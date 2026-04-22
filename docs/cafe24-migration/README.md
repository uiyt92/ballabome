# 카페24 SmartDesign Easy 이식 자료

BALLABOM (ballabom.com) 디자인을 카페24로 이식하기 위한 정제된 HTML/CSS/이미지 자산.

## 📁 폴더 구조

```
docs/cafe24-migration/
├── README.md                    # 이 문서 (이식 가이드)
├── clean-html.mjs               # HTML 정리 스크립트 (재실행 가능)
├── pages/                       # 페이지별 정제 HTML (12개)
│   ├── main.html                # 메인 (홈)
│   ├── product-list.html        # 상품 목록
│   ├── product-detail.html      # 상품 상세
│   ├── cart.html                # 장바구니
│   ├── checkout.html            # 주문/결제
│   ├── login.html               # 로그인
│   ├── mypage.html              # 마이페이지
│   ├── brand-story.html         # 브랜드 스토리
│   ├── event.html               # 이벤트
│   ├── notice.html              # 공지사항
│   ├── terms.html               # 이용약관
│   └── privacy.html             # 개인정보처리방침
└── assets/
    ├── styles.css               # Tailwind 컴파일 결과 (78KB)
    ├── pretendard.css           # Pretendard Variable 폰트
    └── image-list.txt           # 이식 필요한 이미지 경로 25개
```

## 🚀 카페24 업로드 순서

### Step 1. 애셋 업로드

카페24 관리자 → **디자인 > 파일 관리자** 에서 업로드:

| 로컬 경로 | 카페24 업로드 경로 |
|-----------|-------------------|
| `assets/styles.css` | `/web/upload/ballabom/styles.css` |
| `assets/pretendard.css` | `/web/upload/ballabom/pretendard.css` |
| `public/images/*` | `/web/upload/ballabom/images/` |
| `public/images/products/*` | `/web/upload/ballabom/images/products/` |
| `public/images/logo/*` | `/web/upload/ballabom/images/logo/` |

이미지 원본은 `../../../public/images/` 에 있음.

### Step 2. 각 페이지 HTML을 SmartDesign에 복사

카페24 관리자 → **디자인 > 스마트디자인 Easy > 편집** → 각 페이지 편집 모드에서 HTML 탭으로 이동 → 해당 pages 파일의 `<body>` 내부 붙여넣기.

**페이지 매핑:**

| 우리 파일 | 카페24 섹션 |
|-----------|-------------|
| `main.html` | 메인 페이지 (`/index.html`) |
| `product-list.html` | 상품 분류 목록 (`/product/list.html`) |
| `product-detail.html` | 상품 상세 (`/product/detail.html`) |
| `cart.html` | 장바구니 (`/order/basket.html`) |
| `checkout.html` | 주문서 (`/order/orderform.html`) |
| `login.html` | 로그인 (`/member/login.html`) |
| `mypage.html` | 마이페이지 (`/myshop/index.html`) |
| `brand-story.html` | 일반 게시판 or 커스텀 페이지 |
| `event.html` | 이벤트 게시판 |
| `notice.html` | 공지사항 게시판 |
| `terms.html` | 이용약관 (기본 제공 페이지 대체) |
| `privacy.html` | 개인정보처리방침 (기본 제공 대체) |

### Step 3. CSS/폰트 링크 수정

각 페이지의 `<head>`에서 CSS 경로 확인 및 수정:

```html
<!-- 현재 (로컬 상대 경로) -->
<link rel="stylesheet" href="../assets/styles.css">
<link rel="stylesheet" href="../assets/pretendard.css">

<!-- 카페24 업로드 후 -->
<link rel="stylesheet" href="/web/upload/ballabom/styles.css">
<link rel="stylesheet" href="/web/upload/ballabom/pretendard.css">
```

### Step 4. 동적 데이터에 카페24 변수 삽입

정적 HTML에 들어있는 예시 데이터(상품명, 가격, 이미지)를 카페24 스마트디자인 변수로 교체.

