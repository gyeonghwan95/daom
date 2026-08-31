# BUSAN LOCAL SEO RECOVERY — FINAL REPORT

내부 품질 감사 결과입니다. 네이버 알고리즘 점수·순위 보장이 아닙니다. Search Advisor export가 저장소에 없어 노출·클릭 숫자는 만들지 않았습니다. **SEARCH PERFORMANCE UNKNOWN**.

작성일: 2026-08-31

---

## 요약 수치

| 항목 | 값 |
|---|---|
| 지역 keyword (inventory) | 96 |
| 16개 구·군 owner | 16/16 존재, indexable |
| 지역 허브 페이지 점수 대상 | 59 |
| 허브 간 CRITICAL duplicate | 0 |
| 허브 간 HIGH duplicate | 0 |
| PRIMARY keyword collision | 0 |
| 가짜 “최근 ○○에서 상담한 사례입니다” | 0 (코드 전수 검색) |
| Search Advisor 데이터 | 없음 |

---

## 16개 구·군 owner URL

| 검색어 | Owner URL | Title |
|---|---|---|
| 중구 법무사 | `/중구법무사` | 중구 법무사 \| 남포·원도심 상가·법인 주소 |
| 서구 법무사 | `/서구법무사` | 서구 법무사 \| 충무·송도 주택·상속 등기 |
| 동구 법무사 | `/동구법무사` | 동구 법무사 \| 부산역·초량 상가·등기 상담 |
| 영도구 법무사 | `/영도구법무사` | 영도구 법무사 \| 남항·동삼 부동산·법인 등기 |
| 부산진구 법무사 | `/부산진구법무사` | 부산진구 법무사 \| 서면·부전·전포 상가·등기 상담 |
| 동래구 법무사 | `/동래구법무사` | 동래구 법무사 \| 사직·온천 상속·부동산등기 안내 |
| 남구 법무사 | `/남구법무사` | 남구 법무사 \| 대연·용호·문현 법인·부동산 상담 |
| 북구 법무사 | `/북구법무사` | 북구 법무사 \| 화명·덕천 상속·회생 상담 |
| 해운대 법무사 / 해운대구 법무사 | `/해운대법무사` | 해운대 법무사 \| 센텀·재송·우동 부동산·상속 상담 |
| 사하구 법무사 | `/사하구법무사` | 사하구 법무사 \| 하단·괴정 주택·상속 등기 |
| 금정구 법무사 | `/금정구법무사` | 금정구 법무사 \| 부곡·장전 상속·한정승인 안내 |
| 강서구 법무사 | `/강서구법무사` | 강서구 법무사 \| 명지·녹산 법인·공장 등기 |
| 연제구 법무사 | `/연제구법무사` | 연제구 법무사 \| 연산동·거제동 상속·등기 상담 |
| 수영구 법무사 | `/수영구법무사` | 수영구 법무사 \| 광안·민락 부동산·상속 상담 |
| 사상구 법무사 | `/사상구법무사` | 사상구 법무사 \| 주례·감전 상속·회생 상담 |
| 기장군 법무사 / 기장 법무사 | `/기장군법무사` | 기장군 법무사 \| 정관·일광·기장읍 토지·주택 등기 |

`/기장법무사` URL은 유지하되 PRIMARY는 기장군 허브입니다. 페이지 역할은 기장읍 생활권 연결입니다.

---

## 동·생활권

저장소의 neighborhood-hub · overlay · region-hub에서 추출했습니다. 대표 예:

- 연산동·거제동 → `/연산동법무사`, `/거제동법무사` (부모: 연제구)
- 사직동·온천동 → 전용 URL. **명륜동 법무사**는 전용 URL이 없어 `/동래구법무사`가 owner
- 광안리·광안동·민락·망미·남천
- 서면·부전·전포
- 센텀 / 센텀시티 → `/센텀법무사` (동일 intent, 별도 thin page 없음)
- 재송·반여·우동·좌동·중동
- 화명·덕천 및 phase3 동 페이지(초량·범일·구포 등)

전체 목록: `seo/local-keyword-inventory.csv`, 관계: `seo/busan-region-graph.json`

---

## Title / H1 (연제구 — 최우선)

| | 전 (template) | 후 |
|---|---|---|
| Title | 지역명 치환형 “○○구 법무사 안내 \| 부산 법무사” 계열 | **연제구 법무사 \| 연산동·거제동 상속·등기 상담** |
| H1 | 공통 intro 반복 | **연제구 법무사 상담, 연산동·거제동에서 어떤 업무를 맡길 수 있을까요?** |

첫 화면에서 해운대 센텀 위치, 연제구 사건 상담 가능, 안윤정 법무사 직접 상담, 연산·거제, 전화·카카오, 업무 분기를 답하도록 identity 본문을 사용합니다. 사무소가 연제구에 있는 것처럼 쓰지 않습니다.

