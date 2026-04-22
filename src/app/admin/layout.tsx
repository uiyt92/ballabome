import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import AdminShell from "./AdminShell"

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
        redirect("/")
    }

    return <AdminShell>{children}</AdminShell>
}
