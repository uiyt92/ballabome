'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function MediaSection() {
    const reviews = [
        { rating: 5, text: "기초 단계를 줄이고 싶어서 산 건데 대만족이에요! 촉촉", author: "찬*" },
        { rating: 5, text: "크림인데 젤처럼 가볍고 수분감은 에센스급이에요", author: "민*" }
    ]

    return (
        <section className="w-full py-20 bg-zinc-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-3">Reviews</p>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight">고객 후기</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-2xl border border-zinc-100"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(review.rating)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-zinc-700 text-base leading-relaxed mb-4">{review.text}</p>
                            <span className="text-zinc-400 text-sm">{review.author}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
