const INFOBANK_ENDPOINT = 'https://mars.ibapi.kr/api/comm/v1/send/omni'

// 전화번호를 숫자만 남기는 형식으로 정규화 (010-1234-5678 → 01012345678)
function normalizePhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '')
}

export async function sendAlimtalk(phone: string, name: string): Promise<void> {
    const apiKey = process.env.INFOBANK_API_KEY
    const senderKey = process.env.INFOBANK_SENDER_KEY
    const templateCode = process.env.INFOBANK_TEMPLATE_CODE

    if (!apiKey || !senderKey || !templateCode) {
        console.warn('[alimtalk] 환경 변수 미설정 — 알림톡 발송 스킵')
        return
    }

    const to = normalizePhone(phone)
    if (!to) {
        console.warn('[alimtalk] 전화번호 없음 — 알림톡 발송 스킵')
        return
    }

    const body = {
        messageFlow: [
            {
                alimtalk: {
                    senderKey,
                    templateCode,
                    text: `안녕하세요, ${name}님!\nBALLABOM에 가입해 주셔서 감사합니다 🎉\n\n남성 스킨케어 전문 브랜드 발라봄에서\n특별한 첫 구매 혜택을 준비했습니다.\n\n📌 카카오 채널 추가하고 신상품 소식과\n   할인 혜택을 가장 먼저 받아보세요!`,
                    buttons: [
                        {
                            type: 'AC',
                            name: '채널 추가하기',
                        },
                        {
                            type: 'WL',
                            name: '쇼핑몰 바로가기',
                            linkMobile: 'https://ballabom.com',
                            linkPc: 'https://ballabom.com',
                        },
                    ],
                },
            },
        ],
        destinations: [
            {
                to,
                name,
            },
        ],
    }

    try {
        const res = await fetch(INFOBANK_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `ApiKey ${apiKey}`,
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const text = await res.text()
            console.error(`[alimtalk] API 오류 ${res.status}: ${text}`)
        } else {
            const json = await res.json()
            console.log('[alimtalk] 발송 성공:', json)
        }
    } catch (err) {
        console.error('[alimtalk] 네트워크 오류:', err)
    }
}
