import { createClient } from '@/utils/supabase/server'
import ReviewsClient from './ReviewsClient'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name), products(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">리뷰 관리</h1>
        <p className="text-sm text-zinc-500 mt-1">고객 리뷰를 확인하고 구매확인 여부를 관리합니다.</p>
      </div>
      <ReviewsClient initialReviews={reviews ?? []} />
    </div>
  )
}
