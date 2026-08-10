# 부산 우선 Query SEO 감사 · 최소수정 — 2026-08-10

**방식:** FREEZE → Intent 분류 → Champion 선정 → Cannibalization → SAFE 최소 보강  
**공개 금지(신규 삽입):** 「전문 법무사」「법인전문 법무사」「최고/1위 법무사」  
**스냅샷:** `docs/seo/SEO_BEFORE_AUDIT_2026.md`, `generated/seo-before-routes.json`

---

## 현재 문제 원인 TOP 5

### 1.
- **원인:** 법인 Provider Selection 신호가 `/부산법인법무사` · `/부산법인등기` · `/부산법인전문법무사` · `/부산기업법무사` 등으로 **분산**
- **영향도:** HIGH
- **근거 URL:** `/부산법인법무사`, `/부산법인전문법무사`, `/부산법인등기`
- **관련 Query:** 부산 법인 법무사 / 부산 법인전문 법무사 / 부산 법무사 법인전문
- **수정 필요:** Champion=`/부산법인법무사`에 상황별 업무 지도·FAQ·링크 집중 (exact「전문」미사용)
- **위험도:** SAFE (모듈 추가) / 브리지 title은 HIGH RISK(미변경)

### 2.
- **원인:** 「추천」 Query에 대해 별도 추천 URL과 업무 Champion이 **동시 경쟁**
- **영향도:** HIGH
- **근거 URL:** `/부산법무사추천`, `/부산상속법무사추천` vs `/부산법무사`, `/부산상속법무사`
- **관련 Query:** 부산 법무사 추천 / 부산 상속 법무사 추천
- **수정 필요:** 신규 추천 URL 금지. Flagship·상속 Champion에 **선택 기준 모듈** 보강. 기존 추천 URL은 Spoke로 KEEP
- **위험도:** SAFE

### 3.
- **원인:** 「전문」 검색 Intent를 exact phrase 페이지(`/부산법인전문법무사` 등)가 가져가 Champion 권한이 약해질 수 있음
- **영향도:** MEDIUM~HIGH
- **근거 URL:** `/부산법인전문법무사`, hub-catalog 라벨(완화함)
- **관련 Query:** 부산 법인전문 법무사 / 부산 법무사 법인전문
- **수정 필요:** Champion에 업무 깊이 모듈. 브리지 삭제·title 변경 금지(승인 전)
- **위험도:** SAFE / title HIGH RISK

### 4.
- **원인:** 상속포기 Intent는 페이지가 있으나 **권한·깊이 신호**(타임라인·안 날·처분 주의)가 상대적 약세 가능
- **영향도:** MEDIUM
- **근거 URL:** `/부산상속포기` (이미 강함, FAQ 10+)
- **관련 Query:** 부산 상속포기 법무사
- **수정 필요:** SAFE 타임라인·FAQ 추가. **신규 URL 불필요**
- **위험도:** SAFE

### 5.
- **원인:** Title/Description 템플릿 패턴(`비용·절차·준비서류` 등) 반복으로 차별성 약화 가능
- **영향도:** LOW~MEDIUM
- **근거 URL:** 다수 랜딩 (audit-title-patterns / meta-descriptions)
- **관련 Query:** 전 Query
- **수정 필요:** Champion title/description **자동 변경 금지**(성과 보호). 보고만
- **위험도:** HIGH(변경 시)

---

## Q1~Q10 요약

| # | 질문 | 답 |
|---|------|-----|
| Q1 | 법인 Champion 기존 URL? | **예** `/부산법인법무사` |
| Q2 | 왜 약하게 보일 수 있나? | 전문·기업·등기 URL과 신호 분산, 선택표·깊이 모듈 부족(보강함) |
| Q3 | 법인 유사페이지 과다? | **예** — CANNIBALIZATION (삭제 없이 Hub 강화) |
| Q4 | 상속포기 독립 페이지? | **예** `/부산상속포기` — 신규 불필요 |
| Q5 | 포기·등기·한정 혼선? | Intent 분리 PASS. 상호 링크로 유지 |
| Q6 | 상속 추천 Champion? | `/부산상속법무사` (기존 Champion 모듈 유지) |
| Q7 | 부산 추천 Champion? | `/부산법무사` Flagship |
| Q8 | title/첫문단 유사? | 템플릿 반복 WATCH — Champion KEEP |
| Q9 | 내부링크 집중? | Spoke→Champion 링크 보강, hub-catalog 라벨 완화 |
| Q10 | 기술 색인? | SSG 랜딩, Champion published+sitemap 검사 스크립트 |

---

## QUERY별 최종 진단표

