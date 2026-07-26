# 페이지별 대표 이미지 계획 (PAGE_IMAGE_PLAN)

> **2026-07 구현 완료: 캐러셀 대표이미지 시스템**
>
> - 사진 인벤토리: `src/data/media/attorney-photo-inventory.ts` (실사 5장 분류, 제외 사유 기록)
> - Manifest(단일 출처): `src/data/seo/carousel-image-manifest.ts` — 15개 페이지, 전부 `approved`
> - 생성: `npm run generate:carousel-images` → `public/images/generated/carousel/**` (1200×800 WebP q85, 원본 무수정)
> - 검사: `npm run check:carousel-images` / `npm run audit:attorney-photos`
> - 검토 미리보기: `docs/generated/carousel-image-preview.html` (로컬 전용)
> - 연결: `resolveCarouselOgImage`(OG, `pageDataToMetadata`·ServicePages에 훅) + `/services` 허브 캐러셀·ItemList (`SeoContentCarousel`/`SeoCarouselJsonLd`, 승인 4개 미만이면 자동 미노출)
> - 특정 이미지를 내리려면 manifest에서 해당 항목 status를 `review-required`로 바꾸면 즉시 metadata·캐러셀에서 제외된다.

> 생성 기준: 실제 프로젝트 탐색 (가정 URL 없음).  
> 기존 URL·slug·메뉴·sitemap·canonical **변경/삭제 없음**.  
> 신규 `seo/*` 이미지 파일이 준비되기 전에는 **metadata에 미적용**.

---

## 1. 전체 페이지 현황

| 항목 | 값 |
|------|-----|
| 프레임워크 | Next.js 16.2.9 App Router, React 19, TypeScript |
| 배포 | Cloudflare Pages 정적 export (`out/`) + Functions(`/api/quick-inquiry`) |
| PageData 등록 URL | **1,455** (`getAllPageData`) |
| 색인·sitemap 대상 | **1,324** (`isIndexablePagePath`) |
| 메뉴에 직접 연결된 URL | **73** |
| public/image 파일 | **78+** (seo README 포함 시 79) |
| og:image 누락 | **0** (모두 default/cover로 채워짐 — 품질·중복 문제) |
| 우선순위 critical / high / medium / low | **15 / 26 / 1,199 / 215** |
| 1차 manifest 항목 | **38** (`needed` 20 + `existing-review` 18, ready 0) |

상세 수치는 `npm run audit:page-images` → `src/generated/page-inventory-summary.json` 참고.

### 기술 구조 요약

- Metadata: `createPageMetadata` ← PageData builders / `staticPageSeo`
- OG 기본값: `siteImages.seo.defaultOg` = **사무소-전경.jpg** (광범위 재사용)
- 커버: `getCoverImageForPageData` → `getServiceImage` / `getBlogPostImage` / `getCaseImage`
- JSON-LD: LegalService·LocalBusiness·FAQPage·Person 등 (`src/lib/seo/json-ld.ts`)
- Sitemap: prebuild `generate-sitemaps.mjs` (tier 1~7)
- robots: `src/app/robots.ts`

---

## 2. 메뉴·허브 구조 (실측)

헤더 `mainNavigation` 핵심:

- 소개 `/about`, 사무소 `/office`
- 업무안내 `/services` (+ 부산·전국 하위 링크)
- 협업문의 `/협업문의` (메가메뉴)
- 업무사례 `/업무사례`·`/cases`
- 강의·특강 (`lectureNavGroups`: `/법률강의`, 주제별 교육 URL)
- 상황 `/situations`, 도구 `/tools`, 법률지도 `/busan-legal-map`, 용어 `/glossary`
- 자가진단 `/자가진단`, 블로그 `/blog`, 언론 `/media`, 후기 `/reviews`, FAQ `/faq`
- 상담 `/contact`, 오시는 길 `/location`

한국어 랜딩은 `[landingSlug]`로 PageData registry에 연결.

---

## 3. 현재 대표 이미지 현황

