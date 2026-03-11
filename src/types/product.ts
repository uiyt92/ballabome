export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  images: string[]
  is_active: boolean
  rank: number
  created_at: string
  updated_at: string
}

export interface ProductOption {
  id: number
  product_id: string
  name: string
  price: number
  original_price: number | null
  tag: string | null
  sort_order: number
}

export interface Review {
  id: string
  user_id: string | null
  product_id: string
  order_id: string | null
  rating: number
  body: string | null
  images: string[]
  is_verified: boolean
  created_at: string
  profiles?: { full_name: string | null }
}

export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export type SortOption = 'newest' | 'popular' | 'price_asc' | 'price_desc'

export interface QnaItem {
  id: string
  product_id: string
  user_id: string
  title: string
  body: string
  is_private: boolean
  answer: string | null
  answered_at: string | null
  created_at: string
  profiles?: { full_name: string | null }
}
