/**
 * REGION CONTENT REGISTRY — 타지역 상속등기 검색 의도 1개당 대표 URL 1개.
 * 점수(A–G)는 내부 기준이며 네이버 공식 기준이 아니다. 검색량 숫자는 쓰지 않는다(demandProxy만).
 * serp: 2026-09-27 로그아웃 상태 1회 표본(순위 보장 아님). null = 표본 없음.
 * 이 파일은 스크립트(Node 24 .ts 타입 제거)에서도 읽으므로 경로 alias import를 쓰지 않는다.
 * familyCourt: 울산·양산·창원·김해·거제·대구·경주·구미·진주·통영·밀양은 법원 관할표로 확인. 나머지는 페이지에 쓰기 전 재확인.
 */

export type RegionType = "NEARBY" | "REMOTE" | "MIXED";
export type RegionGroup = "부산인접" | "동남권광역" | "경남" | "경북" | "수도권" | "기타광역" | "제주";
export type DemandProxy = "HIGH_DEMAND_PROXY" | "MEDIUM" | "LOW" | "UNKNOWN";
export type RegionAction =
  | "PROTECT_WINNER"
  | "IMPROVE_EXISTING"
  | "EXPAND_NOW"
  | "TEST_NEW_CITY_PAGE"
  | "HOLD"
  | "DO_NOT_CREATE";

export type RegionScores = {
  /** 기존 노출 25 */
  A: number;
  /** 도시 규모 15 */
  B: number;
  /** 부산 생활권·연고 15 */
  C: number;
  /** 원격 적합도 15 (상속등기 기준) */
  D: number;
  /** 콘텐츠 공백 10 */
  E: number;
  /** 사이트 내 지역 클러스터 권위 10 */
  F: number;
  /** 고유 콘텐츠 가능성 10 */
  G: number;
};

export type RegionEntry = {
  region: string;
  parent: string;
  group: RegionGroup;
  regionType: RegionType;
  targetIntent: string;
  secondaryQueries: readonly string[];
  representativeUrl: string;
  hubUrl?: string;
  parentHub: "/전국상속등기";
  familyCourt: string;
  serp: { query: string; position: number | null; shown: readonly string[]; note?: string } | null;
  scores: RegionScores;
  /** A 점수 근거 */
  aBasis: "SERP_1" | "SERP_2" | "SERP_3" | "WRONG_ENTITY" | "ABSENT" | "UNSAMPLED";
  demandProxy: DemandProxy;
  action: RegionAction;
  batch?: "A" | "B";
  uniqueAngle: string;
  defect?: string;
};

const HUB = "/전국상속등기" as const;
const D_INHERITANCE = 15;

