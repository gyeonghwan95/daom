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

- **writes** grow with unique public page views (**1 PUT** each: nested hourly on the day shard). Bot/admin/dedupe skips do not write. Expect writes to track visits roughly 1:1, plus rare CTA/mail/notice writes.
- **reads** drop on public traffic; remaining reads are notice cache misses + admin + conversion events.
- **lists** stay ~0 (code never calls `list()`).

Limits reset 00:00 UTC. Free plan published caps (docs): 100,000 reads / 1,000 writes / 1,000 lists per day. Do not treat those numbers as hardcoded in the app.

## Workers

Workers & Pages → this Pages project → analytics

- Invocations of `/api/analytics/collect` resume for page_view beacons (public pages only).
- `/api/notices/active` may remain but should be cacheable (Cache-Control 300s).

## What should stay healthy

- HOME and champion URLs: 200 HTML, same title/H1.
- `https://다옴법무사사무소.kr/robots.txt` and `/sitemap.xml`: 200, no KV.
- Inquiry POST: still real success/failure (do not treat KV-down mail log as “submitted” if delivery failed).

## Admin

`/admin` KPIs: public (non-admin, non-bot) browsing increments page views and sessions after this restore. Admin cookie visits still excluded. CTA / consult submit / mail logs still update.
