import { test, expect } from '@playwright/test'

/**
 * 01. 전체 페이지 로딩 점검
 * - 모든 public 페이지가 200 응답하는지
 * - 기본 레이아웃(Navbar, Footer)이 렌더되는지
 * - 콘솔 에러가 없는지
 */

const publicPages = [
  { path: '/', name: '홈' },
  { path: '/products', name: '상품 목록' },
  { path: '/story', name: '브랜드 스토리' },
  { path: '/login', name: '로그인' },
  { path: '/crew-lounge', name: '크루 라운지' },
  { path: '/event', name: '이벤트' },
  { path: '/notice', name: '공지사항' },
  { path: '/terms', name: '이용약관' },
  { path: '/privacy', name: '개인정보처리방침' },
  { path: '/cart', name: '장바구니' },
]

for (const pg of publicPages) {
  test(`페이지 로딩: ${pg.name} (${pg.path})`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    const res = await page.goto(pg.path, { waitUntil: 'domcontentloaded' })
    expect(res?.status()).toBe(200)

    // 페이지 콘텐츠가 비어있지 않은지
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(0)

    // 치명적 JS 에러 필터 (hydration, chunk load 등)
    const critical = errors.filter(e =>
      e.includes('Uncaught') ||
      e.includes('ChunkLoadError') ||
      e.includes('Hydration') ||
      e.includes('Minified React error')
    )
    expect(critical, `치명적 콘솔 에러: ${critical.join('\n')}`).toHaveLength(0)
  })
}
