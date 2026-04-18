# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# BALLABOM (manshard) — 프로젝트 가이드

## 프로젝트 개요

**BALLABOM** — 남성 스킨케어 브랜드 쇼핑몰
- 기술 스택: Next.js 16 (App Router) + React 19 + TypeScript + Supabase + Tailwind CSS v4
- 결제: Toss Payments
- 인증: Supabase Auth (카카오 OAuth)
- 배포: Vercel (`vercel --prod`) → ballabom.com

---

## 기술 스택

| 항목 | 버전/내용 |
|------|-----------|
| Next.js | 16.1.5 (App Router) |
| React | 19.2.3 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Supabase | @supabase/ssr + @supabase/supabase-js |
| 상태관리 | Zustand 5 (장바구니 — localStorage persist) |
| UI | shadcn/ui (Radix UI 기반) |
| 애니메이션 | Framer Motion 12 |
| 결제 | @tosspayments/payment-widget-sdk |
| 주소검색 | react-daum-postcode |
| 아이콘 | lucide-react |
| 캐러셀 | embla-carousel-react |

---

## 디렉토리 구조

```
manshard/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root 레이아웃 (카카오 SDK 전역 초기화)
│   │   ├── globals.css
│   │   ├── (shop)/                     # 쇼핑몰 라우트 그룹
│   │   │   ├── layout.tsx              # TopBanner + Navbar + Footer + FloatingCS/Review + KakaoChannelFollow
│   │   │   ├── page.tsx                # 홈 (HeroCarousel, 쿠폰, 인기상품, 브랜드스토리)
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── products/page.tsx       # 상품 목록 (정렬/필터)
│   │   │   ├── product/
│   │   │   │   ├── [id]/page.tsx       # 동적 상품 상세
│   │   │   │   └── cheonga-ampoule/page.tsx  # 고정 상품 페이지
│   │   │   ├── login/page.tsx          # 카카오 로그인
│   │   │   ├── mypage/page.tsx         # 마이페이지
│   │   │   ├── payment/
│   │   │   │   ├── success/page.tsx    # 결제 성공
│   │   │   │   └── fail/page.tsx       # 결제 실패
│   │   │   ├── story/page.tsx          # 브랜드 스토리
│   │   │   ├── crew-lounge/page.tsx    # 크루 라운지
│   │   │   ├── event/page.tsx
│   │   │   └── notice/page.tsx
│   │   ├── admin/                      # 어드민 (주문관리, 콘텐츠CMS)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── content/page.tsx
│   │   └── auth/
│   │       └── callback/route.ts       # OAuth 콜백 + 신규회원 감지
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── TopBanner.tsx               # 가입 유도 상단 배너
│   │   ├── HeroCarousel.tsx
│   │   ├── FeaturedProduct.tsx
│   │   ├── BrandStory.tsx
│   │   ├── CollectionGrid.tsx
│   │   ├── MediaSection.tsx
│   │   ├── TrustSection.tsx
│   │   ├── CouponSection.tsx
│   │   ├── SocialLoginCTA.tsx
│   │   ├── ProductDetailClient.tsx     # 상품 상세 (이미지, 옵션, 수량, 장바구니)
│   │   ├── ProductDetailTabs.tsx       # 상세/리뷰/Q&A 탭
│   │   ├── ProductPage.tsx
│   │   ├── ProductSort.tsx
│   │   ├── PurchaseGuide.tsx
│   │   ├── ReviewSection.tsx           # 리뷰 목록 + 작성폼 (이미지 첨부 포함)
│   │   ├── QnaSection.tsx
│   │   ├── WishlistButton.tsx
│   │   ├── FloatingCS.tsx              # 우측 하단 상담 플로팅 버튼
│   │   ├── FloatingReview.tsx          # 좌측 하단 리뷰 플로팅
│   │   ├── KakaoChannelFollow.tsx      # 신규 회원 카카오 채널 자동 팔로우
│   │   └── ui/                         # shadcn/ui 컴포넌트
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── scroll-area.tsx
│   │       └── tabs.tsx
│   ├── lib/
│   │   ├── products.ts                 # Supabase 쿼리 함수 (getProducts, getProductReviews 등)
│   │   └── utils.ts
│   ├── store/
│   │   └── cartStore.ts                # Zustand 장바구니 (localStorage persist)
│   ├── types/
│   │   └── product.ts                  # Product, ProductOption, Review, QnaItem, Wishlist
│   └── utils/supabase/
│       ├── client.ts                   # 클라이언트 Supabase 인스턴스
│       └── server.ts                   # 서버 Supabase 인스턴스 (cookies 기반)
├── supabase/
│   └── schema.sql                      # DB 스키마 전체
├── .env.local
├── next.config.ts
├── tailwind.config (postcss.config.mjs 방식)
└── components.json                     # shadcn/ui 설정
```

