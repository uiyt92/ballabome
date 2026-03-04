'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function BrandStory() {
    return (
        <section className="w-full py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">Our Story</p>

                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                        피부 고민을 직접 경험한<br />
                        <span className="text-zinc-300">전문가의 해답</span>
                    </h2>

                    <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        발라봄은 20대의 다양한 피부 고민을 직접 겪어본 전문가들이 만들었습니다.
                        단순히 좋은 성분을 넣는 것을 넘어, 실제로 효과를 체감할 수 있는
                        고농축 포뮬러를 연구하고 개발합니다.
                    </p>

                    <Link href="/story" className="inline-block mt-6 px-8 py-4 border-2 border-zinc-900 text-zinc-900 text-sm font-bold rounded-full hover:bg-zinc-900 hover:text-white transition-all">
                        브랜드 스토리 보기
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
