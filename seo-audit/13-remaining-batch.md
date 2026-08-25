# 13 — Remaining work batch (2026-08-26)

## Done

### REBUILD-C hand overlays
- Added `src/data/seo/region-service-overlays.ts` for 13 HIGH paths (남구/강서/서면/동구 부동산, 서면·중구·북구 법인, 중구·센텀시티역·부산진구·강서 상속, 법인등기필요서류, 소유권이전등기필요서류)
- Wired via `getSeoLandingSlugOverlay` in `seo-landing/content.ts`
- Similarity sample: **highRisk 0** (was 8+); top pairs now REVIEW ≤68.5

### Off-page
- `seo-audit/09-offpage-actions.md` — NAP 표 구체화 (상호·주소·전화·Place URL·영업·사업자번호)
- 외부 계정 수정은 운영자 수동 (도구로 불가)

### IndexNow
- `npm run indexnow:dry` → sitemap diff **0** (URL 집합 불변; 콘텐츠 재수집은 Search Advisor / Priority A 목록 사용)
- 제출 목록: `reports/seo/index-submit-master-rebuild-2026-08-26.txt`

## Verification
- `seo:regression` PASS (1639/1639, 0 change/delete)
- `tsc --noEmit` OK
- CREATE_NEW = 0

## Operator next (배포 후)
1. Cloudflare 등 배포
2. Search Advisor: P0 Priority A URL 검사
3. Place/Blog NAP = `09-offpage-actions.md` 표와 대조
4. 필요 시 `npm run indexnow` (배포 후 key 활성 확인)
