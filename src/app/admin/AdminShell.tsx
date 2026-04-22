'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, LogOut, Star, Users, Package, Menu, X } from 'lucide-react'

const NAV = [
    { href: '/admin', label: '대시보드', icon: LayoutDashboard },
    { href: '/admin/content', label: '콘텐츠 관리', icon: ImageIcon },
    { href: '/admin/orders', label: '주문 관리', icon: ShoppingBag },
    { href: '/admin/products', label: '상품 관리', icon: Package },
    { href: '/admin/reviews', label: '리뷰 관리', icon: Star },
    { href: '/admin/members', label: '회원 관리', icon: Users },
] as const

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // 라우트 이동 시 모바일 메뉴 자동 닫힘
    useEffect(() => { setOpen(false) }, [pathname])

    // 메뉴 열린 동안 body 스크롤 잠금 (모바일만)
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const Sidebar = (
        <>
            <div className="h-16 flex items-center justify-between px-6 border-b">
                <Link href="/admin" className="text-xl font-bold tracking-tight">
                    MANSHARD <span className="text-xs bg-zinc-900 text-white px-1.5 py-0.5 rounded ml-2">ADMIN</span>
                </Link>
                <button
                    onClick={() => setOpen(false)}
                    aria-label="메뉴 닫기"
                    className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                                active
                                    ? 'bg-zinc-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-500 rounded-md hover:text-gray-900 transition-colors">
                    <LogOut className="w-5 h-5" />
                    쇼핑몰로 돌아가기
                </Link>
            </div>
        </>
    )

    return (
        <div className="flex h-screen bg-gray-100 font-[Pretendard]">
            {/* 데스크탑 고정 사이드바 */}
            <aside className="hidden md:flex w-64 bg-white border-r flex-col">
                {Sidebar}
            </aside>

            {/* 모바일 오프캔버스 오버레이 */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* 모바일 슬라이드 사이드바 */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
                aria-hidden={!open}
            >
                {Sidebar}
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto">
                {/* 모바일 헤더 */}
                <div className="md:hidden sticky top-0 z-30 bg-white border-b h-14 flex items-center px-4 gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        aria-label="메뉴 열기"
                        className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-zinc-900"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold tracking-tight">
                        MANSHARD <span className="text-[10px] bg-zinc-900 text-white px-1.5 py-0.5 rounded ml-1">ADMIN</span>
                    </span>
                </div>
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
