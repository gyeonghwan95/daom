# 본문형 페이지 ArticleVisual 완료 보고

생성일: 2026-07-30  
범위: `public/image` 전수 조사 → `ArticleVisual` + 레지스트리 → 우선 12개 URL 적용  
원칙: 원본 덮어쓰기·삭제 없음 / URL·본문·title·H1·canonical·sitemap·상담·디자인 시스템 유지

---

## 1. `public/image` 전체 이미지 분석표

원시 데이터: `scripts/output/image-inventory-raw.json`  
재생성: `node scripts/inventory-images.mjs`

| 항목 | 값 |
|------|-----|
| 파일 수 | **88** |
| 총용량 | **약 150.4 MB** |
| 포맷 | jpg/jpeg · png 위주 (webp 원본 거의 없음) |

### 유형 분류 (파일명·실사 확인 기준)

| 유형 | 예시 | 본문 활용 |
|------|------|-----------|
| 안윤정 법무사 실사 | `썸네일-서류확인`, `썸네일-정면`, `상담-메인`, `썸네일-계약임원`, `썸네일-등기소` | 우선 사용 |
| 등기 서류 결과물 | `썸네일-등기필증_상속`, `썸네일-등기필증_매매증여`, `근저당` | 상속·부동산 |
| 관공서·등기소 건물 | `부산지방법원등기국`, `동부지원`, `구청` 다수 | 관할·지역 (반복 제한) |
| 강의·활동 | `강의-*`, `활동-*` | 본문보다 강의/소개 적합 |
| 오시는길·지도 PNG | `찾아오는길1/2`(8~10MB), `주차` | **본문 제외** (용량) |
| 브랜드 | `로고.png` | 본문 제외 |
| 언론 스크랩 | `언론-*` | 소개·EEAT용, 본문 호흡용 아님 |
| 계절 사무실 중복 | `썸네일-사무실_가을/겨울 (1)~(4)` | 커버 후보·본문 중복 주의 |

실사 확인한 주요 파일: `썸네일-서류확인`, `썸네일-정면`, `상담-메인`, `썸네일-계약임원`, `썸네일-등기필증_상속`, `썸네일-등기소`, `사무소-전경` 등 → 안윤정 법무사 실제 사진 또는 실제 업무 서류.

---

## 2. 사용 가능 · 제외 · 보완

### 사용 가능 (카탈로그 등록 12)

`docReviewDesk`, `contractOfficerReview`, `inheritanceRegCert`, `saleGiftRegCert`, `registryOfficeVisit`, `consultMain`, `portraitFront`, `deskComputer`, `consultTalk`, `courtProcedureBook`, `busanRegistryBureau`, `officeDocs`

### 제외 사유

| 대상 | 사유 |
|------|------|
| `로고.png` | 장식·브랜드, 본문 호흡 아님 |
| `사무소-찾아오는길*.png`, `주차.png` | 8~10MB, 오시는길 전용 |
| 자극적 스톡 스타일 | 프로젝트에 해당 파일 없음 (법원 망치·돈다발 미사용) |
| 구청·지원 전경 다수 | 지역 썸네일로는 유용하나 본문 동일 컷 반복 위험 → 이번 차수 미배치 |
| 강의 단체 사진 다수 | 강의 허브에 적합, 상속·등기 본문과 직접 연결 약함 |

### 보완 필요

- 건물 멸실·공장·창고 **고유 현장 사진** 부재 → 등기국·서류 이미지로 대체
- 개인회생용 **차분한 자료 정리** 컷이 적어 `consultMain` + `courtProcedureBook` 조합 사용
- 대형 PNG 오시는길은 별도 WebP 파생을 location 페이지에서만 권장

---

## 3. 이미지 레지스트리

| 파일 | 역할 |
|------|------|
| `src/lib/article-visuals/types.ts` | 타입 |
| `src/lib/article-visuals/asset-catalog.ts` | 에셋·상한·분야 |
| `src/lib/article-visuals/page-placements.ts` | 페이지×슬롯 배치 |
| `src/lib/article-visuals/index.ts` | export |

페이지 JSX에 경로를 흩지 않고 `path` + `slot`으로 조회한다. 동일 asset `maxBodyUses` 초과 시 모듈 로드 시 검사.

