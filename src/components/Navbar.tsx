'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, User, Menu, Search, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef = useRef<HTMLDivElement>(null)
    const totalItems = useCartStore((state) => state.getTotalItems())
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)

        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user)
        })

        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            subscription.unsubscribe()
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        setUserMenuOpen(false)
        router.push('/')
        router.refresh()
    }

    const BrandLogo = () => (
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 cursor-pointer">
            BALLABOM
        </Link>
    )

    const navLinks = [
        { name: '브랜드 스토리', href: '/story' },
        { name: '전제품', href: '/products' },
        { name: '이벤트', href: '/event' },
        { name: '크루 라운지', href: '/crew-lounge' },
        { name: '공지사항', href: '/notice' },
    ]

    return (
        <nav className={`sticky top-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4 flex justify-between items-center ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
            <div className="flex items-center">
                <BrandLogo />
            </div>

            <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
                {navLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="hover:text-zinc-900 transition-colors">
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-5 text-zinc-600">
                <Search className="w-5 h-5 cursor-pointer hover:text-zinc-900 transition-colors" />
                <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)}>
                        <User className="w-5 h-5 cursor-pointer hover:text-zinc-900 transition-colors" />
                    </button>
                    {userMenuOpen && (
                        <div className="absolute right-0 top-8 w-36 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50">
                            {isLoggedIn ? (
                                <>
                                    <Link href="/mypage" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50">
                                        <User className="w-4 h-4" /> 마이페이지
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-zinc-50">
                                        <LogOut className="w-4 h-4" /> 로그아웃
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50">
                                    <User className="w-4 h-4" /> 로그인
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                <Link href="/cart">
                    <div className="relative">
                        <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-zinc-900 transition-colors" />
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </div>
                </Link>
                <Menu className="w-5 h-5 md:hidden cursor-pointer" />
            </div>
        </nav>
    )
}
