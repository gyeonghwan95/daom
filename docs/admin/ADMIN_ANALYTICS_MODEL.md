# Admin Analytics Model

## Ingest

```
Browser → POST /api/analytics/collect → recordAnalyticsEvent()
```

- `/admin` and `/api` paths skipped (never stored; leftover keys stripped on read)
- Valid `daom_admin_session` skipped (owner browsing public pages is not a visitor)
- Client also skips when an admin session is present (`daom_analytics_exclude` + sessionStorage)
- Bot UA skipped
- `page_view` increments daily visits and unique `sid` sessions; `notice_impression` increments notice stats. Same IP+path is deduped for 8s (no KV write). Client also dedupes page_view for 30s.
- Skip paths (bot, empty UA, admin session/path, dedupe) do **not** write ingest counters. Only `store_error` persists ingest.
- Rate limit: 120/min/IP
- Payload whitelist (`text/plain` or JSON body)
- First page_view in a tab = landing source (naver/google/direct). Later views = `internal`
- Writes go to sharded daily KV keys (hourly buckets are nested on the same document so a page_view is 1 GET + 1 PUT, not 2+2)

## Aggregation Keys

| Key | Content |
|-----|---------|
| `analytics:day:YYYY-MM-DD` | legacy unsharded day (still read) |
| `analytics:day:YYYY-MM-DD:s0`–`s7` | sharded visits, sessions, paths{}, sources{}, devices{}, nested `hours{}`, naverPlace* |
| `analytics:hourly:YYYY-MM-DD` | **legacy read-only** (pre-nested hourly; no longer written) |
| `analytics:hourly:YYYY-MM-DD:s0`–`s7` | **legacy read-only** |
| `analytics:recent` | Last 25 CTA/conversion events (no PII) |
| `email:logs` | Ring buffer 500 |
| `notices:all` | Floating notices |
| `audit:logs` | Admin actions 200 |

## Path Identity

- **Storage key**: `normalizePath()` — decode URI, strip query/hash, no trailing slash
- **Display**: `safeDecodePathname()` + `admin-page-titles.json` for titles
- **Merge on read**: `mergePathStats()` combines legacy encoded/decoded duplicates

## Retention

- Daily/hourly: indefinite (low volume)
- Recent activity: 25 events
- Email logs: 500
- No raw per-event store (privacy + KV size)

## Timezone

All date boundaries use `formatKstDate()` / `getKstHour()` in Cloudflare Functions (UTC input → KST bucket).
