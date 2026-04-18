'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Shield, User } from 'lucide-react'

type Member = {
  id: string
  full_name: string | null
  phone: string | null
  default_address: string | null
  role: string
  created_at: string
}

export default function MembersClient({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  async function toggleAdmin(id: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!confirm(`이 회원을 ${newRole === 'admin' ? '관리자' : '일반 회원'}으로 변경하시겠습니까?`)) return
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    if (error) { alert('변경 실패'); return }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m))
  }

  const filtered = members.filter(m => {
    if (!search) return true
    const q = search.toLowerCase()
    return m.full_name?.toLowerCase().includes(q) || m.phone?.includes(q)
  })

  const todayCount = members.filter(m => new Date(m.created_at).toDateString() === new Date().toDateString()).length

  return (
    <div className="space-y-6">
      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-sm text-zinc-500 mb-1">전체 회원</p>
          <p className="text-2xl font-bold">{members.length}명</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-sm text-zinc-500 mb-1">관리자</p>
          <p className="text-2xl font-bold text-blue-600">{members.filter(m => m.role === 'admin').length}명</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-sm text-zinc-500 mb-1">오늘 가입</p>
          <p className="text-2xl font-bold text-green-600">{todayCount}명</p>
        </div>
      </div>

      {/* 검색 */}
      <input
        type="text"
        placeholder="이름 또는 전화번호 검색..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
      />

      {/* 테이블 */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">전화번호</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주소</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">권한</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  {search ? '검색 결과가 없습니다.' : '회원이 없습니다.'}
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{member.full_name || '이름 없음'}</p>
                        <p className="text-xs text-zinc-400 font-mono">{member.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{member.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 max-w-[200px] truncate">{member.default_address || '-'}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap">
                    {new Date(member.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleAdmin(member.id, member.role)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        member.role === 'admin'
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {member.role === 'admin' ? '관리자' : '일반'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
