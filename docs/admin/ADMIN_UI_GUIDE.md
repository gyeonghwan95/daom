# Admin UI Guide

## Layout

- **Desktop**: 15rem sidebar + full-width workspace
- **Mobile**: sticky nav tabs, stacked sections

## Components (`src/components/admin/`)

| Component | Use |
|-----------|-----|
| `PageIdentity` | Title + decoded URL + public link |
| `MetricCard` | KPI with delta vs compare period |
| `HourlyTrafficChart` | CSS bar chart, a11y table fallback |
| `AlertCenter` | Critical/warning alerts |
| `AdminPageHeader` | Title, refresh, timestamp |

## URL Display Rules

- Never show `%ED%98%91...` when decodable
- Links use `encodeURI(displayPath)` for href
- Aggregation keys unchanged in KV

## Empty States

- Use specific messages (“오늘 수집된 … 없습니다”)
- Never show fake zeros for missing data (`—`)

## Testing Admin Locally

```bash
npm run build
npm run preview:cf
# open http://127.0.0.1:8788/admin
```

Plain `next dev` does not serve Cloudflare Functions.

## Chart Library

None — CSS bars only, admin route chunk only.
