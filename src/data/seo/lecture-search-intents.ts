/**
 * Busan B2B/B2G lecture Search Intent Registry.
 * Trend: TREND_DATA_UNAVAILABLE — no fabricated monthly volumes.
 *
 * Champion map (existing URLs only, CREATE_NEW = 0):
 * - LECTURE_MAIN_HUB `/법률강의`
 * - LECTURE_HIRING `/부산법률강사` (초빙·출강·섭외·외부강사)
 * - CORPORATE `/기업법률교육`
 * - PUBLIC `/공공기관법률교육`
 * - WORKSHOP_SEMINAR → Hub + Hiring (워크숍/워크샵 alias, 별도 URL 없음)
 * - STARTUP `/창업법률교육`
 * - JEONSE `/전세사기예방교육`
 * - YOUTH `/청년생활법률특강`
 * - TOPIC_DISCOVERY `/기관특강주제추천`
 * - CONVERSION `/강의문의`
 */

export const LECTURE_MAIN_HUB = "/법률강의";
export const LECTURE_HIRING_CHAMPION = "/부산법률강사";
export const CORPORATE_LECTURE_CHAMPION = "/기업법률교육";
export const PUBLIC_SECTOR_LECTURE_CHAMPION = "/공공기관법률교육";
export const STARTUP_LECTURE_CHAMPION = "/창업법률교육";
export const JEONSE_LECTURE_CHAMPION = "/전세사기예방교육";
export const YOUTH_LECTURE_CHAMPION = "/청년생활법률특강";
export const TOPIC_DISCOVERY_CHAMPION = "/기관특강주제추천";
export const LECTURE_CONVERSION = "/강의문의";
export const LECTURE_HISTORY_HUB = "/강의이력";
export const LAWYER_LECTURE_PAGE = "/부산법무사강의";

export type LectureFunnelStage =
  | "DISCOVERY"
  | "CONSIDERATION"
  | "HIGH_INTENT"
  | "CONVERSION";

export type LectureCoverage =
  | "strong"
  | "partial"
  | "weak"
  | "UNKNOWN_PERFORMANCE";

export type LectureIntentAction =
  | "KEEP"
  | "ADD_SECTION"
  | "ADD_H2"
  | "ADD_FAQ"
  | "ADD_TOPIC_MODULE"
  | "ADD_AUDIENCE_MODULE"
  | "ADD_INTERNAL_LINK"
  | "STRENGTHEN_EXISTING"
  | "CREATE_NEW"
  | "DO_NOT_TARGET";

export type LectureQueryCluster =
  | "workshop"
  | "seminar"
  | "special-lecture"
  | "hiring-booking"
  | "corporate"
  | "public-sector"
  | "audience"
  | "life-law"
  | "jeonse"
  | "startup"
  | "topic-discovery"
  | "geo-doorway";

export type LectureSearchIntentRow = {
  id: string;
  queryCluster: LectureQueryCluster;
  query: string;
  aliases: string[];
  format: string;
  audience: string;
  topic: string;
  institutionType: string;
  funnelStage: LectureFunnelStage;
  existingUrl: string;
  coverage: LectureCoverage;
  trendIndex: "TREND_DATA_UNAVAILABLE";
  businessValue: 5 | 10 | 15 | 20;
  cannibalizationRisk: "LOW" | "MED" | "HIGH";
  recommendedAction: LectureIntentAction;
  notes?: string;
};

export const LECTURE_ANALYTICS_PATHS = [
  LECTURE_MAIN_HUB,
  LECTURE_HIRING_CHAMPION,
  CORPORATE_LECTURE_CHAMPION,
  PUBLIC_SECTOR_LECTURE_CHAMPION,
  STARTUP_LECTURE_CHAMPION,
  JEONSE_LECTURE_CHAMPION,
  YOUTH_LECTURE_CHAMPION,
  TOPIC_DISCOVERY_CHAMPION,
  LECTURE_CONVERSION,
  LECTURE_HISTORY_HUB,
  LAWYER_LECTURE_PAGE,
  "/강사소개",
  "/부산기관법률특강",
  "/부산도서관법률특강",
  "/부산사회복지기관강사",
  "/학교법률교육",
  "/디지털법률교육",
  "/법무사진로특강",
  "/부산강사섭외체크리스트",
  "/부산강사섭외비용",
  "/강의시간별구성",
] as const;

export function classifyLecturePath(
  pathname: string,
): "LECTURE" | "LECTURE_CONVERSION" | null {
  const path = pathname.split("?")[0].split("#")[0];
  if (path === LECTURE_CONVERSION) return "LECTURE_CONVERSION";
  if (path.startsWith("/강의이력")) return "LECTURE";
  if ((LECTURE_ANALYTICS_PATHS as readonly string[]).includes(path)) {
    return "LECTURE";
  }
  return null;
}

