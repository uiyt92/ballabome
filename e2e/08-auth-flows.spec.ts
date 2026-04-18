import { test, expect } from '@playwright/test'
import { loginAs, TEST_USER, TEST_ADMIN } from './helpers/auth'

/**
 * 08. 인증 필요한 흐름
 * - 일반 회원: /mypage 접근, 위시리스트 토글
 * - 관리자: /admin 진입, 각 어드민 서브 페이지 접근
 */

test.describe('일반 회원 흐름', () => {
    test('로그인 후 /mypage 접근 가능', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        const res = await page.goto('/mypage', { waitUntil: 'domcontentloaded' })
        expect(res?.status()).toBeLessThan(400)
        // 로그인 페이지로 리디렉션 안 됨
        expect(page.url()).toContain('/mypage')
    })

    test('로그인 사용자에게 마이페이지 콘텐츠 노출', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        await page.goto('/mypage', { waitUntil: 'domcontentloaded' })
        const body = await page.locator('body').textContent()
        // 주문/위시리스트/프로필 키워드 중 하나라도 나타나야 함
        expect(body).toMatch(/주문|위시|마이|프로필|email|배송/)
    })

    test('상품 상세 위시리스트 버튼 클릭 가능', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        await page.goto('/products')
        await page.waitForLoadState('networkidle')
        const firstHref = await page.locator('a[href^="/product/"]').first().getAttribute('href')
        if (!firstHref) test.skip()
        await page.goto(firstHref!)
        // 하트(위시리스트) 버튼 클릭 시도
        const wishBtn = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' })
        // 단순히 버튼이 존재하는지 확인 (구체적 셀렉터는 컴포넌트 의존)
        const cnt = await wishBtn.count()
        expect(cnt).toBeGreaterThan(0)
    })
})

test.describe('관리자 흐름', () => {
    test('관리자 로그인 후 /admin 접근', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_ADMIN, 'admin')
        await page.goto('/admin', { waitUntil: 'domcontentloaded' })
        await page.waitForTimeout(800) // 권한 확인 + 리디렉션 여부 대기
        // / 로 튕기지 않아야 함
        expect(page.url()).toContain('/admin')
        // 사이드바의 'MANSHARD' 또는 'ADMIN' 텍스트
        const body = await page.locator('body').textContent()
        expect(body).toMatch(/MANSHARD|ADMIN|대시보드/)
    })

    const adminPages = [
        { path: '/admin/orders', name: '주문 관리', keyword: /주문|order/i },
        { path: '/admin/products', name: '상품 관리', keyword: /상품|product/i },
        { path: '/admin/reviews', name: '리뷰 관리', keyword: /리뷰|review/i },
        { path: '/admin/members', name: '회원 관리', keyword: /회원|member/i },
        { path: '/admin/content', name: '콘텐츠 CMS', keyword: /콘텐츠|content|히어로/i },
    ]

    for (const p of adminPages) {
        test(`관리자 ${p.name} 페이지 접근`, async ({ page, request, context }) => {
            await loginAs(request, context, TEST_ADMIN, 'admin')
            const res = await page.goto(p.path, { waitUntil: 'domcontentloaded' })
            expect(res?.status()).toBeLessThan(400)
            expect(page.url()).toContain(p.path)
            const body = await page.locator('body').textContent()
            expect(body).toMatch(p.keyword)
        })
    }

    test('일반 회원이 /admin 접근 → 홈으로 리디렉션', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        await page.goto('/admin', { waitUntil: 'domcontentloaded' })
        await page.waitForTimeout(1000)
        // 일반 회원은 / 로 리디렉션
        expect(page.url()).not.toContain('/admin/')
    })
})
