'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Eye, EyeOff, ChevronDown, ChevronUp, X, ImagePlus, Pencil, Save } from 'lucide-react'

type ProductOption = {
  id: number
  product_id: string
  name: string
  price: number
  original_price: number | null
  tag: string | null
  sort_order: number
}

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  is_active: boolean
  rank: number
  images: string[]
  created_at: string
  options?: ProductOption[]
}

type Tab = 'info' | 'images' | 'options'

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Record<string, Tab>>({})
  const [editingInfo, setEditingInfo] = useState<Record<string, Partial<Product>>>({})
  const [editingOption, setEditingOption] = useState<{ id: number; field: string; value: string } | null>(null)
  const [uploadingProduct, setUploadingProduct] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [targetProductId, setTargetProductId] = useState<string | null>(null)
  const supabase = createClient()

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', id)
    if (error) { alert('변경 실패'); return }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  // 기본 정보 편집
  function startEditInfo(product: Product) {
    setEditingInfo(prev => ({
      ...prev,
      [product.id]: {
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        original_price: product.original_price ?? undefined,
      }
    }))
  }

  async function saveInfo(productId: string) {
    const info = editingInfo[productId]
    if (!info) return
    const { error } = await supabase.from('products').update({
      name: info.name,
      description: info.description || null,
      price: Number(info.price),
      original_price: info.original_price ? Number(info.original_price) : null,
    }).eq('id', productId)
    if (error) { alert('저장 실패'); return }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...info } : p))
    setEditingInfo(prev => { const n = { ...prev }; delete n[productId]; return n })
  }

  // 이미지 업로드 (service_role 경유 API — RLS 우회 + 테이블 update 동시 처리)
  async function handleImageUpload(productId: string, files: FileList) {
    const MAX_SIZE = 4 * 1024 * 1024 // Vercel serverless body limit
    setUploadingProduct(productId)
    let latestImages: string[] | null = null

    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        const mb = (file.size / 1024 / 1024).toFixed(1)
        alert(`${file.name} 너무 큼 (${mb}MB).\n4MB 이하로 압축 후 재업로드. (1200×1200, WebP 권장 → 대부분 200KB 이하)`)
        continue
      }
      const ext = file.name.split('.').pop()
      const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'product-images')
      formData.append('path', path)
      formData.append('productId', productId)

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        let result: { url?: string; images?: string[]; error?: string }
        try {
          result = await res.json()
        } catch {
          throw new Error(res.status === 413 ? '파일 크기 제한 초과' : `서버 응답 오류 (${res.status})`)
        }
        if (!res.ok) {
          alert(`업로드 실패: ${file.name} — ${result.error || res.status}`)
          continue
        }
        if (result.images) latestImages = result.images
      } catch (err: any) {
        alert(`업로드 실패: ${file.name} — ${err.message || '네트워크 오류'}`)
      }
    }

    if (latestImages) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, images: latestImages! } : p))
    }
    setUploadingProduct(null)
  }

  async function removeImage(productId: string, imgUrl: string) {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return
    const product = products.find(p => p.id === productId)
    const newImages = (product?.images ?? []).filter(i => i !== imgUrl)
    const { error } = await supabase.from('products').update({ images: newImages }).eq('id', productId)
    if (error) { alert('삭제 실패'); return }

    // Storage에서도 삭제 (Supabase storage URL인 경우)
    if (imgUrl.includes('product-images')) {
      const path = imgUrl.split('/product-images/')[1]
      if (path) await supabase.storage.from('product-images').remove([path])
    }

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, images: newImages } : p))
  }

  // 옵션 인라인 편집
  async function saveOptionField(optionId: number, field: string, rawValue: string) {
    const value = ['price', 'original_price', 'sort_order'].includes(field)
      ? (rawValue === '' ? null : parseInt(rawValue))
      : rawValue || null
    const { error } = await supabase.from('product_options').update({ [field]: value }).eq('id', optionId)
    if (error) { alert('저장 실패'); return }
    setProducts(prev => prev.map(p => ({
      ...p,
      options: p.options?.map(o => o.id === optionId ? { ...o, [field]: value } : o)
    })))
    setEditingOption(null)
  }

  function getTab(productId: string): Tab {
    return activeTab[productId] ?? 'info'
  }

  function setTab(productId: string, tab: Tab) {
    setActiveTab(prev => ({ ...prev, [productId]: tab }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">상품 관리</h1>
        <p className="text-sm text-zinc-500 mt-1">상품 정보, 이미지, 옵션을 관리합니다.</p>
      </div>

      {/* 숨겨진 파일 인풋 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        className="hidden"
        onChange={e => {
          if (targetProductId && e.target.files) {
            handleImageUpload(targetProductId, e.target.files)
            e.target.value = ''
          }
        }}
      />

      <div className="space-y-3">
        {products.map(product => {
          const isExpanded = expandedId === product.id
          const tab = getTab(product.id)
          const info = editingInfo[product.id]
          const isEditingInfo = !!info

          return (
            <div key={product.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {/* 상품 헤더 */}
              <div className="flex items-center gap-4 px-6 py-4">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-zinc-100 shrink-0" loading="lazy" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-900 truncate">{product.name}</p>
                    <span className="text-xs text-zinc-400 font-mono shrink-0">#{product.id}</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {Number(product.price).toLocaleString()}원
                    {product.original_price && (
                      <span className="line-through text-zinc-300 ml-2">{Number(product.original_price).toLocaleString()}원</span>
                    )}
                    <span className="ml-3 text-zinc-400">이미지 {product.images?.length ?? 0}장 · 옵션 {product.options?.length ?? 0}개</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(product.id, product.is_active)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {product.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {product.is_active ? '판매중' : '숨김'}
                  </button>
                  <button
                    onClick={() => {
                      const next = isExpanded ? null : product.id
                      setExpandedId(next)
                      if (next) setTab(next, 'info')
                    }}
                    className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-50 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 탭 영역 */}
              {isExpanded && (
                <div className="border-t">
                  {/* 탭 헤더 */}
                  <div className="flex border-b bg-gray-50">
                    {(['info', 'images', 'options'] as Tab[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setTab(product.id, t)}
                        className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                          tab === t ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                        }`}
                      >
                        {t === 'info' ? '기본 정보' : t === 'images' ? `이미지 (${product.images?.length ?? 0})` : `옵션 (${product.options?.length ?? 0})`}
                      </button>
                    ))}
                  </div>

                  {/* 기본 정보 탭 */}
                  {tab === 'info' && (
                    <div className="p-6 space-y-4">
                      {!isEditingInfo ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">상품명</p>
                              <p className="font-medium text-zinc-900">{product.name}</p>
                            </div>
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">상품 ID (slug)</p>
                              <p className="font-mono text-zinc-600">{product.id}</p>
                            </div>
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">판매가</p>
                              <p className="font-semibold text-zinc-900">{Number(product.price).toLocaleString()}원</p>
                            </div>
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">정가 (할인 전)</p>
                              <p className="text-zinc-600">{product.original_price ? `${Number(product.original_price).toLocaleString()}원` : '-'}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-zinc-400 text-xs mb-1">상품 설명</p>
                              <p className="text-zinc-600 whitespace-pre-wrap">{product.description || '-'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => startEditInfo(product)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                          >
                            <Pencil className="w-4 h-4" /> 편집
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <label className="block text-xs text-zinc-500 mb-1">상품명</label>
                              <input
                                value={info.name ?? ''}
                                onChange={e => setEditingInfo(prev => ({ ...prev, [product.id]: { ...prev[product.id], name: e.target.value } }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-zinc-500 mb-1">판매가</label>
                              <input
                                type="number"
                                value={info.price ?? ''}
                                onChange={e => setEditingInfo(prev => ({ ...prev, [product.id]: { ...prev[product.id], price: Number(e.target.value) } }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-zinc-500 mb-1">정가 (할인 전)</label>
                              <input
                                type="number"
                                value={info.original_price ?? ''}
                                onChange={e => setEditingInfo(prev => ({ ...prev, [product.id]: { ...prev[product.id], original_price: e.target.value ? Number(e.target.value) : undefined } }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-zinc-500 mb-1">상품 설명</label>
                              <textarea
                                rows={3}
                                value={info.description ?? ''}
                                onChange={e => setEditingInfo(prev => ({ ...prev, [product.id]: { ...prev[product.id], description: e.target.value } }))}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveInfo(product.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                            >
                              <Save className="w-4 h-4" /> 저장
                            </button>
                            <button
                              onClick={() => setEditingInfo(prev => { const n = { ...prev }; delete n[product.id]; return n })}
                              className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 이미지 탭 */}
                  {tab === 'images' && (
                    <div className="p-6 space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {(product.images ?? []).map((img, i) => (
                          <div key={img} className="relative group">
                            <img
                              src={img}
                              alt={`이미지 ${i + 1}`}
                              className="w-24 h-24 object-cover rounded-xl border border-zinc-200"
                              loading="lazy"
                            />
                            {i === 0 && (
                              <span className="absolute bottom-1 left-1 bg-zinc-900/70 text-white text-[10px] px-1.5 py-0.5 rounded">대표</span>
                            )}
                            <button
                              onClick={() => removeImage(product.id, img)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex shadow"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* 업로드 버튼 */}
                        <button
                          onClick={() => {
                            setTargetProductId(product.id)
                            fileInputRef.current?.click()
                          }}
                          disabled={uploadingProduct === product.id}
                          className="w-24 h-24 border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-zinc-500 transition-colors text-zinc-400 hover:text-zinc-600 disabled:opacity-50"
                        >
                          {uploadingProduct === product.id ? (
                            <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <ImagePlus className="w-5 h-5" />
                              <span className="text-[10px]">추가</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 space-y-1">
                        <p className="font-semibold text-zinc-700">📐 썸네일 권장 사양</p>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-500">
                          <li><strong>비율</strong>: 1:1 정사각</li>
                          <li><strong>크기</strong>: 1200×1200px 권장 (최소 800×800px, Retina 대응)</li>
                          <li><strong>포맷</strong>: WebP 우선, JPG/PNG 가능 · <strong className="text-red-600">최대 4MB</strong></li>
                          <li><strong>용량</strong>: 200KB 이하 권장 (자동 최적화 적용)</li>
                          <li><strong>배경</strong>: 흰색(#FFFFFF) 또는 단색</li>
                          <li><strong>여백</strong>: 사방 5~10% (상품이 화면을 꽉 채우지 않게)</li>
                        </ul>
                        <p className="text-zinc-400 pt-1">첫 번째 이미지가 대표 썸네일로 표시됩니다.</p>
                      </div>
                    </div>
                  )}

                  {/* 옵션 탭 */}
                  {tab === 'options' && (
                    <div className="p-6">
                      <p className="text-xs font-semibold text-zinc-400 uppercase mb-3">셀 클릭 → 인라인 편집 · Enter 저장 · Esc 취소</p>
                      {(product.options?.length ?? 0) === 0 ? (
                        <p className="text-sm text-zinc-400">등록된 옵션이 없습니다.</p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-zinc-400 uppercase">
                              <th className="text-left pb-2 font-medium w-1/2">옵션명</th>
                              <th className="text-right pb-2 font-medium">판매가</th>
                              <th className="text-right pb-2 font-medium">정가</th>
                              <th className="text-left pb-2 font-medium pl-4">태그</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {product.options?.map(opt => (
                              <tr key={opt.id} className="hover:bg-zinc-50 transition-colors">
                                {(['name', 'price', 'original_price', 'tag'] as const).map((field, fi) => {
                                  const val = String(opt[field] ?? '')
                                  const isEditing = editingOption?.id === opt.id && editingOption?.field === field
                                  return (
                                    <td key={field} className={`py-2.5 ${fi > 0 ? (fi < 3 ? 'text-right' : 'pl-4') : 'pr-4'}`}>
                                      {isEditing ? (
                                        <div className="flex items-center gap-1">
                                          <input
                                            autoFocus
                                            defaultValue={editingOption.value}
                                            onKeyDown={e => {
                                              if (e.key === 'Enter') saveOptionField(opt.id, field, (e.target as HTMLInputElement).value)
                                              if (e.key === 'Escape') setEditingOption(null)
                                            }}
                                            className="w-full border rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                          />
                                          <button onClick={() => setEditingOption(null)} className="text-zinc-400"><X className="w-3.5 h-3.5" /></button>
                                        </div>
                                      ) : (
                                        <span
                                          className="cursor-pointer hover:text-zinc-900 hover:underline transition-colors"
                                          onClick={() => setEditingOption({ id: opt.id, field, value: val })}
                                        >
                                          {val || <span className="text-zinc-300 italic text-xs">-</span>}
                                        </span>
                                      )}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
