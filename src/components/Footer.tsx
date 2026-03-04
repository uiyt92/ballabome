'use client'

import React from 'react'
import { Instagram, Youtube } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-zinc-50 pt-20 pb-12 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        <div className="text-xl md:text-2xl font-black tracking-tight text-zinc-900">
                            BALLABOM
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mt-4 mb-8">
                            남성을 위한 가장 직관적이고
                            강력한 퍼포먼스 스킨케어, 발라봄.
                        </p>
                        <div className="flex gap-4">
                            <Instagram className="w-5 h-5 cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors" />
                            <Youtube className="w-5 h-5 cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors" />
                        </div>
                    </div>

                    <FooterColumn title="Explore" links={['베스트셀러', '전제품', '이벤트']} />
                    <FooterColumn title="Support" links={['고객센터', '공지사항', 'FAQ']} />
                </div>

                <div className="pt-8 border-t border-zinc-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-zinc-400 mb-4">
                        <div className="flex flex-col gap-1">
                            <p className="font-bold text-zinc-500 text-sm mb-1">와컵뷰티</p>
                            <p>대표자: 유현규</p>
                            <p>주소: 경기도 용인시 기흥구 강남로 9, 504-328호(구갈동, 태평양프라자)</p>
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-zinc-900 transition-colors">개인정보처리방침</a>
                            <a href="#" className="hover:text-zinc-900 transition-colors">이용약관</a>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-400">© 2026 BALLABOM. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
    return (
        <div className="flex flex-col gap-4">
            <span className="font-bold text-sm text-zinc-900">{title}</span>
            <div className="flex flex-col gap-3">
                {links.map((link, i) => (
                    <a key={i} href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                        {link}
                    </a>
                ))}
            </div>
        </div>
    )
}
