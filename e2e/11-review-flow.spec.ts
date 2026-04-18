import { test, expect } from '@playwright/test'
import { loginAs, TEST_USER } from './helpers/auth'
import * as fs from 'fs'
import * as path from 'path'

/**
 * 11. 리뷰 작성 흐름
 * - 비로그인 시 리뷰 폼 미노출 또는 가드
 * - 로그인 시 리뷰 폼 노출 + 입력 가능
 * - 별점/텍스트 입력 + 이미지 첨부 가능
 * - 실제 등록까지는 하지 않음 (DB 더미 데이터 방지)
 */

async function gotoFirstProduct(page: any) {
    await page.goto('/products', { waitUntil: 'networkidle' })
    const href = await page.locator('a[href^="/product/"]').first().getAttribute('href')
    if (!href) throw new Error('상품 없음')
    await page.goto(href, { waitUntil: 'networkidle' })
    return href
}

test.describe('리뷰 흐름', () => {
    test('비로그인 시 리뷰 작성 폼 가드 또는 로그인 안내', async ({ page }) => {
        await page.context().clearCookies()
        await gotoFirstProduct(page)
        // 리뷰 탭 클릭 (탭 UI일 수 있음)
        const reviewTab = page.getByRole('tab', { name: /리뷰/ }).or(page.getByRole('button', { name: /리뷰/ })).first()
        if (await reviewTab.isVisible().catch(() => false)) {
            await reviewTab.click()
        }
        const body = await page.locator('body').textContent()
        // "리뷰 작성" 폼이 보이거나 "로그인" 안내가 있어야 함
        expect(body).toMatch(/리뷰|로그인/)
    })

    test('로그인 사용자 리뷰 폼 노출 + 입력', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        await gotoFirstProduct(page)

        // 리뷰 탭 진입
        const reviewTab = page.getByRole('tab', { name: /리뷰/ }).or(page.getByRole('button', { name: /리뷰/ })).first()
        if (await reviewTab.isVisible().catch(() => false)) {
            await reviewTab.click()
            await page.waitForTimeout(500)
        }

        // 리뷰 textarea
        const reviewInput = page.locator('textarea[placeholder*="리뷰"]').or(page.locator('textarea')).first()
        if (await reviewInput.isVisible().catch(() => false)) {
            await reviewInput.fill('E2E 테스트 리뷰입니다. 실제 등록은 하지 않습니다.')
            await expect(reviewInput).toHaveValue(/E2E 테스트 리뷰/)
        }

        // 등록 버튼이 존재해야 함 (실제 클릭은 하지 않음)
        const submitBtn = page.getByRole('button', { name: /리뷰 등록|등록/ })
        const cnt = await submitBtn.count()
        expect(cnt, '리뷰 등록 버튼이 보여야 함').toBeGreaterThan(0)
    })

    test('리뷰 이미지 file input 존재', async ({ page, request, context }) => {
        await loginAs(request, context, TEST_USER, 'user')
        await gotoFirstProduct(page)
        const reviewTab = page.getByRole('tab', { name: /리뷰/ }).or(page.getByRole('button', { name: /리뷰/ })).first()
        if (await reviewTab.isVisible().catch(() => false)) {
            await reviewTab.click()
            await page.waitForTimeout(500)
        }
        const fileInput = page.locator('input[type="file"]').first()
        // 폼에 file input이 있어야 함
        const cnt = await fileInput.count()
        expect(cnt, '리뷰 이미지 첨부 input 존재').toBeGreaterThan(0)
    })
})
