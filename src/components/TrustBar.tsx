import React from 'react'
import { ShieldCheck, Tag } from 'lucide-react'
import type { ContentMap } from '@/lib/content'

const DEFAULT_BADGES = [
    {
        icon: Tag,
        title: '카카오톡 채널 추가',
        subtitle: '3,000원 할인쿠폰 지급',
    },
    {
        icon: ShieldCheck,
        title: '100%',
        subtitle: '환불 보장 제도',
    },
]

export default function TrustBar({ cms }: { cms?: ContentMap }) {
    const badges = DEFAULT_BADGES.map((badge, i) => ({
        ...badge,
        title: cms?.[`badge${i + 1}_title`] || badge.title,
        subtitle: cms?.[`badge${i + 1}_subtitle`] || badge.subtitle,
    }))

    return (
        <section className="w-full border-y border-zinc-200 bg-white">
            <div className="max-w-6xl mx-auto grid grid-cols-2 divide-x divide-zinc-200">
                {badges.map((badge, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center gap-3 py-5 md:py-6 px-3"
                    >
                        <badge.icon className="w-7 h-7 md:w-8 md:h-8 text-sky-500 flex-shrink-0" strokeWidth={1.5} />
                        <div className="text-left">
                            <p className="text-[11px] md:text-xs text-zinc-400 font-medium leading-tight">{badge.title}</p>
                            <p className="text-xs md:text-sm font-bold text-zinc-800 leading-tight">{badge.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
