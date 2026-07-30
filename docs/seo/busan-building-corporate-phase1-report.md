# 부산 건물·법인 등기 SEO 허브 1차 완료 보고

생성일: 2026-07-30  
의도 맵: [busan-building-corporate-intent-map.md](./busan-building-corporate-intent-map.md)  
페이지 메타 JSON: `scripts/output/building-corp-phase1-pages.json`

## 1. 기존 건물·법인 관련 URL (유지)

**건물(기존)**  
`/부산신축건물보존등기`, `/신축보존등기`, `/건물보존등기`, `/집합건물보존등기`, `/오피스텔보존등기`, `/상가보존등기`, `/사용승인후등기`, `/건축주준비서류`, `/부산집단등기`, `/부산입주등기`, `/부산등기명의인표시변경`(명의인), `/부산기업부동산등기`, B2B 건축·시행·분양 협업 페이지

**법인(기존)**  
`/법인등기`, `/법인변경등기`, `/부산법인법무사`, `/부산법인등기`, `/부산법인설립등기`, `/부산임원변경등기`, `/부산대표이사변경등기`, `/부산임원임기만료등기`, `/부산본점이전등기`, `/부산사업목적변경등기`, `/부산유상증자등기`, `/부산법인해산청산등기`, `/부산법인등기과태료`, `/대표자사망시법인등기`, 구·동·센텀 메시, special-entity·business 클러스터

## 2. 검색 의도 클러스터 맵

대형 허브 → 중간 허브 → 상황·유형 상세 → 상담

- 건물: `/부산건물등기` → 멸실·보존·표시변경·집합·공장창고 → 상황형 상세
- 법인: `/법인변경등기` → 상호·지점·감자·무상·휴면·공동대표·사임해임·전환·해산전확인·녹산

상세 표는 의도 맵 문서 참고.

## 3. 신규 생성 페이지 (49)

**building-intent 38**  
허브 7: 부산건물등기, 부산건축물등기법무사, 부산건물멸실등기, 부산건물표시변경등기, 부산집합건물등기, 부산공장창고등기, 건물등기상황별안내  
멸실 12 · 보존상황 4 · 표시변경 6 · 분할·특수·지역 9

**corporate-intent 갭 11**  
부산상호변경등기, 부산지점설치등기, 부산지점폐지등기, 부산감자등기, 부산무상증자등기, 부산휴면법인계속등기, 부산공동대표변경등기, 부산임원사임해임등기, 부산개인사업자법인전환, 부산법인해산전확인사항, 녹산산단법인본점지점

## 4. 기존 페이지에 통합·보강한 주제

- `/부산신축건물보존등기`: 내부링크에 건물 허브·멸실·표시변경·상황형 보존 연결, 상담 CTA field 보강
- `/법인변경등기`: topicClusters에 갭 페이지 링크 추가
- `/부동산등기`, `/법인등기` topic hub 링크 보강
- 동의어(건축물멸실·철거등기 등) → `/부산건물멸실등기` FAQ/본문 흡수

## 5. 중복 위험으로 생성하지 않은 키워드

- 부산건축물멸실등기 / 멸실등기 법무사 / 철거등기 (멸실 허브 흡수)
- 다가구·공동주택·집합 보존 전용 URL (보존 허브 overlap)
- 센텀스타트업법인설립실수 (센텀법인설립등기와 중복)
- 추가 `부산법인설립*`, `부산회사등기`/`부산상업등기`/`부산기업등기` 신규 허브
- 구명만 바꾼 멸실 복제 페이지

## 6–9. 키워드·title·H1·description·본문 글자수

전체 목록: `scripts/output/building-corp-phase1-pages.json`  
조립 본문(뷰 기준) **전 페이지 ≥1,500자** (건물 min≈1529, avg≈1767).  
주 키워드 중복: 없음.

## 10. 내부링크 구조

허브 topicClusters ↔ 상세 relatedLinks ↔ `/부산건물등기`/`/법인변경등기` ↔ `/contact/inquiry`  
메뉴: 업무안내에 **건물·건축물등기**, **법인 변경등기** 허브만 추가 (세부 URL은 메뉴 비노출).

## 11. 상담 CTA

- 건물: `/contact/inquiry?field=real-estate-registration&from={slug}`
- 법인: `/contact/inquiry?field=corporate-registration&from={slug}`
- CTA 카피: 대장·등기부 / 등기사항증명서·정관 기준 안내

## 12. 중복 검사

- `validate:page-data` OK · **1597 paths**
- 신규 slug는 기존과 충돌 없이 등록
- primaryKeyword 중복 없음

## 13. canonical·sitemap

- self-canonical (기존 PageData 파이프라인)
- `sitemap:generate` 완료 · sitemap **1457 URLs** (tier-4에 부산건물* 등 반영)

## 14. 우선 수집 요청 핵심 URL 20

1. /부산건물등기  
2. /부산건물멸실등기  
3. /부산건물표시변경등기  
4. /부산집합건물등기  
5. /부산공장창고등기  
6. /건물등기상황별안내  
7. /부산건축물등기법무사  
8. /부산신축건물보존등기 (보강)  
9. /철거후건물멸실등기  
10. /건축물대장말소와멸실등기차이  
11. /화재소실건물멸실등기  
12. /상속건물멸실등기  
13. /미등기건물소유권보존등기  
14. /강서구공장멸실등기  
15. /법인변경등기 (보강)  
16. /부산상호변경등기  
17. /부산지점설치등기  
18. /부산감자등기  
19. /부산휴면법인계속등기  
20. /녹산산단법인본점지점  

## 15. 빌드·배포

- `tsc --noEmit`: 통과
- `validate:page-data`: OK
- `sitemap:generate`: OK  
- 전체 `next build` / Cloudflare Pages 배포는 이 세션에서 실행하지 않음 → 배포 전 `npm run build` 권장

## 구현 경로

- `src/lib/building-intent/` (types, content/*, builder, landing-config)
- `src/components/building/BuildingIntentPageView.tsx`
- `src/lib/corporate-intent/content/phase-gaps.ts`
- pageType `building-intent` 배선: types, config, builder, `[landingSlug]/page.tsx`, published-paths
