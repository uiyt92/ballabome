'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { useCartStore } from '@/store/cartStore'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'

export default function CartPage() {
    const [mounted, setMounted] = useState(false)
    const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center py-20">Loading cart...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto py-20 px-6">
                <h1 className="text-3xl font-bold mb-8">장바구니</h1>

                {items.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">장바구니에 담긴 상품이 없습니다.</h2>
                        <p className="text-gray-500 mb-8">원하시는 상품을 장바구니에 담아보세요.</p>
                        <Link href="/">
                            <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                쇼핑 계속하기
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 relative overflow-hidden">
                                        {/* Optional Image */}
                                        <div className="w-full h-full bg-zinc-200"></div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="font-bold text-lg mb-4">{item.price.toLocaleString()}원</div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l-lg transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r-lg transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="text-sm font-bold text-right ml-auto">
                                                소계: {(item.price * item.quantity).toLocaleString()}원
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-black block rounded-full" />
                                    결제 금액
                                </h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>총 상품 금액</span>
                                        <span>{getTotalPrice().toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>배송비</span>
                                        <span>무료</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-lg font-bold">결제 예정 금액</span>
                                        <span className="text-2xl font-black text-blue-600">
                                            {getTotalPrice().toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                                <Link href="/checkout">
                                    <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        {getTotalPrice().toLocaleString()}원 주문하기
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
