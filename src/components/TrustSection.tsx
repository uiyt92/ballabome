'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Heart } from 'lucide-react'

export default function TrustSection() {
    const features = [
        { icon: ShieldCheck, title: "20대 피부 전문가의 고집", desc: "피부 고민을 직접 겪어본 전문가가 설계했습니다." },
        { icon: Zap, title: "강력한 고농축 포뮬러", desc: "소량만으로도 하루 종일 유지되는 수분감을 보장합니다." },
        { icon: Heart, title: "저자극 비건 인증", desc: "민감한 피부도 안심하고 사용할 수 있는 전성분 EWG 그린 등급." }
    ]

    return (
        <section className="w-full py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-3">Why Ballabom</p>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight">
                        진짜 피부 고민을 해결해본 <span className="text-zinc-300">선두자의 솔루션</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((f, i) => {
                        const IconComponent = f.icon
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center space-y-5"
                            >
                                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto">
                                    <IconComponent className="w-6 h-6 text-zinc-600" />
                                </div>
                                <h4 className="text-lg font-bold">{f.title}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px] mx-auto">{f.desc}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
