import Link from "next/link"
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, LogOut, Star, Users, Package } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // 1. 세션 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect("/login")
    }

    // 2. 관리자 권한 확인 (profiles 테이블의 role 컬럼 확인)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || profile?.role !== 'admin') {
        // 관리자가 아니면 메인으로 튕겨냄
        redirect("/")
    }

    return (
        <div className="flex h-screen bg-gray-100 font-[Pretendard]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r relative flex flex-col">
                <div className="h-16 flex items-center px-6 border-b">
                    <Link href="/admin" className="text-xl font-bold tracking-tight">
                        MANSHARD <span className="text-xs bg-zinc-900 text-white px-1.5 py-0.5 rounded ml-2">ADMIN</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-2 flex-1">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        대시보드
                    </Link>
                    <Link href="/admin/content" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        <ImageIcon className="w-5 h-5" />
                        콘텐츠 관리
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        주문 관리
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        <Package className="w-5 h-5" />
                        상품 관리
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        <Star className="w-5 h-5" />
                        리뷰 관리
                    </Link>
                    <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        <Users className="w-5 h-5" />
                        회원 관리
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-500 rounded-md hover:text-gray-900 transition-colors">
                        <LogOut className="w-5 h-5" />
                        쇼핑몰로 돌아가기
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
