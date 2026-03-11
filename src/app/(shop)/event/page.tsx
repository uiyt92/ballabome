'use client'

import { useState } from 'react'

type EventStatus = '전체' | '진행중' | '종료'

// 이벤트 데이터는 여기에 추가하세요
const events: {
  id: number
  title: string
  image: string
  startDate: string
  endDate: string
  status: '진행중' | '종료'
}[] = []

const FILTERS: EventStatus[] = ['전체', '진행중', '종료']

export default function EventPage() {
  const [filter, setFilter] = useState<EventStatus>('전체')

  const filtered = filter === '전체' ? events : events.filter((e) => e.status === filter)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-zinc-900">이벤트</h1>
          <p className="text-sm text-zinc-400 mt-2">발라봄의 특별한 혜택을 만나보세요</p>
        </div>

        {/* 필터 탭 */}
        <div className="flex justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 이벤트 그리드 */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-5xl mb-4">🎁</p>
            <p className="text-base font-semibold text-zinc-500">진행 중인 이벤트가 없습니다.</p>
            <p className="text-sm mt-1">곧 새로운 이벤트로 찾아올게요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <div key={event.id} className="group cursor-pointer">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 mb-3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
                      event.status === '진행중'
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-400 text-white'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="font-semibold text-zinc-800 text-sm leading-snug">{event.title}</p>
                <p className="text-xs text-zinc-400 mt-1">{event.startDate} ~ {event.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
