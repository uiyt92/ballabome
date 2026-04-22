#!/usr/bin/env node
/**
 * 카페24 이식용 HTML 정리 스크립트
 *
 * 입력: curl로 받은 프로덕션 HTML
 * 출력: Next.js 런타임 코드 제거 + 이미지 경로 정상화된 깔끔한 HTML
 *
 * Usage: node clean-html.mjs input.html output.html PAGE_LABEL
 */

import fs from 'node:fs'

const [, , inputPath, outputPath, label = 'PAGE'] = process.argv
if (!inputPath || !outputPath) {
    console.error('Usage: node clean-html.mjs <input.html> <output.html> [label]')
    process.exit(1)
}

let html = fs.readFileSync(inputPath, 'utf8')

// 1. <script>...</script> 전부 제거 (hydration/RSC payload 포함)
html = html.replace(/<script\b[\s\S]*?<\/script>/gi, '')

// 2. Next.js preload/prefetch 태그 제거
html = html.replace(/<link[^>]*rel="(preload|prefetch|modulepreload)"[^>]*\/?>/gi, '')

// 3. noscript 내부에 있는 Next 트래커 제거 (noscript 자체는 유지)
html = html.replace(/<noscript[^>]*>.*?<\/noscript>/gi, '')

// 4. /_next/image?url=%2Fimages%2Fxxx&w=...&q=... → /images/xxx (상대 경로)
html = html.replace(/\/_next\/image\?[^"'\s]*url=([^&"'\s]+)[^"'\s]*/g, (_, u) => {
    try { return decodeURIComponent(u) } catch { return u }
})

// 5. srcset도 동일 처리
html = html.replace(/srcset="([^"]+)"/g, (m, srcset) => {
    const cleaned = srcset
        .split(',')
        .map(entry => entry.trim().split(/\s+/)[0])
        .map(url => {
            const match = url.match(/\/_next\/image\?[^"'\s]*url=([^&"'\s]+)/)
            if (match) {
                try { return decodeURIComponent(match[1]) } catch { return url }
            }
            return url
        })
    // srcset 제거하고 src만 남기는 게 카페24에서 더 안전
    return `srcset="${cleaned[0] || ''}"`
})

// 6. data-* 속성 중 Next 특유의 것 제거
html = html.replace(/\s+data-next[^\s=>]*="[^"]*"/g, '')
html = html.replace(/\s+data-sentry[^\s=>]*="[^"]*"/g, '')

// 7. Supabase Storage URL은 그대로 유지 (카페24에서도 CDN으로 사용 가능)

// 8. 상단 주석 추가
const banner = `<!--
  ============================================================================
  카페24 SmartDesign Easy 이식용 HTML — ${label}
  원본: ballabom.com (Next.js 16 + Tailwind v4)
  ============================================================================

  이 파일을 카페24에 붙여넣을 때 교체할 부분:

  1. <head>의 CSS link를 카페24 업로드 경로로 변경
     <link rel="stylesheet" href="/web/upload/styles/ballabom.css">

  2. 동적 데이터 자리에 카페24 변수 삽입
     - 상품명          → {$product_name}
     - 가격            → {$price}
     - 이미지(중형)    → {$image_medium}
     - 상품 상세 URL   → {$product_link}
     - 상품 번호       → {$product_no}
     - 회원 ID         → {$member_id}
     - 회원명          → {$name}

  3. 반복(상품 목록) 영역은 <module id="xxx"> 블록으로 감쌈
     <module id="product_listmain_1">
       <!-- 반복될 카드 HTML -->
     </module>

  4. 이미지 경로: /images/... 또는 Supabase URL
     → 카페24 관리자 > 파일 관리자에서 업로드 후 경로 재매핑
  ============================================================================
-->

`
html = banner + html

fs.writeFileSync(outputPath, html)
console.log(`✓ ${label}: ${html.length.toLocaleString()} chars → ${outputPath}`)
