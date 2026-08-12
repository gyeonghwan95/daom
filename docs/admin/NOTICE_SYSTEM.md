# Notice System

## Architecture

```
ADMIN_KV notices:all
  ↑↓
/api/admin/notices  (auth + CSRF)
  ↓
/admin/notices UI

Public:
GET /api/notices/active?path= → priority 1 popup (showPopup)
GET /api/notices/list → archive list
GET /api/notices/item?id= → detail

FloatingNoticeHost → NoticeModal (centered)
/공지사항 → NoticesPageView ([landingSlug] + /notices alias)
/공지사항/보기?id= → NoticeDetailPageView (noindex)
```

## Dismiss

| Action | Storage | Behavior |
|--------|---------|----------|
| 닫기 | `sessionStorage noticeDismissedSession:{id}` | Same tab/session only |
| 오늘은 더 이상 보지 않기 | `localStorage noticeDismissedUntil:{id}=KST-YYYY-MM-DD` | Hidden until next KST day |

Never share storage with admin auth cookies.

## Fields (extended, backward compatible)

- `publishedAt`, `showPopup` (default true), `isPublicArchive` (default true)
- Legacy `position` ignored for display (modal is always centered)

## SEO

- List `/공지사항`: indexable hub (office notices)
- Detail `/공지사항/보기`: **noindex** (ephemeral content)
- Existing public URLs unchanged
