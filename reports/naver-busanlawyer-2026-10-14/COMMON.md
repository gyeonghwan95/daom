# 공통 증거 (루트, 2026-10-14)

## 배포·작업 트리
- 운영 = origin/main = `b201a0b` (Cloudflare Pages 성공 10-13 22:59 KST). 직전 배포 ca55849(21:52), 83282bc(21:07).
- 로컬: b201a0b + 미커밋 '15개 검색어' 작업(reports/naver-15kw-2026-10-14/NAVER_15KEYWORDS_REPORT.md — 카드 4종·1:1, /부산법률상담 OG, 백틱 경로, OfferCatalog, /services name, /부산한정승인 범위 문장). **운영 미반영 → 운영 원인으로 쓰지 말 것. 보존.**
- 정상 노출 시점: 미확인. 순위 기록 = audit/naver-ranks.csv(10-11 18:37: '부산 법무사' / 웹 15위), reports/busan-lawyer-rank-2026-10-10/REPORT.md(10-10: 웹 미검출·플레이스), reports/naver-recovery-2026-10-12/serp-observations.csv(10-12 22시: '부산 법무사' 웹 미발견·플레이스 5/7, '부산법무사' 웹 7번째 /). 그 이전 1위는 사용자 보고.

## 이전 수정 반영 여부 (운영 홈 GET, 10-14, 브라우저 UA)
반영됨: title '부산 법무사 안윤정 | 다옴법무사사무소', H1 1개, robots 'index, follow, max-image-preview:large', canonical 홈, 본문 hidden(S:0) 없음(loading.tsx 삭제 반영), 홈 좌측 패널 새 버튼, 오시는 길 카드, ItemList @id, /부산법무사 앵커 '다옴법무사사무소 업무 안내'(옛 앵커 0), 바로 찾는 안내 /부산공탁 링크. 저장: live-home.html.

## 이전 보고서(재조사 금지 항목)
- reports/naver-recovery-2026-10-12/NAVER_RECOVERY_REPORT.md·findings.md: robots·sitemap·리디렉션·soft404·UA별 응답·자산 정상, colo=SEA TTFB 지연(가설), 308 Location 비인코딩(내부 링크 0).
- reports/naver-12kw-2026-10-13/, reports/naver-15kw-2026-10-14/ (baseline.json·agent2-tech.md: 18 URL 운영=로컬 정상).
- reports/busan-lawyer-rank-2026-10-10/, reports/naver-7kw-2026-10-11/ (GOOD 후보 16f9ffb·7b42ef4 비교 완료 — 홈 title·H1 동일).
- 서치어드바이저 FAQ 노출 종료(2026-07-08 공지) — FAQ 리치 결과로 복구 주장 금지.

## 로컬
- out/ = b201a0b + 15kw 미커밋 변경 빌드. 스냅샷 reports/google-index-2026-10-11/protect/15kw-final.json. 파서 scripts/lib/seo-recovery/scan-out.mjs parsePage. 다시 빌드 금지.

## 규칙
조사만, 소스 수정 금지. 결과 agentN-*.md. 네트워크 동시성 ≤4, 재시도 1회. 네이버 검색은 ④만. 확정/가설/정상/접근 불가. 최종 응답 600토큰 이내, 제안 최대 3개(증거 → 판정 → 최소 패치 → 보호 대상 → 검증).
