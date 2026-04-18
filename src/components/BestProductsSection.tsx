import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

const products = [
    {
        id: 'cheonga-ampoule',
        href: '/product/cheonga-ampoule',
        name: '발라봄 청아 앰플',
        subtitle: '엑소좀 피부장벽 고농축 진정 앰플',
        image: '/images/products/product-standard.webp',
        originalPrice: 38300,
        discountRate: 35,
        finalPrice: 24890,
        rating: 4.8,
        reviewCount: 128,
        badges: ['BEST', '무료배송'],
    },
]

function formatPrice(price: number) {
    return price.toLocaleString('ko-KR')
}

export default function BestProductsSection() {
    return (
        <section className="w-full py-12 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[11px] tracking-[0.15em] text-zinc-400 uppercase font-medium mb-1">BEST SELLER</p>
                        <h2 className="text-xl md:text-2xl font-bold text-zinc-900">베스트 상품</h2>
                    </div>
                    <Link href="/products" className="text-xs md:text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
                        전체보기 &gt;
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 max-w-xs mx-auto md:max-w-none md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={product.href}
                            className="group block"
                        >
                            {/* Product Image */}
                            <div className="relative w-full aspect-square bg-zinc-50 rounded-lg overflow-hidden mb-3">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    {product.badges.map((badge, i) => (
                                        <span
                                            key={i}
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                badge === 'BEST'
                                                    ? 'bg-sky-500 text-white'
                                                    : badge === 'NEW'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-zinc-800 text-white'
                                            }`}
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1.5">
                                <h3 className="text-sm md:text-base font-semibold text-zinc-800 leading-snug group-hover:text-sky-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-zinc-400 leading-snug">{product.subtitle}</p>

                                {/* Price */}
                                <div>
                                    <span className="text-zinc-300 line-through text-xs">
                                        {formatPrice(product.originalPrice)}원
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-red-500 font-bold text-sm">{product.discountRate}%</span>
                                        <span className="text-zinc-900 font-bold text-base md:text-lg">{formatPrice(product.finalPrice)}원</span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 text-xs text-zinc-400">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>{product.rating}</span>
                                    <span className="text-zinc-300">({product.reviewCount})</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
