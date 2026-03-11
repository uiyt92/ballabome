import { createClient } from '@/utils/supabase/server'
import type { Product, ProductOption, Review, SortOption, QnaItem } from '@/types/product'

export async function getProducts(params?: {
  search?: string
  sort?: SortOption
  page?: number
  limit?: number
}): Promise<{ data: Product[]; count: number }> {
  const supabase = await createClient()
  const { search, sort = 'popular', page = 1, limit = 20 } = params ?? {}
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'popular':
    default:
      query = query.order('rank', { ascending: true })
      break
  }

  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data as Product[]) ?? [], count: count ?? 0 }
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  if (error) return null
  return data as Product
}

export async function getProductOptions(productId: string): Promise<ProductOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_options')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })
  if (error) return []
  return (data as ProductOption[]) ?? []
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) return []
  return (data as Review[]) ?? []
}

export async function getUserWishlistIds(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId)
  return (data ?? []).map((w) => w.product_id)
}

export async function getUserWishlistProducts(userId: string): Promise<Product[]> {
  const wishlistIds = await getUserWishlistIds(userId)
  if (wishlistIds.length === 0) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .in('id', wishlistIds)
    .eq('is_active', true)
  return (data as Product[]) ?? []
}

export async function getProductQnas(productId: string): Promise<QnaItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('qna')
    .select('*, profiles(full_name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  return (data as QnaItem[]) ?? []
}
