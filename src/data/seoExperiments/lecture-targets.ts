/**
 * Speaker SEO reset — 강의 target URL 목록과 title freeze 기록.
 * 이 목록에 없는 URL은 강의 전용 CTA·레이아웃 분기를 타지 않는다.
 */
export const LECTURE_TARGET_PATHS = [
  "/부산법률강사",
  "/기업법률교육",
  "/부산대학교특강",
  "/법무사진로특강",
  "/학교법률교육",
  "/전세사기예방교육",
  "/법률강의",
  "/강사소개",
] as const;

export type LectureTargetPath = (typeof LECTURE_TARGET_PATHS)[number];

const TARGET_SET = new Set<string>(LECTURE_TARGET_PATHS);

function normalizePath(path: string): string {
  let clean = path.split(/[?#]/)[0] ?? "";
  try {
    clean = decodeURIComponent(clean);
  } catch {
    /* 이미 디코딩된 경로 */
  }
  if (!clean.startsWith("/")) clean = `/${clean}`;
  if (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);
  return clean;
}

export function isLectureTargetPath(path: string): boolean {
  return TARGET_SET.has(normalizePath(path));
}

/** 강의 섭외 담당자가 보는 페이지(타깃 + 주제·기관별 강의 페이지 + 강의 이력) — 개인 의뢰인용 비용 문구 대신 강의 문의 문구를 쓴다 */
const LECTURE_PAGE_SET = new Set<string>([
  ...LECTURE_TARGET_PATHS,
  "/강의이력",
  "/강의문의",
  "/청년생활법률특강",
  "/창업법률교육",
  "/디지털법률교육",
  "/공공기관법률교육",
  "/부산도서관법률특강",
  "/부산법무사강의",
  "/부산기관법률특강",
  "/부산사회복지기관강사",
  "/부산강사섭외비용",
  "/부산강사섭외체크리스트",
  "/기관특강주제추천",
  "/강의시간별구성",
]);

export function isLecturePagePath(path: string): boolean {
  const clean = normalizePath(path);
  return LECTURE_PAGE_SET.has(clean) || clean.startsWith("/강의이력/");
}

export type LectureTitleChange = {
  path: LectureTargetPath;
  oldTitle: string;
  newTitle: string;
  primaryQuery: string;
  serpReason: string;
  contentReason: string;
  /** 이 날짜 이후 근거 없는 자동 변경 금지 */
  frozenAt: string;
};

/**
 * 2026-09-27 speaker reset 이후 title은 고정한다.
 * 다음 변경은 Search Advisor 실측 근거가 있을 때만 이 목록에 추가한다.
 */
export const LECTURE_TITLE_FREEZE: LectureTitleChange[] = [
  {
    path: "/부산법률강사",
    oldTitle: "부산 강사 초빙｜기관·기업·청년 대상 특강·강연",
    newTitle: "부산 강사 초빙｜기관·기업 특강·강연·세미나 출강",
    primaryQuery: "부산 강사 초빙 / 부산 세미나 강사",
    serpReason:
      "부산 세미나 강사 SERP에 다옴 URL 없음. 행사 공고 위주라 공급자 페이지가 적음",
    contentReason:
      "청년은 별도 URL이 담당. 허브 title에서 세미나 형식을 명시해 Busan hub 역할을 분명히 함",
    frozenAt: "2026-09-27",
  },
  {
    path: "/기업법률교육",
    oldTitle: "부산 기업 특강 | 계약·채권·법인 실무 법률교육 - 안윤정 법무사",
    newTitle: "부산 기업 특강·강연｜임직원 계약·채권·법인 실무교육",
    primaryQuery: "부산 기업 특강 / 부산 기업 강연",
    serpReason:
      "부산 기업 특강은 이미 노출. 부산 기업 강연 SERP에는 다옴 URL 없음(CEO 포럼·세미나 위주)",
    contentReason: "기존 prefix 유지, 강연 표기만 추가. 브랜드 suffix 제거로 길이 단축",
    frozenAt: "2026-09-27",
  },
  {
    path: "/부산대학교특강",
    oldTitle: "(신규)",
    newTitle: "부산 대학교 특강 강사｜비교과·진로·생활법률 특강 구성",
    primaryQuery: "부산 대학교 특강",
    serpReason:
      "대학 특강 SERP는 대학 공지 위주, 공급자 페이지가 적고 다옴 URL 없음",
    contentReason:
      "기존 /학교법률교육이 고교·대학을 함께 다뤄 의도가 흐림. 대학 전용 커리큘럼·선택기준·FAQ로 분리",
    frozenAt: "2026-09-27",
  },
  {
    path: "/법무사진로특강",
    oldTitle: "부산 법무사 진로특강 | 학교·직업 특강",
    newTitle: "부산 진로특강 강사｜현직 법무사 법조·전문직 직업인 특강",
    primaryQuery: "부산 진로특강 강사",
    serpReason:
      "부산 진로특강 SERP는 공공 프로그램(전문직업인 특강·직업인 특강) 위주, 다옴 URL 없음",
    contentReason:
      "법무사 진로특강 표기는 유지하면서 담당자 검색어(진로특강 강사·직업인 특강)를 앞에 둠",
    frozenAt: "2026-09-27",
  },
  {
    path: "/학교법률교육",
    oldTitle: "부산 학교·대학 법률교육｜청소년·대학생 생활법률 특강",
    newTitle: "부산 고등학교 특강 강사｜생활법률·진로 특강과 강의계획",
    primaryQuery: "부산 고등학교 특강 강사",
    serpReason:
      "고등학교 특강 강사 SERP는 강사 섭외 후기 블로그 위주, 다옴 URL 없음",
    contentReason: "대학 내용은 /부산대학교특강으로 이동. 이 URL은 고등학교(중등) 전용",
    frozenAt: "2026-09-27",
  },
  {
    path: "/전세사기예방교육",
    oldTitle: "부산 전세사기 예방교육 | 청년·기관 법률특강",
    newTitle: "부산 전세사기 예방교육 강사｜청년·대학생 전월세 계약 특강",
    primaryQuery: "부산 전세사기 예방교육 강사",
    serpReason: "부산 전세사기 예방교육 2위 노출 중. prefix 유지",
    contentReason: "P0 검색어인 강사·예방 특강이 title에 없어 보완",
    frozenAt: "2026-09-27",
  },
  {
    path: "/법률강의",
    oldTitle: "부산 법률 강의·특강 | 안윤정 법무사",
    newTitle: "부산 법률 강의·특강 | 안윤정 법무사",
    primaryQuery: "부산 생활법률 특강",
    serpReason:
      "부산 생활법률 특강 3위, 부산 법률특강 강사 4위, 법률특강 강사 1위 — 유지",
    contentReason: "KEEP. 본문·description만 생활법률 특강 담당자 기준으로 보강",
    frozenAt: "2026-09-27",
  },
  {
    path: "/강사소개",
    oldTitle: "안윤정 법무사 강사 소개 | 법률특강 프로필",
    newTitle: "특강 강사 프로필｜안윤정 법무사 법률·진로 강의 소개",
    primaryQuery: "특강 강사 프로필 / 법률 특강 강사",
    serpReason:
      "지역 없는 강사 검색은 강사은행·강사풀 등 플랫폼 위주. 개인 강사 프로필 페이지 수요",
    contentReason: "지역명 없는 generic hub 역할. 프로필·강의계획서 안내를 전면에 둠",
    frozenAt: "2026-09-27",
  },
  // 2026-11-01 네이버 모바일 실측: 지역 없는 강의 키워드에서 사이트 미노출. 1위 페이지는 제목 앞부분과 H1을 그대로 두고 뒷부분만 보강.
  {
    path: "/전세사기예방교육",
    oldTitle: "부산 전세사기 예방교육 강사｜청년·대학생 전월세 계약 특강",
    newTitle: "부산 전세사기 예방교육 강사｜전세사기 예방 특강·청년 전월세 계약 강의",
    primaryQuery: "전세사기 예방 특강 / 전세사기 강의 (부산 전세사기 예방교육 1위 유지)",
    serpReason: "부산 전세사기 예방교육 1위·전세사기 예방 강사 2위, 전세사기 예방 특강·전세사기 강의 미노출",
    contentReason: "앞부분 유지, 뒷부분에 '전세사기 예방 특강'·'강의' 정확 문구 추가",
    frozenAt: "2026-11-01",
  },
  {
    path: "/법률강의",
    oldTitle: "부산 법률 강의·특강 | 안윤정 법무사",
    newTitle: "부산 법률 강의·특강 | 생활법률특강·법률교육 안윤정 법무사",
    primaryQuery: "생활법률특강 / 법률특강 (부산 법률 강의 1위 유지)",
    serpReason: "부산 법률 강의 1위·부산 법률특강 3위, 생활법률특강·법률특강 사이트 미노출(블로그만 7·12위)",
    contentReason: "앞부분 유지, '생활법률특강·법률교육' 추가",
    frozenAt: "2026-11-01",
  },
  {
    path: "/부산법률강사",
    oldTitle: "부산 강사 초빙｜기관·기업 특강·강연·세미나 출강",
    newTitle: "부산 강사 초빙｜법률 강사·기관·기업 특강·강연·세미나",
    primaryQuery: "법률 강사 초빙 / 법률 강사 (부산 법률 강사 1위 유지)",
    serpReason: "부산 법률 강사 1위·법률 강사 초빙 2위, 법률 강사 미노출 — 제목·H1·본문에 '법률 강사' 없음",
    contentReason: "앞부분 유지, '법률 강사' 추가",
    frozenAt: "2026-11-01",
  },
  {
    path: "/기업법률교육",
    oldTitle: "부산 기업 특강·강연｜임직원 계약·채권·법인 실무교육",
    newTitle: "부산 기업 법률 특강·강연｜직장인 계약·채권·법인 실무교육",
    primaryQuery: "기업 법률 특강 / 직장인 법률 특강",
    serpReason: "기업 법률 특강·직장인 법률 특강 모두 미노출. 제목에 '법률'·'직장인' 없음",
    contentReason: "1위 키워드 없음. 검색 문구를 제목·H1에 반영",
    frozenAt: "2026-11-01",
  },
];
