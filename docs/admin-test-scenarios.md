# 어드민 페이지 테스트 시나리오

**범위**: `/admin` 이하 모든 페이지의 QA 체크리스트.
**실행 방식**: 관리자 계정(`profiles.role='admin'`)으로 로그인 후 수동 검증.
**자동화**: E2E 스켈레톤은 `e2e/08-auth-flows.spec.ts` 기반. 시나리오별 확장 포인트를 각 섹션에 표시.

---

## 0. 공통 전제조건

| 항목 | 값 |
|------|---|
| 테스트 URL | `http://localhost:3000` (로컬) / `https://ballabom.com` (프로덕션) |
| 관리자 계정 | Supabase Auth에서 `profiles.role = 'admin'` 설정된 카카오 계정 |
| 일반 계정 | `profiles.role = 'user'` 계정 (권한 가드 검증용) |
| 테스트 이미지 | JPG 1MB / PNG 2MB / WebP 500KB / 10MB+ 초과본 각 1개 |
| 브라우저 | Chrome 최신, Safari(모바일), 데스크탑 + 모바일(390px) |

### P0: 권한 가드 (모든 페이지 공통)

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| GUARD-1 | 비로그인 상태로 `/admin/*` 직접 접근 | `/login`으로 리디렉션 |
| GUARD-2 | 일반 회원(`role='user'`)으로 `/admin` 접근 | `/` 로 리디렉션 |
| GUARD-3 | 관리자 로그인 상태에서 모든 서브페이지 진입 | 200 응답, 콘텐츠 렌더링 |
| GUARD-4 | 관리자 로그아웃 후 바로 `/admin` 접근 | `/login`으로 리디렉션 (세션 쿠키 정리 확인) |

> 자동화: `e2e/08-auth-flows.spec.ts` — 이미 커버됨

---

## 1. 대시보드 `/admin`

### 1.1 KPI 표시

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| DASH-1 | 오늘 주문 수 카드 표시 | 오늘 00:00 이후 `orders` row 수와 일치 |
| DASH-2 | 이번달 매출 카드 | 이번 달 `status IN ('PAID','DELIVERED')` 주문의 total_amount 합 |
| DASH-3 | 처리대기(PENDING/PREPARING) 카드 | 해당 상태 주문 수 |
| DASH-4 | 전체 회원 카드 | `profiles` row 수 |

### 1.2 최근 주문 8건

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| DASH-5 | 최근 주문 리스트 최대 8건 | created_at DESC 정렬 |
| DASH-6 | 주문 없음 상태 (빈 DB) | 빈 상태 메시지, 에러 없음 |
| DASH-7 | 주문 클릭 | `/admin/orders?focus=<id>` 또는 상세 이동 (구현 확인) |

### 1.3 엣지

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| DASH-8 | 데이터 0건에서도 렌더 | "0" 카드 정상, crash 없음 |
| DASH-9 | 큰 숫자 (10만원+) | `toLocaleString()` 포맷 확인 |

---

## 2. 주문 관리 `/admin/orders`

### 2.1 목록 & 필터

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| ORDER-1 | 전체 주문 리스트 표시 | created_at DESC, 페이지네이션 동작 |
| ORDER-2 | 상태별 색상 배지 | PAID/DELIVERED=초록, PENDING=노랑, SHIPPING/PREPARING=파랑, CANCELLED/REFUNDED=빨강 |
| ORDER-3 | 검색창(있다면) | 주문번호/수령인/전화번호 부분 일치 |

### 2.2 상태 변경

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| ORDER-4 | 상태 드롭다운 변경 | `orders.status` UPDATE, 즉시 배지 색상 반영 |
| ORDER-5 | 잘못된 상태 전이(PAID→PENDING) | 정책에 따라 허용/차단 — 현재 제약 없음, 의도대로 동작하는지 확인 |
| ORDER-6 | 네트워크 오류 중 변경 | 에러 알림, UI rollback |

### 2.3 상세

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| ORDER-7 | 배송지/수령인/전화/요청사항 표시 | DB 값과 일치 |
| ORDER-8 | 주문 아이템 표시 | 옵션명, 수량, 단가, 소계 |
| ORDER-9 | 결제 정보 | payment_key, 결제 금액, 결제 시각 |

---

## 3. 상품 관리 `/admin/products`

### 3.1 목록 & 토글

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| PROD-1 | 전체 상품 카드 표시 | rank/sort 순서 |
| PROD-2 | 판매중/숨김 토글 클릭 | `products.is_active` 반전, 눈/눈가림 아이콘 전환 |
| PROD-3 | 숨김 상품이 `/products`에 노출 X | 쇼핑몰 페이지에서 필터링 확인 |

