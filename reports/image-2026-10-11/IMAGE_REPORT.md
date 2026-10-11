# 이미지 개선 보고 (2026-10-11)

커밋·push·배포·외부 계정 작업은 하지 않았습니다. 검색 결과의 이미지 표시, 캐러셀 노출, 순위는 검색엔진이 판단하며 보장하지 않습니다.

## 0. 기준점(23:00 KST)

- 로컬 HEAD `563ade2`(직전 Google 색인 작업 커밋). 작업 전 트리에는 미추적 원본 이미지 60개(`public/image/` 15개, `public/image/서류/` 45개)와 빌드가 다시 쓴 파일만 있었음.
- 운영 배포: 조사 시작 시점은 `6cb8a32`, 작업 중 `563ade2` 배포가 Cloudflare check-run 기준으로 완료됨.
- 비교 기준선: `reports/google-index-2026-10-11/protect/final.json`(=`563ade2` 빌드)

## 1. 가장 큰 결함: OG·JSON-LD 이미지 주소의 이중 인코딩(확정, 운영에서 확인)

- 원인: `src/lib/seo/social.ts` `getAbsoluteAssetUrl()`. `siteImages`의 경로는 이미 퍼센트 인코딩된 값인데, 이를 다시 `encodeURIComponent`로 인코딩해 `%25EC…` 주소가 만들어졌습니다.
- 운영에서 확인: `/강서구상속포기`의 og:image와 사이트 전체 JSON-LD의 사무소 사진 주소가 404 text/html.
- 영향(수정 전 빌드 감사 `og-audit-before.csv`)
  - 색인 대상 1,639개 중 1,550개 페이지의 og:image가 없는 파일
  - 1,639개 전 페이지의 JSON-LD(기관·사무소·인물의 image·logo)가 깨진 주소
- 수정
  - `getAbsoluteAssetUrl()`: 조각마다 한 번 디코드한 뒤 인코드합니다. 원문과 인코딩된 경로 모두 같은 URL이 됩니다.
  - `src/lib/seo/share-image.ts`(새): og:image·twitter:image·`primaryImageOfPage`를 실제 파일 기준으로 맞춥니다.
    - 원본이 1200px 또는 600KB를 넘으면 같은 사진의 1200px JPEG 파생본(`/_img/…og.jpg`)을 씁니다. 상위 OG 원본이 1~4.6MB, 최대 4000px였습니다.
    - width·height·type은 실제 값으로 냅니다(`og:image:type` 추가).
  - `scripts/optimize-images.mjs`: 기존 WebP 생성 단계에서 원본 크기를 `src/generated/image-dimensions.json`에 기록하고 OG 파생본을 만듭니다. 결과는 130개이고, EXIF는 제거됩니다.
- 결과(`og-audit-after.csv`, 수정 전 → 후)
  - 없는 OG 파일: 1,550 → 0
  - 이중 인코딩: 1,550 → 0
  - 선언 크기 불일치: 0
  - 깨진 JSON-LD 이미지: 1,639 → 0
  - 네이버 기준 미달(가로·세로 150px 초과, 5,000bytes 초과, 비율 3:1 이하): 0
- 사진 자체는 바뀌지 않았습니다. 같은 사진이 이제 실제로 열립니다.

## 2. 새 이미지 적용

같은 기관·같은 서류를 다루는 페이지에만 연결했습니다. 연결 방식은 기존 대표 이미지 리졸버(`resolveSerpImage`)에 넣은 대체 목록(`src/data/seo/field-photo-visuals.ts`)입니다. 큐레이션 대표 이미지(page-visuals)가 이미 있는 페이지는 건드리지 않았습니다. 한 항목이 본문 `<img>`(캡션 포함), og:image, `primaryImageOfPage`를 함께 정하므로, 메타데이터에만 있는 사진은 없습니다.

| 공개 파일(새 경로) | 원본 | 적용 페이지 |
|---|---|---|
| `/image/현장/현장-부산지방법원등기국-방문.jpg` 1600×1200 | `외근_여름_부산지방등기국 (2).jpg` | /부산지방법원등기국, /부산지방법원등기국법무사, /부산지방법원등기국부동산등기, /부산지방법원등기국법인등기, /부산지방법원등기국상속등기, /업무사례/부산지방법원등기국법무사 |
| `/image/현장/현장-부산지방법원서부지원-방문.jpg` 1600×1200 | `외근_여름_서부지원 (2).jpg` | /업무사례/부산서부지원법무사 |
| `/image/현장/현장-부산진구청-방문.jpg` 1600×1200 | `외근_진구청 (2).jpg` | /부산진구법무사, /업무사례/부산진구법무사 |
| `/image/업무서류/서류-상속재산포기심판청구-위임장.jpg` 1600×1200 | `서류/서류_상속포기.jpg` | /상속포기필요서류 |

