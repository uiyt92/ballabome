'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function FeaturedProduct() {
    const router = useRouter()
    const { addToCart, setBuyNowItem } = useCartStore()

    const product = {
        id: 'exosome-ampoule-01',
        name: '발라봄 엑소좀 앰플',
        price: 34800,
        quantity: 1,
        image: '/product-hero.png'
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // 중요!! Link 태그 무시
        addToCart(product)
        if (confirm('장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?')) {
            router.push('/cart')
        }
    }

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault(); // 중요!! Link 태그 무시

        // 바로 구매 시 단일 상품을 buyNowItem 상태에 저장
        setBuyNowItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        })
        router.push('/checkout?mode=direct')
    }

    return (
        <section className="w-full py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-3">Bestseller</p>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight">인기상품</h2>
                </motion.div>

                {/* Product Layout - 미니멀 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-center gap-12"
                >
                    {/* Product Image - 상세페이지 링크 연결 */}
                    <Link href="/product/cheonga-ampoule" className="flex-1 relative group block cursor-pointer w-full">
                        {/* Rank Badge */}
                        <div className="absolute top-0 left-0 z-20 w-12 h-12 bg-sky-400 flex items-center justify-center rounded-full shadow-lg">
                            <span className="text-white text-xl font-black">1</span>
                        </div>

                        {/* Quality Seals - 골드 메달 스타일 */}
                        <div className="absolute top-0 right-0 z-20 flex flex-col gap-4">
                            {/* 네이버 화잘먹 1위 배지 */}
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg"
                                    style={{
                                        clipPath: 'polygon(50% 0%, 61% 6%, 71% 2%, 79% 11%, 89% 11%, 94% 21%, 100% 29%, 96% 39%, 100% 50%, 96% 61%, 100% 71%, 94% 79%, 89% 89%, 79% 89%, 71% 98%, 61% 94%, 50% 100%, 39% 94%, 29% 98%, 21% 89%, 11% 89%, 6% 79%, 0% 71%, 4% 61%, 0% 50%, 4% 39%, 0% 29%, 6% 21%, 11% 11%, 21% 11%, 29% 2%, 39% 6%)'
                                    }}
                                />
                                <div className="absolute inset-2 bg-zinc-900 rounded-full flex flex-col items-center justify-center text-center p-2">
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 text-amber-500 text-[8px]">✦</div>
                                    <div className="absolute top-2 left-3 text-amber-500/60 text-[10px] -rotate-45">❧</div>
                                    <div className="absolute top-2 right-3 text-amber-500/60 text-[10px] rotate-45 scale-x-[-1]">❧</div>
                                    <span className="text-amber-400 text-[8px] font-medium">네이버</span>
                                    <span className="text-amber-400 text-[9px] font-medium">화잘먹 크림</span>
                                    <span className="text-amber-300 text-lg font-black">1위</span>
                                </div>
                            </div>

                            {/* 저자극 임상 완료 배지 */}
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg"
                                    style={{
                                        clipPath: 'polygon(50% 0%, 61% 6%, 71% 2%, 79% 11%, 89% 11%, 94% 21%, 100% 29%, 96% 39%, 100% 50%, 96% 61%, 100% 71%, 94% 79%, 89% 89%, 79% 89%, 71% 98%, 61% 94%, 50% 100%, 39% 94%, 29% 98%, 21% 89%, 11% 89%, 6% 79%, 0% 71%, 4% 61%, 0% 50%, 4% 39%, 0% 29%, 6% 21%, 11% 11%, 21% 11%, 29% 2%, 39% 6%)'
                                    }}
                                />
                                <div className="absolute inset-2 bg-zinc-900 rounded-full flex flex-col items-center justify-center text-center p-2">
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 text-amber-500 text-[8px]">✦</div>
                                    <div className="absolute top-2 left-3 text-amber-500/60 text-[10px] -rotate-45">❧</div>
                                    <div className="absolute top-2 right-3 text-amber-500/60 text-[10px] rotate-45 scale-x-[-1]">❧</div>
                                    <span className="text-amber-400 text-[8px] font-medium">저자극</span>
                                    <span className="text-amber-400 text-[9px] font-medium">보습 / 진정</span>
                                    <span className="text-amber-300 text-sm font-black">임상 완료</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Image */}
                        <div className="flex items-center justify-center py-8 bg-gray-50 rounded-2xl min-h-[400px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/product-hero.png"
                                alt="BALLABOM Exosome Ampoule"
                                className="max-w-full max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    console.error('Image failed to load');
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Error';
                                }}
                            />
                        </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 text-center md:text-left space-y-5">
                        <Link href="/product/cheonga-ampoule" className="block hover:opacity-80 transition-opacity">
                            <h3 className="text-2xl md:text-3xl font-black">발라봄 엑소좀 앰플</h3>
                        </Link>
                        <p className="text-zinc-500 text-base leading-relaxed">
                            피부 깊숙이 스며드는 고농축 엑소좀 앰플.<br />
                            하루 종일 촉촉함이 유지되는 프리미엄 케어.
                        </p>

                        {/* Price */}
                        <div className="flex flex-col md:items-start items-center gap-1">
                            <span className="text-zinc-400 line-through text-sm">46,400원</span>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500 text-2xl font-black">25%</span>
                                <span className="text-3xl font-black">34,800원</span>
                            </div>
                        </div>

                        {/* 구매 / 장바구니 버튼들 */}
                        <div className="flex gap-2 pt-2 max-w-sm md:mx-0 mx-auto">
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 h-14 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center"
                            >
                                바로 구매
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="w-14 h-14 bg-white border border-zinc-200 text-zinc-900 rounded-xl hover:bg-zinc-50 transition-colors flex items-center justify-center"
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-w-sm md:mx-0 mx-auto">
                            <button className="h-12 bg-[#03C75A] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                                <span className="bg-white text-[#03C75A] w-5 h-5 flex items-center justify-center rounded-sm font-black text-[10px]">N</span>
                                PAY
                            </button>
                            <button className="h-12 bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                                <MessageCircle className="w-4 h-4 fill-current" />
                                PAY
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
