'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const BANNER_DISMISSED_KEY = 'topBannerDismissed'

const DEFAULTS = {
    text_before: '카카오톡 채널 추가하면',
    text_highlight: '3,000원 할인쿠폰',
    text_after: '즉시 지급',
}

export default function TopBanner() {
    const [visible, setVisible] = useState(false)
    const [texts, setTexts] = useState(DEFAULTS)

    useEffect(() => {
        const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY)
        if (!dismissed) setVisible(true)

        // CMS 데이터 로드 (경량)
        createClient()
            .from('site_content')
            .select('key, value_content')
            .eq('section', 'top_banner')
            .then(({ data }) => {
                if (!data || data.length === 0) return
                const cms: Record<string, string> = {}
                for (const item of data) if (item.value_content) cms[item.key] = item.value_content
                setTexts({
                    text_before: cms.text_before || DEFAULTS.text_before,
                    text_highlight: cms.text_highlight || DEFAULTS.text_highlight,
                    text_after: cms.text_after || DEFAULTS.text_after,
                })
            })
    }, [])

    if (!visible) return null

    return (
        <div className="w-full bg-zinc-900 text-white text-center py-2.5 text-xs md:text-sm font-medium relative">
            <span className="text-zinc-400">{texts.text_before}</span>{' '}
            <span className="text-white font-bold">{texts.text_highlight}</span>{' '}
            <span className="text-zinc-400">{texts.text_after}</span>
            <button
                onClick={() => { setVisible(false); sessionStorage.setItem(BANNER_DISMISSED_KEY, '1') }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}
