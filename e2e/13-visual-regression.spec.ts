import { test, expect } from '@playwright/test'

/**
 * 13. 시각 회귀 (Visual Regression)
 * - 핵심 페이지 스냅샷을 baseline과 비교
 * - 첫 실행: baseline 자동 생성 (--update-snapshots)
 * - 이후 실행: 픽셀 diff > 임계값이면 실패
 *
 * 주의:
 * - 동적 콘텐츠(시간/세션/광고) 마스킹
 * - 폰트 로드 완료 대기
 */

const targets = [
    { path: '/', name: 'home' },
    { path: '/products', name: 'products' },
    { path: '/login', name: 'login' },
    { path: '/cart', name: 'cart' },
    { path: '/story', name: 'story' },
]

test.describe('시각 회귀 - 데스크탑', () => {
    test.use({ viewport: { width: 1280, height: 800 } })

    for (const t of targets) {
        test(`${t.name} 데스크탑 스냅샷`, async ({ page }) => {
            await page.goto(t.path, { waitUntil: 'networkidle' })
            // 폰트/이미지 안정화
            await page.evaluate(() => document.fonts.ready)
            await page.waitForTimeout(800)

            // 동적 영역 가리기 (있으면)
            const masks = [
                page.locator('[data-testid="floating-review"]'),
                page.locator('iframe'), // 카카오톡 위젯 등
            ]

            await expect(page).toHaveScreenshot(`${t.name}-desktop.png`, {
                fullPage: true,
                mask: masks,
                maxDiffPixelRatio: 0.02, // 2% 차이까지 허용
                animations: 'disabled',
            })
        })
    }
})

test.describe('시각 회귀 - 모바일 390', () => {
    test.use({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        isMobile: true,
        hasTouch: true,
    })

    for (const t of targets) {
        test(`${t.name} 모바일 스냅샷`, async ({ page }) => {
            await page.goto(t.path, { waitUntil: 'networkidle' })
            await page.evaluate(() => document.fonts.ready)
            await page.waitForTimeout(800)

            await expect(page).toHaveScreenshot(`${t.name}-mobile.png`, {
                fullPage: true,
                mask: [page.locator('iframe')],
                maxDiffPixelRatio: 0.02,
                animations: 'disabled',
            })
        })
    }
})
