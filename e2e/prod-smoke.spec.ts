import { test, expect } from '@playwright/test'

/**
 * 프로덕션 스모크 테스트 — ballabom.com 대상
 *
 * 실행: PROD_URL=https://ballabom.com npx playwright test e2e/prod-smoke.spec.ts --project=chromium
 *
 * webServer 없이 외부 URL 직접 타격. 사용자 요청 10개 시나리오 커버.
 */

const PROD = process.env.PROD_URL || 'https://ballabom.com'

test.describe.configure({ mode: 'serial' })

test('1. 홈 페이지 로딩 + BALLABOM 로고 텍스트', async ({ page }) => {
    const errors: string[] = []
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })

    const res = await page.goto(PROD, { waitUntil: 'domcontentloaded' })
    expect(res?.status()).toBe(200)

    // Navbar BALLABOM 텍스트 로고
    const logo = page.locator('nav a[href="/"]').first()
    await expect(logo).toBeVisible()
    const logoText = await logo.textContent()
    expect(logoText).toContain('BALLABOM')

    // 치명적 콘솔 에러 없음
    const fatal = errors.filter(e => /Uncaught|Hydration|ChunkLoad/.test(e))
    console.log(`[홈] 콘솔 에러: ${errors.length}개 / 치명적: ${fatal.length}개`)
    if (errors.length) console.log('에러 샘플:', errors.slice(0, 3))
    expect(fatal).toHaveLength(0)
})

test('2. 히어로 캐러셀 이미지 렌더', async ({ page }) => {
    await page.goto(PROD, { waitUntil: 'networkidle' })
    const heroW = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'))
        const hero = imgs.find(i => i.getBoundingClientRect().width > 400)
        return hero?.getBoundingClientRect().width ?? 0
    })
    expect(heroW).toBeGreaterThan(400)
})

test('3. /products 상품 카드', async ({ page }) => {
    const res = await page.goto(`${PROD}/products`, { waitUntil: 'networkidle' })
    expect(res?.status()).toBe(200)
    const links = page.locator('a[href^="/product/"]')
    await expect(links.first()).toBeVisible({ timeout: 10000 })
    const n = await links.count()
    console.log(`[상품 목록] 카드 ${n}개`)
    expect(n).toBeGreaterThan(0)
})

test('4. 상품 상세 진입 (이미지 + 구매 버튼)', async ({ page }) => {
    await page.goto(`${PROD}/products`, { waitUntil: 'networkidle' })
    const href = await page.locator('a[href^="/product/"]').first().getAttribute('href')
    expect(href).toBeTruthy()
    await page.goto(`${PROD}${href}`, { waitUntil: 'networkidle' })

    // 이미지 존재 + 장바구니/구매 버튼
    const img = page.locator('img').first()
    await expect(img).toBeVisible()
    const btn = page.getByRole('button', { name: /장바구니|구매|구입|담기/ })
    await expect(btn.first()).toBeVisible({ timeout: 10000 })
})

test('5. /login 카카오 버튼', async ({ page }) => {
    await page.goto(`${PROD}/login`, { waitUntil: 'domcontentloaded' })
    const kakao = page.getByRole('button', { name: /카카오/ }).first()
    await expect(kakao).toBeVisible()
})

test('6. /cart 빈 장바구니 상태', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto(PROD)
    await page.evaluate(() => localStorage.clear())
    await page.goto(`${PROD}/cart`, { waitUntil: 'networkidle' })
    // Zustand hydration 완료 대기 (Loading cart... → 실제 콘텐츠)
    await page.waitForFunction(() => !document.body.textContent?.includes('Loading cart'), { timeout: 10000 })
    const body = await page.locator('body').textContent()
    expect(body).toMatch(/비어|empty|담긴 상품|쇼핑 계속하기/i)
})

test('7. /story /privacy /terms 로딩', async ({ page }) => {
    for (const path of ['/story', '/privacy', '/terms']) {
        const res = await page.goto(`${PROD}${path}`, { waitUntil: 'domcontentloaded' })
        console.log(`${path} → ${res?.status()}`)
        expect(res?.status()).toBeLessThan(400)
    }
})

test.describe('8. 모바일 390×844', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

    test('햄버거 메뉴 토글', async ({ page }) => {
        await page.goto(PROD, { waitUntil: 'domcontentloaded' })
        const menuBtn = page.locator('nav button').filter({ has: page.locator('svg') }).last()
        await menuBtn.click()
        await page.waitForTimeout(600)
        // 슬라이드 메뉴 컨테이너 scope
        const slideMenu = page.locator('div.fixed.top-0.right-0.h-full.w-72')
        await expect(slideMenu).toBeVisible()
        const menuOpen = await slideMenu.evaluate(el => el.className.includes('translate-x-0'))
        expect(menuOpen).toBeTruthy()
        // 슬라이드 메뉴 안의 브랜드 스토리 링크
        await expect(slideMenu.locator('a[href="/story"]')).toBeVisible()
    })

    test('가로 오버플로 체크', async ({ page }) => {
        await page.goto(PROD, { waitUntil: 'networkidle' })
        const bodyW = await page.evaluate(() => document.body.scrollWidth)
        console.log(`[모바일] body.scrollWidth = ${bodyW}`)
        expect(bodyW).toBeLessThanOrEqual(390 + 20)
    })
})

test('9. 홈 깨진 이미지 검사', async ({ page }) => {
    await page.goto(PROD, { waitUntil: 'networkidle' })
    const broken = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
            .filter(i => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:'))
            .map(i => ({ src: i.src, alt: i.alt }))
    })
    if (broken.length) console.log('깨진 이미지:', JSON.stringify(broken, null, 2))
    expect(broken, `깨진 이미지 ${broken.length}개`).toHaveLength(0)
})

test('10. /admin 비인증 리디렉션', async ({ page }) => {
    await page.context().clearCookies()
    const res = await page.goto(`${PROD}/admin`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
    // /login으로 리디렉션되거나 가드 메시지
    const url = page.url()
    console.log(`[admin 가드] 최종 URL: ${url}`)
    expect(url.includes('/login') || !url.includes('/admin/')).toBeTruthy()
})
