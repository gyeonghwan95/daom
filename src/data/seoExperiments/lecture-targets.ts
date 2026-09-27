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
];