- 인물 보정·재생성은 없습니다. 회전 보정, 크기 조정, EXIF 제거만 했습니다(`tools/make-derivatives.mjs`).
- 서류 사진은 원본 크기로 확인했습니다. 청구인 이름이 가려져 있고, 보이는 것은 사무소 정보·서류 종류·법원명뿐입니다.
- `PageRepresentativeFigure`: 정사각 고정 틀을 실제 이미지 비율로 바꿨습니다(기존 1200×1200은 그대로 1:1). 세로 이미지는 최대 480px 폭입니다. 캡션도 표시합니다.
- 페이지별 전후 매핑은 `image-mapping.csv`에 있습니다(1,560행, 그중 새 사진 본문 10행).

## 3. 보류 및 사용하지 않은 것

| 후보 | 사유 |
|---|---|
| 구청·시청·BIFC·우체국·행정복지센터 외관 9장 | 사람·업무 장면이 없는 건물 외관이라 고객에게 주는 정보가 적고, 그 지역에 사무소가 있는 것처럼 오해될 수 있음 |
| `사무소_저녁`, `사무소_저녁(2)` | 화면 간판이 '해운대 청년채움공간'이라 사무소 사진으로 표시하면 사실과 다를 수 있음 |
| 판결문·결과 화면(부당이득금) | 승소·성과를 내세우는 자료처럼 보일 수 있음 |
| 특별대리인 결정문 | 미성년 관련 법원 결정이라 가림이 있어도 민감 |
| 공증 인증서, 선박등기 신청서 | 가림은 확인했지만 대상 페이지(/법인공증준비, /부산선박등기, /선박등기)가 다른 템플릿이라 본문에 그림이 나오지 않아 OG에만 걸리게 됨. 연결과 파생본을 모두 철회 |
| 나머지 서류 사진(법인설립·본점이전·임원변경·증여·매매·상속 등) | 대상 페이지가 이미 큐레이션 대표 이미지를 쓰는 상위 페이지이고, 교체할 분명한 근거가 없음 |
| 글자 카드(공유용) 신규 제작 | 준비자료(/resources) OG 카드와 기존 캐러셀 카드가 이미 있어 이번에는 만들지 않음. 검색용 대표는 글자 없는 사진을 유지 |

미추적 원본 60개는 커밋하지 않았습니다. 그중 GPS 정보가 있는 파일은 0개, EXIF가 있는 파일은 15개입니다. 원본을 공개 폴더에 커밋하면 그대로 공개되므로, 공개용 파생본만 커밋하기를 권합니다.

## 4. 캐러셀

- 사이트 내부: 기존 캐러셀(`RelatedContentCarousel`, 홈 미디어)은 이번 범위에서 바꾸지 않았습니다. 새 사진은 슬라이더가 아니라 페이지당 1장 대표 그림으로 넣었습니다(lazy, width·height 지정).
- 검색 결과 캐러셀: 법률 서비스 페이지에 쓸 수 있는 Google 호스트 캐러셀 유형은 없습니다. LocalBusiness 캐러셀 베타는 안내된 제공 지역(EEA·튀르키예·남아공)이 한국이 아니라 적용하지 않았습니다. 네이버 플레이스 사진과 웹문서 이미지는 사이트 코드로 제어할 수 없습니다.
- 이미지 사이트맵: 대표 이미지가 실제 `<img>`와 OG로 나가므로 이번에는 추가하지 않았습니다(사이트맵 loc·분류 변경 없음).
- `max-image-preview: large`: 이미 공개 페이지 robots에 들어 있어 변경 없음. noindex 별칭 정책도 유지.

## 5. 검증

