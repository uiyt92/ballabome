import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ContentMap } from '@/lib/content'

type ElementLayout = {
    x: number
    y: number
    fontSize?: number
    textAlign?: 'left' | 'center' | 'right'
}
type SectionLayout = Record<string, ElementLayout>

const DEFAULTS = {
    image: '/images/products/product-standard.webp',
    title: '남성 피부를 위한 프리미엄\n퍼포먼스 스킨케어',
    description: '과학적으로 입증된 성분을 기반으로\n피부를 건강하고 탄력있게 바꿔드립니다.',
}

export default function BrandStory({ cms }: { cms?: ContentMap }) {
    const image = cms?.image || DEFAULTS.image
    const title = cms?.title || DEFAULTS.title
    const description = cms?.description || DEFAULTS.description

    let layout: SectionLayout | null = null
    if (cms?.layout) {
        try { layout = JSON.parse(cms.layout) } catch { /* ignore */ }
    }

    const hasLayout = layout && Object.keys(layout).length > 0
    // narrowed reference for use in JSX
    const L = layout as SectionLayout

    return (
        <section className="w-full relative overflow-hidden min-h-[400px]">
            {/* Background Image */}
            <Image
                src={image}
                alt="발라봄 브랜드"
                fill
                sizes="100vw"
                className="object-cover object-center"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {hasLayout ? (
                /* CMS 레이아웃 모드 */
                <div className="relative z-10 w-full min-h-[400px]">
                    {/* Logo */}
                    <Image
                        src="/images/logo/KakaoTalk_20260316_181904291.webp"
                        alt="BALLABOM"
                        width={160}
                        height={40}
                        className="absolute h-8 md:h-10 w-auto object-contain brightness-0 invert"
                        style={{ left: '50%', top: '20%', transform: 'translateX(-50%)' }}
                    />

                    {L.title && (
                        <h2
                            className="absolute font-bold text-white leading-snug whitespace-pre-line"
                            style={{
                                left: `${L.title.x}%`,
                                top: `${L.title.y}%`,
                                fontSize: `clamp(1.2rem, ${L.title.fontSize || 1.8}rem, ${(L.title.fontSize || 1.8) * 1.3}rem)`,
                                textAlign: L.title.textAlign || 'center',
                                maxWidth: '80%',
                                transform: L.title.textAlign === 'center' ? 'translateX(-50%)' : 'none',
                            }}
                        >
                            {title}
                        </h2>
                    )}

                    {L.description && (
                        <p
                            className="absolute text-white/70 whitespace-pre-line"
                            style={{
                                left: `${L.description.x}%`,
                                top: `${L.description.y}%`,
                                fontSize: `${L.description.fontSize || 0.9}rem`,
                                textAlign: L.description.textAlign || 'center',
                                maxWidth: '60%',
                                transform: L.description.textAlign === 'center' ? 'translateX(-50%)' : 'none',
                            }}
                        >
                            {description}
                        </p>
                    )}

                    <div className="absolute" style={{ left: '50%', top: '75%', transform: 'translateX(-50%)' }}>
                        <Link
                            href="/story"
                            className="inline-block px-8 py-3 border border-white/70 text-white text-sm font-medium rounded-full hover:bg-white hover:text-zinc-900 transition-all"
                        >
                            브랜드 스토리
                        </Link>
                    </div>
                </div>
            ) : (
                /* 기본 레이아웃 */
                <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[400px] px-5 text-center text-white">
                    <Image
                        src="/images/logo/KakaoTalk_20260316_181904291.webp"
                        alt="BALLABOM"
                        width={160}
                        height={40}
                        className="h-8 md:h-10 w-auto object-contain mb-6 brightness-0 invert"
                    />

                    <h2 className="text-xl md:text-3xl font-bold leading-snug mb-3 whitespace-pre-line">
                        {title}
                    </h2>
                    <p className="text-sm md:text-base text-white/70 max-w-md leading-relaxed mb-8 whitespace-pre-line">
                        {description}
                    </p>
                    <Link
                        href="/story"
                        className="inline-block px-8 py-3 border border-white/70 text-white text-sm font-medium rounded-full hover:bg-white hover:text-zinc-900 transition-all"
                    >
                        브랜드 스토리
                    </Link>
                </div>
            )}
        </section>
    )
}
