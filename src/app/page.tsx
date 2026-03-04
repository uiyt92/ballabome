'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, User, Menu, Instagram, Youtube, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import HeroCarousel from '@/components/HeroCarousel'
import FeaturedProduct from '@/components/FeaturedProduct'
import BrandStory from '@/components/BrandStory'
import MediaSection from '@/components/MediaSection'
import CouponSection from '@/components/CouponSection'
import TrustSection from '@/components/TrustSection'
import FloatingCS from '@/components/FloatingCS'
import FloatingReview from '@/components/FloatingReview'
import TopBanner from '@/components/TopBanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* 맨 상단 가입 유도 배너 */}
      <TopBanner />

      {/* Navigation */}
      <Navbar />

      <main>        {/* Hero Section - 스와이프 캐러셀 */}
        <HeroCarousel />

        {/* 쿠폰 섹션 */}
        <CouponSection />

        {/* 인기상품 */}
        <FeaturedProduct />

        {/* 신뢰 섹션 */}
        <TrustSection />

        {/* 브랜드 스토리 */}
        <BrandStory />

        {/* 리뷰 */}
        <MediaSection />
      </main>

      {/* Footer */}
      {/* Footer */}
      <Footer />

      {/* 플로팅 후기 (왼쪽) */}
      <FloatingReview />

      {/* 플로팅 상담 버튼 (오른쪽) */}
      <FloatingCS />
    </div >
  )
}


