'use client'

import React from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
    const handleKakaoLogin = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Supabase 카카오 로그인 에러:', error.message);
            alert('로그인 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <Link href="/" className="text-3xl font-black tracking-tight text-zinc-900">
                            BALLABOM
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-zinc-900">
                            로그인
                        </h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            발라봄에 오신 것을 환영합니다.
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={handleKakaoLogin}
                            className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-bold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3C6.477 3 2 6.142 2 10.018C2 12.551 3.654 14.773 6.162 16.035L5.196 20.675C5.127 20.976 5.485 21.196 5.736 21.018L11.516 17.135C11.676 17.142 11.838 17.146 12 17.146C17.523 17.146 22 14.004 22 10.128C22 6.252 17.523 3 12 3Z" />
                            </svg>
                            카카오로 1초 만에 시작하기
                        </button>

                        <div className="flex items-center justify-center text-xs text-zinc-400 mt-2">
                            <button onClick={handleKakaoLogin} className="hover:text-zinc-600 underline">회원가입</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
