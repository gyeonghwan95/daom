# 네이버 재수집 URL — 2026-08-13 (당일 변경분)

IndexNow **전수 제출 금지**. Search Advisor에서 **실제 수정된 기존 URL만** 재수집 요청.
신규 URL 0 · title/H1/canonical 불변. 배포·200 확인 후 요청.

호스트: `https://다옴법무사사무소.kr`  
(ASCII: `https://xn--2j1br1na42lvxja38mk8r.kr`)

재수집 성공 ≠ 색인 성공. 절차는 [NAVER_EMERGENCY_CHECKLIST.md](./NAVER_EMERGENCY_CHECKLIST.md).

---

## P0 Must recrawl

### Ranking recovery (본문 모듈 unmerge · Page Identity 복원)

1. `https://다옴법무사사무소.kr/부산법무사`
2. `https://다옴법무사사무소.kr/부산법인법무사`

### High-intent cluster (모듈 보강)

3. `https://다옴법무사사무소.kr/부산법무사상담`
4. `https://다옴법무사사무소.kr/전세사기피해대응절차`
5. `https://다옴법무사사무소.kr/개인회생파산`
6. `https://다옴법무사사무소.kr/부산개인회생`

### B2G Champion

7. `https://다옴법무사사무소.kr/공공기관등기업무`

### Lecture Hub / Hiring

8. `https://다옴법무사사무소.kr/법률강의`
9. `https://다옴법무사사무소.kr/부산법률강사`

---

## P1 Recrawl (spoke · FAQ · topic)

### 공공기관 spokes (title/H1/meta 불변, prose/FAQ override)

10. `https://다옴법무사사무소.kr/공공기관법인등기`
11. `https://다옴법무사사무소.kr/공공기관부동산등기`
12. `https://다옴법무사사무소.kr/공공기관이전등기`
13. `https://다옴법무사사무소.kr/공공기관촉탁등기`
14. `https://다옴법무사사무소.kr/공기업등기`
15. `https://다옴법무사사무소.kr/지방공기업등기`
16. `https://다옴법무사사무소.kr/촉탁등기`

### Lecture topic / 공공교육

17. `https://다옴법무사사무소.kr/기업법률교육`
18. `https://다옴법무사사무소.kr/공공기관법률교육`
19. `https://다옴법무사사무소.kr/기관특강주제추천`

---

## P2 Optional (내부링크·CTA·폼만)

20. `https://다옴법무사사무소.kr/`
21. `https://다옴법무사사무소.kr/부산법률상담`
22. `https://다옴법무사사무소.kr/부산임차권등기명령`
23. `https://다옴법무사사무소.kr/부산전세보증금반환법무사`
24. `https://다옴법무사사무소.kr/부산개인파산`
25. `https://다옴법무사사무소.kr/부산개인회생법무사`
26. `https://다옴법무사사무소.kr/민락동법무사`
27. `https://다옴법무사사무소.kr/양정동법무사`
28. `https://다옴법무사사무소.kr/동래구법무사`
29. `https://다옴법무사사무소.kr/협업문의` (쿼리 `?partner=public` 은 별도 색인 URL 아님)
30. `https://다옴법무사사무소.kr/강의문의`

P2는 하루 한도 남으면. P0 → P1 우선.

---

## Do not recrawl / IndexNow

- `/부산법무사추천` — 이번 작업에서 Page Identity 미변경
- `/partners` — directory 링크만
- 지역·keyword-gap 수백 URL, sitemap lastmod 일괄
- 공유 CTA 컴포넌트 변경을 이유로 한 전수 재수집
- IndexNow 전수 제출

워크숍/워크샵/세미나 **신규 URL 없음**. Hub·Hiring `#formats` 로만 커버.

---

## 배포 게이트 (로컬 검증 2026-08-13)

| Check | Result |
|-------|--------|
| `npm run build` (prebuild + static `out/`) | PASS — 1793 routes, sitemap 1653 |
| `seo:regression` (빌드 후) | PASS — URL/title/H1/canonical/sitemap 0 change |
| `check:lecture-history` | PASS — 22 lectures |
| lecture / public-sector similarity | HIGH 0, Champion REVIEW+ 0 |
| CREATE_NEW | 0 |
