'use client'

import { useState, useRef, useCallback, useEffect, memo, DragEvent } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, Eye, ExternalLink, Upload, RotateCcw, Type, Move, MousePointer } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────
type SiteContent = {
  id: string
  section: string
  key: string
  value_type: 'text' | 'image'
  value_content: string
}

type ElementLayout = {
  x: number
  y: number
  fontSize?: number
  textAlign?: 'left' | 'center' | 'right'
}

type SectionLayout = Record<string, ElementLayout>

type EditableElement = {
  key: string
  label: string
  defaultText: string
  defaultLayout: ElementLayout
  color?: string
  fontWeight?: string
  maxWidth?: string
}

type SectionDef = {
  id: string
  label: string
  type: 'hero' | 'brand'
  defaultImage: string
  elements: EditableElement[]
}

// ─── Section Definitions ─────────────────────────────────────────
const SECTIONS: SectionDef[] = [
  {
    id: 'hero_1', label: '메인 배너 1', type: 'hero',
    defaultImage: '/images/products/product-standard.webp',
    elements: [
      { key: 'subtitle', label: '작은 제목', defaultText: 'BALLABOM SIGNATURE', defaultLayout: { x: 4, y: 30, fontSize: 0.7 }, color: 'rgba(255,255,255,0.6)', fontWeight: '500', maxWidth: '60%' },
      { key: 'title', label: '큰 제목', defaultText: '결국 본질입니다.\n무너지지 않는 기초 포뮬러', defaultLayout: { x: 4, y: 38, fontSize: 2.2 }, color: '#fff', fontWeight: '700', maxWidth: '60%' },
      { key: 'description', label: '설명', defaultText: '단 7일 후, 피부 속부터 차오르는 수분감을 경험하세요', defaultLayout: { x: 4, y: 62, fontSize: 0.9 }, color: 'rgba(255,255,255,0.7)', fontWeight: '400', maxWidth: '60%' },
      { key: 'cta_text', label: '버튼', defaultText: '자세히 보기', defaultLayout: { x: 4, y: 75, fontSize: 0.85 }, color: '#fff', fontWeight: '500', maxWidth: '30%' },
    ]
  },
  {
    id: 'hero_2', label: '메인 배너 2', type: 'hero',
    defaultImage: '/images/products/product-deluxe.webp',
    elements: [
      { key: 'subtitle', label: '작은 제목', defaultText: 'PERFORMANCE SKINCARE', defaultLayout: { x: 4, y: 30, fontSize: 0.7 }, color: 'rgba(255,255,255,0.6)', fontWeight: '500', maxWidth: '60%' },
      { key: 'title', label: '큰 제목', defaultText: '기초에 대한 집착이 만드는\n압도적 밀착력', defaultLayout: { x: 4, y: 38, fontSize: 2.2 }, color: '#fff', fontWeight: '700', maxWidth: '60%' },
      { key: 'description', label: '설명', defaultText: '화장이 잘 먹는 피부는 기초부터 다릅니다', defaultLayout: { x: 4, y: 62, fontSize: 0.9 }, color: 'rgba(255,255,255,0.7)', fontWeight: '400', maxWidth: '60%' },
      { key: 'cta_text', label: '버튼', defaultText: '전제품 보기', defaultLayout: { x: 4, y: 75, fontSize: 0.85 }, color: '#fff', fontWeight: '500', maxWidth: '30%' },
    ]
  },
  {
    id: 'hero_3', label: '메인 배너 3', type: 'hero',
    defaultImage: '/images/products/product-premium-plus.webp',
    elements: [
      { key: 'subtitle', label: '작은 제목', defaultText: 'BRAND STORY', defaultLayout: { x: 4, y: 30, fontSize: 0.7 }, color: 'rgba(255,255,255,0.6)', fontWeight: '500', maxWidth: '60%' },
      { key: 'title', label: '큰 제목', defaultText: '피부는 진심을 느낀다.\n시작은 발라봄입니다.', defaultLayout: { x: 4, y: 38, fontSize: 2.2 }, color: '#fff', fontWeight: '700', maxWidth: '60%' },
      { key: 'description', label: '설명', defaultText: '', defaultLayout: { x: 4, y: 62, fontSize: 0.9 }, color: 'rgba(255,255,255,0.7)', fontWeight: '400', maxWidth: '60%' },
      { key: 'cta_text', label: '버튼', defaultText: '브랜드 스토리', defaultLayout: { x: 4, y: 75, fontSize: 0.85 }, color: '#fff', fontWeight: '500', maxWidth: '30%' },
    ]
  },
  {
    id: 'brand_story', label: '브랜드 스토리', type: 'brand',
    defaultImage: '/images/products/product-standard.webp',
    elements: [
      { key: 'title', label: '제목', defaultText: '남성 피부를 위한 프리미엄\n퍼포먼스 스킨케어', defaultLayout: { x: 50, y: 35, fontSize: 1.8, textAlign: 'center' }, color: '#fff', fontWeight: '700', maxWidth: '80%' },
      { key: 'description', label: '설명', defaultText: '과학적으로 입증된 성분을 기반으로\n피부를 건강하고 탄력있게 바꿔드립니다.', defaultLayout: { x: 50, y: 55, fontSize: 0.9, textAlign: 'center' }, color: 'rgba(255,255,255,0.7)', fontWeight: '400', maxWidth: '60%' },
    ]
  },
]

