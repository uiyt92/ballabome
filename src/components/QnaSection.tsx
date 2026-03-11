'use client'

import { useState } from 'react'
import { Lock, ChevronDown, MessageSquare } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import type { QnaItem } from '@/types/product'

const PAGE_SIZE = 5

function maskName(name: string | null | undefined): string {
  if (!name) return '비회원'
  if (name.length <= 1) return name + '**'
  return name[0] + '*'.repeat(Math.min(name.length - 1, 2))
}

// ─── QNA 행 ───
function QnaRow({ item, index }: { item: QnaItem; index: number }) {
  const [open, setOpen] = useState(false)
  const date = new Date(item.created_at).toLocaleDateString('ko-KR')
  const authorName = maskName(item.profiles?.full_name)

  return (
    <div className="border-b border-zinc-100 last:border-0">
      {/* 제목 행 */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-zinc-50 transition-colors text-left"
      >
        <span className="text-xs text-zinc-400 w-8 shrink-0 text-center">{index}</span>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {item.is_private && <Lock className="w-3 h-3 text-zinc-400 shrink-0" />}
          <span className="text-sm text-zinc-800 truncate">{item.title}</span>
        </div>
        <span className="text-xs text-zinc-400 shrink-0 hidden sm:block">{authorName}</span>
        <span className="text-xs text-zinc-400 shrink-0 hidden sm:block">{date}</span>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
            item.answer ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
          }`}
        >
          {item.answer ? '답변완료' : '답변대기'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 펼침 내용 */}
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* 질문 */}
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-xs text-zinc-400 mb-1">Q. {authorName} · {date}</p>
            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{item.body}</p>
          </div>
          {/* 답변 */}
          {item.answer && (
            <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
              <p className="text-xs text-blue-500 font-semibold mb-1">A. 발라봄</p>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 질문 작성 폼 ───
function QnaForm({ productId, onSubmitted }: { productId: string; onSubmitted: (q: QnaItem) => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('제목을 입력해주세요.'); return }
    if (!body.trim()) { setError('내용을 입력해주세요.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('로그인이 필요합니다.'); setLoading(false); return }

    const { data, error: err } = await supabase
      .from('qna')
      .insert({
        product_id: productId,
        user_id: user.id,
        title: title.trim(),
        body: body.trim(),
        is_private: isPrivate,
      })
      .select('*, profiles(full_name)')
      .single()

    if (err) { setError('등록에 실패했습니다. 잠시 후 다시 시도해주세요.'); setLoading(false); return }
    onSubmitted(data as QnaItem)
    setTitle('')
    setBody('')
    setIsPrivate(false)
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 mt-4">
      <h4 className="font-bold text-zinc-800 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        상품 문의하기
      </h4>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="문의 제목을 입력해주세요."
        className="w-full text-sm border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-400 transition-colors"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="문의 내용을 입력해주세요. (상품 관련 문의만 작성해주세요)"
        rows={5}
        className="w-full text-sm border border-zinc-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-zinc-400 transition-colors"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-4 h-4 accent-zinc-800"
          />
          <span className="text-sm text-zinc-600 flex items-center gap-1">
            <Lock className="w-3 h-3" /> 비밀글
          </span>
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-zinc-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
      >
        {loading ? '등록 중...' : '문의 등록'}
      </button>
    </form>
  )
}

// ─── QnaSection (메인) ───
interface Props {
  productId: string
  initialQnas: QnaItem[]
}

export default function QnaSection({ productId, initialQnas }: Props) {
  const [qnas, setQnas] = useState<QnaItem[]>(initialQnas)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)

  const total = qnas.length
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paginated = qnas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleNew(q: QnaItem) {
    setQnas((prev) => [q, ...prev])
    setShowForm(false)
    setPage(1)
  }

  return (
    <section>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900">
          Q&A
          <span className="ml-2 text-zinc-400 font-normal text-sm">({total})</span>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-semibold bg-zinc-900 text-white px-4 py-2 rounded-xl hover:bg-zinc-700 transition-colors"
        >
          {showForm ? '닫기' : '상품문의하기'}
        </button>
      </div>

      {/* 문의 작성 폼 */}
      {showForm && <QnaForm productId={productId} onSubmitted={handleNew} />}

      {/* 리스트 헤더 */}
      {total > 0 ? (
        <>
          <div className="border border-zinc-200 rounded-xl overflow-hidden mt-4">
            {/* 컬럼 헤더 (PC) */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-3 bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-semibold">
              <span className="w-8 text-center">번호</span>
              <span className="flex-1">제목</span>
              <span className="w-16 text-center">작성자</span>
              <span className="w-20 text-center">날짜</span>
              <span className="w-16 text-center">상태</span>
              <span className="w-4" />
            </div>

            {paginated.map((item, i) => (
              <QnaRow
                key={item.id}
                item={item}
                index={(page - 1) * PAGE_SIZE + i + 1}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                    p === page
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 text-center py-12 text-zinc-400 border border-zinc-100 rounded-xl">
          <p className="text-3xl mb-3">💬</p>
          <p className="text-sm">아직 등록된 문의가 없습니다.</p>
          <p className="text-xs mt-1">상품에 대해 궁금한 점을 문의해주세요.</p>
        </div>
      )}
    </section>
  )
}