### 3.2 상품 정보 편집

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| PROD-4 | 연필 아이콘 → 편집 모드 | name/price/original_price/description 입력 가능 |
| PROD-5 | 저장 클릭 | DB UPDATE, 성공 토스트, 편집 모드 종료 |
| PROD-6 | 취소 클릭 | 원래 값 유지, 편집 모드 종료 |
| PROD-7 | price에 음수/문자 입력 | 검증 or 타입 강제 (Number conversion) |

### 3.3 이미지 업로드 ⚠️ (현재 알려진 이슈)

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| PROD-8 | JPG 1MB 업로드 | Supabase `product-images`에 저장, 썸네일 노출 |
| PROD-9 | PNG/WebP 업로드 | 동일 |
| PROD-10 | 10MB 초과 파일 | 클라이언트 거부 또는 서버 413, 에러 메시지 |
| PROD-11 | 여러 파일 동시 선택 | 전부 업로드, 순서 유지 |
| PROD-12 | 이미지 삭제(X 버튼) | `products.images`에서 제거, Storage 파일은 남음(의도적) |
| PROD-13 | **첫 이미지 = 대표** | `/products`와 `/product/[id]`에서 첫 번째 이미지가 대표 표시 |
| PROD-14 | **권장 사양 안내** | "1:1, 1200x1200px, WebP" 가이드 카드 표시 |
| PROD-15 | **RLS 실패 케이스** | `product-images` 버킷 or `products` 테이블에 admin 정책 누락 시 "업로드 실패" alert. **현재 이 시나리오가 재현되는 것으로 보임** → `/api/upload`로 통일 추천 |

### 3.4 옵션 관리

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| PROD-16 | 옵션 필드 인라인 편집(name/price/tag) | `product_options.<field>` UPDATE |
| PROD-17 | 옵션 추가 | 새 row, sort_order 자동 할당 |
| PROD-18 | 옵션 삭제 | DELETE, 이 옵션을 참조하는 주문은 보존 |

---

## 4. 리뷰 관리 `/admin/reviews`

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| REV-1 | 전체 리뷰 리스트 | created_at DESC |
| REV-2 | 필터 (all / verified / unverified) | 토글 시 즉시 필터링 |
| REV-3 | 구매확인(verified) 토글 | `reviews.is_verified` 반전 |
| REV-4 | 리뷰 삭제 | confirm dialog → DELETE, 리스트 즉시 제거 |
| REV-5 | 이미지 포함 리뷰 | 썸네일 표시, 클릭 시 확대(구현 시) |
| REV-6 | 리뷰 0건 | 빈 상태 메시지 |
| REV-7 | 매우 긴 본문 (10000자+) | 레이아웃 깨짐 없음, truncate 또는 스크롤 |

---

## 5. 회원 관리 `/admin/members`

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| MEM-1 | 회원 리스트 + 관리자 수 카운트 | 상단 통계 정확 |
| MEM-2 | 검색 (이름/이메일/전화) | 부분 일치 필터링 |
| MEM-3 | 관리자 토글 클릭 | confirm → `profiles.role` 변경, 배지 색 전환 |
| MEM-4 | 자기 자신을 user로 강등 | 허용됨 — **주의**: 강등 후 /admin 새로고침 시 / 로 튕김. 실수 방지 경고? |
| MEM-5 | 관리자 1명 남은 상태에서 강등 | 의도 확인 필요 (시스템 어드민 없어짐) |

---

## 6. 콘텐츠 CMS `/admin/content`

### 6.1 비주얼 에디터

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| CMS-1 | 에디터 탭 전환 (히어로/탑배너/브랜드스토리/신뢰배지) | 해당 섹션만 표시 |
| CMS-2 | 텍스트 더블클릭 → 편집 | contentEditable 활성, Enter/Blur로 저장 |
| CMS-3 | 텍스트 Ctrl+Z | 브라우저 기본 undo 동작 |
| CMS-4 | 이미지 끌어놓기 | `/api/upload` 호출 → public-images 버킷 업로드 → `site_content` upsert → 즉시 반영 |
| CMS-5 | 이미지 업로드 실패 | 에러 alert, 로딩 스피너 종료 |
| CMS-6 | 레이아웃 드래그 이동 | layouts state 업데이트, "전체 저장" 시 DB 반영 |
| CMS-7 | "초기화" 버튼 | 해당 섹션 로컬 변경 롤백 |

### 6.2 저장

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| CMS-8 | "전체 저장" 클릭 | 모든 섹션 layout + content UPSERT, 성공 메시지 |
| CMS-9 | 저장 중 중복 클릭 | 버튼 disabled, 중복 요청 차단 |
| CMS-10 | 네트워크 오류 | 에러 메시지, 로컬 변경 유지 (재시도 가능) |

