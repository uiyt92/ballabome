import { notFound } from 'next/navigation'
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
            '/images/BALABOM_01.jpg',
            '/images/BALABOM_02.jpg',
            '/images/BALABOM_03.jpg',
            '/images/BALABOM_04.jpg',
            '/images/BALABOM_05.jpg',
            '/images/BALABOM_07.jpg',
            '/images/BALABOM_08.jpg',
            '/images/BALABOM_09.jpg',
            '/images/BALABOM_10.jpg',
            '/images/BALABOM_12.jpg',
            '/images/BALABOM_14.jpg',
            '/images/BALABOM2_01.jpg',
            '/images/BALABOM2_02.jpg',
            '/images/BALABOM2_03.jpg',
            '/images/BALABOM2_04.jpg',
            '/images/BALABOM2_06.jpg',
            '/images/BALABOM2_08.jpg',
            '/images/BALABOM2_09.jpg',
            '/images/BALABOM2_10.jpg',
          ].map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="w-full block" />
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
