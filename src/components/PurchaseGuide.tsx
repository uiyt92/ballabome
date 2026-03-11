'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const SECTIONS = [
  {
    title: '배송 안내',
    content: [
      { label: '배송 방법', value: '택배 (CJ대한통운)' },
      { label: '배송 기간', value: '결제 완료 후 2~5일 이내 (영업일 기준)' },
      { label: '배송비', value: '기본 3,000원 / 50,000원 이상 구매 시 무료배송' },
      { label: '도서산간', value: '도서·산간 지역은 추가 배송비가 발생할 수 있습니다.' },
      { label: '배송 조회', value: '출고 후 문자로 송장번호가 발송됩니다.' },
    ],
  },
  {
    title: '교환 및 반품 안내',
    content: [
      { label: '신청 기간', value: '상품 수령일 기준 7일 이내' },
      { label: '교환/반품 조건', value: '미사용, 미개봉, 구성품 전체 포함 상태' },
      { label: '반품 배송비', value: '왕복 6,000원 (고객 귀책 사유 시 고객 부담)' },
      { label: '신청 방법', value: '고객센터 카카오톡 채널로 문의해 주세요.' },
    ],
  },
  {
    title: '교환 및 반품 불가 사유',
    content: [
      { label: '', value: '개봉 또는 사용한 제품' },
      { label: '', value: '고객 부주의로 인한 손상·오염' },
      { label: '', value: '수령 후 7일 이상 경과한 경우' },
      { label: '', value: '묶음 구성 상품의 일부만 반품하는 경우' },
      { label: '', value: '단순 변심 (7일 초과)' },
    ],
  },
  {
    title: '고객센터',
    content: [
      { label: '운영시간', value: '평일 10:00 ~ 17:00 (주말·공휴일 휴무)' },
      { label: '카카오톡', value: '발라봄 채널 (@ballabom)' },
      { label: '응답 시간', value: '운영 시간 외 문의는 다음 영업일에 순차 답변' },
    ],
  },
]

export default function PurchaseGuide() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-2">
      {SECTIONS.map((sec, i) => (
        <div key={i} className="border border-zinc-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-zinc-50 transition-colors text-left"
          >
            <span className="font-semibold text-zinc-800">{sec.title}</span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
          </button>

          {open === i && (
            <div className="px-5 pb-5 bg-zinc-50 border-t border-zinc-100">
              <ul className="mt-4 space-y-3">
                {sec.content.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm text-zinc-600">
                    {item.label ? (
                      <>
                        <span className="font-semibold text-zinc-800 shrink-0 w-24">{item.label}</span>
                        <span>{item.value}</span>
                      </>
                    ) : (
                      <span className="before:content-['·'] before:mr-2">{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
