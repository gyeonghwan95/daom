/**
 * Speaker SEO reset — P0/확장 검색어 → 대표 URL 정의.
 * 리포트(02·05·06)와 커버리지 검사에서 공통으로 사용한다.
 */
export const INTENT_GROUPS = [
  { id: "busan-hub", label: "부산 강사·특강·강연 허브", url: "/부산법률강사", decision: "IMPROVE" },
  { id: "enterprise", label: "기업 특강·강연", url: "/기업법률교육", decision: "IMPROVE" },
  { id: "university", label: "대학교 특강", url: "/부산대학교특강", decision: "CREATE" },
  { id: "career", label: "진로특강", url: "/법무사진로특강", decision: "REPOSITION" },
  { id: "high-school", label: "고등학교 특강", url: "/학교법률교육", decision: "REPOSITION" },
  { id: "jeonse", label: "전세사기 예방교육", url: "/전세사기예방교육", decision: "IMPROVE" },
  { id: "life-law", label: "생활법률·법률특강", url: "/법률강의", decision: "KEEP" },
  { id: "generic", label: "지역 없는 강사 프로필 허브", url: "/강사소개", decision: "REPOSITION" },
];

/** [keyword, group, priority] */
export const TARGET_KEYWORDS = [
  ["부산 기업 강연", "enterprise", "P0"],
  ["부산 기업 특강", "enterprise", "P0"],
  ["부산 세미나 강사", "busan-hub", "P0"],
  ["부산 대학 특강", "university", "P0"],
  ["부산 대학교 특강", "university", "P0"],
  ["부산 대학 강연", "university", "P0"],
  ["부산 진로특강", "career", "P0"],
  ["부산 진로특강 강사", "career", "P0"],
  ["부산 고등학교 특강", "high-school", "P0"],
  ["부산 고등학교 특강 강사", "high-school", "P0"],
  ["부산 전세사기 예방 특강", "jeonse", "P0"],
  ["부산 전세사기 예방교육", "jeonse", "P0"],
  ["부산 전세사기 예방교육 강사", "jeonse", "P0"],
  ["부산 생활법률 특강", "life-law", "P0"],
  ["부산 생활법률 강사", "life-law", "P0"],
  ["부산 법률특강 강사", "life-law", "P0"],
  ["부산 강사", "busan-hub", "P1"],
  ["부산 특강", "busan-hub", "P1"],
  ["부산 강연", "busan-hub", "P1"],
  ["부산 강사 초빙", "busan-hub", "P1"],
  ["부산 외부강사", "busan-hub", "P1"],
  ["부산 기업교육 강사", "enterprise", "P1"],
  ["부산 사내특강", "enterprise", "P1"],
  ["부산 대학교 특강 강사", "university", "P1"],
  ["부산 대학생 특강", "university", "P1"],
  ["대학 비교과 특강 강사", "university", "P1"],
  ["대학교 특강 강사", "university", "P1"],
  ["법조인 진로특강", "career", "P1"],
  ["진로특강 강사", "career", "P1"],
  ["전문직업인 특강", "career", "P1"],
  ["고등학교 외부강사", "high-school", "P1"],
  ["고등학생 법률특강", "high-school", "P1"],
  ["전세사기 예방교육 강사", "jeonse", "P1"],
  ["부산 전세사기 특강", "jeonse", "P1"],
  ["법률특강 강사", "life-law", "P1"],
  ["생활법률 강사", "life-law", "P1"],
  ["법률 특강 강사", "life-law", "P1"],
  ["특강 강사 프로필", "generic", "P1"],
  ["특강 강사", "generic", "P1"],
  ["강사 프로필", "generic", "P1"],
];

export function groupUrl(groupId) {
  return INTENT_GROUPS.find((g) => g.id === groupId)?.url;
}