| 검사 | 결과 |
|---|---|
| 보호 비교(`563ade2` 빌드 대비, 1,893개 페이지) | title·description·H1·canonical·robots·OG 제목/설명·네이버 인증·링크·CTA 변경 0. 바뀐 필드는 ogImage 1,777개, JSON-LD 이미지 1,883개(주소 정정)뿐 |
| 페이지·사이트맵 | 페이지 삭제·추가 0, 사이트맵·하위 사이트맵 loc 변화 0, RSS·robots·헤더·리디렉션 동일 |
| 본문 변경 | 새 사진이 들어간 10개 페이지만 |
| lastmod | 지문 비교로 그 10개만 2026-10-11로 갱신. 전 페이지 OG 주소 정정은 날짜를 바꾸지 않음 |
| 로컬 HTTP(실제 GET) | 대표 20개 페이지의 og·twitter·JSON-LD·img·srcset 이미지 374개 모두 200 image/* (`http-check.csv`) |
| 현재 빌드의 없는 이미지 참조 | 0(`missing-refs.txt`의 1건은 파일명 괄호로 생긴 집계 오차, 실제 파일 있음). 과거 미사용 404 26개는 이전과 같이 참조 없음 |
| 화면 | /부산지방법원등기국법무사 PC 1440px, /상속포기필요서류·/부산진구법무사 모바일 390px. 공유 비율 1.91:1·1:1·4:3 자르기에서 얼굴·기관명 유지 |
| 테스트·타입·린트 | `npm test` 31/31, `tsc` 새 오류 0, 변경 src eslint 0 |
| 빌드 | 2회(매핑 3개 철회 후 재빌드) 성공 |

실행하지 못한 것:
- Rich Results Test 등 외부 도구
- 운영 HTTP 확인(새 파일이 아직 배포 전)
- 실제 Googlebot·Yeti 접근

## 6. 변경 파일

코드
- `src/lib/seo/social.ts`
- `src/lib/seo/share-image.ts`(새)
- `src/lib/seo/metadata.ts`
- `src/lib/seo/json-ld.ts`
- `src/lib/seo/page-visuals.ts`
- `src/data/seo/field-photo-visuals.ts`(새)
- `src/components/media/PageRepresentativeFigure.tsx`
- `src/components/page-data/PageDataTemplate.tsx`
- `scripts/optimize-images.mjs`

생성물
- `src/generated/image-dimensions.json`(새)
- `src/generated/image-variants.json`
- `public/sitemap.xml`, `public/sitemaps/*`
- `scripts/lib/sitemap/lastmod-manifest.json`, `lastmod-fingerprints.json`

새 이미지
- `public/image/현장/` 3개
- `public/image/업무서류/` 1개

보고·도구
- `reports/image-2026-10-11/`: inventory.csv, image-mapping.csv, og-audit-before/after.csv, http-check.csv, tools/*

`image-variants.json`과 `image-dimensions.json`에는 로컬에 있는 미추적 원본도 기록돼 있습니다. Cloudflare 빌드는 커밋된 파일만으로 다시 만듭니다.

## 7. 배포 후 확인

1. GitHub check-run으로 배포 commit을 확인합니다.
2. 운영에서 다음 URL이 200 image/jpeg 또는 image/webp인지 확인합니다.
   - `/_img/image/사무소-전경.og.jpg`
   - `/_img/image/현장/현장-부산지방법원등기국-방문.og.jpg`
   - `/_img/image/현장/현장-부산지방법원등기국-방문.1600.webp`
   - `/image/업무서류/서류-상속재산포기심판청구-위임장.jpg`
3. 대표 페이지(/, /부산상속등기, /강서구상속포기, /부산지방법원등기국법무사)에서 og:image가 200인지, width·height가 파일과 같은지 확인합니다. `og-audit.mjs`를 운영 HTML에 적용하거나 직접 확인합니다.
4. 공유 미리보기: 카카오톡 공유 디버거·페이스북 공유 디버거에서 1~2개 URL의 캐시를 갱신해 이미지 표시를 확인합니다.
5. Google: Search Console URL 검사의 '실제 URL 테스트'로 /부산지방법원등기국법무사의 이미지·구조화 데이터를 확인합니다. 색인 요청은 이 페이지에만 선택적으로 하고, 이미 요청한 /상속은 반복하지 않습니다.
6. 네이버: 서치어드바이저의 웹 페이지 수집 요청은 필요할 때 대표 1~2개만 합니다. 사이트맵 재제출은 하지 않습니다.
7. 2~4주 뒤 Search Console '이미지' 검색 유형의 노출을 보고, 실제 노출 여부는 따로 판단합니다.
