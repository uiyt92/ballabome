import { test, expect } from '@playwright/test'
import { loginAs, TEST_ADMIN } from './helpers/auth'

/**
 * 12. 업로드 API 점검
 * - 인증 후 작은 PNG 업로드 → 200 + url 반환
 * - 허용되지 않은 버킷 → 400
 * - 필수 필드 누락 → 400
 */

// 1x1 투명 PNG
const TINY_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
)

test('관리자 인증 후 이미지 업로드 성공', async ({ request, context }) => {
    await loginAs(request, context, TEST_ADMIN, 'admin')
    const res = await request.post('/api/upload', {
        multipart: {
            file: { name: 'e2e-test.png', mimeType: 'image/png', buffer: TINY_PNG },
            bucket: 'public-images',
            path: `e2e/test-${Date.now()}.png`,
        },
    })
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.url).toMatch(/^https?:\/\//)
    expect(json.url).toContain('.png')
})

test('허용되지 않은 버킷 → 400', async ({ request, context }) => {
    await loginAs(request, context, TEST_ADMIN, 'admin')
    const res = await request.post('/api/upload', {
        multipart: {
            file: { name: 'x.png', mimeType: 'image/png', buffer: TINY_PNG },
            bucket: 'forbidden-bucket',
            path: 'x.png',
        },
    })
    expect(res.status()).toBe(400)
})

test('필수 필드 누락 → 400', async ({ request, context }) => {
    await loginAs(request, context, TEST_ADMIN, 'admin')
    const res = await request.post('/api/upload', {
        multipart: { bucket: 'public-images' },
    })
    expect(res.status()).toBe(400)
})
