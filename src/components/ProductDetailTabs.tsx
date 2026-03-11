'use client'

import { useEffect, useRef, useState } from 'react'

const TABS = [
  { id: 'section-detail', label: '제품상세' },
  { id: 'section-guide', label: '상품구매안내' },
  { id: 'section-review', label: '구매후기' },
  { id: 'section-qna', label: 'Q&A' },
]

export default function ProductDetailTabs({
  reviewCount,
  qnaCount,
}: {
  reviewCount: number
  qnaCount: number
}) {
  const [active, setActive] = useState('section-detail')
  const tabsRef = useRef<HTMLDivElement>(null)

  const counts: Record<string, number> = {
    'section-review': reviewCount,
    'section-qna': qnaCount,
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    TABS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const tabHeight = tabsRef.current?.offsetHeight ?? 56
    const navHeight = 60
    const y = el.getBoundingClientRect().top + window.scrollY - tabHeight - navHeight
    window.scrollTo({ top: y, behavior: 'smooth' })
    setActive(id)
  }

  return (
    <div
      ref={tabsRef}
      className="sticky top-[60px] z-30 bg-white border-b border-zinc-200 shadow-sm"
    >
      <div className="max-w-5xl mx-auto flex">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors border-b-2 ${
              active === id
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {label}
            {counts[id] !== undefined && counts[id] > 0 && (
              <span className="ml-1 text-xs text-zinc-400">({counts[id]})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
