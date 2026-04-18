import React from 'react'
import { CreditCard, Gift } from 'lucide-react'

export default function CouponSection() {
    return (
        <section className="w-full py-12 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Refund Guarantee Coupon */}
                    <div
                        className="flex items-center justify-between p-7 md:p-8 bg-sky-400 rounded-2xl text-white group cursor-pointer hover:bg-sky-500 transition-colors"
                    >
                        <div className="text-left">
                            <h3 className="text-2xl md:text-3xl font-black mb-1">100% 환불</h3>
                            <p className="text-xs md:text-sm opacity-90">제품에 대한 자신감, 먼저 사용해보고 결정하세요.</p>
                        </div>
                        <CreditCard className="w-12 h-12 md:w-14 md:h-14 opacity-50 group-hover:opacity-80 transition-opacity" />
                    </div>

                    {/* Discount Coupon */}
                    <div
                        className="flex items-center justify-between p-7 md:p-8 bg-zinc-800 rounded-2xl text-white group cursor-pointer hover:bg-zinc-900 transition-colors"
                    >
                        <div className="text-left">
                            <h3 className="text-2xl md:text-3xl font-black mb-1">1만 원 쿠폰</h3>
                            <p className="text-xs md:text-sm opacity-90">회원 가입 즉시 사용 가능한 쿠폰팩을 드려요.</p>
                        </div>
                        <Gift className="w-12 h-12 md:w-14 md:h-14 opacity-50 group-hover:opacity-80 transition-opacity" />
                    </div>
                </div>
            </div>
        </section>
    )
}
