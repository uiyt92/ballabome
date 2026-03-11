'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { SortOption } from '@/types/product'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular',    label: '인기순' },
  { value: 'newest',     label: '신상품순' },
  { value: 'price_asc',  label: '낮은가격순' },
  { value: 'price_desc', label: '높은가격순' },
]

export default function ProductSort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = (searchParams.get('sort') as SortOption) ?? 'popular'
  const currentLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? '인기순'

  function handleSort(value: SortOption) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-sm text-zinc-600 border border-zinc-200 px-4 py-2 rounded-lg hover:border-zinc-400 transition-colors">
        {currentLabel} <ChevronRight className="w-4 h-4 rotate-90" />
      </button>
      <div className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-10 min-w-[130px] hidden group-hover:block">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSort(opt.value)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-zinc-50 ${
              currentSort === opt.value ? 'font-bold text-zinc-900' : 'text-zinc-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
