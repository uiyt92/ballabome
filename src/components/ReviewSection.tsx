'use client'

import { useState, useRef } from 'react'
import { Star, ImagePlus, X } from 'lucide-react'
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
      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {review.images.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`리뷰 이미지 ${i + 1}`}
              className="w-20 h-20 object-cover rounded-lg border border-zinc-200"
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── 리뷰 작성 폼 ───
function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: (r: Review) => void }) {
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
  const MAX_SIZE_MB = 5

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])

    const invalid = selected.filter((f) => !ALLOWED_TYPES.includes(f.type))
    if (invalid.length > 0) { setError('JPG, PNG, WEBP, HEIC 파일만 첨부할 수 있어요.'); e.target.value = ''; return }

    const tooBig = selected.filter((f) => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (tooBig.length > 0) { setError(`파일 크기는 ${MAX_SIZE_MB}MB 이하여야 해요.`); e.target.value = ''; return }

    const merged = [...files, ...selected].slice(0, 5)
    setFiles(merged)
    setPreviews(merged.map((f) => URL.createObjectURL(f)))
    setError('')
    e.target.value = ''
  }

  function removeImage(idx: number) {
    const next = files.filter((_, i) => i !== idx)
    setFiles(next)
    setPreviews(next.map((f) => URL.createObjectURL(f)))
  }

  async function uploadImages(userId: string): Promise<string[]> {
    const supabase = createClient()
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('review-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) { setError('리뷰 내용을 입력해주세요.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('로그인이 필요합니다.'); setLoading(false); return }

    let imageUrls: string[] = []
    if (files.length > 0) {
      try {
        imageUrls = await uploadImages(user.id)
      } catch {
        setError('이미지 업로드에 실패했습니다.'); setLoading(false); return
      }
    }

    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        product_id: productId,
        rating,
        body: body.trim(),
        images: imageUrls,
        is_verified: false,
      })
      .select('*, profiles(full_name)')
      .single()

    if (insertError) { setError('리뷰 등록에 실패했습니다.'); setLoading(false); return }
    onSubmitted(data as Review)
    setBody('')
    setRating(5)
    setFiles([])
    setPreviews([])
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

      {/* 이미지 첨부 */}
      <div>
        <div className="flex gap-2 flex-wrap">
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover rounded-lg border border-zinc-200" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-zinc-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {files.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-zinc-400 transition-colors text-zinc-400"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-[10px]">{files.length}/5</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

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
