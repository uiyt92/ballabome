'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const CHANNEL_PUBLIC_ID = '_kcxfRX'

declare global {
  interface Window {
    Kakao: any
  }
}

export default function KakaoChannelFollow() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isNewMember = searchParams.get('new_member') === '1'

  useEffect(() => {
    if (!isNewMember) return

    // URL에서 new_member 파라미터 제거
    router.replace(pathname, { scroll: false })

    // Kakao SDK 로드 대기 후 채널 추가 실행
    const tryFollow = (attempts = 0) => {
      if (window.Kakao?.isInitialized()) {
        window.Kakao.Channel.followChannel({ channelPublicId: CHANNEL_PUBLIC_ID })
      } else if (attempts < 10) {
        setTimeout(() => tryFollow(attempts + 1), 300)
      }
    }
    tryFollow()
  }, [isNewMember, pathname, router])

  return null
}
