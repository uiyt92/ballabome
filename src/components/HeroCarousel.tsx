'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { ContentMap } from '@/lib/content'

type ElementLayout = {
    x: number
    y: number
    fontSize?: number
    textAlign?: 'left' | 'center' | 'right'
}
type SectionLayout = Record<string, ElementLayout>

const PRODUCT_LINK = '/product/cheonga-ampoule'

const DEFAULT_SLIDES = [
    {
        image: "/images/products/product-standard.webp",
        subtitle: "BALLABOM SIGNATURE",
        title: "결국 본질입니다.\n무너지지 않는 기초 포뮬러",
        description: "단 7일 후, 피부 속부터 차오르는 수분감을 경험하세요",
        cta: { text: "자세히 보기", href: PRODUCT_LINK },
    },
    {
        image: "/images/products/product-deluxe.webp",
        subtitle: "PERFORMANCE SKINCARE",
        title: "기초에 대한 집착이 만드는\n압도적 밀착력",
        description: "화장이 잘 먹는 피부는 기초부터 다릅니다",
        cta: { text: "자세히 보기", href: PRODUCT_LINK },
    },
    {
        image: "/images/products/product-premium-plus.webp",
        subtitle: "BRAND STORY",
        title: "피부는 진심을 느낀다.\n시작은 발라봄입니다.",
        description: "",
        cta: { text: "자세히 보기", href: PRODUCT_LINK },
    }
]

function mergeSlides(cmsData?: ContentMap[]) {
    if (!cmsData) return DEFAULT_SLIDES.map(s => ({ ...s, layout: null as SectionLayout | null }))
    return DEFAULT_SLIDES.map((defaultSlide, i) => {
        const cms = cmsData[i]
        if (!cms || Object.keys(cms).length === 0) return { ...defaultSlide, layout: null as SectionLayout | null }

        let layout: SectionLayout | null = null
        if (cms.layout) {
            try { layout = JSON.parse(cms.layout) } catch { /* ignore */ }
        }

        return {
            image: cms.image || defaultSlide.image,
            subtitle: cms.subtitle || defaultSlide.subtitle,
            title: cms.title || defaultSlide.title,
            description: cms.description ?? defaultSlide.description,
            cta: {
                text: cms.cta_text || defaultSlide.cta.text,
                href: PRODUCT_LINK,
            },
            layout,
        }
    })
}

const slideVariants = {
    enter: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? 60 : -60,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? -60 : 60,
    }),
}

const slideTransition = {
    duration: 0.4,
    ease: [0.32, 0.72, 0, 1] as const,
}

const textVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay, ease: 'easeOut' as const },
    }),
}

