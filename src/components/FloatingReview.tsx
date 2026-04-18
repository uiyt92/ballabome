'use client'

import React, { useState, useEffect } from 'react'
import { X, Star } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type FloatingReviewData = {
    name: string
    rating: number
    text: string
}

export default function FloatingReview() {
    const [isVisible, setIsVisible] = useState(true)
    const [currentReview, setCurrentReview] = useState(0)
    const [reviews, setReviews] = useState<FloatingReviewData[]>([])
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const supabase = createClient()

        async function fetchReviews() {
            // 최신 리뷰 5개 가져오기 (verified 우선)
            const { data, count } = await supabase
                .from('reviews')
                .select('rating, body, profiles(full_name)', { count: 'exact' })
                .order('is_verified', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(5)

            if (data && data.length > 0) {
                setReviews(data.map((r: any) => {
                    const fullName = r.profiles?.full_name || '고객'
                    const masked = fullName.charAt(0) + '*'.repeat(Math.max(fullName.length - 1, 1))
                    return {
                        name: masked,
                        rating: r.rating,
                        text: r.body || '',
                    }
                }))
                setTotalCount(count ?? data.length)
            }
        }

        fetchReviews()
    }, [])

    useEffect(() => {
        if (reviews.length === 0) return
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [reviews.length])

    // 리뷰 데이터가 없으면 표시하지 않음
    if (!isVisible || reviews.length === 0) return null

    const review = reviews[currentReview]

    return (
        <div
            className="fixed bottom-8 left-6 z-[100] max-w-[280px] animate-slide-in-left"
        >
                <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>

                    <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                            ⭐
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Rating */}
                            <div className="flex items-center gap-0.5 mb-1">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-zinc-700 text-sm leading-relaxed mb-1 line-clamp-2">{review.text}</p>
                            <span className="text-zinc-400 text-xs">{review.name}</span>
                        </div>
                    </div>

                    {/* Review Counter */}
                    <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-xs text-zinc-400">
                            <span className="text-sky-500 font-bold">{totalCount.toLocaleString()}</span>개의 리뷰가 있어요
                        </span>
                        <div className="flex gap-1">
                            {reviews.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentReview ? 'bg-sky-400' : 'bg-zinc-200'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    )
}
