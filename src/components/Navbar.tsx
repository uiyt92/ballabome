'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

    // 모바일 메뉴 열릴 때 스크롤 잠금
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileMenuOpen])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        setUserMenuOpen(false)
        setMobileMenuOpen(false)
        router.push('/')
        router.refresh()
    }

    const BrandLogo = () => (
        <Link href="/" className="cursor-pointer flex items-center min-h-11" aria-label="BALLABOM 홈">
            <Image
                src="/images/logo/KakaoTalk_20260316_181904291.webp"
                alt="BALLABOM"
                width={160}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
                priority
            />
        </Link>
    )

    const navLinks = [
        { name: '브랜드 스토리', href: '/story' },
        { name: '전제품', href: '/products' },
        { name: '이벤트', href: '/event' },
        { name: '스킨 솔루션', href: '/crew-lounge' },
        { name: '공지사항', href: '/notice' },
    ]

    return (
        <>
            <nav className={`sticky top-0 w-full z-50 transition-all duration-300 px-5 md:px-12 py-4 flex justify-between items-center ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
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

                <div className="flex items-center gap-1 md:gap-3 text-zinc-600">
                    <Link href="/products" aria-label="검색" className="w-11 h-11 flex items-center justify-center hover:text-zinc-900 transition-colors">
                        <Search className="w-5 h-5" />
                    </Link>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                        <button aria-label="사용자 메뉴" onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-11 h-11 flex items-center justify-center">
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
                    <Link href="/cart" aria-label="장바구니" className="w-11 h-11 flex items-center justify-center">
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-zinc-900 transition-colors" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                    </Link>
                    <button
                        className="w-11 h-11 flex items-center justify-center md:hidden"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* 모바일 메뉴 오버레이 */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[60] md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* 모바일 슬라이드 메뉴 */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                    <span className="text-sm font-bold text-zinc-900">메뉴</span>
                    <button
                        className="w-11 h-11 flex items-center justify-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X className="w-5 h-5 text-zinc-600" />
                    </button>
                </div>

                <div className="flex flex-col py-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-6 py-3.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="border-t border-zinc-100 py-2">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/mypage"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3.5 text-sm text-zinc-700 hover:bg-zinc-50"
                            >
                                <User className="w-4 h-4" /> 마이페이지
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-red-500 hover:bg-zinc-50"
                            >
                                <LogOut className="w-4 h-4" /> 로그아웃
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-6 py-3.5 text-sm text-zinc-700 hover:bg-zinc-50"
                        >
                            <User className="w-4 h-4" /> 로그인
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}
