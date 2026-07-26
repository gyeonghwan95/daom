# 키워드 사전 가이드

키워드의 단일 출처는 `collector/config/keywords.ts`입니다.
단순 포함검색이 아니라 **그룹별 가중치 합산**으로 관련성 점수를 만듭니다.

## 그룹 구성

| 그룹 | 상수 | 가중치 범위 | 예 |
|---|---|---|---|
| 직접 수임 (강한) | `STRONG_KEYWORDS` | 12~20 | 법무사 선정, 집단등기, 소유권이전등기, 촉탁등기, 공탁 |
| 잠재 수임 (연관) | `RELATED_KEYWORDS` | 5~9 | 사용승인, 토지보상, 공유재산, 해산법인, 미등기, 권리보전 |
| 강의 | `LECTURE_KEYWORDS` | 4~12 | 생활법률, 전세사기, 법률특강, 외부강사, 강사풀 |
| 복대리·협업 | `COLLAB_KEYWORDS` | 6~12 | 복대리, 등기소 접수, 보정대응, 부산지방법원 |
| 제외·감점 | `EXCLUDE_KEYWORDS` | 감점 8~20 | 변호사만, 법무법인만, 컨소시엄 필수 |

- 키워드 매칭은 **공백 차이를 무시**합니다 ("등기 업무" ↔ "등기업무").
- 제외 키워드는 매칭돼도 **즉시 삭제하지 않고** 감점 + 위험표시만 합니다.
  `hardBlock: true` 항목(변호사만·법무법인만 등)은 점수와 무관하게
  "참가자격 확인 필수"(likely-ineligible)로 표시됩니다.

## 의미 기반 규칙 (`SEMANTIC_RULES`)

법무사가 직접 언급되지 않은 공고를 잡기 위한 정규식 규칙입니다.

| 규칙 id | 포착 대상 | 예시 공고 |
|---|---|---|
| ownership-transfer-agency | 소유권 이전·보존 업무 수행기관 | "공동주택 소유권 이전 업무 수행기관 선정" |
| unregistered-preservation | 미등기 재산 권리보전 | "미등기 국유재산 권리보전 조치 용역" |
| dissolved-corp-realestate | 해산·청산 법인 부동산 정리 | "해산법인 소유 부동산 정리" |
| completion-unit-rights | 준공 구분건물 권리정리 | "준공에 따른 구분건물 권리정리" |
| compensation-registry | 토지보상 공부정리·등기 | "토지보상 관련 공부정리 및 등기업무" |
| life-law-education | 외부전문가 법률교육 | "외부전문가 생활법률 교육" |
| legal-affairs-support | 법률실무 지원 용역 | "공공기관 법률사무 지원 용역" |
| document-bulk | 대량 서류 발급·검토·접수 | "대량 서류 일괄 접수 대행" |

각 규칙은 분류 근거 문구(`reason`)를 남기며 브리핑의 "이유"에 표시됩니다.
LLM 분류는 선택 기능(Phase 2+)이며 규칙 기반 결과가 항상 기본입니다.

## 가중치·임계값 수정법

1. **키워드 추가**: 해당 배열에 `{ term, weight, category, subcategory? }` 추가.
2. **후보 임계값**: `collector/src/classify.ts`의 `CANDIDATE_MIN_RELEVANCE` (기본 8).
   낮추면 후보가 늘고, 높이면 강한 매칭만 남습니다.
3. **추천 등급 컷** (`collector/src/score.ts`): 85 우선 검토 / 70 적극 검토 /
   55 협업 포함 / 40 모니터링.
4. **지역·수행분야 가중치**: `collector/config/office-profile.ts`.

수정 후 `npm run bid:test`와 `npm run bid:sample`로 분류·점수 변화를 확인하세요.
