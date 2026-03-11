'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react'

type SiteContent = {
    id: string
    section: string
    key: string
    value_type: 'text' | 'image'
    value_content: string
}

export default function AdminContentPage() {
    const [contents, setContents] = useState<SiteContent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    const [newSection, setNewSection] = useState('')
    const [newKey, setNewKey] = useState('')
    const [newValueType, setNewValueType] = useState<'text' | 'image'>('text')
    const [newValueContent, setNewValueContent] = useState('')

    useEffect(() => {
        fetchContents()
    }, [])

    const fetchContents = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .order('section', { ascending: true })

        if (error) {
            console.error('Error fetching site content:', error)
            alert('콘텐츠 데이터를 불러오는데 실패했습니다.')
        } else {
            setContents(data || [])
        }
        setIsLoading(false)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSection || !newKey) {
            alert('섹션과 키를 모두 입력해주세요.')
            return
        }

        try {
            const { error } = await supabase
                .from('site_content')
                .insert([
                    { section: newSection, key: newKey, value_type: newValueType, value_content: newValueContent }
                ])

            if (error) throw error

            setNewSection('')
            setNewKey('')
            setNewValueType('text')
            setNewValueContent('')
            fetchContents()
            alert('콘텐츠가 추가되었습니다.')
        } catch (err: any) {
            console.error(err)
            alert(err.message || '추가 실패')
        }
    }

    const handleUpdate = async (id: string, updatedContent: string) => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('site_content')
                .update({ value_content: updatedContent })
                .eq('id', id)

            if (error) throw error
            alert('수정되었습니다.')
            fetchContents()
        } catch (err: any) {
            console.error(err)
            alert(err.message || '수정 실패')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        try {
            const { error } = await supabase
                .from('site_content')
                .delete()
                .eq('id', id)

            if (error) throw error
            fetchContents()
        } catch (err: any) {
            console.error(err)
            alert(err.message || '삭제 실패')
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, filePrefix: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        const fileExt = file.name.split('.').pop()
        const fileName = `${filePrefix}-${Math.random()}.${fileExt}`
        const filePath = `public/${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('public-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('public-images').getPublicUrl(filePath)
            return data.publicUrl
        } catch (error: any) {
            alert('이미지 업로드에 실패했습니다: ' + error.message)
            return null
        }
    }


    if (isLoading) return <div>로딩중...</div>

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600">콘텐츠 관리</h1>
                    <p className="text-zinc-500 mt-2">메인 페이지의 텍스트와 이미지를 관리합니다.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
                <h2 className="text-lg font-semibold mb-4">새 콘텐츠 항목 추가</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">섹션 (예: hero, about)</label>
                        <input
                            type="text"
                            value={newSection}
                            onChange={e => setNewSection(e.target.value)}
                            className="w-full rounded-md border p-2 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">키 (예: title, image_url)</label>
                        <input
                            type="text"
                            value={newKey}
                            onChange={e => setNewKey(e.target.value)}
                            className="w-full rounded-md border p-2 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">타입</label>
                        <select
                            value={newValueType}
                            onChange={e => setNewValueType(e.target.value as 'text' | 'image')}
                            className="w-full rounded-md border p-2 text-sm bg-white"
                        >
                            <option value="text">텍스트 (Text)</option>
                            <option value="image">이미지 (Image)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">내용 / 이미지 URL</label>
                        <input
                            type="text"
                            value={newValueContent}
                            onChange={e => setNewValueContent(e.target.value)}
                            className="w-full rounded-md border p-2 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-zinc-900 text-white rounded-md p-2 text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> 추가
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">섹션</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">키</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contents.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.section}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.key}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.value_type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {item.value_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {item.value_type === 'text' ? (
                                        <textarea
                                            defaultValue={item.value_content || ''}
                                            className="w-full rounded border p-2 text-sm min-h-[60px]"
                                            onBlur={(e) => {
                                                if (e.target.value !== item.value_content) {
                                                    handleUpdate(item.id, e.target.value)
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {item.value_content ? (
                                                <img src={item.value_content} alt="preview" className="h-10 w-10 object-cover rounded border" />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-100 border rounded flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    defaultValue={item.value_content || ''}
                                                    className="w-full rounded border p-2 text-xs mb-2"
                                                    placeholder="이미지 URL"
                                                    onBlur={(e) => {
                                                        if (e.target.value !== item.value_content) {
                                                            handleUpdate(item.id, e.target.value)
                                                        }
                                                    }}
                                                />
                                                <div className="relative overflow-hidden inline-[x]">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="text-xs"
                                                        onChange={async (e) => {
                                                            const url = await handleImageUpload(e, `${item.section}-${item.key}`)
                                                            if (url) {
                                                                handleUpdate(item.id, url)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-900 ml-4 border p-2 rounded hover:bg-red-50"
                                        title="삭제"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {contents.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    콘텐츠 데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