| 유형 | 상태 |
|------|------|
| 정적 핵심 페이지 | `staticPageSeo`에 ogImage 필드 없음 → **defaultOg(사무소 전경) 의존** |
| 서비스·로컬·진단·도구 | `getServiceImage(serviceSlug)` → **10종 썸네일로 수백 URL 공유** |
| 블로그 | slug 키워드 기반 `pickThumbnailImagePath` |
| 사례 MDX 8건 | 지역·주제별 명시 매핑 |
| 언론 3건 | 실제 보도 이미지 |
| 강의 | `강의-*` 실사진 다수 |

### 이미지 중복 (핵심 문제)

- `사무소-전경.jpg`: 홈 OG·about profile·office·기본 OG
- `getServiceImage` 10장: 로컬 랜딩·토픽·SEO 랜딩 OG/커버에 반복
- 스톡 5종(서류등기·상담협의·계약임원·사무실·법원절차): media/FAQ/홈 쇼케이스

---

## 4. 캐러셀 후보 허브

| 허브 | 하위(메뉴·실측) | 적합 | ItemList | 비고 |
|------|-----------------|------|----------|------|
| `/services` | 서비스 상세 10 | ✅ | 이미지 승인 후 | 1순위 |
| `/법률강의` | 주제·강사 14 | ✅ | 실사진 정리 후 | 1순위 |
| `/전국업무` | 전국 하위 5 | ✅ | 고유컷 필요 | 1순위 |
| `/상담` | 상담 랜딩 8+ | △ | 보류 | CTA성 → 카드 정비 우선 |
| `/situations` | 동적 | 실측 후 | — | 생성기에서 child 수 확인 |
| `/자가진단` | 동적 | 실측 후 | — | 4개+·의도 분리 시만 |

**ItemList는 approved 이미지·화면 카드와 1:1일 때만 적용.** 현재는 코드에 ItemList를 넣지 않음.

---

## 5. 1차 제작 대상 (37)

선정 이유: sitemap tier1·메뉴 노출·상담 전환·허브/상세·현재 중복 OG.

파일: `src/data/seo/page-image-manifest.ts`

우선순위 요약:

- **critical**: `/`, `/services`, 핵심 `/services/*`, `/부산법무사`, `/부산상속등기`, `/부산부동산등기`, `/부산개인회생`, …
- **high**: 임원변경·설립, 해운대, 전국, 상담, 강의, 사례, 상황, 자가진단, contact
- **medium/low**: FAQ, glossary, tools, office, media 등

상태:

- `existing-review`: 기존 파일로 임시 유지 가능 (전용 SEO컷 권장)
- `needed`: 전용 이미지 신규

**신규 경로**는 모두 `/image/seo/seo-*.webp` — **아직 파일 없음 → OG 미연결**.

---

## 6. 2차·3차 제작

### 2차

- situations·diagnosis 상세 (의도별)
- 업무사례 지역 허브 (`/업무사례/*`)
- 주요 검색의도 랜딩 (search-guides 하위)
- 강의 이력 개별 카드

### 3차

- 세부 동·구 랜딩
- FAQ 상세
- glossary 용어
- 저트래픽 로컬 조합 페이지

---

## 7. 기존 이미지 재사용

| 경로 | 용도 | 재사용 |
|------|------|--------|
| `썸네일-등기필증_*.jpg` | 상속·매매·근저당 | 카드·본문 OK, OG는 타이포 합성본 권장 |
| `썸네일-동부지원/서부지원` | 회생·파산 | 검토 후 사용 |
| `강의-*` | 강의 주제 | **강의 페이지만**, 전 사이트 반복 금지 |
| `썸네일-정면.jpg` | 소개·강사 | 소수 페이지만 |
| `썸네일-아래.jpg` | — | 미사용 → 추가 촬영·crop 후보 |
| `사무소-*` | 사무소·홈 | 사무소/홈 한정 |
| `언론-*` | media | media만 |
| `로고.png` | — | **대표이미지 금지** |
| 지도·명함성 | — | **대표이미지 금지** |

---

## 8. 이미지 디자인 시스템

`src/data/seo/page-image-design-system.ts`

- 색: navy `#1e3a5f`, cream `#f7f4ef`, beige `#f0ebe3`
- 캔버스: **1200×800 WebP**
- 안전영역: 가장자리 ~20%
- 금지: 동일 템플릿 제목만 교체, 가짜 서류/기관로고, 전화 대형 배너, 인물 AI 변조

