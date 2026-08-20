# URL 무결성 전수조사 (2026-08-21)

## 판정: **문제 없음 (차단급 없음)**

기존 공개 허브 URL이 삭제·변경된 흔적 없음. 끊긴 내부 링크(`/cases` 허브, `/services#cases`)는 이전 비상 수정으로 정리됨. 리다이렉트 목적지는 전부 레지스트리/라우트에 존재.

---

## 1. 런타임 레지스트리 검증 (`getAllPageData`)

| Path | 레지스트리 | indexable |
|---|---|---|
| `/자가진단` | OK | true |
| `/업무사례` | OK | true |
| `/partners` | OK | true |
| `/법률강의` | OK | true |
| `/situations` `/tools` `/glossary` `/busan-legal-map` `/faq` `/media` | OK | true |
| `/개인정보처리방침` `/이용약관` `/services` | OK | true |
| `/사하구부동산등기` `/서구부동산등기` `/영도구부동산등기` | OK | true |

총 페이지 1797 · indexable 1664.

---

## 2. 리다이렉트 맵 (`public/_redirects` + `next.config.ts`)

| Source | Destination | 목적지 존재 |
|---|---|---|
| `/cases` | `/업무사례` | OK |
| `/cases/*` | `/services/cases/:splat` | OK |
| `/press` | `/media` (config는 `#press`) | OK |
| `/press/*` | `/media/:splat` | OK |
| `/privacy` `/privacy-policy` | `/개인정보처리방침` | OK |
| `/terms` `/terms-of-service` `/terms-of-use` | `/이용약관` | OK |
| `/blog/external/*` | 네이버 블로그 | external OK |

의도적 레거시 흡수. **공개 허브 삭제 아님.**

---

## 3. 내부 링크 스캔 (`src/`)

| 패턴 | 결과 |
|---|---|
| `href="/cases"` / `href: "/cases"` (허브) | **0건** |
| `/services#cases` | **0건** |
| `/press` `/privacy` `/terms` 등을 href로 사용 | **0건** (리다이렉트·별칭만) |

개별 사례는 `/services/cases/{slug}` 사용 — 정상.

---

## 4. 의도적 비색인·레거시

| Path | 상태 |
|---|---|
| `/cases` | 레지스트리에 있으나 **noindex/redirect** → `/업무사례`. `CasesExplorer` 페이지는 프로덕션에서 도달 불가(orphan UI) |
| `/press` | redirect → `/media` |
| `/privacy` 등 ASCII | `_redirects`로 한글 법적 페이지로 흡수 |

---

## 5. 변경·삭제 위험 평가

| 항목 | 평가 |
|---|---|
| 허브 URL 삭제 | **없음** |
| 허브 slug 변경 | **없음** |
| `/cases` 리다이렉트 목적지 | `/services` → `/업무사례`로 **복구** (이전엔 잘못 끊김) |
| Phase1 신규 3구 부동산등기 | 레지스트리 OK. **커밋된 sitemap-manifest 산출물은 구버전**일 수 있음 → 다음 `prebuild`/`sitemap:generate` 시 반영 |

---

## 6. 비차단 잔여 이슈

1. **Sitemap 산출물 시차**: `scripts/output/sitemap-manifest.json`에 3구 신규 path가 없을 수 있음. 배포 빌드 시 `generate-sitemaps`가 갱신하면 해소.
2. **`/cases` CasesExplorer orphan**: 메타데이터·라우트는 남고 리다이렉트로만 흡수. UX 충돌만 가능(색인 제외됨).
3. **`_redirects` `/press` vs next `#press`**: 해시만 다름, 404 아님.
4. `npm run check:internal-links`의 `/contact/inquiry?...` MISSING은 **쿼리 URL을 known set에 안 넣어서 나는 노이즈**이며, 이번 허브 무결성과 무관.

---

## 결론

- **끊긴 공개 허브 URL: 없음**
- **기존 허브 삭제·slug 변경: 없음**
- **레거시 URL: 301으로 올바른 목적지에 흡수**
- 배포 시 sitemap 재생성만 확인하면 신규 3구 페이지 색인 목록도 동기화됨
