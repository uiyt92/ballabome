import { test, expect } from '@playwright/test'

/**
 * 14. 테스트 전용 라우트(/api/test-only/*) 보안 검증
 *
 * 모두 404 (라우트 존재 자체를 숨겨야 함):
 * - 시크릿 헤더 없음
 * - 잘못된 시크릿
 * - 일치해도 비-test 도메인 이메일 → 400 (가드 단계)
 */

test('시크릿 없으면 404', async ({ request }) => {
    const res = await request.post('/api/test-only/login', {
        data: { email: 'a@ballabom.test', password: 'pw' },
    })
    expect(res.status()).toBe(404)
})

test('잘못된 시크릿 → 404', async ({ request }) => {
    const res = await request.post('/api/test-only/login', {
        headers: { 'x-e2e-test-secret': 'wrong-' + 'x'.repeat(30) },
        data: { email: 'a@ballabom.test', password: 'pw' },
    })
    expect(res.status()).toBe(404)
})

test('빈 시크릿 → 404', async ({ request }) => {
    const res = await request.post('/api/test-only/login', {
        headers: { 'x-e2e-test-secret': '' },
        data: { email: 'a@ballabom.test', password: 'pw' },
    })
    expect(res.status()).toBe(404)
})

test('GET 메서드 → 405 또는 404', async ({ request }) => {
    const res = await request.get('/api/test-only/login')
    expect([404, 405]).toContain(res.status())
})
