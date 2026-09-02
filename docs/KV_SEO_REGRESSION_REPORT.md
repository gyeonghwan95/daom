# KV work — SEO regression report

This change is infrastructure only. Champion fingerprints were asserted in `scripts/test-kv-zero-hotpath.ts` against `src/lib/seo/metadata.ts`.

| Field | Change |
|-------|--------|
| Public URL / slug | **0** |
| New 301 | **0** |
| New noindex | **0** |
| Canonical owner | **0** |
| HOME title | unchanged `부산 법무사 안윤정 \| 다옴법무사사무소` |
| HOME H1 | unchanged `부산 법무사 안윤정` |
| robots.txt Yeti | unchanged allow `/`, disallow `/admin` `/api/` `/search` `/blog/external/` |
| sitemap generation | still prebuild, KV-free |
| JSON-LD / metadata pipeline | still build-time, KV-free |
| Internal links | not edited |
| Public `_headers` HTML | unchanged `max-age=0, must-revalidate` |
| `/image/*` `/video/*` extra TTL | **reverted** — unfingerprinted OG/본문 사진 재수집 지연 방지 |
| Client-only SEO body | **not** done (forbidden) |
| Cloaking / bot-specific HTML | **not** done |

Protected owners (`/`, `/부산법무사상담`, `/부산상속법무사`, `/부산상속등기`, `/부산상속포기`, `/부산한정승인`, region/corporate/lecture hosts) remain static HTML from `out/`. KV failure cannot 5xx those files because Functions never serve them (`public/_routes.json` include `/api/*` only).

Admin UI copy now states that live page views are not written to KV. That is `/admin` only (`X-Robots-Tag: noindex`).
