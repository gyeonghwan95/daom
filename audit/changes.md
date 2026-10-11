# 전국 지역×업무 유입·전환 점검 — 변경 기록 (2026-10-11)

상태: 로컬 작업만 반영했다. 커밋·배포는 하지 않았다. URL·title·H1·meta description·canonical·robots·sitemap은 바꾸지 않았다(스냅샷 diff after26→after27에서 title/h1/description 0건, 사라진 경로 0건, 잃은 링크 0건).

## 1. 원인(확인됨)과 가설

| 구분 | 내용 | 근거 |
|---|---|---|
| 확인 | 섹션 제목이 본문과 다른 데이터에 붙음. 빌더가 해시로 고른 제목 세트(pool)를 인덱스로 배정하는데, 세트의 순서가 본문 순서와 달랐다(경남·전국·동남권 빌더, seo-landing 공통 템플릿) | page-audit 제목-본문 불일치 765건 → 48건(남은 건은 목록형 본문·체크리스트 등 규칙 오탐) |
| 확인 | 지역 허브 초기 HTML에 "지역 목록 준비 중…"만 있었음. `useSearchParams`가 정적 내보내기에서 Suspense 경계까지 클라이언트 렌더로 미룸 | 수정 후 초기 HTML에 링크 추가: 지역별상속등기 102, 경남 55, 양산 54, 경북 23, 대구 22, 울산 20, 지역별 1 |
| 확인 | 상담 기초정보(소재 지역·상속인 수)를 "필요 서류" 제목 아래에 표시 | docs-has-consult-info 243건 → 0건 |
| 확인 | 고객 화면에 내부 작업 문구 노출("전용 URL은 늘리지 않습니다", "분기용", "복제가 아니라") | dev-text 0건 |
| 확인 | '광주 상속등기' 웹문서 1위가 경기 광주 페이지인데, 광주광역시 페이지와 서로 링크가 없었음 | naver-ranks.csv Q 광주 상속등기(법무사) |
| 가설 | 지역 법인설립·한정승인 질의의 미발견은 해당 지역 전용 안내가 없고 전국 안내 1개가 대표하기 때문일 수 있음 | 미발견 비중이 상속등기보다 높음. 원인 단정 불가(순위 요인 미공개) |
| 가설 | 광역 질의(서울·경기·인천 상속등기 법무사)에서 허브나 하위 시·구 페이지가 대신 노출되는 내부 경합 | observed_url ≠ target_url 사례. URL 통합·canonical 변경은 범위 밖이라 링크·안내만 보강 |

## 2. 변경 파일

공통 템플릿
- `src/lib/pageData/types.ts`, `src/lib/pageData/template-helpers.ts`: `documentsTitle` 필드를 추가하고 createPageData에서 전달
- `src/components/page-data/PageDataTemplate.tsx`, `src/components/readability/page-summary.ts`: 서류 섹션 제목과 목차가 `documentsTitle`을 사용
- `src/lib/seo-landing/content.ts`: 비용 본문 위에는 비용 제목만, 지역 본문 위에는 그 본문이 관할을 다룰 때만 관할 제목을 쓰고, 일정 본문이면 "○○ 사건 일정 참고". 상속포기 비용 문장과 상담 범위 문장을 보완

빌더·데이터
- `src/lib/gyeongnam-cases/builder.ts`, `src/lib/nationwide-cases/builder.ts`, `src/lib/southeast-cases/builder.ts`: 제목 세트를 본문 순서에 맞춤. 상담 기초정보 목록 제목은 "첫 상담에 알려주실 정보"
- `src/lib/nationwide-cases/service-defs.ts`, `content-pools.ts`, `src/lib/nationwide/pages.ts`: 개발 문구 제거, 원본 서류 안내 정정, 서류 제목
- `src/lib/nationwide-cases/metro-defs.ts`, `phase4-city-defs.ts`: 광주광역시 ↔ 경기 광주 상호 링크
- `src/lib/local-landing/region-hub-coverage.ts` 외 지역 데이터: 사하·사상·서·동구 FAQ 문구, 북구 금곡동 FAQ·요약 정정
- `src/data/seo/station-section-content.ts`, `src/lib/topic-hubs/config.ts`, `src/lib/special-entity-intent/content/hubs.ts`: 내부 작업 문구를 고객 안내로 교체
- `src/lib/local-landing/company-establishment-busan.ts`: /부산법인설립등기의 "관할·접근 안내" 본문을 본점 소재지 관할 설명으로 교체(보호 질의 페이지, 한 문장)

컴포넌트
- `src/components/nationwide-cases/NationwideRegionExplorer.tsx`, `src/components/southeast-cases/SoutheastHubExplorer.tsx`, `src/components/gyeongnam-cases/GyeongnamHubExplorer.tsx` 및 각 PageView: `useSearchParams`와 Suspense 대기 문구 제거, 검색어는 마운트 후 `window.location`에서 읽음
- `src/components/seo/HubChildLinks.tsx`, `src/components/case-regions/CaseRegionHubViews.tsx`: /업무사례/지역별에서 부산 안내와 부산 밖 지역 상속등기 안내를 나눠 표시(링크는 그대로)

