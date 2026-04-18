'use client'

import React, { useRef } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Review } from '@/types/product'

const FALLBACK_REVIEWS: Review[] = [
    {
        id: 'f1', product_id: '', user_id: null, order_id: null,
        rating: 5, body: '기초 단계를 줄이고 싶어서 산 건데 대만족이에요! 촉촉함이 하루 종일 유지돼요.',
        images: ['/images/BALABOM_01.jpg'], is_verified: true, created_at: '',
        profiles: { full_name: '찬*' }
    },
    {
        id: 'f2', product_id: '', user_id: null, order_id: null,
        rating: 5, body: '크림인데 젤처럼 가볍고 수분감은 에센스급이에요. 피부가 확실히 달라진 느낌.',
        images: ['/images/BALABOM_02.jpg'], is_verified: true, created_at: '',
        profiles: { full_name: '민*' }
    },
    {
        id: 'f3', product_id: '', user_id: null, order_id: null,
        rating: 5, body: '남자 피부에 딱 맞는 제품이에요. 끈적임 없이 빠르게 흡수되고 촉촉해요.',
        images: ['/images/BALABOM_03.jpg'], is_verified: true, created_at: '',
        profiles: { full_name: '준*' }
    },
    {
        id: 'f4', product_id: '', user_id: null, order_id: null,
        rating: 5, body: '세안 후 바로 바르면 다음날 아침 피부 결이 달라요. 재구매 확정.',
        images: ['/images/BALABOM_04.jpg'], is_verified: true, created_at: '',
        profiles: { full_name: '성*' }
    },
]

export default function MediaSection({ serverReviews }: { serverReviews?: Review[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const displayReviews = serverReviews && serverReviews.length > 0 ? serverReviews : FALLBACK_REVIEWS

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
    }

    return (
        <section className="w-full py-12 md:py-16 bg-zinc-50">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[11px] tracking-[0.15em] text-zinc-400 uppercase font-medium mb-1">Reviews</p>
                        <h2 className="text-xl md:text-2xl font-bold text-zinc-900">BEST REVIEW</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="w-10 h-10 border border-zinc-300 rounded-full flex items-center justify-center hover:bg-white transition-colors" aria-label="이전">
                            <ChevronLeft className="w-4 h-4 text-zinc-500" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 border border-zinc-300 rounded-full flex items-center justify-center hover:bg-white transition-colors" aria-label="다음">
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Cards */}
                <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                    {displayReviews.map((review) => (
                        <div key={review.id} className="flex-shrink-0 w-[calc(100vw-64px)] sm:w-60 md:w-72 bg-white rounded-xl overflow-hidden border border-zinc-100" style={{ scrollSnapAlign: 'start' }}>
                            <div className="w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                                {review.images && review.images.length > 0 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={review.images[0]} alt="리뷰 이미지" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                                        <span className="text-zinc-300 text-sm">이미지 없음</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 space-y-2.5">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                                    ))}
                                </div>
                                <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2">{review.body}</p>
                                <div className="flex items-center gap-2 pt-1 border-t border-zinc-50">
                                    <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <span className="text-zinc-400 text-[9px] font-medium">{review.profiles?.full_name?.charAt(0) ?? '익'}</span>
                                    </div>
                                    <span className="text-zinc-400 text-xs">{review.profiles?.full_name ?? '익명'}</span>
                                    {review.is_verified && (
                                        <span className="text-[10px] text-sky-500 font-medium bg-sky-50 px-1.5 py-0.5 rounded">구매확인</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