---

## 환경 변수 (.env.local)

```env
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://felhhgifnqsnxlnefnvx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 미설정 (구현 예정)
# TOSS_CLIENT_KEY=...
# TOSS_SECRET_KEY=...
# BIZGO_API_ID=...
# BIZGO_API_PASSWORD=...
# BIZGO_SENDER_KEY=...
# BIZGO_TEMPLATE_CODE=...
# BIZGO_FROM_NUMBER=...
```

---

## Supabase DB 스키마

### 테이블

| 테이블 | 용도 | 주요 컬럼 |
|--------|------|-----------|
| `profiles` | 사용자 프로필 | id, full_name, phone, default_address, role |
| `products` | 상품 | id, name, price, original_price, images[], is_active, rank |
| `product_options` | 상품 옵션 | id, product_id, name, price, original_price, tag, sort_order |
| `orders` | 주문 | id, user_id, payment_key, status, receiver_*, address* |
| `reviews` | 리뷰 | id, user_id, product_id, rating, body, images[], is_verified |
| `wishlists` | 위시리스트 | id, user_id, product_id |
| `site_content` | CMS | section, key, value_type, value_content |

### Supabase Storage
- `review-images` 버킷 — Public, RLS 정책 적용 (인증 사용자만 업로드, 누구나 조회)
- `product-images` 버킷 — 상품 이미지 업로드용
- `public-images` 버킷 — CMS 이미지 업로드용 (히어로 배너, 브랜드 스토리 등)

### Trigger
- `handle_new_user()` — 신규 회원 가입 시 `profiles` 자동 생성

---

## 구현 완료 기능

### 인증
- [x] 카카오 소셜 로그인 (Supabase OAuth)
- [x] OAuth 콜백 처리 (`auth/callback/route.ts`)
- [x] 신규 회원 감지 (created_at vs last_sign_in_at 5초 이내 차이 → `?new_member=1` 파라미터)
- [x] 신규 회원 카카오 채널 자동 팔로우 (`KakaoChannelFollow.tsx`, 채널 ID: `_kcxfRX`)

### 상품
- [x] 상품 목록 페이지 (정렬/필터)
- [x] 상품 상세 페이지 (동적 라우팅)
- [x] 상품 이미지 갤러리 (썸네일 스크롤, 메인 이미지 전환)
- [x] 상품 옵션 선택 (드롭다운 애니메이션)
- [x] 수량 선택 (터치 타겟 44px)
- [x] 위시리스트

### 장바구니/결제
- [x] 장바구니 (Zustand + localStorage)
- [x] 결제 페이지 (Toss Payments SDK 연동 구조)
- [x] 결제 성공/실패 처리 페이지

### 리뷰
- [x] 리뷰 목록 표시 (별점, 구매확인 뱃지, 이미지)
- [x] 리뷰 작성 폼 (별점 선택, 텍스트)
- [x] 리뷰 이미지 첨부 (최대 5장, 5MB, JPG/PNG/WEBP/HEIC)
- [x] 이미지 Supabase Storage 업로드 (`review-images` 버킷)

### Q&A
- [x] Q&A 목록/작성

