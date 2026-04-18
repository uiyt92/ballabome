import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 테스트 전용 로그인 라우트
 *
 * 보안 가드 (모두 만족해야 동작, 하나라도 실패하면 404):
 * 1. 프로덕션에서는 E2E_TEST_ENABLED=true 가 명시되어야 함 (이중 방어)
 * 2. E2E_TEST_SECRET 환경변수가 24자 이상으로 설정되어 있어야 함
 * 3. 요청 헤더 x-e2e-test-secret 가 시크릿과 일치해야 함 (timing-safe 비교)
 * 4. 이메일이 *@ballabom.test 도메인이어야 함 (실제 사용자 잘못 생성 방지)
 *
 * 라우트 존재 자체를 숨기기 위해 모든 거부는 404로 응답.
 */
function notFound() {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
}

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let mismatch = 0
    for (let i = 0; i < a.length; i++) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return mismatch === 0
}

export async function POST(request: Request) {
    // 1. 프로덕션에서는 E2E_TEST_ENABLED=true 필수
    if (process.env.NODE_ENV === 'production' && process.env.E2E_TEST_ENABLED !== 'true') {
        return notFound()
    }

    // 2. 시크릿 미설정/약함 차단
    const expected = process.env.E2E_TEST_SECRET
    if (!expected || expected.length < 24) return notFound()

    // 3. 헤더 시크릿 timing-safe 비교
    const provided = request.headers.get('x-e2e-test-secret') || ''
    if (!timingSafeEqual(provided, expected)) return notFound()

    const { email, password, role } = await request.json()
    if (!email || !password) {
        return NextResponse.json({ error: 'email, password 필수' }, { status: 400 })
    }

    // 4. 테스트 도메인 강제 (실제 사용자 계정 오염 방지)
    if (!email.endsWith('@ballabom.test')) {
        return NextResponse.json({ error: 'test 도메인만 허용' }, { status: 400 })
    }

    // service_role: 사용자 생성/업서트
    const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1) 기존 사용자 조회
    const { data: existing } = await admin.auth.admin.listUsers()
    let user = existing?.users?.find(u => u.email === email)

    if (!user) {
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })
        if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })
        user = created.user!
    } else {
        // 비밀번호 동기화
        await admin.auth.admin.updateUserById(user.id, { password })
    }

    // 2) profiles role 동기화 (admin 요청 시)
    if (role === 'admin' && user) {
        await admin.from('profiles').upsert({ id: user.id, role: 'admin', full_name: 'E2E Admin' })
    } else if (role === 'user' && user) {
        await admin.from('profiles').upsert({ id: user.id, role: 'user', full_name: 'E2E User' })
    }

    // 3) SSR 클라이언트로 실제 로그인 → 쿠키 자동 설정
    const supabase = await createServerClient()
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
    if (signInErr) return NextResponse.json({ error: signInErr.message }, { status: 500 })

    return NextResponse.json({ ok: true, userId: user!.id })
}