---

## 4. 생성·수정 컴포넌트

| 파일 | 내용 |
|------|------|
| `src/components/media/ArticleVisual.tsx` | `figure` + 약한 그라데이션 + HTML 오버레이 + figcaption + onError fallback + lazy |
| `PageDataTemplate.tsx` | after-intro / before-procedures / before-example |
| `SearchIntentPageView.tsx` | 개인회생 등 |
| `BuildingIntentPageView.tsx` | 건물멸실 등 |
| `PreservationRegistrationPageView.tsx` | 신축 보존등기 |
| `SituationsHubView.tsx` | 상황별 허브 |
| `app/contact/page.tsx` | 상담 페이지 |

오버레이는 **원본에 굽지 않음**. OG용 문구 이미지 대량 생성 없음.

---

## 5~6. 페이지별 이미지·문구·위치

| URL | 슬롯 | asset | overlay | 본문 위치 |
|-----|------|-------|---------|-----------|
| `/부산법무사` | after-intro | portraitFront | 정확한 업무명을 몰라도 괜찮습니다 | 자세히 알아보기 이후 |
| | before-procedures | officeDocs | 준비된 서류가 없어도 시작할 수 있습니다 | 절차 섹션 직전 |
| `/부산상속법무사` | after-intro | docReviewDesk | 상속인은 서류보다 먼저 확인합니다 | 도입 이후 |
| | before-procedures | inheritanceRegCert | 재산과 채무를 함께 살펴야 합니다 | 절차 전 |
| `/부산상속등기` | after-intro | inheritanceRegCert | 가족관계에 따라 절차가 달라집니다 | 도입 이후 |
| | before-example | docReviewDesk | 승인 방식을 먼저 가립니다 | 상담 예시 전 |
| `/부산한정승인` | after-intro | docReviewDesk | 3개월 안에 판단할 사항이 있습니다 | 도입 이후 |
| | before-procedures | consultTalk | 재산 처분 전 먼저 확인하세요 | 절차 전 |
| `/부산부동산등기` | after-intro | saleGiftRegCert | 잔금과 말소 순서를 맞춰야 합니다 | 도입 이후 |
| | before-procedures | registryOfficeVisit | 등기부와 계약을 함께 봅니다 | 절차 전 |
| `/부산건물멸실등기` | after-intro | busanRegistryBureau | 철거 후에도 등기부가 남을 수 있습니다 | 본문 이후 |
| | before-procedures | saleGiftRegCert | 대장과 등기부가 같은지 확인하세요 | 절차 전 |
| `/부산신축건물보존등기` | after-intro | busanRegistryBureau | 준공 이후 보존등기가 시작됩니다 | what-is 이후 |
| | before-procedures | contractOfficerReview | 건축물대장과 도면을 맞춰 봅니다 | 절차 전 |
| `/부산법인등기` | after-intro | contractOfficerReview | 정관과 등기부를 함께 확인합니다 | 도입 이후 |
| | before-procedures | deskComputer | 변경 사실과 등기 시점은 다를 수 있습니다 | 절차 전 |
| `/부산임원변경등기` | after-intro | contractOfficerReview | 임기와 결의 절차가 등기의 출발점입니다 | 도입 이후 |
| | before-example | deskComputer | 결의 후 등기 기한을 달력에 표시하세요 | 예시 전 |
| `/부산개인회생법무사` | after-intro | consultMain | 소득·채무·재산을 함께 검토합니다 | 도입 이후 |
| | before-procedures | courtProcedureBook | 채무액만으로 결정되지는 않습니다 | 절차 전 |
| `/situations` | after-intro | consultTalk | 현재 상황부터 남겨주세요 | 헤더 이후 |
| `/contact` | before-cta | consultMain | 현재 상황부터 남겨주세요 | ContactSection 직전 |

alt는 배치마다 고유. 키워드 나열형 alt 없음.

---

## 7. 동일 이미지 반복 현황

