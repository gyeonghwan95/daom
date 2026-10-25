/**
 * 법무사 수임 유입 검색어 100+.
 * 기존 URL만. 19-query·지역·타지역상속·특강·오늘 상속/법인 챔피언은 다시 가져가지 않는다.
 * 신규 랜딩 금지. TITLE_FROZEN 제목 변경 금지.
 */

export type HireIntentQueryChampion = {
  query: string;
  champion: string;
  family: HireIntentFamily;
};

export type HireIntentFamily =
  | "real-estate"
  | "corporate"
  | "inheritance"
  | "rehab"
  | "jeonse"
  | "gongtak";

/** 수임 검색어. 대표 URL은 이미 있는 페이지다. */
export const HIRE_INTENT_100_TARGETS: readonly HireIntentQueryChampion[] = [
  // 부동산 — 이전·매매
  { query: "부산 소유권이전등기", champion: "/부산소유권이전등기", family: "real-estate" },
  { query: "부산 소유권이전등기 법무사", champion: "/부산소유권이전등기", family: "real-estate" },
  { query: "부산 매매등기 법무사", champion: "/부산소유권이전등기", family: "real-estate" },
  { query: "부산 매매등기", champion: "/부산소유권이전등기", family: "real-estate" },
  { query: "소유권이전등기 서류", champion: "/소유권이전등기서류", family: "real-estate" },
  { query: "소유권이전등기 필요서류", champion: "/소유권이전등기필요서류", family: "real-estate" },
  { query: "소유권이전등기 기간", champion: "/소유권이전등기기간", family: "real-estate" },
  { query: "소유권이전등기 과태료", champion: "/소유권이전등기과태료", family: "real-estate" },
  { query: "부산 신축아파트 소유권이전등기", champion: "/부산신축아파트소유권이전등기", family: "real-estate" },
  { query: "부산 오피스텔 소유권이전등기", champion: "/부산오피스텔소유권이전등기", family: "real-estate" },
  { query: "부산 농지 소유권이전등기", champion: "/부산농지소유권이전등기", family: "real-estate" },
  { query: "부산 판결 소유권이전등기", champion: "/부산판결소유권이전등기", family: "real-estate" },
  { query: "부산 매매등기 전문법무사", champion: "/부산매매등기전문법무사", family: "real-estate" },
  { query: "부산 소유권이전 전문법무사", champion: "/부산소유권이전전문법무사", family: "real-estate" },
  // 증여
  { query: "부산 증여등기", champion: "/부산증여등기", family: "real-estate" },
  { query: "부산 증여등기 법무사", champion: "/부산증여등기", family: "real-estate" },
  { query: "부산 증여등기 전문법무사", champion: "/부산증여등기전문법무사", family: "real-estate" },
  { query: "증여등기 필요서류", champion: "/증여등기필요서류", family: "real-estate" },
  { query: "증여등기 기간", champion: "/증여등기기간", family: "real-estate" },
  { query: "부산 부모자녀 아파트 증여등기", champion: "/부산부모자녀아파트증여등기", family: "real-estate" },
  { query: "부산 부부간 증여등기", champion: "/부산부부간증여등기", family: "real-estate" },
  { query: "부산 부담부증여 등기", champion: "/부산부담부증여등기", family: "real-estate" },
  { query: "부담부증여 셀프", champion: "/방문없이준비하는부담부증여", family: "real-estate" },
  { query: "해외서류 증여등기", champion: "/해외서류가필요한증여등기", family: "real-estate" },
  // 근저당
  { query: "부산 근저당설정등기", champion: "/부산근저당설정등기", family: "real-estate" },
  { query: "부산 근저당설정 법무사", champion: "/부산근저당설정등기", family: "real-estate" },
  { query: "부산 근저당말소등기", champion: "/부산근저당말소등기", family: "real-estate" },
  { query: "부산 근저당말소 법무사", champion: "/부산근저당말소등기", family: "real-estate" },
  { query: "부산 근저당 법무사", champion: "/부산근저당말소등기", family: "real-estate" },
  { query: "근저당말소 필요서류", champion: "/근저당말소필요서류", family: "real-estate" },
  { query: "근저당말소 기간", champion: "/근저당말소기간", family: "real-estate" },
  { query: "부산 중도금대출 근저당", champion: "/부산중도금대출근저당", family: "real-estate" },
  { query: "부산 잔금대출 근저당", champion: "/부산잔금대출근저당", family: "real-estate" },
  // 전세권
  { query: "부산 전세권설정등기", champion: "/부산전세권설정등기", family: "real-estate" },
  { query: "부산 전세권설정 법무사", champion: "/부산전세권설정등기", family: "real-estate" },
  { query: "부산 전세권말소등기", champion: "/부산전세권말소등기", family: "real-estate" },
  { query: "부산 전세권말소 법무사", champion: "/부산전세권말소등기", family: "real-estate" },
  { query: "전세권설정 필요서류", champion: "/전세권설정필요서류", family: "real-estate" },
  { query: "전세권설정 기간", champion: "/전세권설정기간", family: "real-estate" },
  { query: "전세권설정 비용", champion: "/전세권설정비용", family: "real-estate" },
  // 보존등기
  { query: "부산 신축건물보존등기", champion: "/부산신축건물보존등기", family: "real-estate" },
  { query: "부산 보존등기 법무사", champion: "/부산신축건물보존등기", family: "real-estate" },
  { query: "신축보존등기", champion: "/신축보존등기", family: "real-estate" },
  { query: "건물보존등기", champion: "/건물보존등기", family: "real-estate" },
  { query: "집합건물보존등기", champion: "/집합건물보존등기", family: "real-estate" },
  { query: "미등기건물 소유권보존등기", champion: "/미등기건물소유권보존등기", family: "real-estate" },
  // 임차권·전세사기
  { query: "부산 임차권등기명령", champion: "/부산임차권등기명령", family: "jeonse" },
  { query: "부산 임차권등기명령 법무사", champion: "/부산임차권등기명령", family: "jeonse" },
  { query: "임차권등기명령 필요서류", champion: "/임차권등기명령필요서류", family: "jeonse" },
  { query: "임차권등기명령 기간", champion: "/임차권등기명령기간", family: "jeonse" },
  { query: "이사 후 임차권등기명령 준비", champion: "/이사후임차권등기명령준비", family: "jeonse" },
  { query: "부산 전세사기 법무사", champion: "/전세사기피해대응절차", family: "jeonse" },
  { query: "부산 전세사기 피해", champion: "/전세사기피해대응절차", family: "jeonse" },
  { query: "전세사기 피해 대응 법무사", champion: "/전세사기피해대응절차", family: "jeonse" },
  { query: "부산 전세보증금반환 법무사", champion: "/부산전세보증금반환법무사", family: "jeonse" },
  { query: "전세보증금 상담", champion: "/전세보증금상담", family: "jeonse" },
  { query: "집주인 연락두절 전세", champion: "/situations/집주인-연락-두절", family: "jeonse" },
  // 공탁
  { query: "부산 공탁 법무사", champion: "/부산공탁", family: "gongtak" },
  { query: "변제공탁 서류준비", champion: "/변제공탁서류준비", family: "gongtak" },
  { query: "공탁 채권회수 법무사", champion: "/공탁채권회수", family: "gongtak" },
  // 회생·파산
  { query: "부산 개인회생 상담", champion: "/부산개인회생상담", family: "rehab" },
  { query: "부산 개인회생 신청", champion: "/부산개인회생신청", family: "rehab" },
  { query: "부산 개인회생 전문법무사", champion: "/부산개인회생전문법무사", family: "rehab" },
  { query: "개인회생 필요서류", champion: "/개인회생필요서류", family: "rehab" },
  { query: "개인회생 기간", champion: "/개인회생기간", family: "rehab" },
  { query: "신용회복 개인회생 차이", champion: "/신용회복과개인회생차이", family: "rehab" },
  { query: "부산 개인파산", champion: "/부산개인파산", family: "rehab" },
  { query: "부산 개인파산 상담", champion: "/부산개인파산상담", family: "rehab" },
  { query: "부산 파산 신청", champion: "/부산파산신청", family: "rehab" },
  { query: "부산 개인파산 전문법무사", champion: "/부산개인파산전문법무사", family: "rehab" },
  { query: "개인파산 준비서류", champion: "/개인파산준비서류", family: "rehab" },
  { query: "개인파산 기간", champion: "/개인파산기간", family: "rehab" },
  { query: "부산 면책 신청", champion: "/부산면책신청", family: "rehab" },
  { query: "부산 면책 전문법무사", champion: "/부산면책전문법무사", family: "rehab" },
  // 지급명령
  { query: "부산지방법원 지급명령", champion: "/부산지방법원지급명령", family: "rehab" },
  { query: "부산 지급명령 법무사", champion: "/부산지방법원지급명령", family: "rehab" },
  { query: "지급명령 이의신청", champion: "/지급명령이의신청준비", family: "rehab" },
  // 상속 부가 (오늘 묶음에 없던 수임)
  { query: "특별한정승인 법무사", champion: "/특별한정승인", family: "inheritance" },
  { query: "부산 특별한정승인", champion: "/특별한정승인", family: "inheritance" },
  { query: "상속재산분할협의서 준비", champion: "/상속재산분할협의서준비", family: "inheritance" },
  { query: "상속재산분할협의서 작성 법무사", champion: "/상속재산분할협의서준비", family: "inheritance" },
  { query: "상속인조회 방법", champion: "/situations/상속재산-조회", family: "inheritance" },
  { query: "상속재산조회 법무사", champion: "/situations/상속재산-조회", family: "inheritance" },
  { query: "사망자 재산채무 조회", champion: "/사망자재산채무조회", family: "inheritance" },
  { query: "안심상속원스톱 이후 절차", champion: "/안심상속원스톱서비스이후", family: "inheritance" },
  { query: "부산 유언검인", champion: "/부산유언검인", family: "inheritance" },
  { query: "부산 유언검인 법무사", champion: "/부산유언검인", family: "inheritance" },
  { query: "유언공증 준비", champion: "/유언공증준비", family: "inheritance" },
  { query: "유언집행자 상속등기", champion: "/유언집행자와상속등기", family: "inheritance" },
  // 법인 변경 부가
  { query: "부산 목적변경등기 법무사", champion: "/부산사업목적변경등기", family: "corporate" },
  { query: "부산 사업목적변경 법무사", champion: "/부산사업목적변경등기", family: "corporate" },
  { query: "부산 상호변경등기", champion: "/부산상호변경등기", family: "corporate" },
  { query: "부산 상호변경 법무사", champion: "/부산상호변경등기", family: "corporate" },
  { query: "부산 유상증자등기", champion: "/부산유상증자등기", family: "corporate" },
  { query: "부산 유상증자 법무사", champion: "/부산유상증자등기", family: "corporate" },
  { query: "부산 제3자배정 유상증자", champion: "/부산제3자배정유상증자", family: "corporate" },
  { query: "부산 주주배정 유상증자", champion: "/부산주주배정유상증자", family: "corporate" },
  { query: "부산 무상증자등기", champion: "/부산무상증자등기", family: "corporate" },
  { query: "부산 현물출자 증자", champion: "/부산현물출자증자", family: "corporate" },
  { query: "부산 가수금 출자전환", champion: "/부산가수금출자전환", family: "corporate" },
  { query: "부산 감자등기", champion: "/부산감자등기", family: "corporate" },
  { query: "부산 감자 법무사", champion: "/부산감자등기", family: "corporate" },
  // 여분 수임 (100개 이상 맞춤)
  { query: "부산 공동명의 지분증여등기", champion: "/부산공동명의지분증여등기", family: "real-estate" },
  { query: "증여등기 과태료", champion: "/증여등기과태료", family: "real-estate" },
  { query: "부산 근저당 전문법무사", champion: "/부산근저당전문법무사", family: "real-estate" },
  { query: "부산 전세 전문법무사", champion: "/부산전세전문법무사", family: "jeonse" },
  { query: "오피스텔보존등기", champion: "/오피스텔보존등기", family: "real-estate" },
  { query: "상가보존등기", champion: "/상가보존등기", family: "real-estate" },
  { query: "부산동부지원 지급명령", champion: "/부산지방법원동부지원지급명령", family: "rehab" },
  { query: "공탁 자가진단", champion: "/공탁자가진단", family: "gongtak" },
];