| Query | 후보 URL (요지) | Champion | 문제원인 | 신규 | 조치 |
|-------|-----------------|----------|----------|------|------|
| 부산 법인 법무사 | 법인법무사·법인등기·법인전문·기업 | `/부산법인법무사` | CANNIBALIZATION + WEAK | **아니오** | SAFE 모듈 |
| 부산 법인전문 법무사 | 동일 + 전문브리지 | **동일** | CANNIBALIZATION | **아니오** | 깊이 모듈(전문 phrase 금지) |
| 부산 법무사 법인전문 | 동일 | **동일** | 동일 | **아니오** | 동일 |
| 부산 상속포기 법무사 | 상속포기·상속법무사·한정 | `/부산상속포기` | AUTHORITY/CONTENT-GAP | **아니오** | SAFE 타임라인·FAQ |
| 부산 상속 법무사 추천 | 상속법무사·추천·전문 | `/부산상속법무사` | CANNIBALIZATION | **아니오** | 선택기준 모듈 유지 |
| 부산 법무사 추천 | 법무사·추천·상속·법인 | `/부산법무사` | CANNIBALIZATION | **아니오** | Flagship SAFE 모듈 |

---

## 신규 페이지 판정표

| 후보 Intent | 기존 URL | 신규 필요 | 이유 | 중복위험 |
|-------------|----------|-----------|------|----------|
| 법인전문 | `/부산법인법무사` + 브리지 | **NO** | Intent 통합 | HIGH if create |
| 법무사 법인전문 | 동일 | **NO** | 동일 | HIGH |
| 상속포기 | `/부산상속포기` | **NO** | 독립·충분 | — |
| 상속 추천 | `/부산상속법무사` (+기존 추천 Spoke) | **NO** | 선택 모듈로 충족 | HIGH if create |
| 법무사 추천 | `/부산법무사` (+기존 추천 Spoke) | **NO** | Flagship | HIGH if create |

---

## Cannibalization (요지)

| URL A | URL B | Intent Sim | Action |
|-------|-------|------------|--------|
| `/부산법인법무사` | `/부산법인전문법무사` | HIGH | STRENGTHEN-HUB |
| `/부산법인법무사` | `/부산기업법무사` | MED | INTERNAL-LINK-TO-CHAMPION |
| `/부산상속법무사` | `/부산상속전문법무사` | HIGH | STRENGTHEN-HUB |
| `/부산상속법무사` | `/부산상속법무사추천` | MED-HIGH | INTERNAL-LINK-TO-CHAMPION |
| `/부산법무사` | `/부산법무사추천` | MED | INTERNAL-LINK-TO-CHAMPION |
| `/부산상속포기` | `/부산한정승인` | LOW-MED | KEEP-BOTH |

삭제/리다이렉트 **자동 수행 없음**.

---

## 변경 결과표

| URL | 변경내용 | 위험도 | 기존보존율 | Target Query |
|-----|----------|--------|------------|--------------|
| `/부산법인법무사` | `corporate-champion-modules` 병합 | SAFE | ≥90% | 법인 3종 |
| `/부산법무사` | `busan-lawyer-champion-modules` 병합 | SAFE | ≥90% | 부산 법무사 추천 |
| `/부산상속포기` | `renunciation-champion-modules` 병합 | SAFE | ≥90% | 상속포기 |
| `/부산상속법무사` | (기존 Champion 유지, 추가 변경 최소) | — | 100% | 상속 추천 |
| hub-catalog | 공개 라벨에서 「○○전문 법무사」완화 | SAFE | n/a | — |
| title/H1/URL | **변경 없음** | — | 100% | — |

---

## 링크 흐름 (실제 URL)

```
HOME /
└─ /부산법무사  (Busan Main Champion)
   ├─ /부산법인법무사  (Corporate Champion)
   │   ├─ /부산법인설립등기
   │   ├─ /부산임원변경등기 · /부산대표이사변경등기
   │   ├─ /부산본점이전등기
   │   ├─ /부산사업목적변경등기
   │   ├─ /부산유상증자등기
   │   └─ /부산법인해산청산등기
   └─ /부산상속법무사  (Inheritance Champion)
       ├─ /부산상속등기
       ├─ /부산상속포기  (Renunciation Champion)
       ├─ /부산한정승인
       └─ /부산상속재산분할법무사
```

---

## 기술검증

| 항목 | 상태 |
|------|------|
| 기존 URL 삭제 | **0** (목표) |
| URL/slug 변경 | **0** |
| redirect/noindex 신규 | **0** |
| Champion title/H1 | **KEEP** |
| 감사 명령 | `npm run seo:audit:priority` |
| 관측 데이터 | `data/internal/seo-ranking-observations.json` (비공개) |
| 보호 자산 | `config/seo-protected-assets.json` |

---

## HIGH RISK 제안만 (자동 적용 안 함)

1. `/부산법인전문법무사` title에서 「전문」완화 — 승인 후
2. `/부산상속법무사추천`을 Champion canonical로 묶는 방안 — **금지에 가깝게 비권장**(URL 변경 금지). 링크만 유지
3. Champion metaTitle 패턴 차별화 — 성과 관측 후 승인

---

## 실행·산출물

- `npm run seo:audit:priority`
- `reports/seo/priority-query-audit.json` / `.html`
- `reports/seo/cannibalization-pairs.json`
- `reports/seo/title-patterns.json`
- `reports/seo/meta-descriptions.json`
- `reports/seo/faq-duplicates.json`
- `reports/seo/internal-link-authority.json`
- `reports/seo/indexability.json`