| asset | 본문 사용 횟수 | 상한 |
|-------|----------------|------|
| docReviewDesk | 3 | 3 |
| contractOfficerReview | 3 | 3 |
| consultMain | 2 | 3 |
| inheritanceRegCert | 2 | 2 |
| saleGiftRegCert | 2 | 2 |
| busanRegistryBureau | 2 | 2 |
| deskComputer | 2 | 2 |
| consultTalk | 2 | 2 |
| 기타 | 1 | 2~3 |

커버(PageCoverBanner)와 본문 에셋은 의도적으로 분리. 커버와 완전 동일 컷 반복은 피함.

---

## 8. 원본과 파생 파일

- **원본**: `public/image/*` 변경·삭제 없음  
- **파생**: `public/image/derived/*.webp` (12개)  
- 생성 스크립트: `scripts/generate-article-visual-derived.mjs`

| 구분 | 용량 |
|------|------|
| 선택 원본 합 | ~23,157 KB |
| 파생 WebP 합 | ~1,036 KB |
| 절감 | ~22,121 KB |

표시는 `derivedSrc` 우선, 원본은 백업·고해상도 보관용.

---

## 9. 변경 전후 이미지 총용량

| 시점 | public/image 총량 |
|------|-------------------|
| 전 | ~150.4 MB (88 files) |
| 후 | ~150.4 MB + derived ~1.0 MB |

원본 미삭제. 전송 시 본문은 WebP(~50–150KB/장)만 로드.

---

## 10. 모바일·데스크톱 크롭

- `aspect-ratio` 고정 + `object-cover` + `mobileFocus`(`face` → `object-[center_20%]`)
- 인물 컷: 얼굴이 상단 1/3에 오도록 focus
- 서류 컷: center
- 오버레이 1줄, max ~18rem, 하단 그라데이션만 사용 (광고 배너형 아님)

---

## 11. 성능 (LCP·CLS)

- `images.unoptimized: true` (static export) 유지
- 본문 이미지 **lazy** (priority 미사용)
- 커버만 기존대로 eager 가능
- width/height는 aspect 박스로 CLS 완화
- 본문 폭 `prose-measure` / article 폭 내 (`sizes` 820px)
- LCP 악화 요인인 초대형 PNG는 본문 미사용

정량 Lighthouse는 배포 URL에서 재측정 권장 (로컬 추정: 본문 추가 이미지당 ~50–150KB).

---

## 12. 접근성 · alt 중복

- 의미 이미지: 고유 한국어 alt
- 장식 아님 → 빈 alt 미사용
- 오버레이 문구 ≠ alt 복사
- `figure` / 선택적 `figcaption`
- 로드 실패 시 텍스트 fallback figure

---

## 13. 기존 URL·본문·SEO 유지

- URL / title / H1 / canonical / sitemap **변경 없음**
- 본문 텍스트 미삭제
- 상담 CTA·채널 유지
- redirect/noindex 없음

---

## 14. 빌드·배포

| 항목 | 결과 |
|------|------|
| `npx tsc --noEmit` | 통과 |
| 파생 WebP 생성 | 통과 |
| `npm run build` | 배포 전 권장 재실행 |
| Cloudflare Pages | 푸시 후 배포 |

---

## 15. 전 페이지 확대 (자동 배치)

우선 12URL은 `priorityArticleVisualPlacements` 수동 고정.  
그 외 본문형 페이지는 `resolve.ts`가 path·category·serviceSlug로 분야 풀·슬롯 개수(0~2)·오버레이를 해시 선택한다.

| 연결 뷰 | 슬롯 |
|---------|------|
| `PageDataTemplate` (서비스·블로그·FAQ·사례·전국 등) | after-intro, before-procedures, before-example* |
| Search / Building / Preservation / Corporate / Special / Counsel / Selection | after-intro, before-procedures |
| Situation / Diagnosis / Business / PublicAgency / ConsultLanding | after-intro, before-procedures |
| PracticeHub / CaseRegion / B2B / Lecture / SituationsHub / contact | after-intro 또는 before-cta |

\* `before-example`은 우선 수동 배치 URL에서만 표시(자동 개수 기본 2슬롯).

도구·용어집(`tool`/`glossary`)은 `autoVisualCount` 0.  
원본 `public/image` 미변경, 추가 파생: mortgage / office-exterior / nameplate / lecture WebP.
