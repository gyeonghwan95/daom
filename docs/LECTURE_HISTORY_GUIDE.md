# 강의 이력 등록 가이드

네이버 블로그 제목·본문·이미지·요약문을 홈페이지에 복제하지 않습니다.
블로그 URL은 **원문 참고 링크**로만 사용합니다.

데이터 파일: `src/data/lectures/history.ts`  
타입: `LectureHistoryEntry` (`src/lib/lectures/types.ts`)

## 1. 새 데이터 추가 방법

1. 완료된 강의만 등록합니다. 예정 강의는 넣지 않습니다.
2. `lectureHistory` 배열에 객체를 추가합니다.
3. `verified: true`인 항목만 `/강의이력`과 검색·sitemap에 노출됩니다.
4. 추가 후 `npm run check:lecture-history`로 검증합니다.

## 2. 필수 필드

| 필드 | 설명 |
|------|------|
| `id` | 영문 kebab-case, 전역 고유 |
| `slug` | URL용 ASCII kebab-case (`/강의이력/[slug]`), 고유 |
| `title` | 홈페이지 자체 제목 (블로그 제목 복제 금지) |
| `institution` | 공식 기관명 |
| `institutionType` | `library`, `school`, `youth-center` 등 |
| `city` | 지역 |
| `topics` | 핵심 주제 배열 |
| `lectureCategory` | 필터용 (`생활법률`, `전세사기·주거`, `청년` 등) |
| `format` | 표시용 형식 문구 |
| `summary` | 독자적 소개 문장 (블로그 요약 복제 금지) |
| `featured` | 대표 노출 여부 |
| `verified` | 사실 확인 여부 |
| `sourceNote` | 내부 출처 메모 (화면 비노출) |

## 3. 선택 필드

`shortTitle`, `date`, `endDate`, `year`, `district`, `venue`, `audience`/`audiences`,  
`participantCount`, `durationMinutes`, `durationLabel`, `formatKind`,  
`objectives`, `curriculum`, `highlights`, `frequentlyAskedQuestions`,  
`imageSrc`, `images`, `blogUrl`, `relatedLecturePages`, `verificationNote`

확인되지 않은 날짜·인원·시간은 **추정하지 말고 비워 둡니다.**

## 4. 날짜 형식

- 확인된 일자: `YYYY-MM-DD` (예: `2026-06-20`)
- 연도만 확인: `date: "2025"` + `year: 2025`
- 기간만 확인: `date: "2025~2026"`
- 미확인: `date` 생략, `year`만 있으면 연도 표시

미래 날짜는 history에 넣지 않습니다.

## 5. 이미지 위치

- `public/image/강의-*.jpg` 등 기존 현장 사진 사용
- `src/lib/site-images.ts`의 `imagePaths`에 경로를 등록한 뒤 참조
- 가짜 현장 이미지를 생성하지 않습니다
- 사진이 없으면 `images`를 비우고 카드는 기관 유형 라벨로 표시됩니다

## 6. alt 작성법

- 기관·행사 맥락을 짧게: `부산광역시립시민도서관 생활법률 특강 현장`
- 키워드를 부자연스럽게 반복하지 않습니다
- 수강생 얼굴이 과다 노출된 사진은 사용을 재검토합니다

## 7. 블로그 원문 링크

```ts
blogUrl: "https://blog.naver.com/law-yoon-91/XXXXXXXXX"
```

- `target="_blank"` + `rel="noopener noreferrer"`로만 연결
- canonical·제목·본문에 블로그 내용을 넣지 않음
- 참고 카테고리(수동 확인용):  
  https://blog.naver.com/PostList.naver?blogId=law-yoon-91&from=postList&categoryNo=34

## 8. relatedLecturePages 연결법

주제 페이지에 자동 노출됩니다.

```ts
relatedLecturePages: [
  "/전세사기예방교육",
  "/청년생활법률특강",
  "/법률강의",
]
```

존재하지 않는 URL을 넣지 마세요. 검증 스크립트가 확인합니다.

## 9. verified 설정 기준

`verified: true` — 아래 중 **하나 이상**으로 확인된 경우만:

- 네이버 블로그 원문 존재 (링크만 사용)
- 프로젝트에 행사 사진 존재
- 기관 공식 자료 존재
- 관리자가 제공한 정확한 이력

날짜·기관이 불확실하거나 예정/완료가 불분명하면 **등록하지 않습니다.**  
(`verified: false`를 코드에 남겨 두지 않습니다.)

## 10. 예정 강의와 완료 강의

- 완료 강의 → `lecture-history.ts` (`history.ts`)
- 예정 강의 → 이력에 넣지 않거나 별도 `lecture-upcoming.ts`로만 관리 (공개 이력·통계 제외)

연속 강좌는 회차별 날짜·사진이 확인되면 회차 분리, 아니면 하나의 프로그램으로 묶습니다.
동일 강의를 게시글 수만큼 중복 등록하지 않습니다.