---

## 실제로 고친 내용

1. **가짜 사례 표현 제거**  
   `builder.ts`의 “최근 ○○에서 상담한 사례입니다” → 가상의 절차 예시.  
   `LocalLandingContent` 제목: “상담이 필요한 대표 상황”.
2. **구 허브 고유 identity**  
   16개 구·군 + 센텀·재송·반여. title/H1/description/본문 분기. 공통 “등기·상속·법인·채무로 찾으시는 분이 많습니다” intro 제거.
3. **등기 관할 SSOT** (`src/lib/geo/busan-registry.ts`)  
   등기국(연제구 법원로 8), 동부지원 등기과(재반로112번길 20), 남부산등기소, 서부지원 등기과(명지국제7로 77), 북부산등기소(사상로583번길 14).  
   중부산·부산진 등기소는 2021 통합 — URL `/중부산등기소법무사`, `/부산진등기소법무사`는 유지하고 통합 안내.
4. **기장 cannibalization**  
   `기장 법무사` → `/기장군법무사`. `/기장법무사`는 기장읍 생활권 제목.
5. **Footer**  
   16개 구 exact-match farm 없음. 해운대·센텀·연제·서면 + `/busan-legal-map`.
6. **부산 법률지도**  
   16개 카드, “이 페이지에서 다루는 업무”, 관할은 registry SSOT.
7. **Schema**  
   구 페이지에 가짜 LocalBusiness 지점 address를 만들지 않음. 전역 조직 정보는 센텀 주소.

---

## Keyword cannibalization (처리됨)

- 해운대 / 해운대구 / 부산 해운대 → `/해운대법무사`
- 센텀 / 센텀시티 → `/센텀법무사`
- 기장 / 기장군 → `/기장군법무사`
- 부산진 / 부산진구 → `/부산진구법무사`

지역+업무(`연제구 상속등기` 등)는 구 허브와 PRIMARY를 나누도록 기존 슬러그를 유지합니다.

---

## Duplicate content

- **구 허브끼리 CRITICAL template: 없음** (내부 기준 normalized ≥ 0.75).
- HIGH 0쌍. `/주례동법무사`–`/연지동법무사`는 phase2/3 공통 장문을 제거하고 생활권 본문만 남겨 해소.
- `/업무사례/{지역}`는 제목을 `{지역} 업무 사례 | {trait 각도}`로 두고 PRIMARY `{지역} 법무사`를 쓰지 않음. 관할 FAQ는 등기 레지스트리 SSOT. 임의 noindex하지 않음.

---

## noindex / sitemap

`seo/index-policy.json` noindex:

- `/search`
- `/부산상속전문법무사` 등 상속 브리지 4개 (canonical은 허브)

지역 허브는 Search Advisor 데이터 없이 noindex하지 않았습니다.

---

## Internal linking

권장 그래프: `/` → `/busan-legal-map` → 16 구 허브 → 동·생활권 → 지역+업무.

구 페이지 related links는 약 10개로 제한. 동 페이지는 구 허브로 되돌림.

---

## 보존한 페이지

내부 점수 85+ PRESERVE: 16개 구 허브, 센텀, 재송, 반여 등 identity 적용 페이지. Search Advisor 수치가 없어 WINNER 지정은 하지 않음.

---

## 남은 SEO risk

코드로 닫을 수 있는 지역 허브 리스크는 이번 라운드에서 처리했습니다. 아래에 남는 것은 데이터·운영 영역입니다.

1. 네이버 Search Advisor export가 없어 CTR·순위 기반 PRESERVE_GROUP을 확정하지 못함. **SEARCH PERFORMANCE UNKNOWN**.
2. 배포 후 핵심 구 허브 URL 검사·사이트맵 재확인은 `docs/NAVER_LOCAL_SEO_ACTIONS.md`에서 수동 진행.

---

## Audit 스크립트

```
npx --yes tsx scripts/local-seo-audit.ts
npx --yes tsx scripts/local-similarity.ts
npx --yes tsx scripts/keyword-owner-check.ts
```

산출:

- `seo/local-keyword-inventory.csv`
- `seo/local-keyword-map.json`
- `seo/local-similarity-report.csv`
- `seo/local-page-score.csv`
- `seo/busan-region-graph.json`
- `seo/local-ranking-tracker.csv` (baseline 공란)
- `docs/NAVER_LOCAL_SEO_ACTIONS.md`

---

## Search Advisor에서 확인할 항목

`docs/NAVER_LOCAL_SEO_ACTIONS.md` 참고. 배포 후 핵심 구 허브 URL 검사·사이트맵 재확인. 7/30/60/90일은 tracker CSV에 **실제 숫자만** 기입.