// ─── Draggable Element (no re-render during drag) ────────────────
const DraggableElement = memo(function DraggableElement({
  elDef, layout, text, isSelected, isEditing,
  onSelect, onDoubleClick, onTextSave, onDragEnd,
}: {
  elDef: EditableElement
  layout: ElementLayout
  text: string
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onDoubleClick: () => void
  onTextSave: (newText: string) => void
  onDragEnd: (x: number, y: number) => void
}) {
  const elRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; containerRect: DOMRect } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isCta = elDef.key === 'cta_text'

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return
    e.preventDefault()
    e.stopPropagation()
    onSelect()

    const container = elRef.current?.parentElement
    if (!container) return

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: layout.x,
      origY: layout.y,
      containerRect: container.getBoundingClientRect(),
    }

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current || !elRef.current) return
      // 실제 드래그 임계값 넘은 후에만 willChange 활성화
      if (!isDragging) {
        const { startX, startY } = dragRef.current
        if (Math.abs(ev.clientX - startX) > 3 || Math.abs(ev.clientY - startY) > 3) {
          setIsDragging(true)
        }
      }
      const { startX, startY, origX, origY, containerRect } = dragRef.current
      const dx = ((ev.clientX - startX) / containerRect.width) * 100
      const dy = ((ev.clientY - startY) / containerRect.height) * 100
      const newX = Math.max(0, Math.min(95, origX + dx))
      const newY = Math.max(0, Math.min(95, origY + dy))
      elRef.current.style.left = `${newX}%`
      elRef.current.style.top = `${newY}%`
    }

    const handleUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      setIsDragging(false)
      if (!dragRef.current) return
      const { startX, startY, origX, origY, containerRect } = dragRef.current
      const dx = ((ev.clientX - startX) / containerRect.width) * 100
      const dy = ((ev.clientY - startY) / containerRect.height) * 100
      const finalX = Math.round(Math.max(0, Math.min(95, origX + dx)) * 10) / 10
      const finalY = Math.round(Math.max(0, Math.min(95, origY + dy)) * 10) / 10
      dragRef.current = null
      onDragEnd(finalX, finalY)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  return (
    <div
      ref={elRef}
      data-editable
      className={`absolute group ${isEditing ? '' : 'cursor-grab active:cursor-grabbing'}`}
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        maxWidth: elDef.maxWidth || '60%',
        transform: layout.textAlign === 'center' ? 'translateX(-50%)' : 'none',
        zIndex: isSelected ? 50 : 10,
        // 드래그 중에만 GPU 레이어 승격 — 평상시 16개 요소 × 4섹션 compositing 비용 제거
        willChange: isDragging ? 'left, top' : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick() }}
    >
      {/* Selection border — selected 상태일 때만 transition 활성 */}
      <div className={`absolute -inset-2 rounded pointer-events-none ${
        isSelected
          ? 'border-2 border-sky-400 bg-sky-400/10 transition-colors'
          : 'border border-transparent group-hover:border-white/40'
      }`} />

      {isSelected && (
        <div className="absolute -top-6 left-0 flex items-center gap-1 bg-sky-500 text-white text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
          <Move className="w-2.5 h-2.5" />
          {elDef.label}
        </div>
      )}

      {isCta ? (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => onTextSave(e.currentTarget.textContent || '')}
          className={`inline-block px-5 py-2 border rounded-full whitespace-nowrap outline-none ${isEditing ? 'border-sky-400 bg-white/20' : 'border-white/60'}`}
          style={{ color: elDef.color, fontSize: `${layout.fontSize || 0.85}rem`, fontWeight: elDef.fontWeight }}
        >
          {text}
        </div>
      ) : (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => onTextSave(e.currentTarget.innerText || '')}
          className={`outline-none whitespace-pre-line leading-snug ${isEditing ? 'bg-white/10 rounded px-1 -mx-1' : ''}`}
          style={{
            color: elDef.color,
            fontSize: `${layout.fontSize || 1}rem`,
            fontWeight: elDef.fontWeight,
            textAlign: layout.textAlign || 'left',
            letterSpacing: elDef.key === 'subtitle' ? '0.15em' : 'normal',
          }}
        >
          {text}
        </div>
      )}
    </div>
  )
})

