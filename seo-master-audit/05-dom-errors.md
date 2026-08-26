# 05 DOM errors

조사 기준: production HTML 2026-08-26 (`scripts/seo-high-competition-audit.ts` → `02-production-before.csv`)

## Footer-before-H1 / Loading-before-H1

우선 URL 전부:

| URL | footerBeforeH1 | footerBeforeMain | loadingPhrase |
|---|---|---|---|
| `/` 및 지정 랜딩 16개 | false | false | false |

결론: Issue D의 “Footer → loading → H1” 패턴은 **현재 production SSR HTML에서는 재현되지 않음**. `src/app/layout.tsx`에서 Footer를 layout 밖에 두고, `loading.tsx`가 `null`을 반환하는 수정이 이미 반영된 상태로 보임.

## Duplicate CTA 문구

`현재 카카오·네이버톡톡만 가능` 출현:

- 대부분 우선 URL에서 **2~3회** (헤더 상태 + 상담 패널).
- 영업시간 외 SSR 복제로 보이며, 전환 CTA 자체를 제거하지는 않음.
- 본문 H1보다 앞에 헤더 상태 문구가 오는 것은 네비게이션이지 Footer-before-H1이 아님.

## Keyword-list / 검색의도 UI

Production:

- `/부산개인회생법무사`, `/부산개인파산법무사`, `/부산회생법무사` 브레드크럼: `홈 / 검색의도 안내 / …`
- HOME `keywordListHint=true` (배포본 링크 라벨). 코드에서 `상황별 안내 모음`으로 변경.
- `/busan-legal-map` 카드 라벨 `관련 키워드` → `주요 상담 주제`.

## Duplicate DOM (desktop/mobile)

- `ComparisonTable`: 카드+테이블 이중 DOM (CSS로 한쪽 숨김). 회생 비교표는 TopicHub에서 **단일 table**로 추가.
- `ConsultationChatTile`: 모바일/데스크톱 라벨 이중. 전환 타일이라 이번 클러스터 본문보다 우선순위 낮음.

## H1

우선 URL 전부 `h1Count=1`. Missing H1 없음.

## Canonical

전부 self-canonical (punycode 호스트). `/부산개인회생`과 `/부산개인회생법무사`를 묶지 않음.