### 어드민
- [x] 대시보드 (실시간 KPI: 오늘 주문/이번달 매출/처리대기/전체 회원 + 최근 주문 8건)
- [x] 주문 관리 페이지 (목록 + 상태 변경)
- [x] 상품 관리 페이지 (`/admin/products`) — 판매중/숨김 토글, 옵션 인라인 편집
- [x] 리뷰 관리 페이지 (`/admin/reviews`) — 구매확인 토글, 삭제, 필터
- [x] 회원 관리 페이지 (`/admin/members`) — 목록 조회, 검색, 관리자 권한 토글
- [x] 콘텐츠 CMS — 비주얼 섹션 에디터 (`/admin/content` → `ContentClient.tsx`)
  - 히어로 배너 3개, 상단 배너, 브랜드 스토리, 신뢰 배지 관리
  - 이미지 업로드 프리뷰, 인라인 텍스트 편집
  - 프론트엔드 자동 연동 (`src/lib/content.ts` → 각 컴포넌트 CMS props)

### 퍼포먼스 최적화 (2026-04-16 완료)
- [x] 64MB 미사용 JPG 원본 삭제 (`public/images/products/` 원본 3개)
- [x] shop layout.tsx → Server Component 전환 (`'use client'` 제거)
- [x] 폰트 중복 로드 제거 (Inter 폰트 + Pretendard static 이중 로드 → Variable만 유지)
- [x] ProductPage `<img>` → `next/image` 전환 (19개, 자동 WebP + lazy loading)
- [x] Footer, BestProductsSection, BrandStory, TrustBar — `'use client'` 제거 → Server Component
- [x] FloatingCS — framer-motion 제거 → CSS transition 대체
- [x] MediaSection — 클라이언트 Supabase 호출 제거 → 서버 데이터 `serverReviews` prop으로 전달
- [x] FloatingReview — Supabase 실제 리뷰 연동 (DB 비면 자동 숨김)
- [x] 홈 page.tsx — CMS + 리뷰 데이터 서버에서 `Promise.all` 병렬 페칭
- [x] CMS 유틸리티 (`src/lib/content.ts`) — `getSectionContent`, `getMultipleSectionContents`

### HeroCarousel 개선 (2026-04-16 완료)
- [x] 자동 슬라이드 제거 (수동 넘기기만 가능)
- [x] 애니메이션 개선: spring → crossfade + 미세 스케일 (cubic-bezier 0.5s)
- [x] `mode="wait"` → `mode="popLayout"` (exit/enter 동시 실행 → 끊김 제거)
- [x] 슬라이드 클릭 → `/product/cheonga-ampoule` 이동 (드래그 시 미작동)
- [x] 모든 슬라이드 CTA → 단일 상품 링크로 통일

### 기타
- [x] 카카오 JS SDK 전역 로드 (`layout.tsx`)
- [x] 모바일 반응형 (ProductDetailClient 360px/390px 대응)
- [x] Toss Payments 연동 완료 (테스트 키 적용, 서버 승인 API: `/api/payment/confirm`)
- [x] 이용약관 페이지 (`/terms`)
- [x] 개인정보처리방침 페이지 (`/privacy`)
- [x] next.config.ts Supabase Storage 호스트 등록

---

## 이미지 가이드라인

쇼핑몰 표준에 맞춘 권장 사양. 어드민 업로드 페이지(`/admin/products`, `/admin/content`)에도 동일한 안내가 노출됨.

### 상품 썸네일 (`product-images` 버킷)

