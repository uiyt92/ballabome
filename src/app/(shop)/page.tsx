'use client'

import { motion } from 'framer-motion'
import HeroCarousel from '@/components/HeroCarousel'
import FeaturedProduct from '@/components/FeaturedProduct'
import BrandStory from '@/components/BrandStory'
import MediaSection from '@/components/MediaSection'
import CouponSection from '@/components/CouponSection'
import TrustSection from '@/components/TrustSection'

export default function Home() {
  return (
    <>
      {/* Hero Section - 스와이프 캐러셀 */}
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
    </>
  )
}


