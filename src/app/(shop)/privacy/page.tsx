export const metadata = {
  title: '개인정보처리방침 - BALLABOM',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">개인정보처리방침</h1>

      <div className="prose prose-zinc prose-sm max-w-none space-y-8 text-zinc-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">1. 개인정보의 처리 목적</h2>
          <p>발라봄(이하 &quot;회사&quot;)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
            <li>재화 또는 서비스 제공: 물품배송, 서비스 제공, 콘텐츠 제공, 맞춤서비스 제공</li>
            <li>고충처리: 민원인의 신원 확인, 민원사항 확인, 처리결과 통보</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">2. 개인정보의 처리 및 보유기간</h2>
          <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>회원 가입 정보: 회원 탈퇴 시까지</li>
            <li>주문/결제 정보: 5년 (전자상거래법)</li>
            <li>소비자 불만 또는 분쟁 처리 기록: 3년 (전자상거래법)</li>
            <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">3. 처리하는 개인정보의 항목</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>필수항목: 이름, 이메일(카카오 계정), 배송지 주소, 전화번호</li>
            <li>자동수집항목: 접속 IP, 쿠키, 서비스 이용기록, 방문기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">4. 개인정보의 제3자 제공</h2>
          <p>회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등의 경우에만 개인정보를 제3자에게 제공합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>배송업체: 상품 배송을 위해 수령인명, 주소, 연락처를 제공</li>
            <li>결제대행사 (토스페이먼츠): 결제 처리를 위해 필요한 최소한의 정보 제공</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">5. 개인정보의 파기</h2>
          <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>전자적 파일: 복원이 불가능한 방법으로 영구 삭제</li>
            <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">6. 정보주체의 권리·의무 및 행사방법</h2>
          <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">7. 개인정보 보호책임자</h2>
          <ul className="list-none space-y-1">
            <li>성명: 발라봄 고객센터</li>
            <li>연락처: 카카오톡 채널 &quot;발라봄&quot;</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">8. 개인정보 처리방침 변경</h2>
          <p>이 개인정보처리방침은 2026년 3월 1일부터 적용됩니다. 변경사항이 있을 경우 웹사이트를 통해 공지합니다.</p>
        </section>
      </div>
    </div>
  )
}
