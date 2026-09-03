# 상속 외부 권위 링크 — 운영 계획

이 문서는 **운영 제안**이다. Cursor가 네이버 블로그·티스토리·외부 사이트를 수정했다고 보고하지 않는다.

검색순위 보장이 아니며, 공식 홈페이지 owner URL로 자연스럽게 연결하는 기준만 적는다.

## 원칙

- 새 thin URL을 만들지 않는다. (`/부산상속전문법무사추천` 등 금지)
- 「부산 상속 법무사」「부산 상속전문 법무사」는 모두 `/부산상속법무사`
- 「부산 상속포기 법무사」는 `/부산상속포기`
- exact-match 앵커를 글마다 반복하지 않는다.
- 「1위」「최고」「상속전문 자격」을 쓰지 않는다.

## 공식 홈페이지에 이미 있는 글 → owner

| 내부 콘텐츠 | 연결 owner | 문맥 앵커 예 |
|---|---|---|
| `/blog/inheritance-registration-priority-after-parent-death` | `/부산상속법무사` | 등기·포기·한정승인 중 무엇부터 |
| `/blog/busan-inheritance-consultation-prep` | `/부산상속법무사` | 부산 상속 상담 전 확인할 것 |
| `/blog/busan-inheritance-registration-procedure-documents` | `/부산상속등기` | 부산 상속등기 서류 |
| `/blog/inheritance-registration-documents-checklist` | `/부산상속등기` | 상속등기 필요서류 |
| `/blog/delaying-inheritance-registration-risks` | `/부산상속등기` | 상속등기를 미룰 때 |
| `/blog/inheritance-renunciation-vs-qualified-acceptance` | `/부산상속포기` 또는 `/부산한정승인` | 포기와 한정승인 비교 |
| `/blog/three-months-after-death-inheritance` | `/특별한정승인` · `/부산상속포기` | 3개월이 지난 뒤 |
| `/blog/minor-heir-inheritance-guide` | `/미성년상속인` · `/부산상속법무사` | 미성년 상속인 |
| `/blog/overseas-heir-inheritance-busan` | `/해외거주상속인` · `/부산상속법무사` | 해외 거주 상속인 |
| `/blog/inheritance-division-agreement-cautions` | `/부산상속재산분할법무사` | 협의분할 |
| `/blog/when-siblings-refuse-inheritance-registration` | `/부산상속법무사` | 상속인이 협의하지 않을 때 |
| `/services/cases/haeundae-inheritance-registration-case` | `/부산상속등기` | 해운대 상속등기 사례 |
| `/services/cases/dongnae-qualified-acceptance-consultation` | `/부산한정승인` | 한정승인 상담 사례 |
| `/services/cases/jaesong-inheritance-renunciation-consultation` | `/부산상속포기` | 상속포기 상담 사례 |

## 네이버 블로그(law-yoon-91)에 실제로 있는 글

RSS 스냅샷(`src/data/naver-blog-posts.json`, fetched 2026-06-29) 기준. 외부 글을 여기서 고치지 않았다.

| 글 | 권장 owner |
|---|---|
| 부산 연제구 법무사｜상속등기·상속포기·한정승인까지… | `/부산상속법무사` (지역 페이지를 광역 owner보다 앞에 두지 말 것) |
| 부산 상속등기 법무사｜등기 외 상속포기·한정승인과 함께… | 등기 실무는 `/부산상속등기`, 절차 선택은 `/부산상속법무사` |
| 법인·강의·전세·보수표 글 | 해당 기존 owner (`/부산법인등기`, `/법률강의`, `/부산법무사비용`) |

운영자가 글을 고칠 때:

1. 상속 전반·무엇을 해야 할지 모를 때 → `https://다옴법무사사무소.kr/부산상속법무사`
2. 빚 때문에 포기 신청 → `/부산상속포기`
3. 채무를 재산 한도로 → `/부산한정승인`
4. 명의이전 서류 → `/부산상속등기`

## 하지 말 것

- 블로그에서 「부산 상속전문 법무사」를 `/부산상속전문법무사`로 링크 (그 URL은 noindex 브리지)
- 지역 글(연제구·수영구)에서 「부산 상속 법무사」 exact-match를 제목·첫 문단에 반복
- Cursor가 외부 블로그를 수정했다고 배포 노트에 적기
