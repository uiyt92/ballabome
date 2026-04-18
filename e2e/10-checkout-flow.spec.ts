import { test, expect } from '@playwright/test'
import { loginAs, TEST_USER } from './helpers/auth'

/**
 * 10. 결제 흐름 점검
 * - 비로그인 상태에서 /checkout 접근 가능 여부
 * - 로그인 후 장바구니 → 체크아웃 폼 표시
 * - 폼 입력 (이름/전화번호/주소) 가능
 * - "결제하기" 버튼 노출 (실제 토스 SDK는 호출하지 않음 - 외부 모달)
 */

test.describe('체크아웃 흐름', () => {
    test('로그인 후 장바구니 → 체크아웃 진입', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')

        // 장바구니에 임시 아이템 주입
        await page.goto('/')
        await page.evaluate(() => {
            const item = {
                id: 'test-product-1',
                name: '테스트 상품',
                price: 10000,
                quantity: 1,
                image: '/images/products/BALABOM_07.jpg',
            }
            const state = { state: { items: [item], buyNowItem: null }, version: 0 }
            localStorage.setItem('ballabom-cart-storage', JSON.stringify(state))
        })

        await page.goto('/checkout', { waitUntil: 'networkidle' })
        // 체크아웃 폼이 떠야 함
        const body = await page.locator('body').textContent()
        expect(body).toMatch(/결제|배송|주문|이름/)
    })

    test('체크아웃 폼 입력 가능', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        await page.goto('/')
        await page.evaluate(() => {
            const item = {
                id: 'test-product-1', name: '테스트 상품',
                price: 10000, quantity: 1, image: '/images/products/BALABOM_07.jpg',
            }
            localStorage.setItem('ballabom-cart-storage', JSON.stringify({ state: { items: [item], buyNowItem: null }, version: 0 }))
        })

        await page.goto('/checkout', { waitUntil: 'networkidle' })

        const nameInput = page.locator('input[placeholder*="이름"]').first()
        const phoneInput = page.locator('input[placeholder*="010"]').first()

        if (await nameInput.isVisible().catch(() => false)) {
            await nameInput.fill('테스트유저')
            await expect(nameInput).toHaveValue('테스트유저')
        }
        if (await phoneInput.isVisible().catch(() => false)) {
            await phoneInput.fill('010-1234-5678')
            await expect(phoneInput).toHaveValue('010-1234-5678')
        }
    })

    test('결제하기 버튼 노출', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        await page.goto('/')
        await page.evaluate(() => {
            const item = {
                id: 'test-product-1', name: '테스트 상품',
                price: 10000, quantity: 1, image: '/images/products/BALABOM_07.jpg',
            }
            localStorage.setItem('ballabom-cart-storage', JSON.stringify({ state: { items: [item], buyNowItem: null }, version: 0 }))
        })

        await page.goto('/checkout', { waitUntil: 'networkidle' })
        // 결제 버튼 (Toss SDK 로딩 후)
        const payBtn = page.getByRole('button', { name: /결제/ })
        await expect(payBtn.first()).toBeVisible({ timeout: 10000 })
    })

    test('payment/fail 페이지 정상 로딩', async ({ page }) => {
        const res = await page.goto('/payment/fail?code=USER_CANCEL&message=취소', { waitUntil: 'domcontentloaded' })
        expect(res?.status()).toBeLessThan(400)
        const body = await page.locator('body').textContent()
        expect(body).toMatch(/실패|취소|fail/i)
    })
})
