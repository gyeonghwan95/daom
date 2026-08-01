# 전국·원격 5단계 구현 보고

작성일: 2026-08-01  
원칙: SEO thin·과장·결과보장·소송대리 암시 금지. 최근접 URL과 **의도 표로 분리**. 지역 허브·도시 상속 **추가 없음**.

감사: `docs/seo/nationwide-remote-phase5-opportunity-audit.md`

---

## CREATE 6

| URL | 주 키워드 | 최근접과 차별 | SEO 방어 |
| --- | --- | --- | --- |
| `/가처분신청서류준비` | 가처분 신청 서류 | ≠가압류신청(금전 보전) | 인용·명도 미보장 |
| `/채권압류추심서류준비` | 채권압류·추심 서류 | ≠가압류·지급명령 신청 | 회수 미보장 |
| `/변제공탁서류준비` | 변제공탁 서류 | ≠압류·회수 방향 | 채무소멸 미단정 |
| `/이혼재산분할등기서류준비` | 이혼 재산분할등기 서류 | ≠공유물분할·증여·명의변경 | 이혼소송 대리 아님 |
| `/압류말소등기서류준비` | 압류말소등기 서류 | ≠가압류말소·가압류신청 | 체납해소·완료 미보장 |
| `/상속등기후매매서류준비` | 상속등기 후 매매 서류 | ≠단일 상속 원격·단일 매매 | 순서 게이트·세액 미확정 |

---

## IMPROVE

- `/민사소송`, `/공탁채권회수` contact stub → 신규·기존 서류 URL
- situations: 대여금·재산모름·판결후집행·내용증명수신·공동명의 → 서류 URL
- `/부산이혼재산분할등기`, `/부산압류말소등기`(restrictionLinks), `/부산상속후매매등기` 양방향
- 원격 종합 허브 related 확장
- `remote-service-matrix` 6행 추가
- 상속 journey: `상속등기후매매서류준비` → registry

---

## REJECT (이번에도 미생성)

충청·호남·강원 권역 허브, 도시 상속 추가, 비대면·전국 동의어, 부부간증여·보존·멸실 remote 클론, 가처분 유형 시리즈.

---

## 기술

- seeds + CONTENT_OVERRIDES (`nationwide-remote-phase5a/b.ts`)
- sitemap 재생성 필요
- IndexNow: 배포·200 후 `scripts/output/seo-register-nationwide-remote-phase5-2026-08-01.txt`
- redirect/canonical/noindex 자동 미적용