## 📋 카페24 변수 매핑표

### 상품 관련

| 용도 | 예시 HTML (현재) | 카페24 변수 |
|------|-----------------|-------------|
| 상품 번호 | `data-product-id="1"` | `{$product_no}` |
| 상품명 | `<h3>청아 앰플</h3>` | `{$product_name}` |
| 판매가 | `<span>₩42,000</span>` | `{$product_price}` |
| 정상가 | `<s>₩50,000</s>` | `{$product_price_content}` |
| 간략 설명 | `<p>피부 고보습...</p>` | `{$summary_description}` |
| 대표 이미지 (중) | `<img src="/images/...">` | `<img src="{$image_medium}">` |
| 대표 이미지 (소) | 같음 | `{$image_small}` |
| 대표 이미지 (대) | 같음 | `{$image_big}` |
| 상품 상세 URL | `<a href="/product/xxx">` | `<a href="{$product_link}">` |
| 할인가 표시 | 별도 계산 | `{$sale_price}` |

### 상품 목록 (반복)

목록 영역을 **`<module>` 블록**으로 감싸야 카페24가 자동 반복:

```html
<!-- 카페24 -->
<module id="product_listmain_1">
    <div class="product-card">
        <a href="{$product_link}">
            <img src="{$image_medium}" alt="{$product_name}">
            <h3>{$product_name}</h3>
            <span>{$product_price}원</span>
        </a>
    </div>
</module>
```

대표 module id 참고:
- 메인 신상품: `product_listmain_1`
- 메인 베스트: `product_listmain_2`
- 추천상품: `product_listmain_3`
- MD추천: `product_listmain_4`

### 회원 관련

| 용도 | 카페24 변수 |
|------|-------------|
| 로그인 여부 | `<!--@if(member_id!='')-->...<!--@/if-->` |
| 회원 ID | `{$member_id}` |
| 이름 | `{$name}` |
| 이메일 | `{$email}` |
| 휴대폰 | `{$cellphone}` |
| 회원 등급 | `{$grade_name}` |
| 적립금 | `{$available_mileage}` |

### 주문/장바구니

| 용도 | 카페24 변수 |
|------|-------------|
| 장바구니 수량 | `{$basket_count}` |
| 총 결제금액 | `{$payment_amount}` |
| 상품별 수량 | `{$quantity}` |
| 배송비 | `{$shipping_fee}` |
| 수령인 | `{$receiver_name}` |

## ⚠️ 주요 교체 포인트 (페이지별)

### main.html
- 히어로 캐러셀 3장: 히어로 이미지는 **카페24 > 디자인 > 메인 배너** 메뉴에서 등록 후 `<module id="main_banner">` 사용 권장
- 베스트셀러 섹션: `<module id="product_listmain_2">`로 교체
- 리뷰 캐러셀: 카페24 리뷰 모듈 `<module id="Review">` 사용
- 카카오톡 플로팅: 부가서비스 "카카오톡 상담" 설치

### product-list.html
- 상품 카드 반복 영역을 `<module id="product_listmain_1">` 또는 `{$category_products_display_type}`로 감싸기
- 정렬/필터 UI: 카페24 기본 제공 (`{$sort_form}`)
- 페이지네이션: `{$page_navigator}`

### product-detail.html
- 이미지 갤러리: `{$big_image}` + `{$image_medium}` loop
- 옵션 선택: `{$options_total}` → 카페24가 자동 렌더링
- 수량 선택: `<input name="quantity" value="1">`
- 장바구니/바로구매 버튼: 카페24 기본 폼 사용 (이름 `addbasket`, `buynow`)
- 리뷰 탭: `<module id="board_ProductReview">`
- Q&A 탭: `<module id="board_ProductQNA">`

### cart.html
- 장바구니 아이템 반복: `<module id="Basket_List">`
- 수량 변경 input: `name="quantity"`
- 삭제 버튼: 기본 제공 링크 사용
- 결제 버튼: `<a href="/order/orderform.html">결제하기</a>`

