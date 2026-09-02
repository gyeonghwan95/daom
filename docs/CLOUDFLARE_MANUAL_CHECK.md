# Cloudflare dashboard — manual check after deploy

Cursor cannot change the Cloudflare plan or read live KV metrics. After deploy, compare **before vs after** in the account that owns `ADMIN_KV`.

## KV usage

Workers & Pages → KV → namespace **gyeonghwan** (prod) → Metrics / Usage

Record daily:

- reads
- writes
- deletes
- lists

Expect:

- **writes** drop sharply (page_view + skip ingest removed). Should no longer track visits 1:1.
- **reads** drop on public traffic; remaining reads are notice cache misses + admin + conversion events.
- **lists** stay ~0 (code never calls `list()`).

Limits reset 00:00 UTC. Free plan published caps (docs): 100,000 reads / 1,000 writes / 1,000 lists per day. Do not treat those numbers as hardcoded in the app.

## Workers

Workers & Pages → this Pages project → analytics

- Invocations of `/api/analytics/collect` should fall (no page_view beacon).
- `/api/notices/active` may remain but should be cacheable (Cache-Control 300s).

## What should stay healthy

- HOME and champion URLs: 200 HTML, same title/H1.
- `https://다옴법무사사무소.kr/robots.txt` and `/sitemap.xml`: 200, no KV.
- Inquiry POST: still real success/failure (do not treat KV-down mail log as “submitted” if delivery failed).

## Admin

`/admin` KPIs: historical page views remain; new browsing will not increment page_view counters. CTA / consult submit / mail logs still update.
