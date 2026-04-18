'use client'

import React from 'react'
import Link from 'next/link'

const banners = [
    {
        href: '/products',
        bg: 'bg-zinc-100',
        label: '신제품',
        title: '발라봄 엑소좀 앰플',
        sub: '피부 깊숙이 스며드는 고농축 포뮬러',
        textColor: 'text-zinc-900',
        subColor: 'text-zinc-500',
    },
    {
        href: '/product/cheonga-ampoule',
        bg: 'bg-zinc-900',
        label: '베스트셀러',
        title: '지금 가장 인기 있는\n스킨케어',
        sub: '실제 효과를 체감한 고객들의 선택',
        textColor: 'text-white',
        subColor: 'text-zinc-400',
    },
]

export default function SubBannerSection() {
    return (
        <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {banners.map((banner, i) => (
                    <Link
                        key={i}
                        href={banner.href}
                        className={`${banner.bg} flex flex-col justify-end px-8 py-10 min-h-[200px] md:min-h-[240px] group transition-opacity hover:opacity-90`}
                    >
                        <span className={`text-xs font-medium tracking-widest uppercase mb-2 ${banner.subColor}`}>
                            {banner.label}
                        </span>
                        <h3 className={`text-xl md:text-2xl font-bold whitespace-pre-line mb-2 ${banner.textColor}`}>
                            {banner.title}
                        </h3>
                        <p className={`text-sm ${banner.subColor}`}>{banner.sub}</p>
                        <span className={`mt-4 text-xs font-medium underline underline-offset-4 ${banner.subColor} group-hover:opacity-70 transition-opacity`}>
                            자세히 보기 →
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    )
}