export const LECTURE_SEARCH_INTENTS: LectureSearchIntentRow[] = [
  {
    id: "lec-hub",
    queryCluster: "life-law",
    query: "부산 법률강사",
    aliases: ["부산 생활법률 특강", "부산 법률 특강", "부산 법무사 강사"],
    format: "특강·출강",
    audience: "기업·기관 교육담당",
    topic: "생활법률 종합",
    institutionType: "mixed",
    funnelStage: "CONSIDERATION",
    existingUrl: LECTURE_MAIN_HUB,
    coverage: "UNKNOWN_PERFORMANCE",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "MED",
    recommendedAction: "STRENGTHEN_EXISTING",
    notes: "Hub title/H1 보호. 법무사 강사는 /부산법무사강의·/부산법률강사와 역할 분담.",
  },
  {
    id: "lec-workshop",
    queryCluster: "workshop",
    query: "부산 워크숍 강사",
    aliases: [
      "부산 워크샵 강사",
      "부산 워크숍 특강",
      "부산 워크샵 특강",
      "부산 워크숍 특강 강사",
      "부산 워크샵 특강 강사",
      "부산 워크숍 강연",
      "부산 워크샵 강연",
      "기업 워크숍 강사 부산",
      "공공기관 워크숍 강사 부산",
    ],
    format: "워크숍(워크샵 alias)",
    audience: "기업·공공 교육담당",
    topic: "참여형 생활법률",
    institutionType: "mixed",
    funnelStage: "CONSIDERATION",
    existingUrl: LECTURE_MAIN_HUB,
    coverage: "partial",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "LOW",
    recommendedAction: "ADD_SECTION",
    notes: "워크숍/워크샵 철자만 다른 별도 URL 금지. Hiring FAQ·Hub chooser로 흡수.",
  },
  {
    id: "lec-seminar",
    queryCluster: "seminar",
    query: "부산 세미나 강사",
    aliases: [
      "부산 세미나 특강",
      "부산 세미나 강연",
      "부산 세미나 초청강사",
      "공공기관 세미나 강사",
    ],
    format: "세미나",
    audience: "기관 교육담당",
    topic: "정보전달형 특강",
    institutionType: "mixed",
    funnelStage: "CONSIDERATION",
    existingUrl: LECTURE_HIRING_CHAMPION,
    coverage: "partial",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 15,
    cannibalizationRisk: "LOW",
    recommendedAction: "ADD_FAQ",
    notes: "세미나 전용 URL 금지. 특강·워크숍과 한 Format 모듈.",
  },
  {
    id: "lec-special",
    queryCluster: "special-lecture",
    query: "부산 특강 강사",
    aliases: [
      "부산 강연 강사",
      "부산 외부강사",
      "부산 초청강사",
      "부산 출강 강사",
      "부산 강사 출강",
      "부산 출장강의",
    ],
    format: "특강·출강",
    audience: "섭외 담당",
    topic: "강사 섭외",
    institutionType: "mixed",
    funnelStage: "HIGH_INTENT",
    existingUrl: LECTURE_HIRING_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "LOW",
    recommendedAction: "ADD_FAQ",
  },
  {
    id: "lec-hiring",
    queryCluster: "hiring-booking",
    query: "부산 강사 섭외",
    aliases: [
      "부산 강사 초빙",
      "부산 외부강사 섭외",
      "부산 특강 강사 섭외",
      "부산 기업 강사 섭외",
      "부산 공공기관 강사 섭외",
      "부산 법률강사 섭외",
      "부산 법무사 출강",
      "법무사 특강",
      "부산 강사 문의",
      "부산 특강 견적",
    ],
    format: "출강 문의",
    audience: "섭외·총무",
    topic: "섭외 절차",
    institutionType: "mixed",
    funnelStage: "HIGH_INTENT",
    existingUrl: LECTURE_HIRING_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "LOW",
    recommendedAction: "KEEP",
    notes: "체크리스트 `/부산강사섭외체크리스트`, 비용 `/부산강사섭외비용`. 강사료 단정 금지.",
  },
  {
    id: "lec-corporate",
    queryCluster: "corporate",
    query: "부산 기업교육 강사",
    aliases: [
      "부산 기업 강사",
      "부산 기업 특강",
      "부산 기업 특강 강사",
      "부산 사내교육 강사",
      "부산 직원교육 강사",
      "부산 임직원교육 강사",
      "부산 신입사원교육 강사",
      "부산 기업 법률교육",
      "부산 회사 법률교육",
    ],
    format: "사내특강·직원교육",
    audience: "인사·총무·교육",
    topic: "계약·채권·법인 기초",
    institutionType: "corporate",
    funnelStage: "CONSIDERATION",
    existingUrl: CORPORATE_LECTURE_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "LOW",
    recommendedAction: "ADD_FAQ",
  },
  {
    id: "lec-public",
    queryCluster: "public-sector",
    query: "부산 공공기관 법률강사",
    aliases: [
      "부산 공공기관 강사",
      "부산 공공기관 법률교육",
      "부산 공기업 특강",
      "부산 공무원 법률교육",
      "공무원 생활법률교육",
      "기관 외부강사 부산",
    ],
    format: "직원교육·특강",
    audience: "공공 교육담당",
    topic: "생활법률·예방",
    institutionType: "public",
    funnelStage: "CONSIDERATION",
    existingUrl: PUBLIC_SECTOR_LECTURE_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "LOW",
    recommendedAction: "KEEP",
  },
  {
    id: "lec-discovery",
    queryCluster: "topic-discovery",
    query: "기업 특강 주제 추천",
    aliases: [
      "워크숍 특강 주제",
      "직원교육 주제 추천",
      "공공기관 교육 주제",
      "신입사원 특강 주제",
      "청년 특강 주제",
      "부산 워크숍 강사 추천",
      "부산 특강 강사 추천",
    ],
    format: "기획",
    audience: "교육기획 담당",
    topic: "주제 선정",
    institutionType: "mixed",
    funnelStage: "DISCOVERY",
    existingUrl: TOPIC_DISCOVERY_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 15,
    cannibalizationRisk: "MED",
    recommendedAction: "ADD_TOPIC_MODULE",
    notes: "자기추천·1위 금지. `/부산법무사추천`과 무관.",
  },
  {
    id: "lec-jeonse",
    queryCluster: "jeonse",
    query: "부산 전세사기 예방교육",
    aliases: [
      "부산 전세사기 강사",
      "전세사기 예방 특강",
      "청년 전세사기 교육",
      "직원 전세사기 예방교육",
    ],
    format: "특강",
    audience: "청년·직원·복지",
    topic: "전세사기 예방",
    institutionType: "youth-welfare-corporate",
    funnelStage: "CONSIDERATION",
    existingUrl: JEONSE_LECTURE_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "MED",
    recommendedAction: "KEEP",
    notes: "피해대응 `/전세사기피해대응절차`와 Intent 분리.",
  },
  {
    id: "lec-startup",
    queryCluster: "startup",
    query: "부산 창업 법률교육",
    aliases: [
      "부산 창업 특강 강사",
      "스타트업 법률교육 부산",
      "예비창업자 법률교육",
    ],
    format: "특강",
    audience: "예비·초기 창업자",
    topic: "창업 법률실무",
    institutionType: "startup-support",
    funnelStage: "CONSIDERATION",
    existingUrl: STARTUP_LECTURE_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 15,
    cannibalizationRisk: "LOW",
    recommendedAction: "KEEP",
  },
  {
    id: "lec-youth",
    queryCluster: "audience",
    query: "부산 청년 법률특강",
    aliases: ["사회초년생 생활법률", "신입사원 생활법률"],
    format: "특강",
    audience: "청년·신입",
    topic: "생활법률",
    institutionType: "youth-center",
    funnelStage: "CONSIDERATION",
    existingUrl: YOUTH_LECTURE_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 15,
    cannibalizationRisk: "LOW",
    recommendedAction: "KEEP",
  },
  {
    id: "lec-no-geo",
    queryCluster: "geo-doorway",
    query: "해운대 강사",
    aliases: ["센텀 강사", "수영 강사", "연제 강사", "동래 강사"],
    format: "출강",
    audience: "지역 검색",
    topic: "—",
    institutionType: "mixed",
    funnelStage: "CONSIDERATION",
    existingUrl: LECTURE_HIRING_CHAMPION,
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 5,
    cannibalizationRisk: "HIGH",
    recommendedAction: "DO_NOT_TARGET",
    notes: "구·동 thin 랜딩 금지.",
  },
  {
    id: "lec-no-consumer-champion",
    queryCluster: "hiring-booking",
    query: "부산 법무사",
    aliases: ["부산 법무사 추천", "부산 법률상담"],
    format: "수임 상담",
    audience: "개인 의뢰인",
    topic: "법무사 사무소 선택",
    institutionType: "consumer",
    funnelStage: "HIGH_INTENT",
    existingUrl: "/부산법무사",
    coverage: "strong",
    trendIndex: "TREND_DATA_UNAVAILABLE",
    businessValue: 20,
    cannibalizationRisk: "HIGH",
    recommendedAction: "DO_NOT_TARGET",
    notes: "강의 페이지 Primary 금지.",
  },
];

export const LECTURE_P1_CREATE_NEW: string[] = [];
