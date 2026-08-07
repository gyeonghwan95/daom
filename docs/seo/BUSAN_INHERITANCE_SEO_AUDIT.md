# 부산 상속 검색 클러스터 SEO 정밀 진단

**작성일:** 2026-08-07  
**방식:** FREEZE → 보호 → Champion 선정 → SAFE 최소 보강  
**공개 금지 표현:** 「전문 법무사」「상속 전문 법무사」(분석 query로만 기록)

---

## 결론: 순위 차이 원인 TOP 5

| 순위 | 원인 | 영향도 | 근거 | 관련 URL | 수정 | 위험도 |
|------|------|--------|------|----------|------|--------|
| 1 | **대표 URL 신호 분산** | HIGH | 「부산상속법무사」는 `/부산상속법무사`에 잘 맞음. 「…전문…」 query는 `/부산상속전문법무사` exact-ish title과 경쟁·분산 가능 | `/부산상속법무사`, `/부산상속전문법무사` | Champion 보강 + 브리지는 유지(삭제 금지) | SAFE / 브리지 title은 HIGH |
| 2 | **검색의도 깊이 부족** | HIGH | 「전문」 검색자는 exact 키워드보다 업무 범위·예외·분기 깊이를 봄. Champion은 선택 허브였으나 선택표·고유 FAQ가 약했음 | `/부산상속법무사` | 상황 선택표·FAQ·작성자 확인일 추가 | SAFE |
| 3 | **의도 cannibalization** | MEDIUM | 선택허브·등기허브·전문브리지·추천·구군 템플릿이 「부산+상속+법무사」를 나눠 가짐. 완전 중복은 아니나 신호 분산 | 다수 | 역할표 고정, 신규 클론 금지 | SAFE(문서) |
| 4 | **구군 thin/구조 중복** | MEDIUM | 지역명 치환형 상속 페이지 다수 → 클러스터 고유성 약화 가능(“패널티” 단정 금지) | `/{구}상속등기` 등 | 신규 생성 중단·별도 정리 | HIGH(삭제 금지) |
| 5 | **Title 유사 패턴** | LOW~MEDIUM | `부산 상속(등기) 법무사｜…` 패턴 반복. Champion title은 성과 보호로 KEEP | 핵심 허브들 | title 미변경 | HIGH(변경 금지) |

**가설 평가 (A~Q):** PASS 다수, WARNING 8 — 상세는 `scripts/output/inheritance-seo-audit.json`.

---

## INHERITANCE_CHAMPION

| 항목 | 값 |
|------|-----|
| **Champion URL** | `/부산상속법무사` |
| 선정 이유 | 부산 상속 **절차 선택** 허브, 등기·포기·한정 연결, 플래그십·세부에서 inbound, 「전문」 표방 없이 의도 충족 가능, 기존 「부산상속법무사」 성과 보호 |
| 신규 URL | **만들지 않음** |
| Title/H1 | **KEEP** (변경 없음) |

---

## 표 1 — 현재 상속 클러스터 (핵심)

| URL | Title(요약) | Intent | 역할 | 유사 위험 | Protected | Action |
|-----|-------------|--------|------|-----------|-----------|--------|
| `/부산상속법무사` | 부산 상속 법무사｜등기·포기·한정… | 사무소·절차 선택 | **Champion** | — | YES | SAFE 보강 |
| `/부산상속등기` | 부산 상속등기 법무사｜서류… | 명의이전 등기 | 등기 Spoke | 낮음 | YES | KEEP |
| `/부산상속포기` | 부산 상속포기… | 포기·기한 | Spoke | 낮음 | YES | KEEP |
| `/부산한정승인` | 부산 한정승인… | 한정승인 | Spoke | 낮음 | YES | KEEP |
| `/부산상속재산분할법무사` | 재산분할·협의 | 협의분할 | Spoke | 낮음 | — | KEEP |
| `/부산상속전문법무사` | 상속전문 법무사｜첫 분기 | 전문 검색 브리지 | Bridge | 의도 분산 WARNING | 관찰 | HIGH RISK만 제안 |
| `/부산법무사` | 부산 법무사 | 종합 | Parent | — | YES | KEEP |
| `/상속` | 상속 종합 | 토픽 | Hub | — | — | KEEP |
| 구·군 `*상속등기` | 지역×등기 | 지역 실무 | Local | DUPLICATE-RISK 가능 | — | 신규중단·미삭제 |

