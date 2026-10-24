/**
 * 고교·대학 진로/법률특강 50 + 법무사 특강·강의 50.
 * 기존 강의 URL만 사용한다. 수임 허브(홈·상속·법인·공탁)와 compact를 나누고,
 * 신규 랜딩은 만들지 않는다.
 */

export type LectureQueryChampion = {
  query: string;
  champion: string;
};

/** 사용자 지정 100개. 대표 URL은 고유해야 한다. */
export const LECTURE_100_TARGETS: readonly LectureQueryChampion[] = [
  // [1] 부산 고교·대학교 취업/진로/법률특강
  { query: "부산 법무사 진로특강", champion: "/법무사진로특강" },
  { query: "부산 법무사 직업인 특강", champion: "/법무사진로특강" },
  { query: "부산 고등학교 법무사 특강", champion: "/법무사진로특강" },
  { query: "부산 고등학교 진로특강 강사", champion: "/법무사진로특강" },
  { query: "부산 고등학교 직업인 특강 강사", champion: "/법무사진로특강" },
  { query: "부산 고등학교 법률특강 강사", champion: "/학교법률교육" },
  { query: "부산 고등학생 법무사 진로체험", champion: "/법무사진로특강" },
  { query: "부산 법조인 진로특강", champion: "/법무사진로특강" },
  { query: "부산 법률 직업인 특강", champion: "/법무사진로특강" },
  { query: "부산 법률 진로체험 강사", champion: "/법무사진로특강" },
  { query: "부산 고등학교 법률 직업체험", champion: "/법무사진로특강" },
  { query: "부산 고등학교 법률 진로교육", champion: "/법무사진로특강" },
  { query: "부산 특성화고 취업특강 강사", champion: "/학교법률교육" },
  { query: "부산 직업계고 취업특강 강사", champion: "/학교법률교육" },
  { query: "부산 특성화고 근로계약서 교육", champion: "/학교법률교육" },
  { query: "부산 직업계고 노동법 특강", champion: "/학교법률교육" },
  { query: "부산 고등학생 첫 직장 법률교육", champion: "/학교법률교육" },
  { query: "부산 고등학생 사회초년생 법률특강", champion: "/학교법률교육" },
  { query: "부산 고등학생 전월세 계약 교육", champion: "/학교법률교육" },
  { query: "부산 고등학생 생활법률 특강", champion: "/학교법률교육" },
  { query: "부산 고등학교 창업 법률특강", champion: "/학교법률교육" },
  { query: "부산 고등학교 계약서 작성 특강", champion: "/학교법률교육" },
  { query: "부산 고교 법무사 진로교육", champion: "/법무사진로특강" },
  { query: "부산 진로체험의 날 법무사 강사", champion: "/법무사진로특강" },
  { query: "부산 진로캠프 법무사 강사", champion: "/법무사진로특강" },
  { query: "부산 법무사 직업체험 학교", champion: "/법무사진로특강" },
  { query: "부산 법무사 되는 법 특강", champion: "/법무사진로특강" },
  { query: "부산 법무사 직업 소개 강의", champion: "/법무사진로특강" },
  { query: "부산 법무사 현직자 멘토링", champion: "/법무사진로특강" },
  { query: "부산 법률 직업 멘토링 강사", champion: "/법무사진로특강" },
  { query: "부산 대학교 법무사 특강", champion: "/법무사진로특강" },
  { query: "부산 대학생 법무사 진로특강", champion: "/법무사진로특강" },
  { query: "부산 대학교 취업특강 법률", champion: "/부산대학교특강" },
  { query: "부산 대학생 취업 법률특강", champion: "/부산대학교특강" },
  { query: "부산 대학생 근로계약서 특강", champion: "/부산대학교특강" },
  { query: "부산 대학생 노동법 강의", champion: "/부산대학교특강" },
  { query: "부산 대학생 사회초년생 법률교육", champion: "/부산대학교특강" },
  { query: "부산 대학생 전월세 계약 특강", champion: "/부산대학교특강" },
  { query: "부산 대학생 전세사기 예방 특강", champion: "/전세사기예방교육" },
  { query: "부산 대학생 창업 법률특강", champion: "/창업법률교육" },
  { query: "부산 대학생 사업자 계약서 교육", champion: "/창업법률교육" },
  { query: "부산 대학생 법인설립 강의", champion: "/창업법률교육" },
  { query: "부산 대학 취업지원센터 법률특강", champion: "/부산대학교특강" },
  { query: "부산 대학 창업지원단 법률특강", champion: "/창업법률교육" },
  { query: "부산 대학 법학과 법무사 진로특강", champion: "/법무사진로특강" },
  { query: "부산 대학생 전문직 진로특강", champion: "/법무사진로특강" },
  { query: "부산 대학생 직업인 멘토링 법무사", champion: "/법무사진로특강" },
  { query: "부산 청년 취업캠프 법률강사", champion: "/청년생활법률특강" },
  { query: "부산 졸업예정자 계약서 특강", champion: "/부산대학교특강" },
  { query: "부산 대학생 첫 직장 계약 특강", champion: "/부산대학교특강" },
  // [2] 부산 법무사 특강·강의
  { query: "부산 법무사 강사 섭외", champion: "/부산법률강사" },
  { query: "부산 법무사 특강 강사", champion: "/부산법률강사" },
  { query: "부산 법무사 강의 의뢰", champion: "/부산법무사강의" },
  { query: "부산 법무사 출강", champion: "/부산법무사강의" },
  { query: "부산 법무사 초청 강연", champion: "/부산법무사강의" },
  { query: "부산 법률 특강 강사", champion: "/법률강의" },
  { query: "부산 생활법률 강사 섭외", champion: "/법률강의" },
  { query: "부산 생활법률 특강", champion: "/법률강의" },
  { query: "부산 찾아가는 법률교육 강사", champion: "/법률강의" },
  { query: "부산 법률교육 강사", champion: "/부산법률강사" },
  { query: "부산 법률 전문가 특강", champion: "/부산법률강사" },
  { query: "부산 시민 법률강좌 강사", champion: "/부산도서관법률특강" },
  { query: "부산 도서관 생활법률 강좌 강사", champion: "/부산도서관법률특강" },
  { query: "부산 평생학습관 법률강좌 강사", champion: "/부산도서관법률특강" },
  { query: "부산 주민센터 생활법률 강사", champion: "/공공기관법률교육" },
  { query: "부산 복지관 생활법률 강사", champion: "/부산사회복지기관강사" },
  { query: "부산 청년센터 법률특강 강사", champion: "/청년생활법률특강" },
  { query: "부산 청년 생활법률 특강", champion: "/청년생활법률특강" },
  { query: "부산 사회초년생 법률교육 강사", champion: "/청년생활법률특강" },
  { query: "부산 자립준비청년 법률교육 강사", champion: "/청년생활법률특강" },
  { query: "부산 전세사기 예방교육 강사", champion: "/전세사기예방교육" },
  { query: "부산 전월세 계약 특강 강사", champion: "/전세사기예방교육" },
  { query: "부산 임대차계약 교육 강사", champion: "/전세사기예방교육" },
  { query: "부산 보증금 반환 법률교육", champion: "/전세사기예방교육" },
  { query: "부산 부동산 계약서 특강", champion: "/전세사기예방교육" },
  { query: "부산 부동산등기 강의", champion: "/전세사기예방교육" },
  { query: "부산 등기부등본 보는 법 특강", champion: "/전세사기예방교육" },
  { query: "부산 상속 법률특강 강사", champion: "/부산도서관법률특강" },
  { query: "부산 상속등기 강의", champion: "/부산도서관법률특강" },
  { query: "부산 상속포기 한정승인 특강", champion: "/부산도서관법률특강" },
  { query: "부산 유언 상속 강의", champion: "/부산도서관법률특강" },
  { query: "부산 가족 재산정리 법률특강", champion: "/부산도서관법률특강" },
  { query: "부산 창업 법률특강 강사", champion: "/창업법률교육" },
  { query: "부산 청년창업 법률교육", champion: "/창업법률교육" },
  { query: "부산 소상공인 계약서 교육", champion: "/창업법률교육" },
  { query: "부산 스타트업 계약서 특강", champion: "/창업법률교육" },
  { query: "부산 법인설립 강의 강사", champion: "/창업법률교육" },
  { query: "부산 법인등기 교육 강사", champion: "/기업법률교육" },
  { query: "부산 사회적기업 법률교육 강사", champion: "/창업법률교육" },
  { query: "부산 창업지원센터 법률강사", champion: "/창업법률교육" },
  { query: "부산 예비창업자 법률특강", champion: "/창업법률교육" },
  { query: "부산 협동조합 법률교육", champion: "/창업법률교육" },
  { query: "부산 개인회생 파산 법률교육", champion: "/공공기관법률교육" },
  { query: "부산 채무조정 교육 강사", champion: "/공공기관법률교육" },
  { query: "부산 금융복지 법률특강", champion: "/공공기관법률교육" },
  { query: "부산 임대차 분쟁 법률교육", champion: "/전세사기예방교육" },
  { query: "부산 지급명령 실무 강의", champion: "/기업법률교육" },
  { query: "부산 공탁 실무 강의", champion: "/기업법률교육" },
  { query: "부산 임차권등기명령 강의", champion: "/전세사기예방교육" },
  { query: "부산 법률 문서 작성 특강", champion: "/기업법률교육" },
];

