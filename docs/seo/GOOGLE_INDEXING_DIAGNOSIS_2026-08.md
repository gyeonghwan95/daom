# Google 색인 진단 (GSC 2026-08-07 기준)

## 요약

| 항목 | 수치 |
|------|------|
| 색인됨 | **11** |
| 색인 안 됨 | **~1,610** |
| 발견됨 – 현재 미색인 | **1,505** |
| 크롤링됨 – 현재 미색인 | **108** |
| 리디렉션 오류 | **1** |

7월 말 sitemap·대량 URL 노출 이후 **미색인 급증**. Indexed(11)는 거의 정체.

## 원인 (기술 점검 결과)

### 1) robots / 차단 — 아님

- `src/app/robots.ts`: Googlebot·* 허용, `/admin`·`/api`·`/search`만 disallow.
- Sitemap 호스트는 `getSiteUrl()`(punycode)로 canonical과 통일.

### 2) 발견됨 – 미색인 (1,505) — 주원인

Google이 URL을 **알고만** 있고 아직 크롤·색인하지 않음.

- Sitemap ~1.6k URL 일괄 노출 → 크롤 예산·품질 신호 분산
- 템플릿·지역·키워드 랜딩 비중 큼 → “가치 대비 비용” 판단으로 지연
- IndexNow ≠ Google 색인 보장

### 3) 크롤링됨 – 미색인 (108)

크롤 후 품질·중복·얇은 콘텐츠로 보류. 동·역세권·전문검색 보조 URL이 후보.

### 4) 리디렉션 오류 (1)

단일 URL. GSC에서 해당 URL 확인 후 체인만 수정. **기존 슬러그 삭제·대량 리다이렉트 금지.**

## 하지 않을 것 (상위노출·URL 보호)

- 기존 URL 삭제·슬러그 변경·canonical 일괄 변경
- Champion title/H1 변경
- 대량 noindex / 대량 301
- 신규 페이지 공장식 증설로 sitemap 팽창

## SAFE 대응 (코드 반영)

1. **홈·허브 권한 집중** — 「전문」라벨·전문검색 URL 1차 노출 축소, Champion(`/부산법무사`, `/부산상속법무사`, `/부산법인법무사`, `/부산상속포기` 등)으로 링크
2. **가짜 “수요가 많습니다” 문구 정리** — 검증 불가 수요 주장 제거
3. **Spoke→Champion 내부링크** — `internal-links.ts`에서 업무 클러스터별 Champion 선행 링크
4. **색인 요청은 Tier 1–2 우선** — 아래 URL 큐만 GSC「색인 생성 요청」/배포 후 재수집
5. **문의 Turnstile fail-closed** — Secret 없으면 거절(배포에 bypass 금지)
6. **네이버 리뷰 fetch soft-fail** — prebuild가 스크래핑 실패로 중단되지 않음

## 운영 체크리스트 (배포 후)

1. GSC → 페이지 색인 생성: 「발견됨」샘플 20개 중 thin/중복 비율 확인
2. **아래 P0 Champion만** URL 검사 → 색인 생성 요청 (하루 한도 준수)
3. 리디렉션 오류 1건 식별·수정
4. 신규 URL 추가 동결 유지; 개선은 기존 Champion 본문·내부링크만
5. Indexed 수가 주 단위로 Champion부터 늘어나는지 추적

## 관련 파일

- `config/seo-protected-assets.json`
- `scripts/output/index-request-urls-2026-08-10.txt`
- `scripts/output/index-priority-urls.txt` (전체 Tier)
- `docs/seo/BUSAN_PRIORITY_QUERY_AUDIT_2026-08.md`
