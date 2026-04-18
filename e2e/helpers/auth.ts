import { APIRequestContext, BrowserContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const SECRET = (() => {
    try {
        const env = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8')
        const m = env.match(/E2E_TEST_SECRET=(.+)/)
        return m ? m[1].trim() : ''
    } catch {
        return ''
    }
})()

export const TEST_USER = {
    email: 'e2e-user@ballabom.test',
    password: 'TestPass123!@#',
}

export const TEST_ADMIN = {
    email: 'e2e-admin@ballabom.test',
    password: 'AdminPass123!@#',
}

/**
 * 테스트 전용 로그인 API 호출
 * - 호출 후 응답에 Set-Cookie로 supabase 세션 쿠키가 들어옴
 * - browser context로 쿠키를 옮기면 인증 상태 유지
 */
export async function loginAs(
    request: APIRequestContext,
    context: BrowserContext,
    user: { email: string; password: string },
    role: 'user' | 'admin' = 'user'
) {
    if (!SECRET) throw new Error('E2E_TEST_SECRET 환경변수 없음')

    const res = await request.post('/api/test-only/login', {
        headers: { 'x-e2e-test-secret': SECRET },
        data: { email: user.email, password: user.password, role },
    })

    if (!res.ok()) {
        const body = await res.text()
        throw new Error(`테스트 로그인 실패 (${res.status()}): ${body}`)
    }

    // playwright APIRequestContext가 받은 쿠키를 brower context로 동기화
    const storageState = await request.storageState()
    await context.addCookies(storageState.cookies)

    return await res.json()
}