/** 목록에 없었지만 학교·기관 섭외 유입이 큰 검색어. 신규 URL 없음. */
export const LECTURE_EXTRA_INFLOW: readonly LectureQueryChampion[] = [
  { query: "부산 진로체험지원센터 강사", champion: "/법무사진로특강" },
  { query: "부산 진로체험지원센터 특강", champion: "/법무사진로특강" },
  { query: "부산 창체 진로특강 강사", champion: "/법무사진로특강" },
  { query: "부산 자유학기제 직업인 특강", champion: "/법무사진로특강" },
  { query: "부산 취업진로지원센터 특강", champion: "/부산대학교특강" },
  { query: "부산 대학 취업진로지원센터 강사", champion: "/부산대학교특강" },
  { query: "부산 비교과 프로그램 강사", champion: "/부산대학교특강" },
  { query: "부산 찾아가는 법률교육", champion: "/법률강의" },
  { query: "부산 외부강사 초빙", champion: "/부산법률강사" },
  { query: "부산 평생학습관 외부강사", champion: "/부산도서관법률특강" },
  { query: "부산 평생학습 강사", champion: "/부산도서관법률특강" },
  { query: "부산 자립준비청년 특강 강사", champion: "/청년생활법률특강" },
  { query: "부산 자립지원전담기관 강사", champion: "/부산사회복지기관강사" },
  { query: "부산 고교학점제 외부강사", champion: "/학교법률교육" },
  { query: "부산 진로특강", champion: "/법무사진로특강" },
];

