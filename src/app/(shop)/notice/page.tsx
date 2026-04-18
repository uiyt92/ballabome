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

type FaqItem = {
  id: number
  question: string
  answer: string
  category: string
}

// 공지사항 데이터는 여기에 추가하세요
const notices: NoticeItem[] = []

const faqs: FaqItem[] = [
  {
    id: 1,
    question: '배송은 얼마나 걸리나요?',
    answer: '평균 1~3 영업일 내 배송됩니다. 당일 15:00 이전 주문 시 당일 출고, 이후 주문은 익일 출고됩니다.\n제주·도서산간 지역은 추가 1~2일이 소요될 수 있습니다.',
    category: '배송',
  },
  {
    id: 2,
    question: '배송비는 얼마인가요?',
    answer: '배송비는 3,000원입니다. 단, 2개 이상 구매 시 무료배송이 적용됩니다.',
    category: '배송',
  },
  {
    id: 3,
    question: '교환·환불이 가능한가요?',
    answer: '상품 수령 후 7일 이내 교환·환불이 가능합니다.\n단, 개봉 후 사용된 제품은 교환·환불이 불가합니다.\n불량품의 경우 수령 후 30일 이내 접수 시 무료 교환해드립니다.',
    category: '교환/환불',
  },
  {
    id: 4,
    question: '피부 트러블이 생기면 어떻게 하나요?',
    answer: '사용 중 이상 증상이 나타나면 즉시 사용을 중단하고 카카오톡 채널(@발라봄)로 문의해 주세요.\n전문 상담사가 빠르게 도와드리겠습니다.',
    category: '제품',
  },
  {
    id: 5,
    question: '임산부나 민감성 피부도 사용 가능한가요?',
    answer: '발라봄 엑소좀 앰플은 저자극 포뮬러로 민감성 피부에도 적합하게 설계되었습니다.\n임산부의 경우 성분을 확인하시거나 전문의와 상담 후 사용을 권장합니다.',
    category: '제품',
  },
  {
    id: 6,
    question: '정기구독 또는 멤버십 혜택이 있나요?',
    answer: '현재 카카오톡 채널 추가 시 2,000원 쿠폰, 신규 가입 시 최대 1만 원 쿠폰팩을 제공합니다.\n정기구독 서비스는 준비 중이며 오픈 시 별도 공지드리겠습니다.',
    category: '혜택',
  },
]

type Tab = 'notice' | 'faq'

export default function NoticePage() {
  const [activeTab, setActiveTab] = useState<Tab>('notice')
  const [openId, setOpenId] = useState<number | null>(null)

  const pinned = notices.filter((n) => n.isPinned)
  const normal = notices.filter((n) => !n.isPinned)
  const list = [...pinned, ...normal]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-zinc-900">고객센터</h1>
          <p className="text-sm text-zinc-400 mt-2">발라봄의 새로운 소식과 자주 묻는 질문을 확인하세요</p>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-zinc-200 mb-8">
          <button
            onClick={() => { setActiveTab('notice'); setOpenId(null) }}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === 'notice'
                ? 'text-zinc-900 border-b-2 border-zinc-900'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            공지사항
          </button>
          <button
            onClick={() => { setActiveTab('faq'); setOpenId(null) }}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === 'faq'
                ? 'text-zinc-900 border-b-2 border-zinc-900'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            자주 묻는 질문
          </button>
        </div>

        {/* 공지사항 탭 */}
        {activeTab === 'notice' && (
          <>
            {list.length === 0 ? (
              <div className="text-center py-24 text-zinc-400">
                <p className="text-5xl mb-4">📢</p>
                <p className="text-base font-semibold text-zinc-500">등록된 공지사항이 없습니다.</p>
              </div>
            ) : (
              <div className="border-t border-zinc-200">
                <div className="hidden sm:flex items-center gap-4 px-4 py-3 bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-semibold">
                  <span className="w-12 text-center">번호</span>
                  <span className="flex-1">제목</span>
                  <span className="w-24 text-center">날짜</span>
                </div>

                {list.map((item) => (
                  <div key={item.id} className="border-b border-zinc-100 last:border-0">
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

                    {openId === item.id && (
                      <div className="px-6 py-5 bg-zinc-50 border-t border-zinc-100">
                        <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{item.body}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 자주 묻는 질문 탭 */}
        {activeTab === 'faq' && (
          <div className="border-t border-zinc-200">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-zinc-100 last:border-0">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 transition-colors text-left"
                >
                  <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded shrink-0">{faq.category}</span>
                  <span className="flex-1 text-sm font-semibold text-zinc-800">Q. {faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {openId === faq.id && (
                  <div className="px-6 py-5 bg-zinc-50 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
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
