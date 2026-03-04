'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
    {
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1600",
        title: "하루의 시작을\n설레는 여행처럼",
        subtitle: "메이크업 24시간 에어프루프",
        description: "에비앙스킨 시스템"
    },
    {
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600",
        title: "당신의 매일이\n여행처럼 기대되기를",
        subtitle: "허브 콜렉션 1기",
        description: "모험자 모집 중"
    },
    {
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1600",
        title: "피부에 닿는 순간\n여행이 시작됩니다",
        subtitle: "엑소좀 앰플",
        description: "깊은 수분 충전"
    }
]

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [direction, setDirection] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const nextSlide = useCallback(() => {
        setDirection(1)
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [])

    const prevSlide = useCallback(() => {
        setDirection(-1)
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [])

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1)
        setCurrentSlide(index)
    }

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [isAutoPlaying, nextSlide])

    // Handle swipe
    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 50
        if (info.offset.x > swipeThreshold) {
            prevSlide()
        } else if (info.offset.x < -swipeThreshold) {
            nextSlide()
        }
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const slide = slides[currentSlide]

    return (
        <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-zinc-900">
            {/* Slides */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                    {/* Background Image */}
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-16 md:bottom-24 left-8 md:left-16 right-8 text-white">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-sm md:text-base text-white/80 font-medium mb-3"
                        >
                            {slide.subtitle}
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 whitespace-pre-line"
                        >
                            {slide.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-base md:text-lg text-white/70"
                        >
                            {slide.description}
                        </motion.p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="group relative"
                    >
                        <div className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'
                            }`} />
                        {index === currentSlide && isAutoPlaying && (
                            <motion.div
                                className="absolute top-0 left-0 h-1 bg-sky-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 5, ease: "linear" }}
                                key={`progress-${currentSlide}`}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-6 right-8 text-white/60 text-sm font-medium z-10">
                <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="mx-2">/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </section>
    )
}