### 6.3 프론트 반영

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| CMS-11 | 히어로 배너 교체 후 `/` | 새 이미지 표시 (캐시 무효화 포함) |
| CMS-12 | 탑배너 문구 변경 | 모든 페이지 `(shop)/layout.tsx` 영역 반영 |
| CMS-13 | 브랜드 스토리 이미지 교체 | `/story` 페이지 반영 |
| CMS-14 | **권장 사양 배너** | 에디터 상단에 이미지 종류별 권장 크기 노출 |

### 6.4 이미지 URL 검증

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| CMS-15 | 업로드 직후 URL | `https://felhhgifnqsnxlnefnvx.supabase.co/storage/v1/object/public/public-images/...` |
| CMS-16 | next.config.ts remotePatterns | 해당 호스트 허용되어 있어 `next/image` 정상 동작 |

---

## 7. 크로스 페이지 / 회귀 검증

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| XREG-1 | 상품 새로 생성 → 이미지 업로드 → `/products` 새로고침 | 즉시 노출 |
| XREG-2 | 상품 숨김 → `/products` | 노출 안 됨 |
| XREG-3 | 리뷰 verified 토글 → `/product/[id]` | 구매확인 배지 갱신 |
| XREG-4 | 회원 관리자 승격 → 그 회원 `/admin` 접근 | 권한 통과 |
| XREG-5 | CMS 히어로 변경 → 홈 모바일 뷰 | 레이아웃 안전, 오버플로 없음 |

---

## 8. 보안 / 권한

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| SEC-1 | 비인증 상태로 `POST /api/upload` | 401 |
| SEC-2 | 일반 회원으로 `POST /api/upload` (bucket=product-images) | 200 (현재 모든 인증 사용자 허용) — **정책 고려**: admin만 업로드하도록 가드 추가 검토 |
| SEC-3 | 허용 안 된 버킷 (`private-xyz`) | 400 |
| SEC-4 | 파일 없이 `/api/upload` | 400 |
| SEC-5 | `/api/test-only/login` 프로덕션 | 404 (middleware + NODE_ENV 가드) |
| SEC-6 | `NEXT_PUBLIC_SUPABASE_ANON_KEY`만으로 service_role 시도 | 실패 (보안 정상) |

---

## 9. 모바일 / 반응형

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| MOB-1 | 어드민 사이드바(w-64) 모바일(390px) | 현재 고정 사이드바 — **모바일 미지원 상태**. 햄버거/오프캔버스 전환 필요 |
| MOB-2 | 상품 이미지 업로드 버튼 | 터치 타겟 44px 이상 |
| MOB-3 | 에디터 이미지 드래그앤드롭 | 모바일 터치 이벤트 대응 여부 |

> **알려진 제약**: 어드민 UI는 현재 데스크탑 전용(≥1024px). 모바일 최적화는 P2 과제.

---

## 10. 에러 / 로깅

| # | 시나리오 | 기대 결과 |
|---|---------|----------|
| ERR-1 | 브라우저 콘솔 | 에러 0개 (경고는 무관) |
| ERR-2 | Supabase rate limit 초과 | 429 처리, 사용자 안내 |
| ERR-3 | 오랫동안 편집 후 저장 (세션 만료) | 자동 토큰 갱신 또는 재로그인 안내 |

---

## 자동화 매핑

| 페이지 | 기존 E2E | 신규 제안 |
|--------|---------|-----------|
| /admin | `08-auth-flows` 접근 확인 | KPI 숫자 렌더 assertion |
| /admin/orders | 접근만 | 상태 드롭다운 변경 → DB 반영 |
| /admin/products | 접근만 | **이미지 업로드 전체 플로우** (P1) |
| /admin/reviews | 접근만 | 구매확인 토글, 삭제 (데이터 준비 필요) |
| /admin/members | 접근만 | 관리자 토글 (테스트 계정 롤백 필수) |
| /admin/content | 접근만 | 이미지 드래그 업로드, 텍스트 편집, 저장 |

자동화 추가 시 `e2e/15-admin-crud.spec.ts` 같은 파일에 그룹화. **DB 격리 필요**:
- 전용 테스트 프로젝트(Supabase 별도 인스턴스) 또는
- 테스트 후 seed/cleanup 트랜잭션
- `E2E_TEST_ONLY` 플래그로 구분된 테스트 상품/리뷰만 조작

---

## 실행 팁

### 빠른 smoke (5분)
GUARD-1~4 → DASH-1 → ORDER-4 → PROD-2, PROD-8 → REV-3 → MEM-3 → CMS-4

### 릴리스 전 전체 (45~60분)
모든 섹션 순서대로. P0/P1 실패 시 릴리스 차단.

### 우선순위
- **P0** (릴리스 차단): GUARD, SEC-1/3/5, DASH-1~4, ORDER-4, PROD-15, CMS-4/8
- **P1** (주요 기능): PROD-4/5/8/13, REV-3/4, MEM-3, CMS-11~13
- **P2** (부가/UX): MOB, PROD-7, REV-7, CMS-3
