# 10 — Cannibalization

## Active (SERP-confirmed 2026-09-25)

**Query:** `부산 상속포기 법무사`  
**Winner in SERP:** `/부산상속법무사` (hub)  
**Intended champion:** `/부산상속포기`  
**Mechanism:** Hub `<title>`에「등기·포기·한정승인」; 본문·내부링크 authority가 허브에 집중.

**Remediation (applied):**
- Renunciation 전용 title/H1/description (`renunciation-hub-identity.ts`)
- Hub title「중 먼저 확인할 **절차**」로 포기 단독 intent 분리
- Renunciation page answer-first + unique FAQ
- IndexNow on both URLs

## Managed (policy, no delete)

| URL | Role |
|-----|------|
| `/부산상속전문법무사` | CANNIBALIZATION_CANDIDATE — noindex, canonical → hub |
| `/부산상속법무사` | GROUP A champion for「부산 상속 법무사」「부산 상속전문 법무사」 |

## Watch
- Homepage `/` vs hub title similarity (`05-self-duplication-audit.csv`)
- External blog/tistory title mirrors — `LIVE_SERP_REVIEW_REQUIRED.md`
