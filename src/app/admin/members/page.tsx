import { createClient } from '@/utils/supabase/server'
import MembersClient from './MembersClient'

export default async function AdminMembersPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, phone, default_address, role, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">회원 관리</h1>
        <p className="text-sm text-zinc-500 mt-1">가입한 회원 목록을 확인하고 권한을 관리합니다.</p>
      </div>
      <MembersClient initialMembers={members ?? []} />
    </div>
  )
}