### checkout.html
- 배송지 폼: `{$receiver_name}`, `{$receiver_address}`, `{$receiver_cellphone}`
- 결제 수단: 카페24 PG 위젯 자동 (카드/실시간계좌이체/무통장/카카오페이/네이버페이 모두 지원)
- 쿠폰/적립금: 카페24 기본 기능 (`{$coupon_list}`, `{$mileage_input}`)
- Toss Payments 직접 연동 코드는 **모두 제거** — 카페24가 PG 처리

### login.html
- 카카오 로그인 버튼은 유지하되 카페24 부가서비스 "카카오 로그인" 설치 후 안내 URL로 교체:
  `<a href="/exec/front/Member/SocialLogin/?provider=kakao">`
- 일반 로그인 폼 추가 권장 (카페24 표준)

### mypage.html
- 주문 내역: `<module id="Myshop_OrderList">`
- 위시리스트: `<module id="Myshop_Wishlist">`
- 적립금/등급: 카페24 기본 데이터

## 🧹 제거 / 버려야 할 것

HTML 안에 남은 Next.js / 우리 커스텀 흔적은 카페24에서 무의미하므로 정리 필요:

- `<div hidden></div>` — React placeholder
- `data-editable` 속성 (어드민 CMS 전용)
- `/admin/*` 관련 링크 (카페24 관리자에서 처리)
- Supabase Auth 로그인 링크 (카페24 로그인으로 교체)
- `/api/upload`, `/api/payment/confirm` 호출 (카페24 기본 기능으로 대체)
- `/api/test-only/*` (테스트 전용)

## 📊 이식 후 확인 체크리스트

- [ ] 각 페이지 모바일/PC 레이아웃 깨짐 없음
- [ ] 상품 카드 반복이 정상 작동 (카페24 더미 상품 1개 등록 후 확인)
- [ ] 상품 상세 이미지 갤러리 작동
- [ ] 장바구니 추가/수량 변경/삭제
- [ ] 결제 플로우 (테스트 결제)
- [ ] 회원가입 → 로그인 → 마이페이지 이동
- [ ] 리뷰/Q&A 작성 및 노출
- [ ] 카카오 로그인 연동
- [ ] SEO 메타 태그 (`<title>`, `<meta name="description">`)
- [ ] 파비콘 업로드
- [ ] Google Analytics / Pixel 재삽입

## 🔁 데이터 이관 (별도)

이 폴더는 **디자인 이식용**. 데이터 이관은 별도 파일 `DATA_MIGRATION.md` 참고 (TBD):
- 상품 `products` + `product_options` → 카페24 CSV
- 회원 `profiles` → 카페24 회원 이관 (고객센터 문의, 개인정보 동의 필수)
- 리뷰 `reviews` → 카페24 리뷰 CSV
- 주문 `orders` → 이관 비권장 (기존은 Supabase 참조용 유지)

## 🛠️ 재생성 방법

HTML이 갱신되면 다시 추출:

```bash
# 1. 프로덕션 페이지 fetch
mkdir -p /tmp/ballabom-raw
for p in "/:main" "/products:product-list" "/product/cheonga-ampoule:product-detail" ...; do
  curl -sSL "https://ballabom.com${p%%:*}" -o "/tmp/ballabom-raw/${p##*:}.html"
done

# 2. 정리 스크립트 실행
cd docs/cafe24-migration
for f in /tmp/ballabom-raw/*.html; do
  node clean-html.mjs "$f" "pages/$(basename "$f" .html).html" "$(basename "$f" .html)"
done
```

## 💰 비용 예산

| 항목 | 예상 비용 |
|------|-----------|
| 카페24 표준형 | 33,000원/월 |
| 스마트디자인 Easy | 무료 |
| PG 수수료 | 카드 3.0% + VAT |
| 카카오 로그인 부가서비스 | 무료 |
| 도메인 이전 | 등록비 없음 (DNS만 변경) |
| 이식 개발 (외주 시) | 300~500만원 |
| 이식 개발 (자체) | ~80시간 |
