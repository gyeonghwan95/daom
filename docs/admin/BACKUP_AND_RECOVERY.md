# Backup and Recovery

## 현재 인프라

| 자산 | 백업 |
|------|------|
| 사이트 코드·콘텐츠 | Git (GitHub) |
| Cloudflare Pages 배포 | 배포 이력 (Dashboard) |
| `ADMIN_KV` (공지·집계·로그) | Cloudflare KV — managed; 별도 앱 백업 미구축 |
| 문의 원문 | Telegram/Resend 측 (사이트 DB 없음) |

## 권장 운영

1. 중요 공지 문구는 게시 전 별도 메모/문서에 한 줄 백업해도 충분.
2. KV 실수 삭제 방지: Dashboard에서 namespace 삭제 금지.
3. 시크릿은 비밀번호 관리자에만 보관. Git에 커밋 금지.

## Recovery

| 장애 | 대응 |
|------|------|
| 공지 API/KV 장애 | 공개 사이트는 공지 없이 로드 (soft-fail) |
| Analytics 장애 | 문의·CTA 정상 |
| 세션 시크릿 유출 의심 | `ADMIN_SESSION_SECRET`·`ADMIN_PASSWORD` 교체 후 재배포 |
| KV 데이터 손실 | 공지 재작성; 통계는 “아직 측정되지 않음”부터 재집계 |

별도 백업 시스템을 중복 구축하지 않는다.
