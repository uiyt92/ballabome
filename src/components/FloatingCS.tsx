'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function FloatingCS() {
    return (
        <a
            href="https://pf.kakao.com/_kcxfRX/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-zinc-900 text-white flex items-center justify-center rounded-full shadow-lg hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-200 animate-fade-in"
            aria-label="카카오톡 상담"
        >
            <MessageCircle className="w-6 h-6" />
        </a>
    )
}
