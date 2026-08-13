# Lecture Current Coverage

기준일: 2026-08-13  
보호: URL/slug/canonical/sitemap 변경·삭제 0. title/H1 불변. UNKNOWN_PERFORMANCE 보호.  
CREATE_NEW = **0** (워크숍·세미나 Format Champion은 기존 Hub/Hiring에 흡수).

기계 인벤토리: `reports/seo/lecture-page-inventory.json`  
이력 슬림 구조: `src/data/lectures/history-summaries.ts` (`LectureHistoryEntry` → Summary)

---

## Champion map

| Role | URL | Primary queries | Title/H1 |
|------|-----|-----------------|----------|
| **LECTURE_MAIN_HUB** | `/법률강의` | 부산 법률 강의·특강, 생활법률 교육 | 보호 |
| **LECTURE_HIRING** | `/부산법률강사` | 강사 초빙·출강·섭외·외부강사·특강 강사 | 보호 |
| **CORPORATE** | `/기업법률교육` | 기업교육·사내·임직원·신입 | 보호 |
| **PUBLIC** | `/공공기관법률교육` | 공공기관·공기업·공무원 법률교육 | 보호 |
| **WORKSHOP_SEMINAR** | *별도 URL 없음* | 워크숍/워크샵/세미나/초청특강 | Hub chooser + Hiring `#formats` |
| **STARTUP** | `/창업법률교육` | 창업·스타트업 법률교육 | 보호 |
| **JEONSE** | `/전세사기예방교육` | 전세사기 예방교육 | 보호 (고의도 supporting) |
| **YOUTH** | `/청년생활법률특강` | 청년·사회초년생 | 보호 |
| **TOPIC_DISCOVERY** | `/기관특강주제추천` | 특강 주제 추천, 워크숍 주제 | 보호 |
| **CONVERSION** | `/강의문의` | 강의 문의·견적 | 보호 |
| History | `/강의이력` | 검증 이력 | 보호 |
| Speaker | `/강사소개` | 강사 프로필 | 보호 |
| 법무사 강의 | `/부산법무사강의` | 부산 법무사 강의·출강 | 보호 |

일반 Champion `/부산법무사` `/부산법인법무사` `/부산법무사상담`과 Primary 경쟁 금지.

---

## URL inventory (요약)

기존 강의 랜딩(lecturePages): 허브·섭외·전세·청년·창업·기업·강사소개·문의·디지털·학교·공공·진로 + 도서관·기관특강·법무사강의 + 복지강사·섭외비용·체크리스트·주제추천·시간구성.

각 페이지 공통: indexable, self-canonical, UNKNOWN_PERFORMANCE → **PROTECTED**.  
CTA: `/강의문의` 또는 페이지 내 `LectureInquiryForm`.  
이미지는 현장 사진이 있는 이력만 사용. 가짜 청중·기관 행사 생성 없음.

상세 필드(URL/Title/H1/Description/Audience/Topic/Format/History/CTA/Links)는 inventory JSON.

---

## 검증 강의 이력

`src/data/lectures/history.ts` — `verified: true`만. 허위 횟수·만족도·인원 없음.  
기관명 공개는 출처(현장 사진·프로필·블로그 링크)가 있는 항목만.

대표 유형:

| institutionType | 예 |
|-----------------|-----|
| library | 부산광역시립시민도서관 생활법률 특강 |
| welfare | 자립지원전담기관 전세사기·일상분쟁 |
| youth-center / startup-support | 해운대청년채움공간 창업법률 등 |
| school | 양산제일고 진로특강 |
| public collab | LH·부산창조경제혁신센터 등 확인분 |

형식: 특강 · 연속과정 · (안내상) 사례형 워크숍. 게임형 퍼실리테이션 이력 없음 → 광고하지 않음.

---

## 이미 있는 UI/모듈

- `LectureTopicFinder` — 대상×니즈×시간 (클라이언트 필터, 결과 링크는 코드에 고정)
- `LectureFormatGuide` — 60/90/120/3~4시간
- `VerifiedLectureHistory` / `/강의이력`
- `SpeakerProfile`
- `LectureInquiryForm` (최소 필수: 연락처·동의)

Cluster 보강: Hub `LectureProgramChooser` (SSR HTML 링크) — 교육 목적 / 대상 / 형식.

---

## 워크숍 vs 워크샵

**같은 Intent.** 별도 페이지 금지.  
Hub 형식 카드 + Hiring FAQ에서 alias로 처리.

세미나·특강·강연·초빙·출강도 Hiring/Hub aliases.

---

## 강의 vs 수임 Intent

| 강의 | 수임 |
|------|------|
| `/전세사기예방교육` | `/전세사기피해대응절차` |
| `/기업법률교육` | `/부산기업법률자문` `/부산법인법무사` |
| `/공공기관법률교육` | `/공공기관등기업무` |
| `/법률강의` | `/부산법무사` |

관련 링크는 유지하되 강의 페이지 Primary Query를 수임 Query로 바꾸지 않음.