export const HIRE_INTENT_CHAMPION_PATHS = [
  ...new Set(HIRE_INTENT_100_TARGETS.map((row) => row.champion)),
] as const;

export function compactHireIntentQuery(query: string): string {
  return query.replace(/\s+/g, "");
}

export function hireIntentExactKeywordChampions(): {
  path: string;
  compactQueries: readonly string[];
}[] {
  const byPath = new Map<string, string[]>();
  for (const row of HIRE_INTENT_100_TARGETS) {
    const compact = compactHireIntentQuery(row.query);
    const list = byPath.get(row.champion) ?? [];
    if (!list.includes(compact)) list.push(compact);
    byPath.set(row.champion, list);
  }
  return [...byPath.entries()].map(([path, compactQueries]) => ({
    path,
    compactQueries,
  }));
}

const REAL_ESTATE_CARDS = [
  "/부산소유권이전등기",
  "/부산증여등기",
  "/부산근저당설정등기",
  "/부산전세권설정등기",
  "/부산신축건물보존등기",
  "/부산부동산등기",
  "/부산법무사상담",
] as const;

const CORPORATE_CARDS = [
  "/부산법인등기",
  "/부산임원변경등기",
  "/부산본점이전등기",
  "/부산사업목적변경등기",
  "/부산유상증자등기",
  "/부산법인법무사",
  "/부산법무사상담",
] as const;

