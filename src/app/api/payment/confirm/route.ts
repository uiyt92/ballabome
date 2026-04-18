import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    const { paymentKey, orderId, amount, orderData } = await req.json()

    if (!paymentKey || !orderId || !amount) {
        return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }

    // 1. 토스 서버에 결제 승인 요청
    const secretKey = process.env.TOSS_SECRET_KEY!
    const encoded = Buffer.from(`${secretKey}:`).toString('base64')

    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${encoded}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    if (!tossRes.ok) {
        const error = await tossRes.json()
        return NextResponse.json({ error: error.message || '결제 승인 실패' }, { status: 400 })
    }

    const payment = await tossRes.json()

    // 2. 승인 완료 후 Supabase에 주문 저장
    const supabase = await createClient()
    const { error: dbError } = await supabase.from('orders').insert({
        ...orderData,
        status: 'PAID',
        payment_key: payment.paymentKey,
    })

    if (dbError) {
        console.error('Order insert error:', dbError)
        return NextResponse.json({ error: 'DB 저장 실패' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
