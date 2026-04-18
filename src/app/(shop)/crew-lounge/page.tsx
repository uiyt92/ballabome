'use client'

import { useState } from 'react'

type Category = '전체' | '기내방송' | '비행일지' | '이벤트'

// 크루 라운지 콘텐츠는 여기에 추가하세요
const articles: {
  id: number
  title: string
  date: string
  author: string
  category: '기내방송' | '비행일지' | '이벤트'
  image: string
}[] = []

const CATEGORIES: Category[] = ['전체', '기내방송', '비행일지', '이벤트']

export default function CrewLoungePage() {
  const [filter, setFilter] = useState<Category>('전체')
  const filtered = filter === '전체' ? articles : articles.filter((a) => a.category === filter)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-zinc-900">스킨 솔루션</h1>
          <p className="text-sm text-zinc-400 mt-2">나에게 맞는 스킨케어 솔루션을 찾아보세요</p>
        </div>
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === cat
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-base font-semibold text-zinc-500">아직 등록된 콘텐츠가 없습니다.</p>
            <p className="text-sm mt-1">곧 승무원들의 이야기로 찾아올게요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {filtered.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full text-zinc-700">{article.category}</span>
                </div>
                <p className="text-[11px] font-bold text-zinc-400 mb-1">[{article.category}]</p>
                <h3 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-blue-600 transition-colors">{article.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                  <span>{article.date}</span><span>·</span><span>{article.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
