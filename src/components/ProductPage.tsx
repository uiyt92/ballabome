import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import ProductDetailClient from '@/components/ProductDetailClient'
import ReviewSection from '@/components/ReviewSection'
import QnaSection from '@/components/QnaSection'
import PurchaseGuide from '@/components/PurchaseGuide'
import ProductDetailTabs from '@/components/ProductDetailTabs'
import { getProduct, getProductOptions, getProductReviews, getProductQnas } from '@/lib/products'

interface Props { id: string }

export default async function ProductPage({ id }: Props) {
  const [product, options, reviews, qnas] = await Promise.all([
    getProduct(id),
    getProductOptions(id),
    getProductReviews(id),
    getProductQnas(id),
  ])

  if (!product) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let initialWished = false
  if (user) {
    const { data } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .single()
    initialWished = !!data
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* 상품 구매 영역 */}
      <ProductDetailClient
        product={product}
        options={options}
        initialWished={initialWished}
      />

      {/* 스티키 탭 네비게이션 */}
      <ProductDetailTabs reviewCount={reviews.length} qnaCount={qnas.length} />

      {/* ─── 제품상세 ─── */}
      <div id="section-detail" className="bg-white">
        <div className="max-w-3xl mx-auto">
          {[
            { src: '/images/BALABOM_01.jpg', w: 860, h: 1465 },
            { src: '/images/BALABOM_02.jpg', w: 860, h: 1465 },
            { src: '/images/BALABOM_03.jpg', w: 860, h: 1465 },
            { src: '/images/BALABOM_04.jpg', w: 860, h: 1465 },
            { src: '/images/BALABOM_05.jpg', w: 860, h: 200 },
            { src: '/images/BALABOM_07.jpg', w: 860, h: 5685 },
            { src: '/images/BALABOM_08.jpg', w: 860, h: 2800 },
            { src: '/images/BALABOM_09.jpg', w: 860, h: 3800 },
            { src: '/images/BALABOM_10.jpg', w: 860, h: 4289 },
            { src: '/images/BALABOM_12.jpg', w: 860, h: 800 },
            { src: '/images/BALABOM_14.jpg', w: 860, h: 200 },
            { src: '/images/BALABOM2_01.jpg', w: 860, h: 3374 },
            { src: '/images/BALABOM2_02.jpg', w: 860, h: 1465 },
            { src: '/images/BALABOM2_03.jpg', w: 860, h: 2200 },
            { src: '/images/BALABOM2_04.jpg', w: 860, h: 800 },
            { src: '/images/BALABOM2_06.jpg', w: 860, h: 800 },
            { src: '/images/BALABOM2_08.jpg', w: 860, h: 800 },
            { src: '/images/BALABOM2_09.jpg', w: 860, h: 1200 },
            { src: '/images/BALABOM2_10.jpg', w: 860, h: 1400 },
          ].map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt=""
              width={img.w}
              height={img.h}
              className="w-full h-auto block"
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              quality={75}
              sizes="(max-width: 768px) 100vw, 768px"
            />
          ))}
        </div>
      </div>

      {/* ─── 상품구매안내 ─── */}
      <div id="section-guide" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">상품구매안내</h2>
          <PurchaseGuide />
        </div>
      </div>

      {/* ─── 구매후기 ─── */}
      <div id="section-review" className="py-16 bg-zinc-50">
        <div className="max-w-3xl mx-auto px-6">
          <ReviewSection productId={id} initialReviews={reviews} />
        </div>
      </div>

      {/* ─── Q&A ─── */}
      <div id="section-qna" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <QnaSection productId={id} initialQnas={qnas} />
        </div>
      </div>
    </div>
  )
}
