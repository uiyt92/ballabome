'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

// Mock Data (나중에 Supabase 연동 시 교체)
const products = [
    {
        id: 'cheonga-ampoule',
        name: '발라봄 청아 앰플',
        description: '사하라 사막보다 건조한 기내에서 10시간 물광 메이크업을 유지하는 승무원들만의 비밀 공구템',
        price: 34800,
        originalPrice: 46400,
        image: '/product-hero.png',
        link: '/product/cheonga-ampoule'
    }
]

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Breadcrumb & Header */}
                <div className="flex justify-between items-end mb-12 border-b border-zinc-100 pb-6">
                    <div>
                        <p className="text-zinc-400 text-sm mb-2">Home &gt; 전제품</p>
                        <h1 className="text-2xl font-bold">전체 <span className="text-zinc-400 font-normal">{products.length}개</span></h1>
                    </div>

                    {/* Sort Dropdown (Mock) */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 text-sm text-zinc-600 border border-zinc-200 px-4 py-2 rounded-lg hover:border-zinc-400 transition-colors">
                            신상품순 <ChevronRight className="w-4 h-4 rotate-90" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <Link key={product.id} href={product.link} className="group block">
                            {/* Image Container */}
                            <div className="bg-zinc-50 rounded-2xl aspect-square flex items-center justify-center p-8 mb-6 overflow-hidden relative">
                                {/* Rank/Badge Overlay could go here */}
                                <div className="absolute top-4 left-4 z-10 w-10 h-10 bg-zinc-900 text-white flex items-center justify-center rounded-full font-bold text-sm">
                                    BEST
                                </div>

                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Text Info */}
                            <div className="text-center space-y-2 px-2">
                                <h3 className="font-bold text-lg text-zinc-900 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="pt-2 flex items-center justify-center gap-2">
                                    <span className="text-zinc-400 line-through text-sm">
                                        {product.originalPrice.toLocaleString()}원
                                    </span>
                                    <span className="text-lg font-black text-zinc-900">
                                        {product.price.toLocaleString()}원
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination (Mock) */}
                <div className="flex justify-center mt-24 gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-50">‹</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 text-white font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 hover:bg-zinc-50">›</button>
                </div>

            </main>

            <Footer />
        </div>
    )
}
