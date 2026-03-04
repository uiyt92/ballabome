'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Suspense } from 'react'

function PaymentFailContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const code = searchParams.get('code')

    return (
        <div className="max-w-2xl mx-auto py-32 px-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>

            <h1 className="text-3xl font-black mb-4 text-zinc-900">결제에 실패하였습니다.</h1>
            <p className="text-zinc-500 mb-12">잠시 후 다시 시도해 주세요.</p>

            <div className="bg-red-50 rounded-2xl p-8 mb-12 text-left space-y-4 border border-red-100">
                <div className="flex justify-between">
                    <span className="text-red-500 font-bold">오류 내용</span>
                    <span className="font-mono text-zinc-700">{message}</span>
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

export default function PaymentFailPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
                <PaymentFailContent />
            </Suspense>
        </div>
    )
}