// ─── Section Editor (memo'd) ─────────────────────────────────────
const SectionEditor = memo(function SectionEditor({
  section, layout, contentGetter, imageUrl,
  selectedKey, editingKey,
  onSelect, onEdit, onTextSave, onDragEnd,
  onFontSize, onAlign, onReset, onImageUpload,
}: {
  section: SectionDef
  layout: SectionLayout
  contentGetter: (key: string) => string
  imageUrl: string
  selectedKey: string | null
  editingKey: string | null
  onSelect: (key: string | null) => void
  onEdit: (key: string | null) => void
  onTextSave: (key: string, text: string) => void
  onDragEnd: (key: string, x: number, y: number) => void
  onFontSize: (key: string, delta: number) => void
  onAlign: (key: string) => void
  onReset: () => void
  onImageUpload: (file: File) => void
}) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragOver(false) }
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) {
      setUploading(true)
      try {
        await onImageUpload(file)
      } finally {
        setUploading(false)
      }
    }
  }

  const selectedLayout = selectedKey ? layout[selectedKey] : null

  return (
    <div
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{
        // 뷰포트 밖 섹션은 렌더링 skip → 스크롤 성능 대폭 향상
        contentVisibility: 'auto',
        containIntrinsicSize: '800px 650px',
      }}
    >
      <div className="px-4 py-3 border-b bg-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🖼️</span>
          <span className="font-medium text-zinc-800 text-sm">{section.label}</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> 초기화
        </button>
      </div>

      {/* Canvas */}
      <div
        className={`relative w-full overflow-hidden select-none ${
          section.type === 'hero' ? 'aspect-[16/7]' : 'aspect-[16/6]'
        } ${dragOver ? 'ring-4 ring-sky-400 ring-inset' : ''}`}
        onClick={() => { onSelect(null); onEdit(null) }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div className={`absolute inset-0 pointer-events-none ${
          section.type === 'hero' ? 'bg-gradient-to-r from-black/60 via-black/30 to-transparent' : 'bg-black/50'
        }`} />

        {section.elements.map((el) => {
          const elLayout = layout[el.key] || el.defaultLayout
          const text = contentGetter(el.key) || el.defaultText
          return (
            <DraggableElement
              key={el.key}
              elDef={el}
              layout={elLayout}
              text={text}
              isSelected={selectedKey === el.key}
              isEditing={editingKey === el.key}
              onSelect={() => onSelect(el.key)}
              onDoubleClick={() => { onSelect(el.key); onEdit(el.key) }}
              onTextSave={(t) => onTextSave(el.key, t)}
              onDragEnd={(x, y) => onDragEnd(el.key, x, y)}
            />
          )
        })}

        {dragOver && (
          <div className="absolute inset-0 bg-sky-500/30 flex items-center justify-center z-[60] pointer-events-none">
            <div className="bg-white rounded-xl px-8 py-4 shadow-2xl text-sky-600 font-semibold flex items-center gap-3">
              <Upload className="w-6 h-6" /> 여기에 이미지를 놓으세요
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl px-6 py-3 shadow-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
              <span className="text-sm font-medium text-zinc-700">업로드 중...</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-20 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
            <Upload className="w-3 h-3" /> 이미지 드래그하여 교체
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {selectedKey && selectedLayout && (
        <div className="px-4 py-2.5 border-t bg-zinc-50 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-600">
            <MousePointer className="w-3.5 h-3.5" />
            <span className="font-medium">{section.elements.find(e => e.key === selectedKey)?.label}</span>
          </div>
          <div className="h-4 w-px bg-zinc-300" />
          <div className="flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-zinc-500" />
            <button onClick={() => onFontSize(selectedKey, -0.1)} className="w-6 h-6 rounded border bg-white text-zinc-700 font-bold hover:bg-zinc-100 flex items-center justify-center">−</button>
            <span className="text-zinc-600 w-10 text-center font-mono">{(selectedLayout.fontSize || 1).toFixed(1)}</span>
            <button onClick={() => onFontSize(selectedKey, 0.1)} className="w-6 h-6 rounded border bg-white text-zinc-700 font-bold hover:bg-zinc-100 flex items-center justify-center">+</button>
          </div>
          <div className="h-4 w-px bg-zinc-300" />
          <button onClick={() => onAlign(selectedKey)} className="px-2 py-1 text-zinc-600 hover:bg-zinc-100 rounded transition-colors">
            정렬: {selectedLayout.textAlign === 'center' ? '가운데' : selectedLayout.textAlign === 'right' ? '오른쪽' : '왼쪽'}
          </button>
          <div className="h-4 w-px bg-zinc-300" />
          <span className="text-zinc-400 font-mono">x:{selectedLayout.x.toFixed(0)}% y:{selectedLayout.y.toFixed(0)}%</span>
        </div>
      )}
    </div>
  )
})

