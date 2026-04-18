import { test, expect } from '@playwright/test'

/**
 * 07. 퍼포먼스 / 캐러셀 점검
 * - 홈 LCP/로딩 시간
 * - 캐러셀 이미지 존재
 * - 깨진 이미지 없음
 */

test('홈 페이지 로딩 시간 (5초 이내)', async ({ page }) => {
  const start = Date.now()
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const elapsed = Date.now() - start
  console.log(`홈 DOMContentLoaded: ${elapsed}ms`)
  expect(elapsed).toBeLessThan(5000)
})

test('히어로 캐러셀 이미지 렌더링', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  // 캐러셀 영역의 이미지
  const heroImg = page.locator('img').first()
  await expect(heroImg).toBeVisible({ timeout: 10000 })
})

test('홈 깨진 이미지 없음', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const broken = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'))
    return imgs
      .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'))
      .map(img => img.src)
  })
  expect(broken, `깨진 이미지: ${broken.join(', ')}`).toHaveLength(0)
})

test('상품 페이지 로딩 시간', async ({ page }) => {
  const start = Date.now()
  await page.goto('/products', { waitUntil: 'domcontentloaded' })
  const elapsed = Date.now() - start
  console.log(`/products DOMContentLoaded: ${elapsed}ms`)
  expect(elapsed).toBeLessThan(6000)
})
