'use client'

import { useEffect, useRef, Suspense, useState } from 'react'
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/client'

const clientKey = "test_ck_D5GePWvyJnrKwdP715g8gLzN97Eq" // Toss Payments Test Client Key
const customerKey = "YbX2HuSlsC9uVJW6NMRMj" // Random string for customer key

function CheckoutContent() {
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
    const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance['renderPaymentMethods']> | null>(null)
    const [isWidgetReady, setIsWidgetReady] = useState(false)
    const searchParams = useSearchParams()

    // Shipping State
    const [receiverName, setReceiverName] = useState('')
    const [receiverPhone, setReceiverPhone] = useState('')
    const [address, setAddress] = useState('')
    const [detailAddress, setDetailAddress] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [shippingRequest, setShippingRequest] = useState('배송 요청사항을 선택해주세요')

    const [hasSavedAddress, setHasSavedAddress] = useState(false)
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [saveAsDefault, setSaveAsDefault] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState('')

    // Coupon State
    const [couponCode, setCouponCode] = useState('')
    const [discountAmount, setDiscountAmount] = useState(0)

    // Get product info from URL or default
    const productName = searchParams.get('productName') || '청아 앰플'
    const paramPrice = searchParams.get('price');
    const productPrice = paramPrice && !isNaN(parseInt(paramPrice)) ? parseInt(paramPrice) : 34800;

    const finalPrice = productPrice - discountAmount

    // Supabase: 로그인 유저 프로필 불러오기
    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setUserId(user.id)
                setUserEmail(user.email || '')

                // profiles 테이블에서 저장된 배송지 가져오기
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profile && profile.default_address) {
                    setHasSavedAddress(true)
                    setReceiverName(profile.full_name || '')
                    setReceiverPhone(profile.phone || '')
                    setAddress(profile.default_address || '')
                    setDetailAddress(profile.default_address_detail || '')
                    setZipCode(profile.default_zipcode || '')
                }
            }
        }
        fetchProfile()
    }, [])

    // Load Payment Widget
    useEffect(() => {
        (async () => {
            try {
                const paymentWidget = await loadPaymentWidget(clientKey, customerKey)

                // Render Payment Methods
                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    '#payment-widget',
                    { value: productPrice }, // Use product price initially, update later
                    { variantKey: 'DEFAULT' }
                )

                // Render Agreement
                paymentWidget.renderAgreement(
                    '#agreement',
                    { variantKey: 'AGREEMENT' }
                )

                paymentWidgetRef.current = paymentWidget
                paymentMethodsWidgetRef.current = paymentMethodsWidget

                setIsWidgetReady(true)
            } catch (error) {
                console.error("Error loading payment widget:", error)
            }
        })()
    }, []) // Run once on mount

    // Update Amount when Final Price changes
    useEffect(() => {
        const widget = paymentMethodsWidgetRef.current
        if (widget) {
            widget.updateAmount(finalPrice)
        }
    }, [finalPrice])

    const handleApplyCoupon = () => {
        if (couponCode === 'WELCOME') {
            setDiscountAmount(3000)
            alert('웰컴 쿠폰이 적용되었습니다! (3,000원 할인)')
        } else {
            setDiscountAmount(0)
            alert('유효하지 않은 쿠폰 코드입니다.')
        }
    }

    const handlePayment = async () => {
        const paymentWidget = paymentWidgetRef.current

        // Basic Validation
        if (!receiverName || !receiverPhone || !address) {
            alert('배송 정보를 모두 입력해주세요.')
            return
        }

        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

        try {
            const supabase = createClient()

            // 기본 배송지로 저장 체크 시 프로필 업데이트
            if (saveAsDefault && userId) {
                await supabase.from('profiles').update({
                    full_name: receiverName,
                    phone: receiverPhone,
                    default_address: address,
                    default_address_detail: detailAddress,
                    default_zipcode: zipCode,
                    updated_at: new Date().toISOString(),
                }).eq('id', userId)
            }

            // DB에 주문 내역 저장 (상태: PENDING)
            if (userId) {
                await supabase.from('orders').insert({
                    user_id: userId,
                    order_id: orderId,
                    product_name: productName,
                    quantity: 1,
                    total_amount: finalPrice,
                    status: 'PENDING',
                    receiver_name: receiverName,
                    receiver_phone: receiverPhone,
                    address: address,
                    address_detail: detailAddress,
                    zipcode: zipCode,
                    shipping_request: shippingRequest,
                })
            }

            // 토스 결제 요청
            await paymentWidget?.requestPayment({
                orderId: orderId,
                orderName: productName,
                customerName: receiverName,
                customerEmail: userEmail || 'guest@ballabom.com',
                customerMobilePhone: receiverPhone.replace(/-/g, ''),
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddressChange = () => {
        setIsEditingAddress(true)
    }

    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Shipping & Order Info */}
                <div className="space-y-6">
                    {/* Shipping Address Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="w-1 h-6 bg-black block rounded-full" />
                                배송지 정보
                            </h2>
                            {hasSavedAddress && !isEditingAddress && (
                                <button
                                    onClick={handleAddressChange}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    배송지 변경
                                </button>
                            )}
                        </div>

                        {hasSavedAddress && !isEditingAddress ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">{receiverName}</span>
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">기본 배송지</span>
                                </div>
                                <div className="text-gray-800">
                                    {address} {detailAddress}
                                </div>
                                <div className="text-gray-600">
                                    {receiverPhone}
                                </div>
                                <div className="pt-2">
                                    <select
                                        value={shippingRequest}
                                        onChange={(e) => setShippingRequest(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none bg-white text-gray-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7em] bg-[right_1rem_center] bg-no-repeat pe-8"
                                    >
                                        <option value="배송 요청사항을 선택해주세요">배송 요청사항을 선택해주세요</option>
                                        <option value="문 앞에 놓고 가주세요">문 앞에 놓고 가주세요</option>
                                        <option value="직접/경비실 등 받으실 곳을 입력해주세요">직접/경비실 등 받으실 곳을 입력해주세요</option>
                                        <option value="배송 전 연락바랍니다">배송 전 연락바랍니다</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">수령인</label>
                                    <input
                                        type="text"
                                        value={receiverName}
                                        onChange={(e) => setReceiverName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="이름을 입력하세요"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                                    <input
                                        type="tel"
                                        value={receiverPhone}
                                        onChange={(e) => setReceiverPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={zipCode}
                                            readOnly // For now
                                            className="w-24 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                                            placeholder="우편번호"
                                        />
                                        <button className="flex-1 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
                                            주소 찾기
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all mb-2"
                                        placeholder="기본 주소"
                                    />
                                    <input
                                        type="text"
                                        value={detailAddress}
                                        onChange={(e) => setDetailAddress(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="상세 주소를 입력하세요"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="saveDefault"
                                        checked={saveAsDefault}
                                        onChange={(e) => setSaveAsDefault(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black"
                                    />
                                    <label htmlFor="saveDefault" className="text-sm text-gray-700 cursor-pointer select-none">
                                        기본 배송지로 저장
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <select
                                        value={shippingRequest}
                                        onChange={(e) => setShippingRequest(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none bg-white text-gray-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7em] bg-[right_1rem_center] bg-no-repeat pe-8"
                                    >
                                        <option value="배송 요청사항을 선택해주세요">배송 요청사항을 선택해주세요</option>
                                        <option value="문 앞에 놓고 가주세요">문 앞에 놓고 가주세요</option>
                                        <option value="직접/경비실 등 받으실 곳을 입력해주세요">직접/경비실 등 받으실 곳을 입력해주세요</option>
                                        <option value="배송 전 연락바랍니다">배송 전 연락바랍니다</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary with Coupon */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-black block rounded-full" />
                            쿠폰 / 할인
                        </h2>
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="쿠폰 번호 입력 (WELCOME)"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all uppercase"
                            />
                            <button
                                onClick={handleApplyCoupon}
                                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                적용
                            </button>
                        </div>

                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-black block rounded-full" />
                            최종 결제 금액
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-gray-600">
                                <span>상품 금액</span>
                                <span>{productPrice.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between items-center text-blue-600">
                                <span>할인 금액</span>
                                <span>-{discountAmount.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-t border-gray-100 mt-2">
                                <span className="text-lg font-bold">총 결제 금액</span>
                                <span className="text-2xl font-bold text-gray-900">{finalPrice.toLocaleString()}원</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Widget */}
                <div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-black block rounded-full" />
                            결제 수단
                        </h2>
                        <div id="payment-widget" className="w-full" />
                        <div id="agreement" className="w-full" />

                        <button
                            disabled={!isWidgetReady}
                            onClick={handlePayment}
                            className={`w-full font-bold py-4 rounded-xl text-lg transition-colors shadow-lg mt-6 ${isWidgetReady
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isWidgetReady ? `${finalPrice.toLocaleString()}원 결제하기` : '결제 정보 불러오는 중...'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Suspense fallback={<div className="flex justify-center py-20">Loading...</div>}>
                <CheckoutContent />
            </Suspense>
        </div>
    )
}
