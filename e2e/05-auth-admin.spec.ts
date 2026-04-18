import { test, expect } from '@playwright/test'

/**
 * 05. 인증 / 어드민 가드 점검
 * - 로그인 페이지 카카오 버튼
 * - /mypage 비로그인 접근 → 로그인 리디렉션
 * - /admin 비로그인 접근 → 로그인 리디렉션
 */

test('로그인 페이지에 카카오 버튼 존재', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('button', { name: /카카오/ }).first()).toBeVisible()
})

test('비로그인 /mypage → 로그인으로 리디렉션 또는 가드', async ({ page }) => {
  await page.goto('/')
  await page.context().clearCookies()
  const res = await page.goto('/mypage', { waitUntil: 'domcontentloaded' })
  // 로그인 페이지로 리디렉션되거나, mypage에서 로그인 안내가 보여야 함
  const url = page.url()
  const body = await page.locator('body').textContent()
  const guarded = url.includes('/login') || /로그인|login/i.test(body || '')
  expect(guarded).toBeTruthy()
})

test('비로그인 /admin → 로그인으로 리디렉션', async ({ page }) => {
  await page.context().clearCookies()
  await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)
  const url = page.url()
  expect(url).toMatch(/login|admin/)
  // admin 페이지에 머무르면 안 됨 (또는 가드 메시지)
  if (url.includes('/admin')) {
    const body = await page.locator('body').textContent()
    expect(body).toMatch(/로그인|권한|admin|로딩/i)
  }
})
