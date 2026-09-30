# 09. 생성·개선 계획과 결과

## 순서 (브리프: 허브 → 상속 → 필요 시 등기 vs 등록·관리인 → 지역)

| 순서 | URL | 유형 | 판단 근거 |
|---|---|---|---|
| 1 | `/선박등기` | CREATE (CORE) | 선박 허브 없음. 기존 선박 문서 10개는 서로 유사도 0.78–0.83인 얇은 템플릿 |
| 2 | `/선박상속` | CREATE (INHERITANCE) | 표본 SERP 광고 위주, 다옴 미노출. "부산 선박상속"·"어선 상속"도 이 URL이 소유 |
| 3 | `/선박등기와선박등록` | CREATE (FISHING_VESSEL) | 20톤 미만 어선도 법원 등기라는 오해를 바로잡을 문서가 없음 |
| 4 | `/선박관리인선임등기` | CREATE (MANAGER) | 공유·공동상속 필수 절차. 표본 SERP는 사전·서식뿐 |
| 5 | `/부산선박등기` | IMPROVE (TARGET_ALLOWLIST) | URL 유지. 근저당·전세권 등 부동산 템플릿 문구 교체 |
| 6–9 | 거제·통영·창원·울산 | CREATE (Batch 1, 4개 ≤ 5) | 10개 기준 중 8–10개 충족 (`05-region-opportunity.csv`) |

## 만들지 않은 것

| 후보 | 결정 | 이유 |
|---|---|---|
| 부산 선박상속 별도 URL | DO_NOT_CREATE | `/선박상속`과 같은 의도 — 자기잠식 |
| 선박 소유권이전·저당권·비용 별도 URL | HUB_SECTION | 허브 섹션으로 충분, 얇은 문서 증식 방지 |
| 진해·마산 | 창원에 통합 | 같은 창원시·같은 접수 등기소 |
| 기장 | DO_NOT_CREATE | 부산 대표 URL과 관할·절차 동일 |
| 영도 | PROTECT | 표본 1위, 변경 없음 |
| 선박 사례 페이지 | DO_NOT_CREATE | 검증된 선박 사건 자료 없음 |
| 포항·사천·고성·남해 | HOLD (Batch 2) | 배치 상한. 포항이 1순위 |
| 경주·영덕·울진 | HOLD (Batch 3) | |

## 구현 방식 (보호 URL 영향 0)

- 전용 컴포넌트 `src/components/ship-seo/ShipSeoPageView.tsx`, 스펙 `src/lib/ship-seo/**`.
- `src/app/[landingSlug]/page.tsx`의 generateMetadata·page 맨 앞에서 선박 스펙만 가로챔. 다른 slug는 기존 경로 그대로.
- 중앙 registry(`src/lib/pageData/registry.ts`)에 넣지 않음 → 다른 페이지 출력 불변.
- sitemap: `published-paths.mjs`가 `src/lib/ship-seo/pages/*.ts` slug만 읽음. lastmod는 스펙 `dateModified`(2026-09-30).
- 전역 nav·footer·공통 SEO 컴포넌트 수정 없음. meta keywords 없음.
