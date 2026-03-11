export default function AdminDashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">대시보드</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">오늘의 주문</h2>
                    <p className="text-3xl font-bold">0건</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">신규 회원</h2>
                    <p className="text-3xl font-bold">0명</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">현재 진행중 주문</h2>
                    <p className="text-3xl font-bold">0건</p>
                </div>
            </div>
        </div>
    )
}
