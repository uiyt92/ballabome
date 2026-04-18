import { createClient } from '@/utils/supabase/server'
import ProductsClient from './ProductsClient'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: options }] = await Promise.all([
    supabase.from('products').select('*').order('rank', { ascending: true }),
    supabase.from('product_options').select('*').order('sort_order', { ascending: true })
  ])

  const merged = (products ?? []).map(p => ({
    ...p,
    options: (options ?? []).filter(o => o.product_id === p.id)
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">상품 관리</h1>
        <p className="text-sm text-zinc-500 mt-1">상품 정보, 이미지, 옵션을 관리합니다.</p>
      </div>
      <ProductsClient initialProducts={merged} />
    </div>
  )
}
