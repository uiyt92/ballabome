'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface WishlistButtonProps {
  productId: string
  initialWished: boolean
  className?: string
  size?: 'sm' | 'md'
}

export default function WishlistButton({
  productId,
  initialWished,
  className = '',
  size = 'md',
}: WishlistButtonProps) {
  const [wished, setWished] = useState(initialWished)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function toggle() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      if (wished) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
      } else {
        await supabase
          .from('wishlists')
          .upsert({ user_id: user.id, product_id: productId })
      }
      setWished(!wished)
    })
  }

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const btnSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle() }}
      disabled={isPending}
      aria-label={wished ? '찜 해제' : '찜하기'}
      className={`${btnSize} flex items-center justify-center rounded-full transition-all duration-200 ${
        wished
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
      } shadow-sm border border-zinc-100 ${className}`}
    >
      <Heart className={`${iconSize} ${wished ? 'fill-red-500' : ''}`} />
    </button>
  )
}
