import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserWishlistProducts } from '@/lib/products'

type Tab = 'orders' | 'wishlist'

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function MyPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) redirect('/login')

  const params = await searchParams
  const tab = (params.tab as Tab) ?? 'orders'

  const [profileResult, ordersResult, wishlistProducts] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    tab === 'wishlist' ? getUserWishlistProducts(user.id) : Promise.resolve([]),
  ])

  const profile = profileResult.data
  const orders = ordersResult.data

  const statusLabel: Record<string, string> = {
    PENDING: '결제대기',
    PAID: '결제완료',
    PREPARING: '상품준비중',
    SHIPPING: '배송중',
    DELIVERED: '배송완료',
    CANCELLED: '취소',
    REFUNDED: '환불',
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">마이페이지</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 내 정보 카드 */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">이름</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.full_name || '이름 없음'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">이메일</p>
                <p className="text-md text-gray-800 break-all">{user.email}</p>
              </div>
              {profile?.phone && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">연락처</p>
                  <p className="text-md text-gray-800">{profile.phone}</p>
                </div>
              )}
              <div className="pt-4 mt-2 border-t border-gray-50">
                <Link href="/cart" className="text-blue-600 font-medium text-sm hover:underline">
                  장바구니 확인하기 &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* 탭 영역 */}
          <div className="md:col-span-2">
            {/* 탭 헤더 */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
              <Link
                href="/mypage?tab=orders"
                className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === 'orders'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                결제 내역
              </Link>
              <Link
                href="/mypage?tab=wishlist"
                className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === 'wishlist'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                찜한 상품
              </Link>
            </div>

            {/* 결제 내역 */}
            {tab === 'orders' && (
              <>
                {!orders || orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                    <span className="text-4xl mb-4">📦</span>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">아직 결제한 내역이 없습니다</h3>
                    <p className="text-gray-500 mb-6">발라봄의 베스트 상품들을 만나보세요.</p>
                    <Link href="/" className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-full transition-colors">
                      쇼핑 계속하기
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'PAID' ? 'bg-blue-50 text-blue-600' :
                              order.status === 'SHIPPING' ? 'bg-green-50 text-green-600' :
                              order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {statusLabel[order.status] ?? order.status}
                            </span>
                            <span className="text-sm text-gray-400 font-medium">
                              {new Date(order.created_at).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{order.product_name}</h3>
                          <p className="text-sm text-gray-500 mb-3">수량: {order.quantity}개</p>
                          <div className="flex flex-col text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                            <span className="font-semibold text-gray-700 mb-1">배송지 정보</span>
                            <span>{order.receiver_name} ({order.receiver_phone})</span>
                            <span className="mt-0.5">{order.address} {order.address_detail}</span>
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap sm:self-stretch sm:flex sm:flex-col sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0 w-full sm:w-auto">
                          <p className="text-sm text-gray-500 mb-1">총 결제금액</p>
                          <p className="text-xl font-bold text-gray-900">{order.total_amount.toLocaleString()}원</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 찜한 상품 */}
            {tab === 'wishlist' && (
              <>
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                    <span className="text-4xl mb-4">🤍</span>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">찜한 상품이 없습니다</h3>
                    <p className="text-gray-500 mb-6">마음에 드는 상품을 찜해보세요.</p>
                    <Link href="/products" className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-full transition-colors">
                      상품 보러가기
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {wishlistProducts.map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-gray-300 transition-all">
                        <div className="aspect-square bg-zinc-50 p-6 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.images[0] ?? '/product-hero.png'}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{product.name}</p>
                          <div className="flex items-center gap-2">
                            {product.original_price && (
                              <span className="text-xs text-gray-400 line-through">{product.original_price.toLocaleString()}원</span>
                            )}
                            <span className="text-sm font-black text-gray-900">{product.price.toLocaleString()}원</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
