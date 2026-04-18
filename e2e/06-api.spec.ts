import { test, expect } from '@playwright/test'

/**
 * 06. API 라우트 점검
 * - /api/upload: 비로그인은 401
 * - /api/payment/confirm: 잘못된 요청은 4xx
 */

test('/api/upload 비인증 → 401', async ({ request }) => {
  const res = await request.post('/api/upload', {
    multipart: {
      bucket: 'public-images',
      path: 'test.jpg',
    },
  })
  expect(res.status()).toBe(401)
})

test('/api/payment/confirm 잘못된 바디 → 4xx/5xx', async ({ request }) => {
  const res = await request.post('/api/payment/confirm', {
    data: { invalid: true },
  })
  expect(res.status()).toBeGreaterThanOrEqual(400)
})
