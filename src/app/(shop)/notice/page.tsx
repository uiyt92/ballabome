'use client'

import { useState } from 'react'
import { Pin, ChevronDown } from 'lucide-react'

type NoticeItem = {
  id: number
  title: string
  date: string
  isPinned?: boolean
  body: string
}

const notices: NoticeItem[] = [
  {
    id: 1,
    title: '[필독] 발라봄 공식몰 이용 안내',
    date: '2025-12-01',
    isPinned: true,
    body: '안녕하세요, 발라봄입니다.\n\n발라봄 공식몰을 방문해 주셔서 감사합니다.\n주문 및 배송, 교환/반품 관련 안내사항을 확인해 주세요.\n\n■ 배송 안내\n- 평일 오후 2시 이전 결제 완료 시 당일 출고\n- 배송 소요 기간: 출고일로부터 1~3 영업일\n- 제주 및 도서산간 지역은 추가 1~2일 소요\n\n■ 교환/반품 안내\n- 수령일로부터 7일 이내 접수 가능\n- 고객센터 또는 마이페이지에서 신청\n- 단순 변심 시 왕복 배송비 고객 부담\n\n감사합니다.',
  },
  {
    id: 2,
    title: '[안내] 개인정보 처리방침 개정 안내',
    date: '2026-01-15',
    isPinned: true,
    body: '안녕하세요, 발라봄입니다.\n\n개인정보 처리방침이 아래와 같이 개정되어 안내드립니다.\n\n■ 주요 변경사항\n- 개인정보 수집 항목 명확화\n- 제3자 제공 관련 조항 업데이트\n- 개인정보 보유 기간 명시\n\n■ 시행일: 2026년 2월 1일\n\n자세한 내용은 하단 개인정보 처리방침 페이지를 참고해 주세요.\n감사합니다.',
  },
  {
    id: 3,
    title: '2026년 설 연휴 배송 안내',
    date: '2026-01-20',
    isPinned: false,
    body: '안녕하세요, 발라봄입니다.\n\n설 연휴 기간 배송 일정을 안내드립니다.\n\n■ 연휴 기간: 1월 28일(수) ~ 1월 30일(금)\n- 1월 27일(화) 오후 2시 이전 주문 건까지 연휴 전 출고\n- 연휴 기간 주문 건은 1월 31일(토)부터 순차 출고\n\n■ 고객센터 운영\n- 연휴 기간 중 고객센터 휴무\n- 1:1 문의는 접수 가능하며, 1월 31일부터 순차 답변\n\n즐거운 명절 보내세요!',
  },
  {
    id: 4,
    title: '청아 앰플 리뉴얼 출시 안내',
    date: '2026-02-10',
    isPinned: false,
    body: '안녕하세요, 발라봄입니다.\n\n많은 분들이 사랑해 주신 청아 앰플이 더욱 업그레이드되어 돌아왔습니다.\n\n■ 리뉴얼 포인트\n- 엑소좀 함량 20% 증가\n- 8중 히알루론산 배합 강화\n- 흡수력 개선 텍스처\n- 패키지 디자인 리뉴얼\n\n기존 제품 대비 수분 보습 지속력이 30% 향상되었습니다.\n공식몰에서 만나보세요!\n\n감사합니다.',
  },
  {
    id: 5,
    title: '3월 웰컴 쿠폰 이벤트 안내',
    date: '2026-03-01',
    isPinned: false,
    body: '안녕하세요, 발라봄입니다.\n\n3월 한 달간 신규 회원을 위한 특별 혜택을 준비했습니다.\n\n■ 혜택 내용\n- 회원가입 시 3,000원 할인 쿠폰 즉시 지급\n- 쿠폰 코드: WELCOME\n- 사용 조건: 15,000원 이상 구매 시 적용 가능\n\n■ 이벤트 기간: 2026년 3월 1일 ~ 3월 31일\n\n발라봄과 함께 봄맞이 피부 관리를 시작해 보세요!',
  },
]

export default function NoticePage() {
  const [openId, setOpenId] = useState<number | null>(null)

  const pinned = notices.filter((n) => n.isPinned)
  const normal = notices.filter((n) => !n.isPinned)
  const list = [...pinned, ...normal]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-zinc-900">공지사항</h1>
          <p className="text-sm text-zinc-400 mt-2">발라봄의 새로운 소식을 확인하세요</p>
        </div>

        {/* 목록 */}
        {list.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">
            <p className="text-5xl mb-4">📢</p>
            <p className="text-base font-semibold text-zinc-500">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="border-t border-zinc-200">
            {/* 컬럼 헤더 */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-3 bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-semibold">
              <span className="w-12 text-center">번호</span>
              <span className="flex-1">제목</span>
              <span className="w-24 text-center">날짜</span>
            </div>

            {list.map((item, index) => (
              <div key={item.id} className="border-b border-zinc-100 last:border-0">
                {/* 행 */}
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 transition-colors text-left"
                >
                  <span className="w-12 text-center text-xs text-zinc-400 shrink-0">
                    {item.isPinned ? (
                      <span className="inline-flex items-center justify-center">
                        <Pin className="w-3 h-3 text-blue-500" />
                      </span>
                    ) : (
                      normal.indexOf(item) + 1
                    )}
                  </span>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {item.isPinned && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded shrink-0">공지</span>
                    )}
                    <span className={`text-sm truncate ${item.isPinned ? 'font-semibold text-zinc-800' : 'text-zinc-700'}`}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0 hidden sm:block">{item.date}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${openId === item.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* 상세 내용 */}
                {openId === item.id && (
                  <div className="px-6 py-5 bg-zinc-50 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{item.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
