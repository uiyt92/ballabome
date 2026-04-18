import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { sendAlimtalk } from '@/lib/alimtalk'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // 신규 회원 감지: 가입 시각과 마지막 로그인 시각이 5초 이내면 신규
            const { data: { user } } = await supabase.auth.getUser()
            const isNewUser = user
                && user.last_sign_in_at
                && (new Date(user.last_sign_in_at).getTime() - new Date(user.created_at).getTime()) < 5000

            if (isNewUser && user) {
                // 전화번호 추출 (phone_number 스코프 동의 시)
                const phone: string | undefined =
                    user.user_metadata?.phone_number ??
                    user.identities?.[0]?.identity_data?.phone_number

                const name: string =
                    user.user_metadata?.full_name ??
                    user.user_metadata?.name ??
                    '고객'

                // profiles 테이블 phone 컬럼 업데이트
                if (phone) {
                    await supabase
                        .from('profiles')
                        .update({ phone })
                        .eq('id', user.id)
                }

                // 알림톡 발송 (전화번호 있을 때만, 에러여도 가입 플로우 중단 안 함)
                if (phone) {
                    sendAlimtalk(phone, name).catch((err) =>
                        console.error('[callback] 알림톡 발송 오류:', err)
                    )
                }
            }

            const redirectPath = isNewUser ? `${next}?new_member=1` : next
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
