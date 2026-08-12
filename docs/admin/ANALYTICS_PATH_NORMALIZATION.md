# Analytics Path Normalization

## Rule

1. **Ingest / storage key**: `normalizePath()` — decode `%`-encoding, strip query/hash, no trailing slash
2. **Display**: `safeDecodePathname()` + page title from `admin-page-titles.json`
3. **Read merge**: `mergePathStats()` sums legacy encoded + decoded keys

## Examples

| Raw (KV key legacy) | Normalized key | Display |
|---------------------|----------------|---------|
| `/%ED%98%91%EC%97%85%EB%AC%B8%EC%9D%98` | `/협업문의` | 협업문의 |
| `/협업문의` | `/협업문의` | 협업문의 |

## Migration

No KV rewrite required. New events use normalized keys; old duplicates merged at read time.

## Client

`beacon.ts` normalizes path before POST to prevent new duplicates.
