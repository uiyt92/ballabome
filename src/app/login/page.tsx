'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
    const handleKakaoLogin = () => {
        if (typeof window !== 'undefined' && (window as any).Kakao) {
            const Kakao = (window as any).Kakao;
            if (!Kakao.isInitialized()) {
                alert('카카오 SDK가 초기화되지 않았습니다.');
                return;
            }
            Kakao.Auth.authorize({
                redirectUri: `${window.location.origin}/auth/kakao/callback`
            });
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
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

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-zinc-400">
                                    또는 이메일로 로그인
                                </span>
                            </div>
                        </div>

                        <button
                            className="w-full h-12 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                            이메일 로그인
                        </button>

                        <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 mt-4">
                            <Link href="#" className="hover:text-zinc-600">아이디 찾기</Link>
                            <span className="w-[1px] h-3 bg-zinc-200"></span>
                            <Link href="#" className="hover:text-zinc-600">비밀번호 찾기</Link>
                            <span className="w-[1px] h-3 bg-zinc-200"></span>
                            <Link href="#" className="hover:text-zinc-600">회원가입</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
