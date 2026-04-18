import { createClient } from '@/utils/supabase/server'

export type ContentMap = Record<string, string>

/**
 * 특정 section의 모든 콘텐츠를 { key: value } 맵으로 가져온다.
 * Server Component에서만 사용.
 */
export async function getSectionContent(section: string): Promise<ContentMap> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('key, value_content')
    .eq('section', section)

  const map: ContentMap = {}
  for (const item of data ?? []) {
    if (item.value_content) map[item.key] = item.value_content
  }
  return map
}

/**
 * 여러 section의 콘텐츠를 한 번에 가져온다.
 * 반환: { sectionId: { key: value } }
 */
export async function getMultipleSectionContents(sections: string[]): Promise<Record<string, ContentMap>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('section, key, value_content')
    .in('section', sections)

  const result: Record<string, ContentMap> = {}
  for (const s of sections) result[s] = {}

  for (const item of data ?? []) {
    if (item.value_content) {
      if (!result[item.section]) result[item.section] = {}
      result[item.section][item.key] = item.value_content
    }
  }
  return result
}
