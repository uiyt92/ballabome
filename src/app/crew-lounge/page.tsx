'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Article/Content Type
type Article = {
    id: number
    title: string
    date: string
    author: string
    category: '기내방송' | '비행일지' | '이벤트' | '전체'
    image: string
    link: string
}

// Mock Data for Grid
const articles: Article[] = [
    {
        id: 1,
        title: '에어무드 멤버십 혜택 전부 받아가세요!',
        date: '25.12.15',
        author: '에어무드',
        category: '이벤트',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600',
        link: '#'
    },
    {
        id: 2,
        title: '승무원 크림 사용해보세요! 체험단 모집',
        date: '25.07.20',
        author: '에어무드',
        category: '이벤트', // Using '이벤트' per image, labeled as '체험단 모집'
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600',
        link: '#'
    },
    {
        id: 3,
        title: '7년차 승무원의 피부관리 비법',
        date: '25.05.10',
        author: '승무원log',
        category: '비행일지',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
        link: '#'
    },
    {
        id: 4,
        title: '러닝 하면 피부 노화가 빨라지는 이유 (Skin Care)',
        date: '25.04.15',
        author: '피부연구소',
        category: '기내방송',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
        link: '#'
    },
    // Add more fillers if needed to match grid look
]

const categories = ['전체', '기내방송', '비행일지', '이벤트']

export default function CrewLoungePage() {
    const [filter, setFilter] = useState('전체')

    const filteredArticles = filter === '전체'
        ? articles
        : articles.filter(a => a.category === filter)

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-2">
                    <h1 className="text-3xl font-black">크루 라운지</h1>
                    <p className="text-zinc-500">승무원들의 생생한 이야기와 특별한 혜택</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center gap-2 mb-20">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                                ? 'bg-zinc-900 text-white shadow-md'
                                : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Tools (View Mode) - Mock */}
                <div className="flex justify-end mb-6 text-xs text-zinc-400 gap-4 font-medium">
                    <button className="flex items-center gap-1 hover:text-zinc-600">
                        <span className="w-3 h-3 bg-zinc-400 rounded-sm"></span> 이미지형
                    </button>
                    <button className="flex items-center gap-1 hover:text-zinc-600">
                        <span className="w-3 h-3 border border-zinc-300 rounded-sm"></span> 리스트형
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                    {filteredArticles.map((article) => (
                        <Link key={article.id} href={article.link} className="group block">
                            {/* Image */}
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-100">
                                {/* Badges/Overlays based on category */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase">
                                        {article.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 z-10 text-white font-black italic opacity-50 text-xl tracking-tighter">
                                    BALLABOM
                                </div>

                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>

                            {/* Text */}
                            <div className="space-y-2">
                                <p className="text-[10px] sm:text-xs font-bold text-zinc-400">
                                    [{article.category}]
                                </p>
                                <h3 className="text-xl md:text-2xl font-bold text-zinc-900 leading-tight group-hover:text-sky-600 transition-colors">
                                    {article.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-zinc-400 pt-2 font-medium">
                                    <span>{article.date}</span>
                                    <span className="w-0.5 h-0.5 bg-zinc-300 rounded-full"></span>
                                    <span>{article.author}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
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