---

## 9. 이미지별 제작 표 (1차)

| 우선 | URL | headline | subheadline | 파일명 | 사진 | 상태 |
|------|-----|----------|-------------|--------|------|------|
| critical | `/` | 부산 법무사 | 상속·등기·회생 상담 | seo-home-busan-lawyer.webp | office | existing-review |
| critical | `/services` | 업무안내 | 상속·부동산·법인·회생 | seo-services-hub.webp | none | existing-review |
| critical | `/services/inheritance-registration` | 상속등기 | 서류·절차·비용 | seo-svc-inheritance-registration.webp | document | existing-review |
| critical | `/services/inheritance-renunciation` | 상속포기 | 3개월 안에 확인 | seo-svc-inheritance-renunciation.webp | none | needed |
| critical | `/services/qualified-acceptance` | 한정승인 | 채무가 불확실할 때 | seo-svc-qualified-acceptance.webp | none | needed |
| critical | `/services/real-estate-registration` | 부동산등기 | 이전·말소·담보 | seo-svc-real-estate-registration.webp | none | existing-review |
| high | `/services/ownership-transfer` | 매매등기 | 잔금부터 이전까지 | seo-svc-ownership-transfer.webp | document | existing-review |
| critical | `/services/corporate-registration` | 법인등기 | 설립·임원·본점 | seo-svc-corporate-registration.webp | none | existing-review |
| high | `/services/company-establishment` | 법인설립 | 준비부터 등기까지 | seo-svc-company-establishment.webp | none | needed |
| high | `/services/director-change` | 임원변경 | 기한 놓치기 전에 | seo-svc-director-change.webp | none | needed |
| critical | `/services/personal-rehabilitation` | 개인회생 | 자격·서류·절차 | seo-svc-personal-rehabilitation.webp | none | existing-review |
| high | `/services/bankruptcy` | 개인파산 | 면책까지 확인 | seo-svc-bankruptcy.webp | none | existing-review |
| critical | `/부산법무사` | 부산 법무사 | 해운대·센텀 상담 | seo-local-busan-lawyer.webp | office | needed |
| critical | `/부산상속등기` | 부산 상속등기 | 관할·서류 확인 | seo-local-busan-inheritance.webp | document | needed |
| critical | `/부산부동산등기` | 부산 부동산등기 | 매매·증여·말소 | seo-local-busan-real-estate.webp | none | needed |
| high | `/부산법인등기` | 부산 법인등기 | 설립·변경·이전 | seo-local-busan-corporate.webp | none | needed |
| critical | `/부산개인회생` | 부산 개인회생 | 상담 전 확인사항 | seo-local-busan-rehab.webp | none | needed |
| high | `/해운대법무사` | 해운대 법무사 | 센텀 방문·비대면 | seo-local-haeundae-lawyer.webp | office | needed |
| high | `/전국업무` | 전국 업무 | 관할 특례 확인 | seo-nationwide-hub.webp | none | needed |
| high | `/전국상속등기` | 전국 상속등기 | 타지역 부동산도 | seo-nationwide-inheritance.webp | none | needed |
| high | `/about` | 안윤정 법무사 | 자격·수상·강의 | seo-about-lawyer.webp | speaker | existing-review |
| medium | `/office` | 사무소 안내 | 센텀·주차·상담실 | seo-office.webp | office | existing-review |
| high | `/contact` | 상담 문의 | 전화·카카오·방문 | seo-contact.webp | none | existing-review |
| high | `/상담` | 간편 상담 | 상황만 선택해도 OK | seo-consult-hub.webp | none | needed |
| high | `/법률강의` | 법률 강의 | 기관·청년·도서관 | seo-lecture-hub.webp | lecture | existing-review |
| high | `/전세사기예방교육` | 전세사기 예방 | 계약 전 확인 | seo-lecture-jeonse.webp | lecture | existing-review |
| medium | `/청년생활법률특강` | 청년 생활법률 | 주거·계약·채무 | seo-lecture-youth.webp | lecture | existing-review |
| medium | `/강사소개` | 강사 소개 | 안윤정 법무사 | seo-lecture-speaker.webp | speaker | existing-review |
| high | `/업무사례` | 업무사례 | 지역·업무별 탐색 | seo-cases-hub.webp | none | needed |
| high | `/situations` | 이런 상황이면 | 상황별 다음 단계 | seo-situations-hub.webp | none | needed |
| high | `/자가진단` | 자가진단 | 지금 필요한 절차 | seo-diagnosis-hub.webp | none | needed |
| medium | `/search-guides` | 검색 전 확인 | 추천·비용·서류 | seo-search-guides.webp | none | needed |
| medium | `/협업문의` | 협업·복대리 | 기업·중개·기관 | seo-b2b-hub.webp | custom | existing-review |
| medium | `/faq` | 자주 묻는 질문 | 절차·서류·비용 | seo-faq-hub.webp | none | needed |
| low | `/glossary` | 법률 용어 | 등기·회생 용어 | seo-glossary-hub.webp | none | needed |
| low | `/tools` | 실무 도구 | 체크·안내 | seo-tools-hub.webp | none | needed |
| medium | `/media` | 언론·활동 | 보도·강의·자문 | seo-media-hub.webp | custom | existing-review |

