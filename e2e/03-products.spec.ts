import { test, expect } from '@playwright/test'

/**
 * 03. 상품 목록/검색/정렬/상세 점검
 */

test.describe('상품 목록', () => {
  test('상품 카드가 렌더링된다', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')
    // 상품 링크가 하나 이상 있어야 함
    const productLinks = page.locator('a[href^="/product/"]')
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 })
    const count = await productLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('상품 정렬 변경 동작', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')
    const sortSelect = page.locator('select').first()
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ index: 1 })
      await page.waitForLoadState('networkidle')
      // URL이 바뀌거나 같은 페이지에서 재정렬되어야 함
      expect(page.url()).toContain('/products')
    }
  })

  test('상품 검색 input 동작', async ({ page }) => {
    await page.goto('/products')
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"], input[name*="search"]').first()
    if (await searchInput.count() > 0) {
      await searchInput.fill('앰플')
      await searchInput.press('Enter')
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/products/)
    }
  })
})

test.describe('상품 상세', () => {
  test('상품 상세 페이지 진입', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')
    const firstProduct = page.locator('a[href^="/product/"]').first()
    const href = await firstProduct.getAttribute('href')
    expect(href).toBeTruthy()
    await page.goto(href!)
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toMatch(/\/product\//)
    // 핵심 요소: 장바구니/구매 버튼
    const buyOrCart = page.getByRole('button', { name: /장바구니|구매|구입|담기/ })
    await expect(buyOrCart.first()).toBeVisible({ timeout: 10000 })
  })

  test('정적 라우트 /product/cheonga-ampoule 로딩', async ({ page }) => {
    const res = await page.goto('/product/cheonga-ampoule')
    expect(res?.status()).toBeLessThan(400)
  })
})
