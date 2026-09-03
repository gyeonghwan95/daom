# KV architecture before / after

## Before

```
VISITOR (JS)
  → static HTML (KV = 0)
  → POST /api/analytics/collect page_view  → 2 GET + 2 PUT
  → GET  /api/notices/active               → 1 GET
YETI
  → static HTML (KV = 0)
ADMIN
  → GET /api/admin/dashboard               → ~229 GET
```

Public SEO HTML was already static export (`out/`, `STATIC_EXPORT=true`). The defect was **client follow-up Functions** that made KV grow linearly with visits, especially **writes** against the 1,000/day Free cap.

## After

```
VISITOR
  → static HTML (KV = 0)
  → POST /api/analytics/collect page_view → 1 GET + 1 PUT (hourly nested on day shard)
YETI / bots
  → static HTML (KV = 0); collect skipped with 0 writes
공지
  → EDGE CACHE (5 min); HIT KV = 0; MISS 1 GET
전환 이벤트 (CTA, 문의 제출, 공지 클릭)
  → POST collect → sharded GET+PUT

문의 POST
  → 전달 성공/실패 시에만 email:logs GET+PUT (1+1)

ADMIN
  → dashboard still reads shards (memoized in-request)
  → monitoring uses today-only subset (~12 GET)
```

## What did not change

- Public URLs, title, H1, canonical, robots, sitemap membership
- Static-first HTML (no SSR migration, no bot-only HTML)
- ADMIN_KV still stores notices, conversion analytics, mail logs, audit
- No new third-party analytics product

## Layering

| Layer | Source of truth | KV |
|-------|-----------------|----|
| STATIC SEO CONTENT | repo / `out/` | never |
| EDGE-CACHED PUBLIC DYNAMIC | `notices:all` behind Cache API 300s | miss only |
| EVENT-DRIVEN WRITE | page_view / CTA / inquiry / notice | per event (page_view 1 PUT) |
| ADMIN ONLY | dashboard, logs, notice CRUD | on demand |