/** 캐러셀에 쓸 고유 사진 소유 URL. 구·군·공탁·상속 수임 카드를 넣지 않는다. */
export const LECTURE_SERP_CAROUSEL_URLS = [
  "/법률강의",
  "/법무사진로특강",
  "/학교법률교육",
  "/부산대학교특강",
  "/전세사기예방교육",
  "/청년생활법률특강",
  "/창업법률교육",
  "/기업법률교육",
  "/부산법률강사",
  "/부산법무사강의",
  "/부산도서관법률특강",
  "/공공기관법률교육",
  "/부산사회복지기관강사",
] as const;

export const LECTURE_CHAMPION_PATHS = [
  ...new Set(
    [...LECTURE_100_TARGETS, ...LECTURE_EXTRA_INFLOW].map((row) => row.champion),
  ),
] as const;

export function compactLectureQuery(query: string): string {
  return query.replace(/\s+/g, "");
}

export function lectureExactKeywordChampions(): {
  path: string;
  compactQueries: readonly string[];
}[] {
  const byPath = new Map<string, string[]>();
  for (const row of [...LECTURE_100_TARGETS, ...LECTURE_EXTRA_INFLOW]) {
    const compact = compactLectureQuery(row.query);
    const list = byPath.get(row.champion) ?? [];
    if (!list.includes(compact)) list.push(compact);
    byPath.set(row.champion, list);
  }
  return [...byPath.entries()].map(([path, compactQueries]) => ({
    path,
    compactQueries,
  }));
}

export function lecturePackUrls(current: string): string[] {
  return LECTURE_SERP_CAROUSEL_URLS.filter((href) => href !== current);
}
