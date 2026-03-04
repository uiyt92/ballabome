'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'

export default function FloatingReview() {
    const [isVisible, setIsVisible] = useState(true)
    const [currentReview, setCurrentReview] = useState(0)

    const reviews = [
        {
            name: "찬*",
            rating: 5,
            text: "기초 단계를 줄이고 싶어서 산 건데 대만족이에요! 촉촉",
            avatar: "👩"
        },
        {
            name: "민*",
            rating: 5,
            text: "크림인데 젤처럼 가볍고 수분감은 에센스급이에요",
            avatar: "👨"
        },
        {
            name: "수*",
            rating: 5,
            text: "피부가 예민한데 자극없이 잘 스며들어요",
            avatar: "👩"
        }
    ]

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [reviews.length])

    if (!isVisible) return null

    const review = reviews[currentReview]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed bottom-8 left-6 z-[100] max-w-[280px]"
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
                            {review.avatar}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Rating */}
                            <div className="flex items-center gap-0.5 mb-1">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-zinc-700 text-sm leading-relaxed mb-1">{review.text}</p>
                            <span className="text-zinc-400 text-xs">{review.name}</span>
                        </div>
                    </div>

                    {/* Review Counter */}
                    <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-xs text-zinc-400">
                            <span className="text-sky-500 font-bold">3,907</span>개의 리뷰가 있어요
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
            </motion.div>
        </AnimatePresence>
    )
}
