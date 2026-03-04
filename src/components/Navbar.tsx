'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingCart, User, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mounted, setMounted] = useState(false)
    const totalItems = useCartStore((state) => state.getTotalItems())

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
                <Link href="/mypage">
                    <User className="w-5 h-5 cursor-pointer hover:text-zinc-900 transition-colors" />
                </Link>
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
