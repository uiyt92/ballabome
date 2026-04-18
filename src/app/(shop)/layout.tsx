import { Suspense } from 'react'
import TopBanner from '@/components/TopBanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingCS from '@/components/FloatingCS'
import FloatingReview from '@/components/FloatingReview'
import KakaoChannelFollow from '@/components/KakaoChannelFollow'

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
            {/* 맨 상단 가입 유도 배너 */}
            <TopBanner />

            {/* Navigation */}
            <Navbar />

            <main>{children}</main>

            {/* Footer */}
            <Footer />

            {/* 플로팅 후기 (왼쪽) */}
            <FloatingReview />

            {/* 플로팅 상담 버튼 (오른쪽) */}
            <FloatingCS />

            {/* 신규 회원 카카오 채널 자동 추가 */}
            <Suspense>
                <KakaoChannelFollow />
            </Suspense>
        </div>
    )
}
