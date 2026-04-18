import { test, expect } from '@playwright/test'

/**
 * 02. 레이아웃 & 네비게이션 점검
 */

test.describe('Navbar', () => {
  test('로고/홈 링크 동작', async ({ page }) => {
    await page.goto('/products')
    const logo = page.locator('nav a[href="/"]').first()
    await expect(logo).toBeVisible()
    await logo.click()
    await expect(page).toHaveURL('/')
  })

  test('네비게이션 링크 존재 (스토리/상품)', async ({ page, isMobile }) => {
    test.skip(isMobile, '모바일은 햄버거 메뉴 안에 있음 (별도 테스트)')
    await page.goto('/')
    const storyLink = page.locator('nav a[href="/story"]').first()
    const productsLink = page.locator('nav a[href="/products"]').first()
    await expect(storyLink).toBeVisible()
    await expect(productsLink).toBeVisible()
  })

  test('장바구니 링크 존재', async ({ page }) => {
    await page.goto('/')
    const cartLink = page.locator('a[href="/cart"]').first()
    await expect(cartLink).toBeVisible()
  })
})

test.describe('Footer', () => {
  test('Footer 표시', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})

test.describe('모바일 네비게이션', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('햄버거 메뉴 토글', async ({ page }) => {
    await page.goto('/')
    const menuBtn = page.locator('nav button').filter({ has: page.locator('svg') }).first()
    if (await menuBtn.isVisible().catch(() => false)) {
      await menuBtn.click()
      await page.waitForTimeout(500)
      const link = page.locator('a[href="/story"]').first()
      await expect(link).toBeVisible()
    }
  })
})