| 항목 | 값 |
|------|---|
| 비율 | **1:1 정사각** (필수) |
| 권장 크기 | 1200×1200px (Retina 대응) |
| 최소 크기 | 800×800px |
| 포맷 우선순위 | WebP > JPG > PNG > HEIC |
| 권장 용량 | 200KB 이하 |
| 최대 용량 | 10MB (서버 한도) |
| 배경 | 흰색(#FFFFFF) 또는 단색 (브랜드 톤 유지) |
| 여백 | 사방 5~10% (제품이 화면을 꽉 채우지 않도록) |
| 첫 이미지 | **대표 썸네일**로 자동 사용 — 가장 인지도 높은 컷 우선 |

### 히어로 배너 (`public-images/hero-*`)

| 항목 | 값 |
|------|---|
| 비율 | 2:1 (가로형) |
| 크기 | 1920×960px (데스크탑) |
| 모바일 자동 트림 | `next/image` `sizes` 속성 적용 |
| 용량 | 200KB 이하 (실측 16~61KB) |
| 포맷 | WebP 필수 (AVIF 자동 fallback) |

### 브랜드 스토리 / 보조 배너

| 항목 | 값 |
|------|---|
| 비율 | 16:9 (1600×900px) |
| 용량 | 300KB 이하 |
| 포맷 | WebP / JPG |

### 리뷰 이미지 (`review-images` 버킷)

- 사용자 업로드, 자동 검증
- 최대 5장 / 5MB per file
- 허용: JPG, PNG, WEBP, HEIC

### 최적화 워크플로

업로드 전 로컬에서 압축 권장 (이전 세션 sharp 활용 예시 참고):
```bash
# WebP 변환 + 리사이즈
sharp input.jpg --resize 1200,1200 --webp '{"quality":80}' -o output.webp

# JPG mozjpeg 압축
sharp input.jpg --jpeg '{"quality":75,"mozjpeg":true}' -o output.jpg
```

next.config.ts에 AVIF/WebP 자동 변환이 설정되어 있어, JPG로 올려도 브라우저 지원 시 AVIF/WebP가 서빙됨.

---

## 미구현 / 진행 중

### 알림톡 연동
신규 회원 가입 시 카카오 알림톡 자동 발송 (Infobank)

- 코드 위치: `src/lib/alimtalk.ts`, `app/auth/callback/route.ts`
- 환경변수 미설정 상태 → 현재 스킵됨
```env
INFOBANK_API_KEY=
INFOBANK_SENDER_KEY=
INFOBANK_TEMPLATE_CODE=
```

### 프론트엔드 미완 (P1)
- [ ] 모바일 네비게이션 메뉴 (햄버거 → 슬라이드 메뉴) — `Navbar.tsx`
- [ ] BestProductsSection 360px 오버플로 수정 — `BestProductsSection.tsx`
- [ ] HeroCarousel 360px 패딩/폰트 조정 — `HeroCarousel.tsx`
- [ ] Footer 링크 `#` → 실제 경로 연결 — `Footer.tsx`
- [ ] FloatingCS 카카오 채팅 링크 연결 — `FloatingCS.tsx`
- [ ] TopBanner 닫기 상태 localStorage persist — `TopBanner.tsx`

### 추가 최적화 (P2)
- [ ] framer-motion 추가 제거 가능 (현재 HeroCarousel만 사용, ~173KB)
- [ ] reviews 테이블 실제 데이터 투입 필요 (현재 비어있을 수 있음)
- [ ] Q&A 테이블 SQL — Supabase 대시보드에서 직접 실행 필요
- [ ] `KakaoChannelFollow.tsx` — 알림톡 전환 시 제거 검토

### 아키텍처 주의사항
- shop layout.tsx를 async로 만들면 **모든** 하위 라우트가 Dynamic(ƒ)으로 전환됨 → 데이터 페칭은 page.tsx에서만
- TopBanner는 layout에서 렌더되므로 자체 클라이언트 CMS 페칭 유지 (경량)

---

## 코딩 컨벤션

- **모바일 퍼스트** — 기본 스타일은 360px 기준, `md:` 이상으로 PC 확장
- **터치 타겟** 최소 44px (`h-11`)
- `'use client'` 최상단에 명시
- Supabase 서버 컴포넌트는 `utils/supabase/server.ts`, 클라이언트는 `utils/supabase/client.ts`
- 타입은 `src/types/product.ts`에 통합 관리
- 신규 컴포넌트는 `src/components/`에 추가

---

## 로컬 개발

```bash
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 배포

```bash
vercel --prod    # ballabom.com 으로 배포 (Vercel CLI)
```

## 주의사항

- `next/image` 사용 시 외부 이미지 호스트는 `next.config.ts`의 `remotePatterns`에 추가 필요 (현재 `images.unsplash.com`, `felhhgifnqsnxlnefnvx.supabase.co` 허용)
- Supabase Storage `review-images` 버킷 — Public 버킷, 업로드는 인증된 사용자만 가능
- 장바구니 상태는 `localStorage`에 persist됨 (Zustand `persist` 미들웨어)
- Server Component에서 Supabase 사용 시 반드시 `utils/supabase/server.ts`의 `createClient()` (async) 사용
