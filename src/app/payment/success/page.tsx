'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Suspense, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

function PaymentSuccessContent() {
    const searchParams = useSearchParams()
    const amount = searchParams.get('amount')
    const orderId = searchParams.get('orderId')
    const paymentKey = searchParams.get('paymentKey')

    // 결제 성공 시 DB 주문 상태를 PAID로 업데이트
    useEffect(() => {
        const updateOrder = async () => {
            if (!orderId) return
            const supabase = createClient()
            await supabase
                .from('orders')
                .update({
                    status: 'PAID',
                    payment_key: paymentKey,
                    updated_at: new Date().toISOString(),
                })
                .eq('order_id', orderId)
        }
        updateOrder()
    }, [orderId, paymentKey])

    return (
        <div className="max-w-2xl mx-auto py-32 px-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-3xl font-black mb-4 text-zinc-900">결제가 완료되었습니다!</h1>
            <p className="text-zinc-500 mb-12">소중한 주문 감사합니다. <br />빠른 배송을 위해 최선을 다하겠습니다.</p>

            <div className="bg-zinc-50 rounded-2xl p-8 mb-12 text-left space-y-4">
                <div className="flex justify-between">
                    <span className="text-zinc-500">주문번호</span>
                    <span className="font-mono font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">결제금액</span>
                    <span className="font-bold text-lg text-sky-600">{Number(amount).toLocaleString()}원</span>
                </div>
            </div>

            <Link href="/">
                <button className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors">
                    홈으로 돌아가기
                </button>
            </Link>
        </div>
    )
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
                <PaymentSuccessContent />
            </Suspense>
        </div>
    )
}
