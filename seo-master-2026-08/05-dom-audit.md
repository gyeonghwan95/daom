# 05 DOM audit

기준: production HTML 2026-08-30 (`scripts/seo-master-2026-08-audit.ts`)  
코드: `src/app/loading.tsx`, `src/app/layout.tsx`, `src/components/layout/PageContainer.tsx`

## 필수 재검증 — `/부산법무사상담` · `/부산등기법무사`

| 항목 | `/부산법무사상담` | `/부산등기법무사` |
|---|---|---|
| ① `페이지를 불러오는 중입니다`가 H1보다 먼저? | **아니오** (`loadingPhrase=false`) | **아니오** |
| ② Footer/사업자정보가 Article보다 먼저? | **아니오** (`footerBeforeH1=false`, `footerBeforeMain=false`) | **아니오** |
| ③ 같은 상담 상태문구 연속 렌더? | 헤더 상태 `현재 카카오·네이버톡톡만 가능` 4회 (영업시간 외 SSR). Footer-before-H1 아님 | 동일 4회 |
| ④ PC/Mobile 이중 DOM 후 CSS 숨김? | 상담 페이지 ComparisonTable이 카드+표 이중 DOM이었음 → **단일 table로 변경** | 허브는 카드 그리드 단일 DOM |
| ⑤ carousel clone SEO 복제? | 본문 캐러셀 없음 | 본문 캐러셀 없음 |

## 레이아웃 근거

- `loading.tsx`는 `null`을 반환. 스켈레톤 문구를 최초 HTML에 넣지 않음.
- `PageSkeleton`의 “페이지를 불러오는 중입니다”는 컴포넌트만 존재하고 페이지에서 import되지 않음.
- `NavigationProgress`는 client-only. 정적 HTML에 로딩 H1이 없음.
- Footer는 `PageContainer` → `SiteChromeAfterMain`으로 **main 뒤**.
- 핵심 본문(SelectionHub / RegistryHub)은 서버 컴포넌트. H1·첫 문단이 최초 HTML에 존재.

## H1 / Canonical

P0 14 URL 전부 `h1Count=1`, self-canonical(punycode 호스트), `robots=index, follow`.  
서로 다른 고유 페이지를 canonical로 합치지 않음.

## 코드에서 고친 DOM

- `ComparisonTable`: 모바일 카드 + 데스크톱 표 **이중 텍스트** 제거. 표만 출력(가로 스크롤).
- `/부산법무사상담`: “자세히 알아보기”가 hero·요약을 다시 쓰던 블록 제거. TOC 8개로 축소.