export default function HeroCarousel({ cms }: { cms?: ContentMap[] }) {
    const slides = mergeSlides(cms)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [direction, setDirection] = useState(0)
    const isDragged = useRef(false)
    const router = useRouter()

    const nextSlide = useCallback(() => {
        setDirection(1)
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [slides.length])

    const prevSlide = useCallback(() => {
        setDirection(-1)
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [slides.length])

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1)
        setCurrentSlide(index)
    }

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 50) {
            isDragged.current = true
            if (info.offset.x > 0) prevSlide()
            else nextSlide()
        }
        setTimeout(() => { isDragged.current = false }, 150)
    }

    const handleSlideClick = () => {
        if (!isDragged.current) router.push(PRODUCT_LINK)
    }

    const slide = slides[currentSlide]
    const layout = slide.layout
    const hasLayout = layout && Object.keys(layout).length > 0

    return (
        <section className="relative w-full h-[480px] md:h-[600px] overflow-hidden bg-zinc-100">
            <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0}
                    onDragEnd={handleDragEnd}
                    onClick={handleSlideClick}
                    className="absolute inset-0 cursor-pointer"
                >
                    {/* Background Image */}
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority={currentSlide === 0}
                        draggable={false}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                    {hasLayout ? (
                        /* CMS 레이아웃 모드: 절대 좌표 배치 */
                        <>
                            {slide.subtitle && layout.subtitle && (
                                <motion.p
                                    variants={textVariants} custom={0.15} initial="hidden" animate="visible"
                                    className="absolute tracking-[0.15em] text-white/60 font-medium whitespace-pre-line"
                                    style={{
                                        left: `${layout.subtitle.x}%`,
                                        top: `${layout.subtitle.y}%`,
                                        fontSize: `${layout.subtitle.fontSize || 0.7}rem`,
                                        textAlign: layout.subtitle.textAlign || 'left',
                                        maxWidth: '60%',
                                        transform: layout.subtitle.textAlign === 'center' ? 'translateX(-50%)' : 'none',
                                    }}
                                >
                                    {slide.subtitle}
                                </motion.p>
                            )}

                            {layout.title && (
                                <motion.h2
                                    variants={textVariants} custom={0.25} initial="hidden" animate="visible"
                                    className="absolute font-bold text-white leading-tight whitespace-pre-line"
                                    style={{
                                        left: `${layout.title.x}%`,
                                        top: `${layout.title.y}%`,
                                        fontSize: `clamp(1.5rem, ${layout.title.fontSize || 2.2}rem, ${(layout.title.fontSize || 2.2) * 1.5}rem)`,
                                        textAlign: layout.title.textAlign || 'left',
                                        maxWidth: '60%',
                                        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                                        transform: layout.title.textAlign === 'center' ? 'translateX(-50%)' : 'none',
                                    }}
                                >
                                    {slide.title}
                                </motion.h2>
                            )}

                            {slide.description && layout.description && (
                                <motion.p
                                    variants={textVariants} custom={0.35} initial="hidden" animate="visible"
                                    className="absolute text-white/70 whitespace-pre-line"
                                    style={{
                                        left: `${layout.description.x}%`,
                                        top: `${layout.description.y}%`,
                                        fontSize: `${layout.description.fontSize || 0.9}rem`,
                                        textAlign: layout.description.textAlign || 'left',
                                        maxWidth: '60%',
                                        transform: layout.description.textAlign === 'center' ? 'translateX(-50%)' : 'none',
                                    }}
                                >
                                    {slide.description}
                                </motion.p>
                            )}

                            {slide.cta && layout.cta_text && (
                                <motion.div
                                    variants={textVariants} custom={0.45} initial="hidden" animate="visible"
                                    className="absolute"
                                    style={{
                                        left: `${layout.cta_text.x}%`,
                                        top: `${layout.cta_text.y}%`,
                                        transform: layout.cta_text.textAlign === 'center' ? 'translateX(-50%)' : 'none',
                                    }}
                                >
                                    <span
                                        className="inline-block border border-white/80 text-white font-medium rounded-full hover:bg-white hover:text-zinc-900 transition-all"
                                        style={{
                                            fontSize: `${layout.cta_text.fontSize || 0.85}rem`,
                                            padding: `${(layout.cta_text.fontSize || 0.85) * 0.8}rem ${(layout.cta_text.fontSize || 0.85) * 2}rem`,
                                        }}
                                    >
                                        {slide.cta.text}
                                    </span>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        /* 기본 플로우 레이아웃 (CMS 미설정 시) */
                        <div className="absolute inset-0 flex items-center">
                            <div className="px-5 md:px-16 lg:px-24 max-w-2xl">
                                {slide.subtitle && (
                                    <motion.p
                                        variants={textVariants} custom={0.15} initial="hidden" animate="visible"
                                        className="text-[11px] md:text-xs tracking-[0.2em] text-white/60 font-medium mb-4"
                                    >
                                        {slide.subtitle}
                                    </motion.p>
                                )}
                                <motion.h2
                                    variants={textVariants} custom={0.25} initial="hidden" animate="visible"
                                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 whitespace-pre-line"
                                    style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}
                                >
                                    {slide.title}
                                </motion.h2>
                                {slide.description && (
                                    <motion.p
                                        variants={textVariants} custom={0.35} initial="hidden" animate="visible"
                                        className="text-sm md:text-base text-white/70 mb-8"
                                    >
                                        {slide.description}
                                    </motion.p>
                                )}
                                {slide.cta && (
                                    <motion.div
                                        variants={textVariants} custom={0.45} initial="hidden" animate="visible"
                                    >
                                        <span
                                            className="inline-block px-7 py-3 border border-white/80 text-white text-sm font-medium rounded-full hover:bg-white hover:text-zinc-900 transition-all"
                                        >
                                            {slide.cta.text}
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={(e) => { e.stopPropagation(); prevSlide() }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); nextSlide() }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); goToSlide(index) }}
                        className="group relative"
                    >
                        <div className={`h-[3px] rounded-full transition-all duration-500 ${index === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'
                            }`} />
                    </button>
                ))}
            </div>
        </section>
    )
}
