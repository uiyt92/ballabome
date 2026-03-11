'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import type { Review } from '@/types/product'

// ─── 별점 컴포넌트 ───
function StarRating({ rating, interactive = false, onChange }: {
  rating: number
  interactive?: boolean
  onChange?: (v: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-colors ${
            i <= (interactive ? hover || rating : rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-zinc-300'
          } ${interactive ? 'cursor-pointer' : ''}`}
          onClick={() => interactive && onChange?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  )
}

// ─── 리뷰 카드 ───
function ReviewCard({ review }: { review: Review }) {
  const name = review.profiles?.full_name
    ? review.profiles.full_name.slice(0, 1) + '**'
    : '익명'
  const date = new Date(review.created_at).toLocaleDateString('ko-KR')

  return (
    <div className="bg-zinc-50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 text-sm font-bold shrink-0">
            {name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800">{name}</p>
            <p className="text-xs text-zinc-400">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {review.is_verified && (
            <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">구매 확인</span>
          )}
          <StarRating rating={review.rating} />
        </div>
      </div>
      {review.body && (
        <p className="text-sm text-zinc-600 leading-relaxed">{review.body}</p>
      )}
    </div>
  )
}

// ─── 리뷰 작성 폼 ───
function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: (r: Review) => void }) {
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) { setError('리뷰 내용을 입력해주세요.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('로그인이 필요합니다.'); setLoading(false); return }

    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        product_id: productId,
        rating,
        body: body.trim(),
        is_verified: false,
      })
      .select('*, profiles(full_name)')
      .single()

    if (insertError) { setError('리뷰 등록에 실패했습니다.'); setLoading(false); return }
    onSubmitted(data as Review)
    setBody('')
    setRating(5)
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
      <h4 className="font-bold text-zinc-800">리뷰 작성</h4>
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">별점</span>
        <StarRating rating={rating} interactive onChange={setRating} />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="이 상품을 사용해 보셨나요? 솔직한 리뷰를 남겨주세요."
        rows={4}
        className="w-full text-sm border border-zinc-200 rounded-xl p-3 resize-none focus:outline-none focus:border-zinc-400 transition-colors"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-zinc-900 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
      >
        {loading ? '등록 중...' : '리뷰 등록'}
      </button>
    </form>
  )
}

// ─── ReviewSection (메인) ───
interface ReviewSectionProps {
  productId: string
  initialReviews: Review[]
}

export default function ReviewSection({ productId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  function handleNewReview(r: Review) {
    setReviews((prev) => [r, ...prev])
  }

  return (
    <section className="mt-20 pt-10 border-t border-zinc-100">
      {/* 헤더 */}
      <div className="flex items-end justify-between mb-8">
        <h3 className="text-xl font-bold text-zinc-900">
          고객 리뷰
          <span className="ml-2 text-zinc-400 font-normal text-base">({reviews.length})</span>
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avg)} />
            <span className="text-sm font-bold text-zinc-700">{avg.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-3xl mb-3">📝</p>
          <p className="text-sm">아직 등록된 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}

      {/* 리뷰 작성 폼 */}
      <ReviewForm productId={productId} onSubmitted={handleNewReview} />
    </section>
  )
}
