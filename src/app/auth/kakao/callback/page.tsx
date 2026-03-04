'use client'

import { useEffect, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

function KakaoCallbackContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

    useEffect(() => {
        if (error) {
            setStatus('error')
            return
        }

        if (code) {
            setStatus('success')
            // TODO: Here you would normally send the 'code' to your backend API 
            // e.g., POST /api/auth/kakao { code }
            // to exchange it for an access token and create a session.
        }
    }, [code, error])

    return (
        <div className="max-w-md mx-auto py-32 px-6 text-center">
            {status === 'loading' && (
                <>
                    <div className="w-16 h-16 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-8" />
                    <h1 className="text-2xl font-bold mb-2">카카오 로그인 처리 중...</h1>
                    <p className="text-zinc-500">잠시만 기다려주세요.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-20 h-20 bg-[#FEE500] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#3C1E1E">
                            <path d="M12 3C6.477 3 2 6.142 2 10.018C2 12.551 3.654 14.773 6.162 16.035L5.196 20.675C5.127 20.976 5.485 21.196 5.736 21.018L11.516 17.135C11.676 17.142 11.838 17.146 12 17.146C17.523 17.146 22 14.004 22 10.128C22 6.252 17.523 3 12 3Z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black mb-4">로그인 성공!</h1>
                    <p className="text-zinc-600 mb-8">
                        카카오 간편로그인이 성공적으로 완료되었습니다.<br /><br />
                        <span className="text-xs bg-zinc-100 p-2 rounded">발급된 인가 코드: {code?.substring(0, 15)}...</span>
                    </p>
                    <Link href="/">
                        <button className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors">
                            홈으로 이동
                        </button>
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black mb-4">로그인 실패</h1>
                    <p className="text-zinc-600 mb-8">
                        {errorDescription || '카카오 로그인 중 오류가 발생했습니다.'}
                    </p>
                    <Link href="/login">
                        <button className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors">
                            다시 시도하기
                        </button>
                    </Link>
                </>
            )}
        </div>
    )
}

export default function KakaoCallbackPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
                <KakaoCallbackContent />
            </Suspense>
        </div>
    )
}