전체 inventory: before-audit + `_inheritance-url-inventory.txt`.

---

## 표 2 — Target Query

| 항목 | 내용 |
|------|------|
| Query (분석용) | 부산 상속 전문 법무사 |
| Champion | `/부산상속법무사` |
| 왜 | 이미 선택 허브이며 공개 「전문」 표방 없이 깊이·범위를 채울 수 있음. 등기 전용 URL은 등기 intent에 맡김 |
| 부족했던 신호 | 상황 선택표, 맡기기 전 확인 기준, 선택형 FAQ, 작성 확인일 명시 |
| 추가한 신호 | `inheritance-champion-modules` → 문단·선택표·FAQ·관련링크·CTA·lawyerOpinion |
| 수정하지 않은 요소 | title, H1, description, problemStatement, URL, canonical, sitemap 구조 |
| 보호조치 | `config/seo-protected-pages.json`, title/H1 동결, 기존 본문 삭제 없음 |

---

## 표 3 — 변경 내역

| 파일 | URL | 변경 | 등급 | 보존율 | 이유 |
|------|-----|------|------|--------|------|
| `inheritance-champion-modules.ts` | `/부산상속법무사` | 모듈 신규 | SAFE | n/a | 추가 전용 |
| `keyword-builder.ts` | `/부산상속법무사` | Champion만 병합 | SAFE | ≥85% | title/H1/기존 문단 유지 |
| docs/config/data/scripts | — | 진단·보호·로그 | SAFE | — | FREEZE·추적 |

---

## 표 4 — 중복 위험 (삭제하지 않음)

| URL A | URL B | Intent | Content | Title | Recommendation |
|-------|-------|--------|---------|-------|----------------|
| `/부산상속법무사` | `/부산상속전문법무사` | 분산 WARNING | 낮음(~2%) | 25% | 삭제 금지. Champion 집중. 브리지 title 완화는 승인 후 |
| `/부산상속법무사` | `/부산상속등기` | 분리 PASS | 낮음 | ~27% | 역할 유지 |
| 구군 템플릿들 | 상호 | 구조 중복 가능 | 높을 수 있음 | 유사 | 신규 중단·별도 과제 |

---

## Query → URL 매핑 (요지)

| Query | Recommended Champion |
|-------|----------------------|
| 부산상속법무사 / 부산 상속 법무사 | `/부산상속법무사` |
| 부산 상속 전문 법무사 | `/부산상속법무사` (exact 삽입 금지) |
| 부산 상속등기(법무사) | `/부산상속등기` |
| 부산 상속포기 법무사 | `/부산상속포기` |
| 부산 한정승인 법무사 | `/부산한정승인` |
| 부산 상속재산분할 | `/부산상속재산분할법무사` |
| 비용·서류 | `/상속등기비용`, `/상속등기필요서류`, `/상속상담전준비서류와비용` |

---

## 최종 검사 체크리스트

| 항목 | 결과 |
|------|------|
| 기존 URL 삭제 | 0 |
| 기존 URL/slug 변경 | 0 |
| redirect / noindex | 0 |
| Champion title/H1 변경 | 0 |
| 공개 「전문 법무사」 신규 삽입 | 0 (Champion 모듈 검증) |
| 기존 `/부산상속전문법무사` | 존치(HIGH RISK 문서화) |
| audit 스크립트 | `npm run audit:inheritance` / `check:inheritance-similarity` |

---

## 다음 관측

배포 후 `data/seo/ranking-observations.json`에 네이버 위치·노출 URL을 수동 기록. URL을 모르면 null 유지.
