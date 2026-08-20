# 허브 페이지 노출 비상 전수조사 (2026-08-21)

## 결론

`/자가진단`, `/업무사례`, `/partners`, `/법률강의` 등은 **삭제·404·noindex가 아님**. 라우트·sitemap에 존재하나, **내부 발견 경로가 끊기거나 묻혀** “안 보이는” 상태였다.

| Path | 라우트 | Sitemap | Header | 문제 |
|---|---|---|---|---|
| `/자가진단` | OK | OK | 후순위 → **강의 다음으로 이동** | Footer `slice(0,6)`에서 탈락, 홈 허브 약함 |
| `/업무사례` | OK | OK | OK | 서브메뉴·내부링크가 `/cases`로 가서 **서비스로 301** |
| `/partners` | OK | OK | OK | 홈/인기검색 약함 |
| `/법률강의` | OK | OK | OK | 홈/인기검색 약함 |

## 치명 버그

- 내비/본문: “전체 업무 사례·사례 탐색기” → `/cases`
- `public/_redirects`: `/cases` → `/services` 301
- `next.config.ts`: `/cases` → `/services#cases`
- 결과: **업무사례 허브로 못 감** (탐색기 페이지도 프로덕션에서는 이미 리다이렉트로 도달 불가)

## 적용 수정

1. `/cases` → `/업무사례` (Cloudflare `_redirects` + `next.config.ts`)
2. `/cases/*` → `/services/cases/:splat` 유지 (개별 사례)
3. 내비·푸터·홈 허브·인기검색·사례 관련 CTA를 `/업무사례` 등으로 정리
4. Footer 바로가기: `mainNavigation.slice(0,6)` 폐기 → 허브 명시 목록 (`자가진단` 포함)
5. 홈: `tools-hubs` 섹션 추가, 주요 업무에 자가진단·업무사례·법률강의·partners
6. Header: `자가진단`을 강의·특강 직후로 이동

## URL 정책

기존 허브 URL 변경·삭제 없음. `/cases`는 레거시 진입을 `/업무사례`로 흡수.

## 인덱싱 제출 후보 (P0)

- `/`
- `/자가진단`
- `/업무사례`
- `/partners`
- `/법률강의`
- `/situations`
- `/tools`