const INHERITANCE_CARDS = [
  "/부산상속법무사",
  "/부산상속포기",
  "/부산한정승인",
  "/전국상속등기",
  "/부산법무사상담",
] as const;

const REHAB_CARDS = [
  "/services/personal-rehabilitation",
  "/services/bankruptcy",
  "/부산법무사상담",
  "/부산법률상담",
  "/부산공탁",
  "/부산법무사추천",
] as const;

const JEONSE_CARDS = [
  "/부산소유권이전등기",
  "/부산전세권설정등기",
  "/부산부동산등기",
  "/부산법무사상담",
] as const;

const GONGTAK_CARDS = [
  "/부산공탁",
  "/부산등기법무사",
  "/부산부동산등기",
  "/부산법무사상담",
] as const;

const FAMILY_CARDS: Record<HireIntentFamily, readonly string[]> = {
  "real-estate": REAL_ESTATE_CARDS,
  corporate: CORPORATE_CARDS,
  inheritance: INHERITANCE_CARDS,
  rehab: REHAB_CARDS,
  jeonse: JEONSE_CARDS,
  gongtak: GONGTAK_CARDS,
};

const FAMILY_HEADING: Record<HireIntentFamily, string> = {
  "real-estate": "함께 확인하면 좋은 등기",
  corporate: "회사 등기 종류",
  inheritance: "상속과 이어지는 안내",
  rehab: "회생·파산과 이어지는 안내",
  jeonse: "전세·임차와 이어지는 안내",
  gongtak: "공탁과 이어지는 안내",
};

const PATH_FAMILY = new Map(
  HIRE_INTENT_100_TARGETS.map((row) => [row.champion, row.family]),
);

export function getHireIntentCarouselPack(
  path: string,
): { heading: string; urls: string[] } | undefined {
  const family = PATH_FAMILY.get(path);
  if (!family) return undefined;
  const urls = FAMILY_CARDS[family].filter((href) => href !== path);
  if (urls.length < 4) return undefined;
  return { heading: FAMILY_HEADING[family], urls };
}
