'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function BrandStoryPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
            <main className="pt-20 pb-32 transition-colors duration-500">
                {/* Intro Section */}
                <div className="max-w-3xl mx-auto px-6 text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <span className="text-blue-500 font-bold tracking-widest text-sm uppercase">Brand Story</span>
                        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 leading-tight">
                            하루의 시작을<br className="md:hidden" /> 설레는 여행처럼
                        </h1>
                        <p className="text-zinc-500 mt-4 tracking-wide">Take Off Into Your Day</p>

                        <div className="pt-12 space-y-2 text-zinc-700 leading-relaxed">
                            <p className="text-lg md:text-xl font-medium">1500명의 얼굴을 바꾸며 깨달았습니다.</p>
                            <p className="text-lg md:text-xl font-medium">대부분의 사람들은 자신의 피부를 제대로 알지 못합니다.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Large Visual Image */}
                <div className="max-w-5xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="w-full h-[400px] md:h-[600px] relative overflow-hidden bg-zinc-100"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600"
                            alt="Travel Sky View"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 transform hover:scale-105"
                        />
                    </motion.div>
                </div>

                {/* Story Sections */}
                <div className="max-w-6xl mx-auto px-6 space-y-32">

                    {/* Section 1: Image Left, Text Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="aspect-[4/5] relative bg-zinc-100 overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800"
                                alt="Skincare Consultation"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h3 className="text-2xl font-bold text-zinc-900">반복되는 고민, 그리고 본질</h3>
                            <div className="space-y-6 text-zinc-600 leading-relaxed font-light">
                                <p>
                                    이미지 컨설턴트와 사진작가로 3년간 수많은 고객을 만나며, 같은 고민을 반복해서 들었습니다.
                                    여드름엔 이 제품, 기미엔 저 제품, 주름엔 또 다른 제품.
                                </p>
                                <p>
                                    광고가 약속하는 화려한 효능에 이끌려 제품을 사 모으지만,
                                    정작 가장 기본적인 <strong className="text-zinc-900 border-b border-zinc-900">수분 보습 케어</strong>는 건너뜁니다.
                                </p>
                                <div className="pl-6 border-l-2 border-zinc-900 italic text-zinc-900 font-serif">
                                    "건강한 수분이 채워지지 않은 피부 위에 무엇을 발라도 소용없습니다."
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Section 2: Text Left, Image Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1 space-y-8"
                        >
                            <h3 className="text-2xl font-bold text-zinc-900">설레는 봄, 새로운 시작</h3>
                            <div className="space-y-6 text-zinc-600 leading-relaxed font-light">
                                <p>
                                    발라봄(ballabom)은 그 본질에서 시작합니다.
                                    '발라보다'는 의지와, 사계절의 시작인 '봄'처럼 <strong className="text-zinc-900 border-b border-zinc-900">모든 스킨케어의 첫 단계</strong>를 의미합니다.
                                </p>
                                <p>
                                    첫 제품은 모든 피부 타입의 기초, 수분 보습입니다.
                                    엑소좀과 8중 히알루론산, 아직 많은 이들이 모르는 이 조합의 시너지에 집중했습니다.
                                </p>
                                <p>
                                    성분 함량과 조화를 정교하게 설계해 피부 깊숙이 수분을 채우고,
                                    저자극 포뮬러로 어떤 피부도 안심할 수 있게 했습니다.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2 aspect-[4/5] relative bg-zinc-100 overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
                                alt="Product Synergy"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                    </div>

                    {/* Outro Centered */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center py-24 space-y-8"
                    >
                        <p className="text-lg text-zinc-600 leading-relaxed font-light">
                            탄탄한 기초 위에, 당신의 피부에 필요한 것들을 하나씩 더해갈 것입니다.<br />
                            복잡한 루틴이 아닌, 정확한 단계.
                        </p>
                        <p className="text-xl font-bold text-zinc-900">
                            발라봄을 경험해본 이들이 말합니다.<br />
                            "이제야 시작이 보인다"고.
                        </p>
                        <h2 className="text-3xl md:text-5xl font-black text-black pt-8">
                            발라봄, 당신 피부에 피어난 봄입니다.
                        </h2>
                    </motion.div>

                </div>
            </main>
        </div>
    )
}