export const REGION_CONTENT_REGISTRY: readonly RegionEntry[] = [
  {
    region: "울산",
    parent: "울산광역시",
    group: "동남권광역",
    regionType: "NEARBY",
    targetIntent: "울산 상속 법무사",
    secondaryQueries: ["울산 상속등기 법무사", "울산 아파트 상속등기"],
    representativeUrl: "/업무사례/울산상속등기법무사",
    hubUrl: "/업무사례/울산법무사업무",
    parentHub: HUB,
    familyCourt: "울산가정법원(울산광역시·양산시)",
    serp: { query: "울산 상속 법무사", position: 1, shown: ["/업무사례/울산법무사업무", "/업무사례/울산아파트상속등기"] },
    scores: { A: 25, B: 15, C: 12, D: D_INHERITANCE, E: 1, F: 10, G: 8 },
    aBasis: "SERP_1",
    demandProxy: "HIGH_DEMAND_PROXY",
    action: "PROTECT_WINNER",
    uniqueAngle: "허브(울산 법무사 업무)가 1순위로 노출되고 상속 세부 문서가 함께 묶여 보인다. 제목·H1 유지.",
  },
  {
    region: "포항",
    parent: "경상북도",
    group: "경북",
    regionType: "REMOTE",
    targetIntent: "포항 상속 법무사",
    secondaryQueries: ["포항 상속등기 법무사", "포항 아파트 상속등기"],
    representativeUrl: "/업무사례/포항상속등기법무사",
    hubUrl: "/업무사례/경북상속등기법무사",
    parentHub: HUB,
    familyCourt: "대구가정법원 포항지원",
    serp: { query: "포항 상속 법무사", position: 1, shown: ["/업무사례/포항상속등기법무사", "/업무사례/경북상속등기법무사"] },
    scores: { A: 25, B: 11, C: 6, D: D_INHERITANCE, E: 1, F: 5, G: 7 },
    aBasis: "SERP_1",
    demandProxy: "MEDIUM",
    action: "PROTECT_WINNER",
    uniqueAngle: "도시 문서 + 경북 상위 허브가 짝으로 노출. 제목·H1 유지.",
  },
  {
    region: "경산",
    parent: "경상북도",
    group: "경북",
    regionType: "REMOTE",
    targetIntent: "경산 상속 법무사",
    secondaryQueries: ["경산 상속등기"],
    representativeUrl: "/업무사례/경산상속등기법무사",
    hubUrl: "/업무사례/경북상속등기법무사",
    parentHub: HUB,
    familyCourt: "대구가정법원",
    serp: { query: "경산 상속 법무사", position: 1, shown: ["/업무사례/경산상속등기법무사", "/업무사례/경북상속등기법무사"] },
    scores: { A: 25, B: 8, C: 5, D: D_INHERITANCE, E: 2, F: 4, G: 6 },
    aBasis: "SERP_1",
    demandProxy: "LOW",
    action: "PROTECT_WINNER",
    uniqueAngle: "대구가정법원 관할 지역. 현 상태 유지.",
  },
  {
    region: "양산",
    parent: "경상남도",
    group: "부산인접",
    regionType: "NEARBY",
    targetIntent: "양산 상속등기 법무사",
    secondaryQueries: ["양산 상속 법무사", "물금 상속등기", "양산 상속포기"],
    representativeUrl: "/업무사례/양산상속등기법무사",
    hubUrl: "/업무사례/양산법무사업무",
    parentHub: HUB,
    familyCourt: "울산가정법원(양산시 관할)",
    serp: {
      query: "양산 상속 법무사",
      position: 2,
      shown: ["/업무사례/양산법무사업무", "/업무사례/양산상속포기한정승인"],
      note: "상속등기 대표 URL이 아니라 허브·상속포기 문서가 노출",
    },
    scores: { A: 18, B: 10, C: 15, D: D_INHERITANCE, E: 6, F: 9, G: 10 },
    aBasis: "SERP_2",
    demandProxy: "MEDIUM",
    action: "IMPROVE_EXISTING",
    batch: "A",
    uniqueAngle: "부산과 맞닿은 생활권(방문·비대면 선택) + 상속포기는 부산이 아닌 울산가정법원 관할이라는 점.",
    defect: "상속등기 대표 URL이 SERP에 선택되지 않음(허브가 대신 노출). 공통 템플릿 반복.",
  },
  {
    region: "창원",
    parent: "경상남도",
    group: "부산인접",
    regionType: "NEARBY",
    targetIntent: "창원 상속등기 법무사",
    secondaryQueries: ["창원 상속 법무사", "마산 상속등기", "진해 상속등기"],
    representativeUrl: "/업무사례/창원상속등기법무사",
    hubUrl: "/업무사례/경남상속등기법무사",
    parentHub: HUB,
    familyCourt: "창원지방법원 본원(의창·성산·진해) / 마산지원(마산합포·마산회원)",
    serp: {
      query: "창원 상속 법무사",
      position: 2,
      shown: ["/업무사례/창원상속등기비용", "/업무사례/창원상속등기법무사"],
      note: "비용 문서가 대표 URL보다 앞",
    },
    scores: { A: 18, B: 15, C: 12, D: D_INHERITANCE, E: 6, F: 7, G: 9 },
    aBasis: "SERP_2",
    demandProxy: "HIGH_DEMAND_PROXY",
    action: "IMPROVE_EXISTING",
    batch: "A",
    uniqueAngle: "5개 구에 흩어진 부동산을 한 등기소에 일괄 신청하는 요건(제7조의2)과 구별 가정법원 관할 차이.",
    defect: "비용 하위 문서가 대표 URL보다 먼저 노출. 공통 템플릿 반복.",
  },
  {
    region: "김해",
    parent: "경상남도",
    group: "부산인접",
    regionType: "NEARBY",
    targetIntent: "김해 상속등기 법무사",
    secondaryQueries: ["김해 상속 법무사", "장유 상속등기", "김해 상속등기 비용"],
    representativeUrl: "/업무사례/김해상속등기법무사",
    hubUrl: "/업무사례/경남상속등기법무사",
    parentHub: HUB,
    familyCourt: "창원지방법원 본원(김해시 관할)",
    serp: { query: "김해 상속 법무사", position: 3, shown: ["/업무사례/김해상속등기법무사", "/업무사례/김해상속등기필요서류"] },
    scores: { A: 14, B: 12, C: 15, D: D_INHERITANCE, E: 7, F: 7, G: 7 },
    aBasis: "SERP_3",
    demandProxy: "MEDIUM",
    action: "IMPROVE_EXISTING",
    batch: "A",
    uniqueAngle: "부산 거주 상속인이 많은 생활권 + 가사사건은 부산이 아닌 창원지방법원 본원 관할.",
    defect: "공통 템플릿 반복, 김해 고유 정보 부족.",
  },
  {
    region: "대구",
    parent: "대구광역시",
    group: "동남권광역",
    regionType: "REMOTE",
    targetIntent: "대구 상속등기 법무사",
    secondaryQueries: ["대구 상속 법무사", "대구 아파트 상속등기", "대구 상속등기 비용"],
    representativeUrl: "/업무사례/대구상속등기법무사",
    hubUrl: "/업무사례/대구법무사업무",
    parentHub: HUB,
    familyCourt: "대구가정법원(대구·영천·경산·청도·칠곡·성주·고령)",
    serp: { query: "대구 상속 법무사", position: null, shown: [], note: "1페이지 미노출(대구 하위 문서 약 25개 보유)" },
    scores: { A: 3, B: 15, C: 7, D: D_INHERITANCE, E: 10, F: 9, G: 8 },
    aBasis: "ABSENT",
    demandProxy: "HIGH_DEMAND_PROXY",
    action: "IMPROVE_EXISTING",
    batch: "A",
    uniqueAngle: "대구 현지 사무소가 많은 시장 — 현지처럼 보이지 않고 ‘부산에서 맡겨도 되는 경우와 아닌 경우’를 솔직히 구분.",
    defect: "하위 문서가 많아도 미노출. 대표 URL 본문이 얇고(비용·서류 반복) 원격 의도에 답하지 않음.",
  },
  {
    region: "거제",
    parent: "경상남도",
    group: "경남",
    regionType: "NEARBY",
    targetIntent: "거제 상속등기 법무사",
    secondaryQueries: ["거제 상속 법무사", "거제시 상속등기"],
    representativeUrl: "/업무사례/거제상속등기법무사",
    hubUrl: "/업무사례/경남상속등기법무사",
    parentHub: HUB,
    familyCourt: "창원지방법원 통영지원(통영·거제·고성)",
    serp: {
      query: "거제 상속 법무사",
      position: 3,
      shown: ["/연제구법무사", "/거제동상속등기"],
      note: "경남 거제시가 아니라 부산 연제구 거제동 문서가 노출(엔터티 혼동)",
    },
    scores: { A: 6, B: 7, C: 10, D: D_INHERITANCE, E: 9, F: 4, G: 9 },
    aBasis: "WRONG_ENTITY",
    demandProxy: "LOW",
    action: "IMPROVE_EXISTING",
    batch: "A",
    uniqueAngle: "‘경남 거제시’와 ‘부산 연제구 거제동’을 첫 문단에서 구분 + 통영지원 관할.",
    defect: "검색 결과에서 부산 거제동 문서와 혼동. 대표 URL 제목에 ‘법무사’가 없음.",
  },
  {
    region: "경주",
    parent: "경상북도",
    group: "경북",
    regionType: "REMOTE",
    targetIntent: "경주 상속등기 법무사",
    secondaryQueries: ["경주 상속 법무사", "경주 토지 상속등기"],
    representativeUrl: "/업무사례/경주상속등기법무사",
    hubUrl: "/업무사례/경북상속등기법무사",
    parentHub: HUB,
    familyCourt: "대구가정법원 경주지원(경주시)",
    serp: { query: "경주 상속 법무사", position: 2, shown: ["/업무사례/경주상속등기법무사", "/업무사례/경주오래된토지상속등기"] },
    scores: { A: 18, B: 7, C: 8, D: D_INHERITANCE, E: 5, F: 4, G: 6 },
    aBasis: "SERP_2",
    demandProxy: "LOW",
    action: "IMPROVE_EXISTING",
    batch: "B",
    uniqueAngle: "비농업인 상속인의 농지 소유(농지법 1만㎡)·임야. 오래된 토지 의도는 /업무사례/경주오래된토지상속등기가 담당.",
  },
  {
    region: "진주",
    parent: "경상남도",
    group: "경남",
    regionType: "REMOTE",
    targetIntent: "진주 상속등기 법무사",
    secondaryQueries: ["진주 상속 법무사"],
    representativeUrl: "/업무사례/진주상속등기법무사",
    hubUrl: "/업무사례/경남상속등기법무사",
    parentHub: HUB,
    familyCourt: "창원지방법원 진주지원(진주·사천·하동·남해·산청)",
    serp: { query: "진주 상속 법무사", position: 3, shown: ["/업무사례/진주상속포기한정승인"], note: "상속포기 문서가 선행" },
    scores: { A: 14, B: 9, C: 7, D: D_INHERITANCE, E: 7, F: 4, G: 6 },
    aBasis: "SERP_3",
    demandProxy: "MEDIUM",
    action: "IMPROVE_EXISTING",
    batch: "B",
    uniqueAngle: "빚 확인(안심상속) → 포기·한정승인 판단 → 등기 순서. 포기 의도는 /업무사례/진주상속포기한정승인이 담당.",
  },
  {
    region: "구미",
    parent: "경상북도",
    group: "경북",
    regionType: "REMOTE",
    targetIntent: "구미 상속등기 법무사",
    secondaryQueries: ["구미 상속 법무사"],
    representativeUrl: "/업무사례/구미상속등기법무사",
    hubUrl: "/업무사례/경북상속등기법무사",
    parentHub: HUB,
    familyCourt: "대구가정법원 김천지원(김천·구미)",
    serp: { query: "구미 상속 법무사", position: 2, shown: ["/업무사례/구미상속등기법무사"] },
    scores: { A: 18, B: 10, C: 4, D: D_INHERITANCE, E: 5, F: 4, G: 5 },
    aBasis: "SERP_2",
    demandProxy: "MEDIUM",
    action: "IMPROVE_EXISTING",
    batch: "B",
    uniqueAngle: "구미 부동산 상속 / 구미 거주 상속인의 부산 부동산 상속 양방향, 김천지원 관할, 가족 회사 임원 변경.",
  },
  {
    region: "통영",
    parent: "경상남도",
    group: "경남",
    regionType: "REMOTE",
    targetIntent: "통영 상속등기 법무사",
    secondaryQueries: ["통영 상속 법무사"],
    representativeUrl: "/업무사례/통영상속등기법무사",
    hubUrl: "/업무사례/경남상속등기법무사",
    parentHub: HUB,
    familyCourt: "창원지방법원 통영지원",
    serp: { query: "통영 상속 법무사", position: 2, shown: ["/업무사례/통영상속등기법무사"] },
    scores: { A: 18, B: 4, C: 8, D: D_INHERITANCE, E: 5, F: 3, G: 6 },
    aBasis: "SERP_2",
    demandProxy: "LOW",
    action: "IMPROVE_EXISTING",
    batch: "B",
    uniqueAngle: "섬 지역 토지와 등기부 없는 건물의 상속인 보존등기(부동산등기법 제65조 제1호).",
  },
  {
    region: "밀양",
    parent: "경상남도",
    group: "경남",
    regionType: "REMOTE",
    targetIntent: "밀양 상속등기 법무사",
    secondaryQueries: ["밀양 상속 법무사"],
    representativeUrl: "/업무사례/밀양상속등기법무사",
    hubUrl: "/업무사례/경남상속등기법무사",
    parentHub: HUB,
    familyCourt: "창원지방법원 밀양지원(밀양·창녕)",
    serp: null,
    scores: { A: 8, B: 4, C: 10, D: D_INHERITANCE, E: 6, F: 3, G: 5 },
    aBasis: "UNSAMPLED",
    demandProxy: "LOW",
    action: "IMPROVE_EXISTING",
    batch: "B",
    uniqueAngle: "흩어진 형제의 협의서 서명·본인서명사실확인서, 단독 소유 vs 법정상속분 공유.",
  },
  ...(
    [
      ["사천", "경상남도", "경남", "REMOTE", "창원지방법원 진주지원", 4, 6, 6, 3, 4, "LOW"],
      ["울주군", "울산광역시", "동남권광역", "NEARBY", "울산가정법원", 7, 12, 5, 6, 6, "LOW"],
      ["안동", "경상북도", "경북", "REMOTE", "대구지방법원 안동지원", 5, 3, 6, 2, 4, "LOW"],
      ["서울", "서울특별시", "수도권", "REMOTE", "서울가정법원", 15, 5, 7, 3, 5, "HIGH_DEMAND_PROXY"],
      ["경기", "경기도", "수도권", "REMOTE", "수원가정법원 등", 15, 4, 6, 2, 4, "HIGH_DEMAND_PROXY"],
      ["인천", "인천광역시", "수도권", "REMOTE", "인천가정법원", 15, 3, 6, 2, 4, "HIGH_DEMAND_PROXY"],
      ["대전", "대전광역시", "기타광역", "REMOTE", "대전가정법원", 15, 3, 6, 2, 4, "HIGH_DEMAND_PROXY"],
      ["광주", "광주광역시", "기타광역", "REMOTE", "광주가정법원", 15, 3, 6, 2, 4, "HIGH_DEMAND_PROXY"],
      ["세종", "세종특별자치시", "기타광역", "REMOTE", "대전가정법원 관할(세종시 법원 구성 확인 필요)", 10, 2, 6, 2, 4, "MEDIUM"],
      ["제주", "제주특별자치도", "제주", "REMOTE", "제주지방법원", 11, 3, 6, 2, 5, "MEDIUM"],
    ] as const
  ).map(
    ([region, parent, group, regionType, familyCourt, B, C, E, F, G, demandProxy]): RegionEntry => ({
      region,
      parent,
      group,
      regionType,
      targetIntent: `${region} 상속등기 법무사`,
      secondaryQueries: [`${region} 상속 법무사`],
      representativeUrl: `/업무사례/${region}상속등기법무사`,
      parentHub: HUB,
      familyCourt,
      serp: null,
      scores: { A: 8, B, C, D: D_INHERITANCE, E, F, G },
      aBasis: "UNSAMPLED",
      demandProxy,
      action: "HOLD",
      uniqueAngle:
        group === "수도권" || group === "기타광역"
          ? "현지 사무소 경쟁이 큰 시장 — 지역 페이지 확대보다 ‘부동산은 지방, 상속인은 수도권’ 문제형 문서가 적합."
          : "SERP 표본·검증 가능한 지역 고유 정보 확보 후 재평가.",
    }),
  ),
];

export function regionScoreTotal(entry: RegionEntry): number {
  const s = entry.scores;
  return s.A + s.B + s.C + s.D + s.E + s.F + s.G;
}

export function getRegionEntry(region: string): RegionEntry | undefined {
  return REGION_CONTENT_REGISTRY.find((e) => e.region === region);
}
