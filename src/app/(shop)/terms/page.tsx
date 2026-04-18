export const metadata = {
  title: '이용약관 - BALLABOM',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">이용약관</h1>

      <div className="prose prose-zinc prose-sm max-w-none space-y-8 text-zinc-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제1조 (목적)</h2>
          <p>이 약관은 발라봄(이하 &quot;회사&quot;)이 운영하는 온라인 쇼핑몰(이하 &quot;몰&quot;)에서 제공하는 서비스를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제2조 (정의)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>&quot;몰&quot;이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 운영하는 인터넷 사이트를 말합니다.</li>
            <li>&quot;이용자&quot;란 몰에 접속하여 이 약관에 따라 몰이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
            <li>&quot;회원&quot;이란 몰에 회원등록을 한 자로서, 계속적으로 몰이 제공하는 서비스를 이용할 수 있는 자를 말합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제3조 (약관의 효력과 변경)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>이 약관은 몰 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
            <li>회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있으며, 변경된 약관은 공지 후 효력이 발생합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제4조 (서비스의 제공 및 변경)</h2>
          <p>회사는 다음과 같은 업무를 수행합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
            <li>구매계약이 체결된 재화 또는 용역의 배송</li>
            <li>기타 회사가 정하는 업무</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제5조 (서비스의 중단)</h2>
          <p>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체, 고장, 통신 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제6조 (회원가입)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
            <li>회사는 카카오 소셜 로그인을 통한 간편 회원가입을 제공합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제7조 (회원 탈퇴 및 자격 상실)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.</li>
            <li>회원이 허위 정보를 등록하거나, 타인의 서비스 이용을 방해한 경우 회사는 회원자격을 제한 및 정지시킬 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제8조 (구매신청 및 결제)</h2>
          <p>이용자는 몰에서 다음의 방법으로 구매를 신청합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>상품 선택 및 옵션 지정</li>
            <li>배송지 정보 입력</li>
            <li>결제수단 선택 및 결제 (토스페이먼츠)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제9조 (배송)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회사는 이용자가 구매를 신청한 날로부터 7일 이내에 배송을 시작합니다.</li>
            <li>배송 소요기간은 발송일로부터 통상 2~5일(영업일 기준)입니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제10조 (환불 및 교환)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>이용자는 상품 수령 후 7일 이내에 교환 및 환불을 요청할 수 있습니다.</li>
            <li>단, 이용자의 책임 있는 사유로 상품이 훼손된 경우에는 교환 및 환불이 제한됩니다.</li>
            <li>반품 배송비는 단순 변심의 경우 이용자 부담, 상품 하자의 경우 회사 부담입니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">제11조 (분쟁해결)</h2>
          <p>회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 서울중앙지방법원을 전속관할법원으로 합니다.</p>
        </section>

        <section>
          <p className="text-zinc-400 text-xs">본 약관은 2026년 3월 1일부터 시행됩니다.</p>
        </section>
      </div>
    </div>
  )
}
