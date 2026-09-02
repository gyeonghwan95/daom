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
VISITOR / YETI
  → CLOUDFLARE EDGE / STATIC HTML
  → KV operations = 0

공지 등 비SEO 동적 정보
  → EDGE CACHE (5 min, per colo)
  → HIT  KV = 0
  → MISS KV = 1 GET (notices:all blob) then cache

전환 이벤트 (CTA, 문의 제출, 공지 클릭)
  → POST collect → sharded GET+PUT (event-driven, not per view)

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
| EVENT-DRIVEN WRITE | CTA / inquiry / notice click | per event |
| ADMIN ONLY | dashboard, logs, notice CRUD | on demand |
