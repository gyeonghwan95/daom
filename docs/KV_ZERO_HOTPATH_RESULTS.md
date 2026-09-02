# KV zero-hotpath results

Measured from repository call graph + mock KV tests (`scripts/test-kv-zero-hotpath.ts`). Not Cloudflare dashboard numbers.

| Route | Before (JS visit) | After |
|-------|-------------------|--------|
| `/` HTML | 0 | 0 |
| `/` + page_view collect | 2 GET + 2 PUT | **0** (not stored; beacon removed) |
| `/` + notices/active | 1 GET | **0** on cache hit, **1 GET** on 5-minute miss |
| robots.txt | 0 | 0 |
| sitemap.xml | 0 | 0 |
| `/부산상속법무사` HTML | 0 | 0 |
| `/contact` GET | 0 | 0 |
| `/contact/inquiry` GET | 0 | 0 |
| static assets | 0 | 0 |
| `page_view` writes | 2 PUT | **0** |
| public `KV.list` | 0 | 0 |
| collect skip `bumpIngest` | 2 ops | **0** (only `store_error` still writes) |
| notice_impression | 2 GET + 2 PUT | **0** |
| CTA click | 3 GET + 3 PUT | 3 GET + 3 PUT (unchanged, rare) |
| inquiry POST delivery | 1 GET + 1 PUT | 1 GET + 1 PUT |
| admin dashboard | ~229 GET | ~194 GET (in-request memo + one email log read) |
| admin monitoring | ~229 GET | ~12 GET |
| admin pages 30d | ~396 GET | ~270 GET (unique days only) |

Public SEO mandatory KV read on HTML: **0** (before and after).  
Visitor growth vs KV: **no longer linear** for browsing; only conversion events and rare notice cache misses scale.

Chaos: throwing KV on `page_view` and `notices/active` still returns **200** with safe defaults. CTA store failure returns `stored: false` (not a fake success). Inquiry delivery still reports real errors.
