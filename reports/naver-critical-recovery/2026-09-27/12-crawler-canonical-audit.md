# 12 — Crawler / canonical audit (live, before deploy; 2026-09-27 07:57 UTC)

Checked with three User-Agents (browser, Yeti, Googlebot) via plain HTTP GET; no login, no CAPTCHA handling, 3 URLs only.

| Check | /부산상속전문법무사 | /부산상속포기 | /해운대법무사 |
|---|---|---|---|
| Status (browser / Yeti / Googlebot) | 200 / 200 / 200 | 200 / 200 / 200 | 200 / 200 / 200 |
| Cloudflare challenge (`cf-mitigated`, challenge page) | none | none | none |
| X-Robots-Tag | none | none | none |
| meta robots | index, follow | index, follow | index, follow |
| canonical | self (percent-encoded) | self | self |
| Same HTML for Yeti vs browser | yes (same title/H1/bytes) | yes | yes |
| robots.txt | `Allow: /` for `*`, Googlebot, Yeti (only /admin, /api, /search, /blog/external blocked) | same | same |
| sitemap.xml (root) | listed | listed | listed |
| tier sitemap lastmod | **missing (before)** → 2026-09-27 (after) | 2026-09-27 | 2026-09-27 |
| `http://` | 301 → https (same path) | 301 | 301 |
| `www.` host | no DNS record (connection fails) | same | same |
| trailing slash `/X/` | 308 → `/X` | 308 | 308 |
| `/X.html` | 308 → `/X` | 308 | 308 |

## Findings
1. **308 Location header is raw UTF-8 bytes**, not percent-encoded (clients that read it as Latin-1 see `/ë¶ì°…`). Browsers and Googlebot usually tolerate it; Yeti behaviour is not documented. This comes from the hosting layer (Cloudflare Pages static routing), not from page code → `CLOUDFLARE_APPROVAL_REQUIRED` (optional: a redirect rule that emits percent-encoded Location). No change made.
2. `www.` has no DNS record. Not harmful (no duplicate host). If a www record is ever added, it must 301 to the apex. Report only.
3. No WAF / Bot Fight / challenge observed for Yeti UA. Cloudflare security settings were not changed and should not be lowered.
4. Canonical, og:url, sitemap `<loc>` and internal hrefs all use the same percent-encoded form → no canonical conflict.

`CLOUDFLARE_APPROVAL_REQUIRED`: item 1 only (optional, low priority).
