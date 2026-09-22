# 05 — Technical SEO (targets)

| URL | 200 | indexable | self canonical | H1=1 | unique title/desc | sitemap | static HTML |
|-----|-----|-----------|----------------|------|-------------------|---------|-------------|
| /부산상속법무사 | Y | Y | Y | Y | Y | Y | Y |
| /부산등기법무사 | Y | Y | Y | Y | Y | Y | Y |
| /부산법인등기 | Y | Y | Y | Y | Y | Y | Y |
| /해운대법무사 | Y | Y | Y | Y | Y | Y | Y |
| /업무사례/울산상속등기법무사 | Y | Y | Y | Y | Y | Y | Y |
| /부산보상등기 | Y | Y | Y | Y | Y | Y | Y |

- meta keywords: 미사용
- QA script: `scripts/target-seo-qa.mjs` → issues=0
- production build: OK (static export)
- sitemap lastmod: 소스 mtime 기반. 해운대 등 수정 파일만 2026-09-22로 갱신 확인. 전 URL 일괄 build-date lastmod 아님.
