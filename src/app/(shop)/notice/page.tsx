'use client'

import { useState } from 'react'
import { Pin, ChevronDown } from 'lucide-react'

type NoticeItem = {
  id: number
  title: string
  date: string
  isPinned?: boolean
  body: string
}

// 공지사항 데이터는 여기에 추가하세요
const notices: NoticeItem[] = []

export default function NoticePage() {
  const [openId, setOpenId] = useState<number | null>(null)

  const pinned = notices.filter((n) => n.isPinned)
  const normal = notices.filter((n) => !n.isPinned)
  const list = [...pinned, ...normal]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-zinc-900">공지사항</h1>
          <p className="text-sm text-zinc-400 mt-2">발라봄의 새로운 소식을 확인하세요</p>
        </div>

        {/* 목록 */}
        {list.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-5xl mb-4">📢</p>
            <p className="text-base font-semibold text-zinc-500">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="border-t border-zinc-200">
            {/* 컬럼 헤더 */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-3 bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-semibold">
              <span className="w-12 text-center">번호</span>
              <span className="flex-1">제목</span>
              <span className="w-24 text-center">날짜</span>
            </div>

            {list.map((item, index) => (
              <div key={item.id} className="border-b border-zinc-100 last:border-0">
                {/* 행 */}
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 transition-colors text-left"
                >
                  <span className="w-12 text-center text-xs text-zinc-400 shrink-0">
                    {item.isPinned ? (
                      <span className="inline-flex items-center justify-center">
                        <Pin className="w-3 h-3 text-blue-500" />
                      </span>
                    ) : (
                      normal.indexOf(item) + 1
                    )}
                  </span>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {item.isPinned && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded shrink-0">공지</span>
                    )}
                    <span className={`text-sm truncate ${item.isPinned ? 'font-semibold text-zinc-800' : 'text-zinc-700'}`}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0 hidden sm:block">{item.date}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${openId === item.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* 상세 내용 */}
                {openId === item.id && (
                  <div className="px-6 py-5 bg-zinc-50 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{item.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
