'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Shield, Sparkles, Check, ChevronRight, Truck, ShoppingCart, MessageCircle, Heart, Star, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Product Images
const productImages = [
    "/product-hero.png",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400", // Texture 1
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400", // Texture 2
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=400",  // Lifestyle
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400", // Detail
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400", // Smear
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400", // Moisture
    "https://images.unsplash.com/photo-1512290923902-8a9d81aa713c?auto=format&fit=crop&q=80&w=400", // Ingredient
    "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400"  // Context
]

// Product Options
const productOptions = [
    { id: 1, name: "[BEST 40%할인] 청아 앰플 3+1개 세트", price: 111200, originalPrice: 185600, tag: "무료배송" },
    { id: 2, name: "[31%할인] 청아 앰플 2개 세트", price: 63600, originalPrice: 92800, tag: "무료배송" },
    { id: 3, name: "[25%할인] 청아 앰플 단품", price: 34800, originalPrice: 46400, tag: "" },
]

export default function ProductDetailPage() {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isOptionOpen, setIsOptionOpen] = useState(false)
    const router = useRouter()

    const handleBuy = () => {
        const option = productOptions.find(o => o.id === (selectedOption || 3)) // Default to single item if none selected
        if (!option) return
        router.push(`/checkout?productName=${encodeURIComponent(option.name)}&price=${option.price}`)
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            {/* Hero Section - Product Info */}
            <section className="pt-8 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* LEFT: Product Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="sticky top-24"
                        >
                            {/* Main Image */}
                            <div className="bg-zinc-50 rounded-2xl p-8 flex items-center justify-center min-h-[500px] mb-4 relative overflow-hidden group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={productImages[selectedImage]}
                                    alt="발라봄 청아 앰플"
                                    className="max-w-full max-h-[450px] object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-5 gap-2">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-zinc-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* RIGHT: Product Info & Options */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Product Header */}
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-sky-600 tracking-wide">수분 전문가의 비밀 공구템</p>
                                <div className="space-y-1">
                                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900">발라봄 청아 앰플</h1>
                                    <p className="text-zinc-500">
                                        병풀잎소포 엑소좀 10,000ppm + 8종 히알루론산
                                    </p>
                                </div>
                            </div>

                            {/* Price & Coupon */}
                            <div className="space-y-6">
                                <div className="flex items-end gap-3 pb-6 border-b border-zinc-100">
                                    <span className="text-zinc-400 line-through text-lg">46,400원</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-500 text-3xl font-black">25%</span>
                                        <span className="text-4xl font-black">34,800원</span>
                                    </div>
                                </div>

                                {/* Coupons (Mockup) */}
                                <div className="space-y-2">
                                    <button className="w-full h-12 bg-[#FEE500] rounded-lg flex items-center justify-between px-4 hover:brightness-95 transition-all">
                                        <div className="flex items-center gap-2 font-bold text-[#3C1E1E] text-sm">
                                            <span className="w-6 h-6 bg-[#3C1E1E] text-[#FEE500] rounded-full flex items-center justify-center font-black text-[10px]">P</span>
                                            카카오톡 1초 가입하고 1만 원 쿠폰팩 받기
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#3C1E1E]" />
                                    </button>
                                    <button className="w-full h-12 bg-[#3C1E1E] rounded-lg flex items-center justify-between px-4 hover:brightness-110 transition-all">
                                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                                            <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center text-[10px]">Ch</div>
                                            카톡 채널 추가하고 2천 원 쿠폰 받기
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Options Selector */}
                            <div className="border border-zinc-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setIsOptionOpen(!isOptionOpen)}
                                    className="w-full bg-zinc-50 p-4 flex items-center justify-between font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                                >
                                    <span>[옵션 선택]</span>
                                    <ChevronRight className={`w-5 h-5 transition-transform ${isOptionOpen ? 'rotate-90' : ''}`} />
                                </button>

                                <div className={`divide-y divide-zinc-100 ${isOptionOpen ? 'block' : 'hidden'}`}>
                                    {productOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => { setSelectedOption(opt.id); setIsOptionOpen(false); }}
                                            className="w-full text-left p-4 hover:bg-sky-50 transition-colors group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`font-bold text-sm ${selectedOption === opt.id ? 'text-sky-600' : 'text-zinc-700'}`}>
                                                    {opt.name}
                                                </span>
                                                {opt.tag && (
                                                    <span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0">
                                                        {opt.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-bold text-zinc-900">{opt.price.toLocaleString()}원</span>
                                                <span className="text-zinc-400 line-through text-xs">{opt.originalPrice.toLocaleString()}원</span>
                                                <span className="text-xs text-sky-500">
                                                    (1개당 {(opt.price / (opt.name.includes("3+1") ? 4 : opt.name.includes("2개") ? 2 : 1)).toLocaleString()}원)
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Option Display (Simplified) */}
                            {selectedOption && (
                                <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-bold text-zinc-700">
                                            {productOptions.find(o => o.id === selectedOption)?.name}
                                        </span>
                                        <button onClick={() => setSelectedOption(null)} className="text-zinc-400 hover:text-zinc-600">✕</button>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                                        <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded px-2 h-8">
                                            <button className="text-zinc-400 px-2">-</button>
                                            <span className="font-bold text-sm">1</span>
                                            <button className="text-zinc-400 px-2">+</button>
                                        </div>
                                        <span className="font-black text-lg">
                                            {productOptions.find(o => o.id === selectedOption)?.price.toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                            )}


                            {/* Shipping Badge */}
                            <div className="bg-white border border-zinc-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Truck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-black text-zinc-900">오늘 출발 14:00 마감</span>
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium">
                                        지금 주문 시 <span className="text-red-500 font-bold">내일(목)</span>에 발송됩니다
                                    </p>
                                </div>
                            </div>

                            {/* Shipping Progress */}
                            <div className="bg-zinc-50 rounded-xl p-4">
                                <div className="flex justify-between items-center text-sm font-medium mb-2">
                                    <span className="text-zinc-500 line-through">0원</span>
                                    <span className="text-zinc-900">50,000원</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden mb-2">
                                    <div className="w-[70%] h-full bg-zinc-900 rounded-full" />
                                </div>
                                <p className="text-xs text-center text-zinc-500">
                                    <span className="font-bold text-zinc-900">15,200원</span> 더 담으면 <span className="text-red-500 font-bold">무료배송</span> 🚚
                                </p>
                            </div>


                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-3 pt-4">
                                <button className="col-span-1 h-14 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-xl hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    장바구니
                                </button>
                                <button
                                    onClick={handleBuy}
                                    className="col-span-2 h-14 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 duration-200"
                                >
                                    바로 구매
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleBuy}
                                    className="h-12 bg-[#03C75A] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                                >
                                    <span className="bg-white text-[#03C75A] w-4 h-4 flex items-center justify-center rounded-sm font-black text-[9px]">N</span>
                                    네이버페이 구매
                                </button>
                                <button
                                    onClick={handleBuy}
                                    className="h-12 bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                                >
                                    <MessageCircle className="w-4 h-4 fill-current" />
                                    카카오페이 구매
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-zinc-50">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-8"
                    >
                        <p className="text-lg text-zinc-500">그거 아세요?</p>
                        <h2 className="text-2xl md:text-4xl font-black leading-tight">
                            한국인들의 피부는<br />늘 건조하다는 것
                        </h2>
                        <div className="space-y-4 text-zinc-600 leading-relaxed">
                            <p>매일 뒤집어지는 피부,</p>
                            <p>저희는 나아지기 위해 매일 위에 무언가를 덧바르지만,</p>
                            <p className="text-xl font-bold text-zinc-900 py-4">
                                사실 진짜 문제는<br />기초 보습에 있다는 것.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-16 space-y-6 text-zinc-600 leading-relaxed"
                    >
                        <p>
                            이미지 컨설턴트로서 3년간 수천명을 만나며, 사람들의 피부를 남다르게 바라보게 되었습니다.
                            어떤 제품이 진짜 피부에 작용하는지, 어떤 것은 그저 광고일 뿐인지.
                        </p>
                        <p>
                            지난 기간동안 스킨케어 업계에서 많은 대표님들을 만나봤습니다.
                            아이러니하게도 본인이 만든 제품을 진심으로 바르고 있는, 그런 아이템은 찾기가 어려웠습니다.
                        </p>
                        <blockquote className="border-l-4 border-zinc-900 pl-6 py-4 my-8 text-zinc-900 font-medium italic">
                            "그건 제가 원하는 것이 아니었습니다. 발라봄은 내가 직접 바르고 싶은 제품에서 시작했습니다.
                            내 피부에도, 당신의 피부에도 진짜로 작용하는 것."
                        </blockquote>
                        <p className="text-xl font-bold text-zinc-900 text-center py-4">
                            진심으로 만든 것만, 진심으로 변할 수 있습니다.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pain Points Section */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-black">혹시, 이런 고민 있으세요?</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        {[
                            '여드름, 기미, 주름에 제품을 바르고 있지만 변화가 없는 경우',
                            '수분 보습을 잘 해도 금방 건조해지거나 메이크업이 잘 뜨는 경우',
                            '유목민 처럼 여러 제품 쓰다가 오히려 피부가 민감해진 경우'
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 bg-sky-50 rounded-xl">
                                <Droplets className="w-6 h-6 text-sky-500 flex-shrink-0 mt-0.5" />
                                <p className="text-zinc-700">{item}</p>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-xl font-bold text-zinc-900 mb-8">
                            "제대로된 수분 보습이 안 되면,<br />그 위의 모든 것은 의미가 없습니다."
                        </p>

                        <div className="inline-block text-left bg-zinc-100 rounded-2xl p-8">
                            <p className="font-bold text-zinc-900 mb-4">확실한 수분 보습이 안되면:</p>
                            <ol className="space-y-3 text-zinc-600">
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    피부 장벽 약화
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    피부 예민도 극화
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    여드름, 모공, 주름 등 각종 피부 스트레스 증가
                                </li>
                            </ol>
                        </div>

                        <p className="text-2xl font-black text-zinc-900 mt-12">
                            "발라봄은 그 가장 첫 단계에<br />사활을 걸었습니다."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Key Features Section */}
            <section className="py-24 bg-zinc-900 text-white">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-sky-400 text-sm font-medium mb-3">CORE BENEFITS</p>
                        <h2 className="text-2xl md:text-4xl font-black">
                            발라봄 청아 앰플이<br />다른 이유
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Droplets,
                                title: '촉촉한 깊은 수분 보습',
                                desc: '8종 히알루론산으로 피부 표면과 깊숙한 곳 모두 튼튼하게 수분 충전'
                            },
                            {
                                icon: Shield,
                                title: '염증 완화 & 장벽 강화',
                                desc: '병풀잎소포 엑소좀 10,000ppm 함유'
                            },
                            {
                                icon: Sparkles,
                                title: '맑은 제형',
                                desc: '부드럽고 매끄럽게 흡수되며, 수분 증발을 최소화'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-zinc-800 rounded-2xl p-8 text-center"
                            >
                                <item.icon className="w-12 h-12 text-sky-400 mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* New: Ingredient Venn Diagram Section (Reference Style) - 2 Circles Update */}
            <section className="py-24 bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364] text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500 blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-500 blur-[120px]" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <p className="text-teal-300 font-bold tracking-widest text-sm mb-4 uppercase">Two Core Elements</p>
                        <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                            촉촉하고 청아한 피부를 위한<br />
                            두 가지 핵심 성분
                        </h2>
                    </motion.div>

                    {/* Circles Diagram - 2 Overlapping Circles */}
                    <div className="flex justify-center items-center h-[300px] mb-12 relative">
                        {/* Circle 1: Exosome (Left) */}
                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-48 h-48 md:w-72 md:h-72 rounded-full border border-teal-400/30 bg-teal-900/40 backdrop-blur-sm flex flex-col items-center justify-center -mr-4 md:-mr-8 z-10 relative shadow-[0_0_30px_rgba(20,184,166,0.2)]"
                        >
                            <span className="font-bold text-lg md:text-2xl mb-1 text-teal-100">병풀잎소포<br />엑소좀</span>
                            <span className="text-xs md:text-sm text-teal-200/50 font-light mt-1">Exosome</span>
                        </motion.div>

                        {/* Plus Sign (Hidden but keeping structure if needed for spacing, actually let's remove spacing) */}

                        {/* Circle 2: Hyaluronic (Right) */}
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-48 h-48 md:w-72 md:h-72 rounded-full border border-sky-400/30 bg-sky-900/40 backdrop-blur-sm flex flex-col items-center justify-center -ml-4 md:-ml-8 z-10 relative shadow-[0_0_30px_rgba(14,165,233,0.2)]"
                        >
                            <span className="font-bold text-lg md:text-2xl mb-1 text-sky-100">8중<br />히알루론산</span>
                            <span className="text-xs md:text-sm text-sky-200/50 font-light mt-1">Hyaluronic Acid</span>
                        </motion.div>
                    </div>

                    {/* Descriptions */}
                    <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md max-w-sm mx-auto w-full"
                        >
                            <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-300">
                                <span className="font-bold text-lg">1</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">병풀잎소포 엑소좀</h3>
                            <p className="text-zinc-300 text-sm">피부 세포의 건강을 충전하는<br />가장 진보된 진정 성분</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md max-w-sm mx-auto w-full"
                        >
                            <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-sky-300">
                                <span className="font-bold text-lg">2</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">8중 히알루론산</h3>
                            <p className="text-zinc-300 text-sm">피부 속 수분을 빈틈없이 충전하는<br />강력한 보습 에너지</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Ingredients Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-amber-500 text-sm font-medium mb-3">MAIN INGREDIENTS</p>
                        <h2 className="text-2xl md:text-4xl font-black">핵심 성분</h2>
                    </motion.div>

                    {/* Exosome Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 md:p-12 mb-8"
                    >
                        <div className="max-w-3xl mx-auto">
                            <p className="text-amber-600 font-bold text-sm mb-2">메인 성분 #1</p>
                            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2">
                                병풀잎소포 엑소좀 10,000ppm
                            </h3>
                            <p className="text-zinc-500 mb-8">"단순한 성분이 아닙니다."</p>

                            <div className="space-y-6">
                                {[
                                    { title: '깊은 전달력', desc: '엑소좀은 피부의 가장 깊은 층까지 유효 성분을 전달하는 천연 운반체입니다. 일반 제품이 닿지 못하는 곳까지.' },
                                    { title: '진정 & 회복', desc: '병풀잎에서 추출된 엑소좀은 자극받은 피부를 진정시키고, 손상된 세포를 회복시키는 힘을 가지고 있습니다.' },
                                    { title: '세포 재생', desc: '피부 세포 자체를 건강하게 만들어, 단순히 표면을 채우는 것이 아닌 피부의 근본을 바꾸는 원료입니다.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <ChevronRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-bold text-zinc-900">{item.title}</p>
                                            <p className="text-zinc-600 text-sm mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-center font-bold text-amber-700 mt-8 text-lg">
                                "청아 앰플의 핵심, 바로 여기입니다."
                            </p>
                        </div>
                    </motion.div>

                    {/* Hyaluronic Acid Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-3xl p-8 md:p-12"
                    >
                        <div className="max-w-3xl mx-auto">
                            <p className="text-sky-600 font-bold text-sm mb-2">메인 성분 #2</p>
                            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2">
                                8종 히알루론산
                            </h3>
                            <p className="text-zinc-500 mb-8">"수분은 하나로는 부족합니다."</p>

                            <div className="space-y-6">
                                {[
                                    { title: '깊이별 작용', desc: '히알루론산 하나가 아닌 8가지의 서로 다른 분자 크기가 피부의 깊은 층부터 표면까지, 단계별로 작용합니다.' },
                                    { title: '촘촘한 수분 충전', desc: '분자 크기가 다양할수록 수분이 빈틈없이 채워집니다. 단일 히알루론산이 닿지 못하는 곳까지 촘촘하게.' },
                                    { title: '장벽 회복', desc: '깊은 층의 수분이 채워져야 피부 장벽이 건강해집니다. 8종 히알루론산은 그 근본부터 채워주는 역할입니다.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <ChevronRight className="w-5 h-5 text-sky-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-bold text-zinc-900">{item.title}</p>
                                            <p className="text-zinc-600 text-sm mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-center font-bold text-sky-700 mt-8 text-lg">
                                "촘촘하게, 깊숙히. 수분의 방정식."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Sub Ingredients Section */}
            <section className="py-24 bg-zinc-50">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="text-zinc-400 text-sm font-medium mb-3">SUPPORTING INGREDIENTS</p>
                        <h2 className="text-xl md:text-2xl font-black">
                            당신의 피부가 건강을 되찾도록<br />보조해주는 성분
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: '판테놀', desc: '피부 재생 및 진정' },
                            { name: '세라마이드 NP', desc: '피부 장벽 강화' },
                            { name: '알란토인', desc: '자극 완화 및 세포 활성화' },
                            { name: '베타글루칸', desc: '면역력 강화 및 수분 유지' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-xl p-6 text-center shadow-sm"
                            >
                                <p className="font-bold text-zinc-900 mb-2">{item.name}</p>
                                <p className="text-zinc-500 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing Section */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-black leading-tight">
                            여자들의 부러움을 사던 물광피부,<br />그 비밀은 여기에 있습니다.
                        </h2>

                        <div className="text-zinc-600 leading-relaxed space-y-4 text-center">
                            <p>
                                피부에 대한 욕심으로 지난 3년간 꾸준히 혼합해서 바르던 루틴,
                            </p>
                            <p>
                                그 결과는 지금도 꾸준히 듣는<br />
                                <span className="font-bold text-zinc-900">"남자 피부에서 어떻게 그렇게 광이나냐?"</span>는 칭찬이었습니다.
                            </p>
                            <p>
                                그 루틴은 3가지 앰플을 직접 혼합하는 것이었습니다.<br />
                                매번 복잡하고 번거로운 과정이었지만, 피부에 작용하는 것은 확실했습니다.
                            </p>
                        </div>

                        <div className="bg-zinc-900 text-white rounded-2xl p-8 mt-8 text-center">
                            <p className="text-xl md:text-2xl font-bold leading-relaxed">
                                발라봄 청아 앰플은<br />
                                그 3년간의 레시피를<br />
                                단 하나의 앰플로 농축한 것입니다.
                            </p>
                            <p className="text-zinc-400 mt-4">
                                혼합할 필요 없이, 스포이트 한 번으로.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Usage Scenarios Section - NEW */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-zinc-400 text-sm font-medium mb-3">USAGE SCENARIOS</p>
                        <h2 className="text-2xl md:text-4xl font-black leading-tight">
                            이럴 때, 발라봄이<br className="md:hidden" /> 답이 됩니다.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Heart,
                                title: "소개팅 전날 밤",
                                desc: "피부가 예민하고 걱정될 때,\n부드러운 진정과 수분을 채워주세요."
                            },
                            {
                                icon: Star,
                                title: "메이크업이 들뜰 때",
                                desc: "화장이 잘 먹지 않고 푸석한 날,\n속부터 차오르는 물광을 경험하세요."
                            },
                            {
                                icon: Shield,
                                title: "피부과 레이저 후",
                                desc: "자극 없는 깊은 보습이 필요할 때,\n안심하고 수분을 공급하세요."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-900 transition-all duration-300 shadow-sm"
                            >
                                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-zinc-900 transition-colors">
                                    <item.icon className="w-6 h-6 text-zinc-900 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed whitespace-pre-line">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Satisfaction Keywords - NEW */}
            <section className="py-24 bg-zinc-50 overflow-hidden">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-lg relative"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 -right-10 w-40 h-40 bg-sky-200/20 blur-3xl"
                        />

                        <h2 className="text-2xl md:text-3xl font-black mb-12">
                            발라봄이 약속하는<br />세 가지 경험
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                            <div className="space-y-4">
                                <div className="text-4xl">💧</div>
                                <p className="font-bold text-lg">깊은 흡수력</p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-4xl">✨</div>
                                <p className="font-bold text-lg">쫀쫀한 수분감</p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-4xl">🌿</div>
                                <p className="font-bold text-lg">저자극 안심 케어</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-zinc-900 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-black mb-8">
                            당신 피부에 피어날 봄,<br />지금 시작하세요.
                        </h2>
                        <p className="text-zinc-400 mb-12 text-lg">
                            성분 함량과 조화를 정교하게 설계해 피부 깊숙이 수분을 채우고,<br className="hidden md:block" /> 저자극 포뮬러로 어떤 피부도 안심할 수 있게 했습니다.
                        </p>
                        <Link href="#top">
                            <button className="group bg-white text-zinc-900 font-bold px-12 py-5 rounded-full hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 mx-auto shadow-2xl">
                                청아 앰플 시작하기
                                <Zap className="w-5 h-5 fill-zinc-900 group-hover:scale-125 transition-transform" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