// ─── Main Component ──────────────────────────────────────────────
export default function ContentClient({ initialContents }: { initialContents: SiteContent[] }) {
  const [contents, setContents] = useState<SiteContent[]>(initialContents)
  const [layouts, setLayouts] = useState<Record<string, SectionLayout>>({})
  const [selected, setSelected] = useState<{ section: string; key: string } | null>(null)
  const [editing, setEditing] = useState<{ section: string; key: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const supabase = createClient()

  const getContentValue = useCallback((section: string, key: string): string => {
    return contents.find(c => c.section === section && c.key === key)?.value_content ?? ''
  }, [contents])

  // Init layouts
  useEffect(() => {
    const loaded: Record<string, SectionLayout> = {}
    for (const s of SECTIONS) {
      const raw = getContentValue(s.id, 'layout')
      if (raw) { try { loaded[s.id] = JSON.parse(raw) } catch { /* */ } }
      if (!loaded[s.id]) {
        loaded[s.id] = {}
        for (const el of s.elements) loaded[s.id][el.key] = { ...el.defaultLayout }
      }
    }
    setLayouts(loaded)
  }, [getContentValue])

  const upsertContent = useCallback(async (section: string, key: string, value: string, valueType: 'text' | 'image' = 'text') => {
    const existing = contents.find(c => c.section === section && c.key === key)
    if (existing) {
      await supabase.from('site_content').update({ value_content: value }).eq('id', existing.id)
      setContents(prev => prev.map(c => c.id === existing.id ? { ...c, value_content: value } : c))
    } else {
      const { data } = await supabase.from('site_content').insert({ section, key, value_type: valueType, value_content: value }).select().single()
      if (data) setContents(prev => [...prev, data])
    }
  }, [contents, supabase])

  const saveAll = useCallback(async () => {
    setSaving(true)
    try {
      for (const s of SECTIONS) {
        if (layouts[s.id]) await upsertContent(s.id, 'layout', JSON.stringify(layouts[s.id]))
      }
      setSaveStatus('저장 완료!')
      setTimeout(() => setSaveStatus(null), 2000)
    } catch { setSaveStatus('저장 실패') }
    finally { setSaving(false) }
  }, [layouts, upsertContent])

  const handleDragEnd = useCallback((sectionId: string, key: string, x: number, y: number) => {
    setLayouts(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [key]: { ...prev[sectionId]?.[key], x, y } }
    }))
  }, [])

  const handleFontSize = useCallback((sectionId: string, key: string, delta: number) => {
    setLayouts(prev => {
      const cur = prev[sectionId]?.[key]
      if (!cur) return prev
      return { ...prev, [sectionId]: { ...prev[sectionId], [key]: { ...cur, fontSize: Math.round(Math.max(0.5, Math.min(5, (cur.fontSize || 1) + delta)) * 10) / 10 } } }
    })
  }, [])

  const handleAlign = useCallback((sectionId: string, key: string) => {
    setLayouts(prev => {
      const cur = prev[sectionId]?.[key]
      if (!cur) return prev
      const aligns: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right']
      const idx = aligns.indexOf(cur.textAlign || 'left')
      return { ...prev, [sectionId]: { ...prev[sectionId], [key]: { ...cur, textAlign: aligns[(idx + 1) % 3] } } }
    })
  }, [])

  const handleReset = useCallback((sectionId: string) => {
    const s = SECTIONS.find(s => s.id === sectionId)
    if (!s) return
    const def: SectionLayout = {}
    for (const el of s.elements) def[el.key] = { ...el.defaultLayout }
    setLayouts(prev => ({ ...prev, [sectionId]: def }))
  }, [])

  const handleImageUpload = useCallback(async (sectionId: string, file: File) => {
    const MAX_SIZE = 4 * 1024 * 1024 // Vercel serverless body limit ≈ 4.5MB
    if (file.size > MAX_SIZE) {
      const mb = (file.size / 1024 / 1024).toFixed(1)
      alert(
        `파일이 너무 큽니다 (${mb}MB).\n\n` +
        `4MB 이하로 압축해서 다시 올려주세요.\n` +
        `추천: 1920×960px로 리사이즈 + WebP 변환 → 대부분 200KB 이하\n` +
        `• squoosh.app (무료 온라인)\n` +
        `• tinypng.com`
      )
      return
    }
    try {
      const ext = file.name.split('.').pop()
      const path = `cms/${sectionId}-${Date.now()}.${ext}`
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'public-images')
      formData.append('path', path)
      formData.append('section', sectionId)
      formData.append('key', 'image')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      let result: { url?: string; error?: string }
      try {
        result = await res.json()
      } catch {
        // 413/502 등 non-JSON 응답 (Vercel이 차단한 경우)
        throw new Error(res.status === 413 ? '파일 크기 제한 초과 (4MB)' : `서버 응답 오류 (${res.status})`)
      }
      if (!res.ok) throw new Error(result.error || `오류 ${res.status}`)
      if (!result.url) throw new Error('URL 반환 없음')
      setContents(prev => {
        const existing = prev.find(c => c.section === sectionId && c.key === 'image')
        if (existing) return prev.map(c => c.id === existing.id ? { ...c, value_content: result.url! } : c)
        return [...prev, { id: `temp-${Date.now()}`, section: sectionId, key: 'image', value_type: 'image', value_content: result.url! }]
      })
    } catch (err: any) { alert('업로드 실패: ' + (err.message || '알 수 없는 오류')) }
  }, [])

  const handleTextSave = useCallback((sectionId: string, key: string, text: string) => {
    setEditing(null)
    upsertContent(sectionId, key, text)
  }, [upsertContent])

  return (
    <div className="space-y-6">
      {/* 이미지 권장 사양 안내 */}
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-zinc-700">
        <p className="font-semibold text-sky-900 mb-1">📐 이미지 권장 사양</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-zinc-600">
          <span>• <strong>히어로 배너</strong>: 1920×960px (2:1), 200KB 이하</span>
          <span>• <strong>상품 썸네일</strong>: 1200×1200px (1:1), 200KB 이하</span>
          <span>• <strong>브랜드 스토리/배너</strong>: 1600×900px (16:9)</span>
          <span>• <strong>포맷</strong>: WebP 우선 / JPG, PNG, HEIC 가능</span>
          <span>• <strong>배경</strong>: 흰색 또는 단색</span>
          <span>• <strong>최대 용량</strong>: <strong className="text-red-600">4MB</strong> (Vercel 한도)</span>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between bg-white rounded-xl border shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-sky-500" />
          <div>
            <h2 className="font-semibold text-zinc-900 text-sm">비주얼 에디터</h2>
            <p className="text-xs text-zinc-500"><strong>더블클릭</strong> → 텍스트 수정 · <strong>드래그</strong> → 위치 이동 · <strong>이미지 끌어놓기</strong> → 배경 교체</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus && <span className={`text-sm font-medium ${saveStatus.includes('완료') ? 'text-green-600' : 'text-red-500'}`}>{saveStatus}</span>}
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 border text-zinc-600 text-sm rounded-lg hover:bg-zinc-50">
            <ExternalLink className="w-4 h-4" /> 홈페이지
          </a>
          <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 전체 저장
          </button>
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <SectionEditor
          key={section.id}
          section={section}
          layout={layouts[section.id] || {}}
          contentGetter={(key) => getContentValue(section.id, key)}
          imageUrl={getContentValue(section.id, 'image') || section.defaultImage}
          selectedKey={selected?.section === section.id ? selected.key : null}
          editingKey={editing?.section === section.id ? editing.key : null}
          onSelect={(key) => { setSelected(key ? { section: section.id, key } : null); if (!key) setEditing(null) }}
          onEdit={(key) => setEditing(key ? { section: section.id, key } : null)}
          onTextSave={(key, text) => handleTextSave(section.id, key, text)}
          onDragEnd={(key, x, y) => handleDragEnd(section.id, key, x, y)}
          onFontSize={(key, d) => handleFontSize(section.id, key, d)}
          onAlign={(key) => handleAlign(section.id, key)}
          onReset={() => handleReset(section.id)}
          onImageUpload={(file) => handleImageUpload(section.id, file)}
        />
      ))}

      {/* Banner & Trust (simple text editors) */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-zinc-50 flex items-center gap-2">
          <span className="text-lg">📢</span>
          <span className="font-medium text-zinc-800 text-sm">상단 배너</span>
        </div>
        <div className="p-4">
          <div className="bg-zinc-900 text-white text-center py-2.5 text-xs font-medium rounded-lg mb-4">
            <span className="text-zinc-400">{getContentValue('top_banner', 'text_before') || '카카오톡 채널 추가하면'}</span>{' '}
            <span className="font-bold">{getContentValue('top_banner', 'text_highlight') || '3,000원 할인쿠폰'}</span>{' '}
            <span className="text-zinc-400">{getContentValue('top_banner', 'text_after') || '즉시 지급'}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'text_before', label: '앞 문구', ph: '카카오톡 채널 추가하면' },
              { key: 'text_highlight', label: '강조 문구', ph: '3,000원 할인쿠폰' },
              { key: 'text_after', label: '뒷 문구', ph: '즉시 지급' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">{f.label}</label>
                <input type="text" defaultValue={getContentValue('top_banner', f.key)} placeholder={f.ph}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                  onBlur={(e) => { if (e.target.value) upsertContent('top_banner', f.key, e.target.value) }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-zinc-50 flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="font-medium text-zinc-800 text-sm">신뢰 배지</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          {[
            { t: 'badge1_title', s: 'badge1_subtitle', tp: '카카오톡 채널 추가', sp: '3,000원 할인쿠폰 지급' },
            { t: 'badge2_title', s: 'badge2_subtitle', tp: '100%', sp: '환불 보장 제도' },
          ].map((b, i) => (
            <div key={i} className="space-y-2">
              <label className="text-xs font-medium text-zinc-500">배지 {i + 1}</label>
              <input type="text" defaultValue={getContentValue('trust', b.t)} placeholder={b.tp}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                onBlur={(e) => { if (e.target.value) upsertContent('trust', b.t, e.target.value) }}
              />
              <input type="text" defaultValue={getContentValue('trust', b.s)} placeholder={b.sp}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                onBlur={(e) => { if (e.target.value) upsertContent('trust', b.s, e.target.value) }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
