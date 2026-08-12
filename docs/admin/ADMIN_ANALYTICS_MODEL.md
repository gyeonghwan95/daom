# Admin Analytics Model

## Ingest

```
Browser → POST /api/analytics/collect → recordAnalyticsEvent()
```

- Admin paths skipped
- Rate limit: 120/min/IP
- Payload whitelist

## Aggregation Keys

| Key | Content |
|-----|---------|
| `analytics:day:YYYY-MM-DD` | visits, cta, paths{}, sources{}, devices{}, naverPlace* |
| `analytics:hourly:YYYY-MM-DD` | hours["0".."23"] { pageViews, cta, consultSubmit, naverPlace } |
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
