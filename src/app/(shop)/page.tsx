import { getMultipleSectionContents } from '@/lib/content'
import { createClient } from '@/utils/supabase/server'
import HeroCarousel from '@/components/HeroCarousel'
import TrustBar from '@/components/TrustBar'
import BestProductsSection from '@/components/BestProductsSection'
import MediaSection from '@/components/MediaSection'
import BrandStory from '@/components/BrandStory'

export default async function Home() {
  const supabase = await createClient()

  // 병렬 데이터 페칭
  const [cms, { data: reviews }] = await Promise.all([
    getMultipleSectionContents([
      'hero_1', 'hero_2', 'hero_3',
      'brand_story', 'trust', 'top_banner'
    ]),
    supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  return (
    <>
      {/* Hero Section */}
      <HeroCarousel cms={[cms.hero_1, cms.hero_2, cms.hero_3]} />

      {/* 신뢰 배지 바 */}
      <TrustBar cms={cms.trust} />

      {/* 베스트 상품 */}
      <BestProductsSection />

      {/* BEST REVIEW */}
      <MediaSection serverReviews={reviews ?? []} />

      {/* 브랜드 스토리 */}
      <BrandStory cms={cms.brand_story} />
    </>
  )
}
