import React from 'react'
import { ChevronRight, ArrowUpRight, ShieldCheck, Droplets, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface Product {
    id: string
    name: string
    category: string
    price: string
    originalPrice?: string
    discount?: string
    image: string
    tag: string
}

const PRODUCTS: Product[] = [
    {
        id: '01',
        name: '엑소좀 앰플',
        category: 'Serum & Ampoule',
        price: '34,800원',
        originalPrice: '46,400원',
        discount: '25%',
        tag: 'Best',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '02',
        name: '에어프루프 클렌저',
        category: 'Cleansing',
        price: '22,000원',
        tag: 'New',
        image: 'https://images.unsplash.com/photo-1620917670397-dc7bc45e6976?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '03',
        name: '에비앙스킨 수분미스트',
        category: 'Mist & Toner',
        price: '19,000원',
        tag: 'Signature',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
    }
]

export default function CollectionGrid() {
    return (
        <section className="w-full py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-medium tracking-widest text-zinc-400 uppercase mb-4 block">
                            Premium Collection
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                            여행의 설렘을 담은<br />
                            <span className="text-zinc-300 italic">프리미엄 라인업</span>
                        </h2>
                        <p className="text-base text-zinc-500 max-w-lg leading-relaxed">
                            매일 아침, 비행기에 오르는 설렘을 피부에 전달하세요. <br />
                            발라봄만의 독자적인 에비앙스킨 시스템으로 완성하는 광채.
                        </p>
                    </div>

                    <button className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 hover:text-sky-500 transition-colors">
                        전제품 보러가기 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRODUCTS.map((product) => (
                        <div
                            key={product.id}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-zinc-50 rounded-2xl">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-block bg-zinc-900 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg">
                                        {product.tag}
                                    </span>
                                </div>
                                <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="bg-white text-zinc-900 p-4 rounded-full shadow-2xl">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 px-1">
                                <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold">{product.category}</p>
                                <h3 className="text-xl font-black tracking-tight group-hover:text-sky-500 transition-colors">{product.name}</h3>

                                <div className="flex items-center gap-2">
                                    {product.discount && (
                                        <span className="text-red-500 text-sm font-bold">{product.discount}</span>
                                    )}
                                    <span className="text-base font-black">{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-zinc-300 text-xs line-through">{product.originalPrice}</span>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-zinc-100 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <BenefitItem icon={<ShieldCheck />} label="Safe" />
                                    <BenefitItem icon={<Droplets />} label="Moist" />
                                    <BenefitItem icon={<Sparkles />} label="Glow" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function BenefitItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 text-zinc-300">{icon}</div>
            <span className="text-[9px] uppercase tracking-tighter font-bold text-zinc-400">{label}</span>
        </div>
    )
}
