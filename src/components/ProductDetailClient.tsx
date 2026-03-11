'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Truck, ShoppingCart, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import WishlistButton from '@/components/WishlistButton'
import type { Product, ProductOption } from '@/types/product'

interface Props {
  product: Product
  options: ProductOption[]
  initialWished: boolean
}

export default function ProductDetailClient({ product, options, initialWished }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  const [isOptionOpen, setIsOptionOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { addToCart, setBuyNowItem } = useCartStore()

  const selectedOption = options.find((o) => o.id === selectedOptionId) ?? null
  const images = product.images.length > 0 ? product.images : ['/product-hero.png']

  // 옵션 당 개당 가격 계산
  function perUnitPrice(opt: ProductOption): string {
    const match = opt.name.match(/(\d+)\+(\d+)/)
    if (match) {
      const total = parseInt(match[1]) + parseInt(match[2])
      return `1개당 ${Math.round(opt.price / total).toLocaleString()}원`
    }
    const match2 = opt.name.match(/(\d+)개/)
    if (match2) {
      return `1개당 ${Math.round(opt.price / parseInt(match2[1])).toLocaleString()}원`
    }
    return ''
  }

  function getCartItem() {
    if (!selectedOption) {
      alert('옵션을 선택해주세요.')
      return null
    }
    return {
      id: `${product.id}-${selectedOption.id}`,
      name: `${product.name} - ${selectedOption.name}`,
      price: selectedOption.price,
      quantity,
      image: images[0],
    }
  }

  function handleAddToCart() {
    const item = getCartItem()
    if (!item) return
    addToCart(item)
    if (confirm('장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?')) {
      router.push('/cart')
    }
  }

  function handleBuy() {
    const item = getCartItem()
    if (!item) return
    setBuyNowItem(item)
    router.push('/checkout?mode=direct')
  }

  return (
    <section className="pt-8 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* 이미지 갤러리 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-zinc-50 rounded-2xl p-8 flex items-center justify-center min-h-[500px] mb-4 relative overflow-hidden group">
              <div className="absolute top-4 right-4 z-10">
                <WishlistButton productId={product.id} initialWished={initialWished} />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-[450px] object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-zinc-900 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* 상품 정보 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="text-sm font-bold text-sky-600 tracking-wide">수분 전문가의 비밀 공구템</p>
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900">{product.name}</h1>
                <p className="text-zinc-500">병풀잎소포 엑소좀 10,000ppm + 8종 히알루론산</p>
              </div>
            </div>

            {/* 가격 */}
            <div className="space-y-6">
              <div className="flex items-end gap-3 pb-6 border-b border-zinc-100">
                {product.original_price && (
                  <span className="text-zinc-400 line-through text-lg">
                    {product.original_price.toLocaleString()}원
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {product.original_price && (
                    <span className="text-red-500 text-3xl font-black">
                      {Math.round((1 - product.price / product.original_price) * 100)}%
                    </span>
                  )}
                  <span className="text-4xl font-black">{product.price.toLocaleString()}원</span>
                </div>
              </div>

              {/* 쿠폰 버튼 */}
              <div className="space-y-2">
                <button className="w-full h-12 bg-[#FEE500] rounded-lg flex items-center justify-between px-4 hover:brightness-95 transition-all">
                  <div className="flex items-center gap-2 font-bold text-[#3C1E1E] text-sm">
                    <span className="w-6 h-6 bg-[#3C1E1E] text-[#FEE500] rounded-full flex items-center justify-center font-black text-[10px]">P</span>
                    카카오톡 1초 가입하고 1만 원 쿠폰팩 받기
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#3C1E1E]" />
                </button>
                <button className="w-full h-12 bg-[#3C1E1E] rounded-lg flex items-center justify-between px-4 hover:brightness-110 transition-all">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center text-[10px]">Ch</div>
                    카톡 채널 추가하고 2천 원 쿠폰 받기
                  </div>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* 옵션 선택 */}
            {options.length > 0 && (
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setIsOptionOpen(!isOptionOpen)}
                  className="w-full bg-zinc-50 p-4 flex items-center justify-between font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <span>[옵션 선택]</span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${isOptionOpen ? 'rotate-90' : ''}`} />
                </button>
                <div className={`divide-y divide-zinc-100 ${isOptionOpen ? 'block' : 'hidden'}`}>
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setSelectedOptionId(opt.id); setIsOptionOpen(false); setQuantity(1) }}
                      className="w-full text-left p-4 hover:bg-sky-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-bold text-sm ${selectedOptionId === opt.id ? 'text-sky-600' : 'text-zinc-700'}`}>
                          {opt.name}
                        </span>
                        {opt.tag && (
                          <span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0">
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-zinc-900">{opt.price.toLocaleString()}원</span>
                        {opt.original_price && (
                          <span className="text-zinc-400 line-through text-xs">{opt.original_price.toLocaleString()}원</span>
                        )}
                        <span className="text-xs text-sky-500">{perUnitPrice(opt)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 선택된 옵션 표시 */}
            {selectedOption && (
              <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-zinc-700">{selectedOption.name}</span>
                  <button onClick={() => { setSelectedOptionId(null); setQuantity(1) }} className="text-zinc-400 hover:text-zinc-600">✕</button>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                  <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded px-2 h-8">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-zinc-400 px-2 hover:text-zinc-700"
                    >-</button>
                    <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="text-zinc-400 px-2 hover:text-zinc-700"
                    >+</button>
                  </div>
                  <span className="font-black text-lg">{(selectedOption.price * quantity).toLocaleString()}원</span>
                </div>
              </div>
            )}

            {/* 배송 정보 */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-zinc-900 mb-1">오늘 출발 14:00 마감</p>
                <p className="text-sm text-zinc-500 font-medium">
                  지금 주문 시 <span className="text-red-500 font-bold">내일</span>에 발송됩니다
                </p>
              </div>
            </div>

            {/* 구매 버튼 */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="col-span-1 h-14 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-xl hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                장바구니
              </button>
              <button
                onClick={handleBuy}
                className="col-span-2 h-14 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
              >
                바로 구매
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleBuy}
                className="h-12 bg-[#03C75A] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <span className="bg-white text-[#03C75A] w-4 h-4 flex items-center justify-center rounded-sm font-black text-[9px]">N</span>
                네이버페이 구매
              </button>
              <button
                onClick={handleBuy}
                className="h-12 bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                카카오페이 구매
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
