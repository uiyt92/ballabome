import React from 'react'
import { MessageCircle, Smile } from 'lucide-react'

export default function SocialLoginCTA() {
    return (
        <section className="w-full py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Kakao CTA */}
                    <div
                        className="flex-1 bg-[#FEE500] p-6 rounded-2xl flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-[#3C1E1E] p-2 rounded-full text-[#FEE500]">
                                <MessageCircle className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#3C1E1E]/60 uppercase tracking-widest">Membership</p>
                                <h4 className="text-sm md:text-base font-black text-[#3C1E1E]">카카오 1초 로그인하고 3,000P 받기</h4>
                            </div>
                        </div>
                        <Smile className="w-5 h-5 text-[#3C1E1E] opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Naver CTA */}
                    <div
                        className="flex-1 bg-[#03C75A] p-6 rounded-2xl flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-4 text-white">
                            <div className="bg-white p-2 rounded-full text-[#03C75A]">
                                <span className="font-black text-xs">N</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Quick Payment</p>
                                <h4 className="text-sm md:text-base font-black">네이버 공식 스토어 혜택 그대로</h4>
                            </div>
                        </div>
                        <Smile className="w-5 h-5 text-white opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </section>
    )
}
