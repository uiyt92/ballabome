'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Star, Trash2, CheckCircle, XCircle } from 'lucide-react'

type Review = {
  id: string
  rating: number
  body: string
  images: string[]
  is_verified: boolean
  created_at: string
  product_id: string
  profiles: { full_name: string | null } | null
  products: { name: string } | null
}

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const supabase = createClient()

  async function toggleVerify(id: string, current: boolean) {
    const { error } = await supabase.from('reviews').update({ is_verified: !current }).eq('id', id)
    if (error) { alert('변경 실패'); return }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_verified: !current } : r))
  }

  async function deleteReview(id: string) {
    if (!confirm('이 리뷰를 삭제하시겠습니까?')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) { alert('삭제 실패'); return }
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const filtered = reviews.filter(r => {
    if (filter === 'verified') return r.is_verified
    if (filter === 'unverified') return !r.is_verified
    return true
  })

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '-'

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-sm text-zinc-500 mb-1">전체 리뷰</p>
          <p className="text-2xl font-bold">{reviews.length}개</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-sm text-zinc-500 mb-1">평균 별점</p>
          <p className="text-2xl font-bold text-yellow-500">★ {avgRating}</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-sm text-zinc-500 mb-1">미확인 리뷰</p>
          <p className="text-2xl font-bold text-orange-500">{reviews.filter(r => !r.is_verified).length}개</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        {(['all', 'unverified', 'verified'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-zinc-900 text-white' : 'bg-white border text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {f === 'all' ? `전체 (${reviews.length})` : f === 'verified' ? `구매확인 (${reviews.filter(r => r.is_verified).length})` : `미확인 (${reviews.filter(r => !r.is_verified).length})`}
          </button>
        ))}
      </div>

      {/* 리뷰 목록 */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-zinc-400">리뷰가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-medium text-sm text-zinc-900">{review.profiles?.full_name || '익명'}</span>
                    <span className="text-xs text-zinc-400">|</span>
                    <span className="text-xs text-zinc-500">{review.products?.name || review.product_id}</span>
                    <span className="text-xs text-zinc-400">|</span>
                    <span className="text-xs text-zinc-400">{new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
                    {review.is_verified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">구매확인</span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{review.body || '(내용 없음)'}</p>
                  {review.images?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer">
                          <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-zinc-200 hover:opacity-80 transition-opacity" loading="lazy" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => toggleVerify(review.id, review.is_verified)}
                    title={review.is_verified ? '구매확인 해제' : '구매확인 처리'}
                    className={`p-2 rounded-lg border transition-colors ${
                      review.is_verified
                        ? 'text-green-600 border-green-200 hover:bg-green-50'
                        : 'text-zinc-400 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {review.is_verified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 rounded-lg border border-zinc-200 text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
