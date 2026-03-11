'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { MoreHorizontal } from 'lucide-react'

type Order = {
    id: string
    order_id: string
    product_name: string
    total_amount: number
    status: string
    receiver_name: string
    created_at: string
}

const ORDER_STATUSES = [
    'PENDING',    // 입금대기 / 결제대기
    'PAID',       // 결제완료
    'PREPARING',  // 배송준비중
    'SHIPPING',   // 배송중
    'DELIVERED',  // 배송완료
    'CANCELLED',  // 취소됨
    'REFUNDED'    // 환불됨
]

const STATUS_LABELS: Record<string, string> = {
    PENDING: '입금/결제대기',
    PAID: '결제완료',
    PREPARING: '배송준비중',
    SHIPPING: '배송중',
    DELIVERED: '배송완료',
    CANCELLED: '취소',
    REFUNDED: '환불'
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching orders:', error)
            alert('주문 데이터를 불러오는데 실패했습니다.')
        } else {
            setOrders(data || [])
        }
        setIsLoading(false)
    }

    const updateOrderStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error
            alert(`상태가 ${STATUS_LABELS[newStatus]}으로 변경되었습니다.`)
            fetchOrders()
        } catch (err: any) {
            console.error(err)
            alert(err.message || '상태 변경 실패')
        }
    }

    if (isLoading) return <div>로딩중...</div>

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600">주문 관리</h1>
                    <p className="text-zinc-500 mt-2">고객들의 주문 내역을 확인하고 상태를 관리합니다.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문일시</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문번호</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문자명</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">결제금액</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleString('ko-KR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.order_id || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.receiver_name || '익명'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {order.product_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                    {order.total_amount.toLocaleString()}원
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${['PAID', 'DELIVERED'].includes(order.status) ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'SHIPPING' || order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' : ''}
                    ${['CANCELLED', 'REFUNDED'].includes(order.status) ? 'bg-red-100 text-red-800' : ''}
                    ${!['PAID', 'DELIVERED', 'PENDING', 'SHIPPING', 'PREPARING', 'CANCELLED', 'REFUNDED'].includes(order.status) ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                                        {STATUS_LABELS[order.status] || order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <div className="relative inline-block text-left">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm rounded-md bg-white border"
                                        >
                                            {ORDER_STATUSES.map(status => (
                                                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                    주문 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
