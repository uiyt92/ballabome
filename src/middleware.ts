import { NextRequest, NextResponse } from 'next/server'

/**
 * 테스트 전용 라우트(/api/test-only/*) 차단
 *
 * 프로덕션 빌드에서는 E2E_TEST_ENABLED=true 가 명시적으로 설정되지 않으면
 * 라우트 자체에 도달하기 전에 404로 응답한다.
 * (라우트 핸들러에도 동일 가드가 있어 이중 방어)
 */
export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/api/test-only')) {
        if (process.env.NODE_ENV === 'production' && process.env.E2E_TEST_ENABLED !== 'true') {
            return new NextResponse('Not Found', { status: 404 })
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/api/test-only/:path*'],
}
