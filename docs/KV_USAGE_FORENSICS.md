# KV usage forensics

Single namespace: **ADMIN_KV** (`wrangler.toml` → prod `gyeonghwan` / preview `gyeonghwan-preview`).

There is **no** `STATS_KV`, `CONTACT_KV`, `NOTICE_KV`, `MAIL_LOG_KV`, or `SITE_CONFIG_KV`. All notices, analytics shards, email logs, and audit trails share `ADMIN_KV`.

There is **no** Next.js `middleware.ts`, **no** Pages `_middleware`, and **no** KV read in layout/HTML render. Cloudflare Pages `_routes.json` only sends `/api/*` to Functions. Static HTML, CSS, JS, images, `robots.txt`, and `sitemap.xml` never touch KV.

Official Free-tier reference (Cloudflare docs, not hardcoded in runtime): **100,000 reads / day**, **1,000 writes / day**, **1,000 lists / day**, reset 00:00 UTC. Exceeding a type returns errors (often surfaced as 429).

## Why writes filled first (evidence)

A stored `page_view` did **2 GET + 2 PUT** (day shard + hourly shard).  
`1,000 writes / day ÷ 2 PUT = ~500 stored page views` before the write cap. Ingest counters (`bumpIngest`) added **GET+PUT on skipped collects** (dedupe, empty UA, rate limit), so bots/spam also burned writes.

This is **not** explained by HTML traffic or Yeti. Yeti/Googlebot fetch static `out/` HTML (0 KV). Collect already skipped verified bots — but **JavaScript visitors** and **rejected collect POSTs** were the write amplifiers.

## Hot paths (before)

| Rank | Path | Ops | Class |
|------|------|-----|--------|
| 1 | `POST /api/analytics/collect` `page_view` | 2 GET + 2 PUT | CRITICAL |
| 2 | `bumpIngest` on skip/reject | 1 GET + 1 PUT | HIGH |
| 3 | `GET /api/notices/active` per navigation | 1 GET | HIGH |
| 4 | `GET /api/admin/dashboard` | ~229 GET (9-key shard merge, duplicate today) | CRITICAL (admin) |
| 5 | `GET /api/admin/pages?days=30` | ~396 GET | HIGH (admin) |

**No `KV.list` anywhere.** Negative lookups: `getDaily`/`getHourly` always read legacy unsharded key + 8 shards (9 GETs), many of them empty.

## Non-visit sources checked

| Source | KV? |
|--------|-----|
| Admin dashboard (manual refresh, no polling) | Yes — large GET fan-out |
| Wrangler / local Pages | Same Functions if bound |
| Cron / scheduled | None in `wrangler.toml` |
| Health checks | No KV route |
| Prefetch of HTML | Static files only |
| Form GET `/contact` | 0 |
| Form POST success | email log 1 GET + 1 PUT |

See `audit/kv/namespaces.csv` and `audit/kv/route-operation-matrix.csv`.