점검 도구·산출물(audit/)
- `build-lists.ts` → `regions.csv`, `queries.csv`
- `naver-rank.mjs` → `naver-ranks.csv`, `serp-evidence.jsonl`
- `build-competitors.mjs` → `competitors.csv`
- `page-audit.mjs` → `page-audit.csv`
- `legal-check.md`, 이 파일

## 3. 검사 결과

- `npm run build` 통과(prebuild 검증과 seo-dom 샘플 포함)
- `npm test` 25/25 통과
- 변경 범위 eslint: 오류 0, 경고 2(기존 미사용 변수)
- `tsc --noEmit`: 새 오류 0(`reserved-inheritance-intents.ts`의 기존 오류만 남음)
- 중복 검사 `scripts/quick-seo-duplicate-check.mjs`: similarity_fail 0, exact_duplicates 0
- 스냅샷 diff after26→after27: 본문 변경 525개 경로(대부분 H2 제목). 핵심 보호 랜딩(/부산법무사, /부산상속법무사, /부산상속포기, /부산법인법무사, /부산공탁, /부산등기법무사 등)의 본문은 바뀌지 않았고, 예외는 /부산법인설립등기 한 문장
- 화면 확인(로컬 정적 서버, 헤드리스 Chrome 500px·1366px): /업무사례/지역별, /업무사례/지역별상속등기법무사, /업무사례/경남법무사업무

남은 page-audit 표시
- loading-placeholder 7건: 홈·/location(지도), 공지사항 4건(런타임 조회), /협업문의(문의 양식). 지역 링크와 무관한 실제 런타임 로딩이다
- heading-body 48건: 체크리스트·FAQ 질문형 제목 등 규칙 오탐 위주. 표본을 검토했다

## 4. 되돌리기 범위

- 위 파일 목록만 되돌리면 된다. 데이터 스키마는 선택 필드(`documentsTitle`) 하나만 추가했고, URL·라우트 변경은 없다
- 탐색기 3개는 이전처럼 `useSearchParams`와 Suspense로 되돌릴 수 있다. 다만 되돌리면 초기 HTML 링크가 다시 사라진다

## 5. 14일·28일 재확인 체크리스트

배포 후 날짜를 기준으로 한다. 순위 변화를 이번 변경의 효과로 단정하지 않는다.

- [ ] D+14, D+28: `node audit/naver-rank.mjs --priority 1`로 같은 질의를 같은 방식(PC UA, 비로그인, 웹문서 탭, 깊이 30)으로 다시 수집하고 TOP3·BELOW3·미발견 수를 비교
- [ ] D+14: 보호 질의 24개(`priority 1`, service=보호)가 TOP3·BELOW3에서 미발견으로 떨어지지 않았는지 확인
- [ ] D+14: 서치어드바이저·서치콘솔에서 /업무사례/지역별상속등기법무사, /업무사례/경남법무사업무 등 허브 7개의 수집·색인 상태와 하위 링크 발견 확인
- [ ] D+14: 광주 상속등기 질의에서 노출 페이지와 클릭 페이지 확인
- [ ] D+28: 지역 페이지의 문의 클릭(전화·카카오·네이버 예약·문의서) 수를 직전 28일과 비교(PII 없이 이벤트 수만)
- [ ] D+28: `node audit/page-audit.mjs`를 다시 돌려 heading-body·dev-text·docs-has-consult-info가 늘지 않았는지 확인
- [ ] 차단(BLOCKED)이 나오면 반복 요청하지 말고 그날 수집을 중단

## 6. 순위 관찰 결과 (2026-10-11 18:1x~19:1x KST, 웹문서 탭, 비로그인, 깊이 30)

| 기기 | 질의 | TOP3 | BELOW3 | 30위 내 미발견 | 차단 | 미확인 |
|---|---|---|---|---|---|---|
| PC(UA) | 626 | 367 | 133 | 126 | 0 | 0 |
| 모바일(UA, m.search where=m_web) | 48 | 12 | 19 | 17 | 0 | 578(나머지 질의 미수집) |

- 우선순위별 PC: P1 224건(TOP3 52 / BELOW3 79 / 미발견 93), P2 274건(187/54/33), P3 128건(128/0/0, 소지역 상속등기)
- 보호 질의 24개: PC와 모바일 순위가 같게 관찰됐다. 미발견은 "부산 법률상담" 1건
- 모바일 수치는 모바일 UA로 받은 웹문서 탭 순서다. 실제 모바일 통합검색의 블록 배치는 측정하지 않았다
- 다음 수집 대상: 모바일 미수집 578건(`node audit/naver-rank.mjs --mobile --priority 2`부터)
