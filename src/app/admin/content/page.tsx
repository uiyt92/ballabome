import { createClient } from '@/utils/supabase/server'
import ContentClient from './ContentClient'

export default async function AdminContentPage() {
  const supabase = await createClient()

  const { data: contents } = await supabase
    .from('site_content')
    .select('*')
    .order('section', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">홈페이지 관리</h1>
        <p className="text-sm text-zinc-500 mt-1">메인 페이지의 배너, 텍스트, 이미지를 쉽게 수정할 수 있습니다.</p>
      </div>
      <ContentClient initialContents={contents ?? []} />
    </div>
  )
}
