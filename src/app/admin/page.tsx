import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ShoppingBag, Users, TrendingUp, Clock, ArrowRight } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '입금대기', PAID: '결제완료', PREPARING: '배송준비중',
  SHIPPING: '배송중', DELIVERED: '배송완료', CANCELLED: '취소', REFUNDED: '환불'
}
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800', PAID: 'bg-green-100 text-green-800',
  PREPARING: 'bg-blue-100 text-blue-800', SHIPPING: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-red-100 text-red-800',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: todayOrders },
    { data: monthOrders },
    { count: pendingOrders },
    { count: totalMembers },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('orders').select('total_amount').gte('created_at', monthStart).in('status', ['PAID', 'PREPARING', 'SHIPPING', 'DELIVERED']),
    supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['PAID', 'PREPARING', 'SHIPPING']),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('id, order_id, receiver_name, product_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(8)
  ])

  const monthRevenue = (monthOrders ?? []).reduce((sum, o) => sum + (o.total_amount ?? 0), 0)

  const kpiCards = [
    { label: '오늘 주문', value: `${todayOrders ?? 0}건`, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '이번달 매출', value: `${monthRevenue.toLocaleString()}원`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '처리 대기', value: `${pendingOrders ?? 0}건`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '전체 회원', value: `${totalMembers ?? 0}명`, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">대시보드</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="p-6 bg-white rounded-xl border shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm text-zinc-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-zinc-900 break-all">{value}</p>
          </div>
        ))}
      </div>

      {/* 최근 주문 */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-zinc-900">최근 주문</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            전체 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주문일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주문자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">금액</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(recentOrders ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">주문 내역이 없습니다.</td>
                </tr>
              ) : (
                (recentOrders ?? []).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{order.receiver_name || '익명'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500 max-w-[200px] truncate">{order.product_name}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{order.total_amount.toLocaleString()}원</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