전체 필드(alt, visualConcept, OG/본문/카드 플래그)는 manifest 소스 참고.

---

## 10. 필요한 실제 사진

| 사진 | 용도 | 보유 |
|------|------|------|
| 정면 상반신 | 소개·강사 | ✅ `썸네일-정면.jpg` |
| 아래 각도 | 보조 | 파일 있음·미사용 |
| 사무소 전경/내부/명패 | 홈·사무소 | ✅ |
| 강의 현장 | 강의 허브·주제 | ✅ `강의-*` |
| 상담 테이블 | 상담 허브 | △ 상담-* 일부 |
| 서류 설명 장면 | 업무 상세 | △ 필증 썸네일 |

**금지:** AI로 얼굴 생성·변조, 가짜 강의장.

---

## 11. 적용 순서

1. 디자인·카피 확정 (본 문서 + manifest)  
2. `/public/image/seo/`에 WebP 업로드  
3. manifest `status`: `needed` → `approved` → `applied`  
4. `resolvePageSeoImage(url)`을 metadata/커버에 **조건부** 연결 (ready일 때만)  
5. `/services`·`/법률강의` 화면에 카드 그리드 = ItemList 동기화  
6. `npm run check:og-images` / `check:carousel-images`  
7. 네이버·IndexNow는 **기존 URL 유지**한 채 재수집 요청

---

## 12. 네이버 수집 요청 대상 (이미지 적용 후)

1차 URL: `/`, `/services`, 서비스 상세 10, `/부산법무사`, `/부산상속등기`, `/부산부동산등기`, `/부산개인회생`, `/해운대법무사`, `/전국업무`, `/법률강의`, `/상담`, `/업무사례`, `/자가진단`, `/situations`

---

## 13. 코드 산출물

| 경로 | 역할 |
|------|------|
| `src/data/seo/page-image-types.ts` | 타입 |
| `src/data/seo/page-image-design-system.ts` | 디자인 토큰 |
| `src/data/seo/page-image-manifest.ts` | 1차 명세·캐러셀 후보 |
| `src/data/seo/page-inventory.ts` | 웨이브1 헬퍼 |
| `src/lib/seo/page-images.ts` | ready일 때만 resolve |
| `scripts/generate-page-image-inventory.ts` | 전수 인벤토리 |
| `scripts/audit-page-images.ts` | 감사 |
| `scripts/check-og-images.ts` | 파일 검사 |
| `scripts/check-carousel-images.ts` | 캐러셀 검사 |
| `public/image/seo/README.md` | 업로드 안내 |

### npm scripts

```bash
npm run audit:page-images
npm run check:og-images
npm run check:carousel-images
```

---

## 14. 의도적으로 하지 않은 것

- 기존 URL/메뉴/sitemap/canonical 변경
- 존재하지 않는 `seo/*.webp`를 og:image에 등록
- ItemList JSON-LD 선제 삽입
- 캐러셀용 얇은 신규 페이지 생성
- placeholder·빈 이미지 배포
