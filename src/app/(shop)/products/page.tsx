import React, { Suspense } from 'react'
import Link from 'next/link'
import ProductSort from '@/components/ProductSort'
import { getProducts } from '@/lib/products'
import type { SortOption } from '@/types/product'

const LIMIT = 20

interface PageProps {
  searchParams: Promise<{ sort?: string; q?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sort = (params.sort as SortOption) ?? 'popular'
  const search = params.q ?? ''
  const page = Number(params.page ?? 1)

  const { data: products, count } = await getProducts({ sort, search, page, limit: LIMIT })
  const totalPages = Math.ceil(count / LIMIT)

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b border-zinc-100 pb-6">
          <div>
            <p className="text-zinc-400 text-sm mb-2">Home &gt; 전제품</p>
            <h1 className="text-2xl font-bold">
              전체 <span className="text-zinc-400 font-normal">{count}개</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 검색 */}
            <form action="/products" method="GET">
              {sort !== 'popular' && <input type="hidden" name="sort" value={sort} />}
              <input
                type="text"
                name="q"
                defaultValue={search}
                placeholder="상품 검색"
                className="text-sm border border-zinc-200 rounded-lg px-3 py-2 w-40 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </form>
            {/* 정렬 */}
            <Suspense>
              <ProductSort />
            </Suspense>
          </div>
        </div>

        {/* 검색 결과 없음 */}
        {products.length === 0 && (
          <div className="text-center py-32 text-zinc-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-zinc-600 mb-2">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드로 검색해 보세요.</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group block">
              <div className="bg-zinc-50 rounded-2xl aspect-square flex items-center justify-center p-8 mb-6 overflow-hidden relative">
                {index === 0 && (
                  <div className="absolute top-4 left-4 z-10 w-10 h-10 bg-zinc-900 text-white flex items-center justify-center rounded-full font-bold text-sm">
                    BEST
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0] ?? '/product-hero.png'}
                  alt={product.name}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="text-center space-y-2 px-2">
                <h3 className="font-bold text-lg text-zinc-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  {product.original_price && (
                    <span className="text-zinc-400 line-through text-sm">
                      {product.original_price.toLocaleString()}원
                    </span>
                  )}
                  <span className="text-lg font-black text-zinc-900">
                    {product.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-24 gap-2">
            <Link
              href={`/products?sort=${sort}&q=${search}&page=${Math.max(1, page - 1)}`}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
            >
              ‹
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/products?sort=${sort}&q=${search}&page=${p}`}
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  p === page
                    ? 'bg-zinc-900 text-white'
                    : 'border border-zinc-200 text-zinc-400 hover:bg-zinc-50'
                }`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/products?sort=${sort}&q=${search}&page=${Math.min(totalPages, page + 1)}`}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 hover:bg-zinc-50"
            >
              ›
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
