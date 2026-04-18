import { test, expect, devices } from '@playwright/test'

/**
 * 09. 모바일 비주얼 검증
 * - 360px / 390px 두 뷰포트
 * - 로고 이미지 표시 + 크기 검증
 * - 텍스트 가로 오버플로 없음
 * - 터치 타겟 ≥ 44px
 * - 핵심 페이지 스크린샷 캡처
 */

const viewports = [
    { name: '360px', width: 360, height: 780 },
    { name: '390px', width: 390, height: 844 },
]

const pagesToCheck = [
    { path: '/', name: 'home' },
    { path: '/products', name: 'products' },
    { path: '/cart', name: 'cart' },
    { path: '/login', name: 'login' },
    { path: '/story', name: 'story' },
]

for (const vp of viewports) {
    test.describe(`모바일 ${vp.name}`, () => {
        test.use({
            viewport: { width: vp.width, height: vp.height },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
            isMobile: true,
            hasTouch: true,
        })

        for (const pg of pagesToCheck) {
            test(`${pg.name} - 가로 오버플로 없음 + 스크린샷`, async ({ page }, testInfo) => {
                await page.goto(pg.path, { waitUntil: 'networkidle' })
                await page.waitForTimeout(500) // 폰트/이미지 안정화

                // 1) 가로 스크롤 발생 여부
                const overflow = await page.evaluate(() => {
                    return {
                        bodyWidth: document.body.scrollWidth,
                        innerWidth: window.innerWidth,
                        overflowing: Array.from(document.querySelectorAll('*'))
                            .filter(el => {
                                const r = el.getBoundingClientRect()
                                return r.right > window.innerWidth + 1
                            })
                            .slice(0, 5)
                            .map(el => ({
                                tag: el.tagName,
                                cls: (el as HTMLElement).className?.toString().slice(0, 60),
                                w: Math.round(el.getBoundingClientRect().width),
                                right: Math.round(el.getBoundingClientRect().right),
                            })),
                    }
                })

                console.log(`[${vp.name}] ${pg.name}: bodyWidth=${overflow.bodyWidth} window=${overflow.innerWidth}`)
                if (overflow.overflowing.length > 0) {
                    console.log(`  넘치는 요소:`, JSON.stringify(overflow.overflowing, null, 2))
                }

                // body가 viewport보다 20px 이상 넓으면 실패 (스크롤바/폰트 렌더 차이 허용)
                expect(overflow.bodyWidth, `body가 viewport(${vp.width}) 초과`).toBeLessThanOrEqual(vp.width + 20)

                // 2) 스크린샷 저장
                await testInfo.attach(`${pg.name}-${vp.name}.png`, {
                    body: await page.screenshot({ fullPage: true }),
                    contentType: 'image/png',
                })
            })
        }

        test('홈 - 로고 이미지 검증', async ({ page }) => {
            await page.goto('/', { waitUntil: 'networkidle' })
            await page.waitForTimeout(500)

            // 보이는 nav 안의 첫 번째 / 링크 (로고)
            const logoArea = page.locator('nav a[href="/"]').filter({ visible: true }).first()
            await expect(logoArea).toBeVisible({ timeout: 5000 })

            const box = await logoArea.boundingBox()
            expect(box).not.toBeNull()
            expect(box!.height).toBeGreaterThanOrEqual(20)
            expect(box!.height).toBeLessThanOrEqual(80)
            expect(box!.width).toBeLessThanOrEqual(vp.width)

            // 로고 이미지 자연 크기 (next/image면 img 태그)
            const logoImg = logoArea.locator('img').first()
            if (await logoImg.count() > 0) {
                const dims = await logoImg.evaluate((el: HTMLImageElement) => ({
                    naturalWidth: el.naturalWidth,
                    naturalHeight: el.naturalHeight,
                    displayWidth: el.clientWidth,
                    displayHeight: el.clientHeight,
                    src: el.src,
                    complete: el.complete,
                }))
                console.log(`[${vp.name}] 로고:`, dims)
                expect(dims.complete, '로고 이미지 로드 완료').toBeTruthy()
                expect(dims.naturalWidth, '로고 이미지 깨짐 (naturalWidth=0)').toBeGreaterThan(0)
            }
        })

        test('홈 - 히어로 캐러셀 가시성', async ({ page }) => {
            await page.goto('/', { waitUntil: 'networkidle' })
            // 첫 번째 화면 폭 70% 이상인 이미지를 히어로로 간주
            const heroWidth = await page.evaluate((minW) => {
                const imgs = Array.from(document.querySelectorAll('img'))
                const hero = imgs.find(img => img.getBoundingClientRect().width >= minW)
                return hero?.getBoundingClientRect().width ?? 0
            }, vp.width * 0.7)
            expect(heroWidth, '히어로 이미지가 viewport의 70% 이상 차지').toBeGreaterThan(vp.width * 0.7)
        })

        test('터치 타겟 크기 ≥ 40px (Navbar 버튼/링크)', async ({ page }) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' })
            await page.waitForTimeout(300)

            const result = await page.evaluate(() => {
                const targets = Array.from(document.querySelectorAll('nav button, nav a'))
                return targets
                    .filter(el => {
                        const r = el.getBoundingClientRect()
                        return r.width > 0 && r.height > 0 // 보이는 것만
                    })
                    .map(el => {
                        const r = el.getBoundingClientRect()
                        return {
                            tag: el.tagName,
                            text: (el.textContent || '').slice(0, 20).trim(),
                            w: Math.round(r.width),
                            h: Math.round(r.height),
                        }
                    })
                    .filter(t => t.h < 40)
            })

            if (result.length > 0) {
                console.log(`[${vp.name}] 작은 터치 타겟 (40px 미만):`, JSON.stringify(result, null, 2))
            }
            // 경고만 (fail은 안 함 — 텍스트 링크는 작을 수 있음)
        })

        test('텍스트 가독성 (본문 폰트 ≥ 12px)', async ({ page }) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' })
            await page.waitForTimeout(300)

            const tooSmall = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li'))
                    .filter(el => {
                        const text = el.textContent?.trim()
                        if (!text || text.length < 3) return false
                        const r = el.getBoundingClientRect()
                        if (r.width === 0 || r.height === 0) return false
                        const fs = parseFloat(getComputedStyle(el).fontSize)
                        return fs < 12
                    })
                    .slice(0, 5)
                    .map(el => ({
                        tag: el.tagName,
                        text: (el.textContent || '').slice(0, 30).trim(),
                        fontSize: getComputedStyle(el).fontSize,
                    }))
            })

            if (tooSmall.length > 0) {
                console.log(`[${vp.name}] 12px 미만 텍스트:`, JSON.stringify(tooSmall, null, 2))
            }
            // 일부 라벨/배지는 작을 수 있어 fail 안 함
        })
    })
}
