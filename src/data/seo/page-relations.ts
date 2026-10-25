/**
 * Page Relation Registry — Busan Entity Graph
 * Maps existing URLs to region / service / situation entities.
 * No new URLs; additive internal-link and champion decisions only.
 */
import {
  LECTURE_100_TARGETS,
  LECTURE_EXTRA_INFLOW,
} from "@/data/seo/lecture-100-champions";
import { getExactKeywordChampionPath } from "@/lib/seo/champion-query";

const LECTURE_CHAMPION_BY_QUERY = new Map(
  [...LECTURE_100_TARGETS, ...LECTURE_EXTRA_INFLOW].map((row) => [
    row.query,
    row.champion,
  ]),
);

export type PageRelationRole =
  | "BUSAN_MAIN_CHAMPION"
  | "LOCAL_CHAMPION"
  | "SERVICE_CHAMPION"
  | "FINANCE_CHAMPION"
  | "COST_CHAMPION"
  | "SELECTION_CHAMPION"
  | "PUBLIC_SECTOR_CHAMPION"
  | "HUB"
  | "SUPPORT";

export type PageRelationEntry = {
  path: string;
  parentHub?: string;
  role: PageRelationRole;
  region?: string[];
  regionAliases?: string[];
  stationEntities?: string[];
  services?: string[];
  situations?: string[];
  relatedPages: string[];
  localEntities?: string[];
  notes?: string;
};

export const HOME_BROAD_CHAMPION = "/" as const;

/** Supporting guide — 업무·비용·선택 기준. Broad query champion is HOME. */
export const BUSAN_LEGAL_SCRIVENER_CHAMPION = "/부산법무사";

/** Provider + operations broad intent — 동일 URL, title/H1 불변 */
export const BUSAN_CORPORATE_CHAMPION = "/부산법인법무사";
export const CORPORATE_LEGAL_OPERATIONS_CHAMPION = BUSAN_CORPORATE_CHAMPION;

export const COST_CHAMPION = "/부산법무사비용";
export const SELECTION_CHAMPION = "/부산법무사추천";
export const FINANCE_REGISTRATION_CHAMPION = "/부산잔금대출근저당";
export const FINANCE_CLOSING_DAY_CHAMPION = "/부산잔금일법무사";
export const FINANCE_MORTGAGE_RELEASE_CHAMPION = "/부산근저당말소등기";
export const REAL_ESTATE_CHAMPION = "/부산부동산등기";

export const PUBLIC_SECTOR_CHAMPION = "/공공기관등기업무";
export const PUBLIC_SECTOR_CONVERSION = "/협업문의";
export const PUBLIC_SECTOR_LECTURE_HUB = "/공공기관법률교육";

export const LEGAL_CONSULTATION_CHAMPION = "/부산법무사상담";
export const JEONSE_DAMAGE_CHAMPION = "/전세사기피해대응절차";
export const INSOLVENCY_CHAMPION = "/개인회생파산";
export const PERSONAL_REHABILITATION_CHAMPION = "/부산개인회생";
export const PERSONAL_BANKRUPTCY_CHAMPION = "/부산개인파산";

export const LOCAL_CHAMPION_MAP: Record<
  string,
  {
    primaryHost: string;
    aliases: string[];
    stationEntities?: string[];
    guHub?: string;
    notes?: string;
  }
> = {
  민락: {
    primaryHost: "/민락동법무사",
    aliases: ["민락동", "민락역", "민락수변공원", "민락항"],
    stationEntities: ["민락역"],
    guHub: "/수영구법무사",
  },
  장산: {
    primaryHost: "/좌동법무사",
    aliases: ["장산역", "좌동", "해운대 신시가지"],
    stationEntities: ["장산역"],
    guHub: "/해운대법무사",
  },
  전포: {
    primaryHost: "/전포동법무사",
    aliases: ["전포동", "전포역", "전포카페거리"],
    stationEntities: ["전포역"],
    guHub: "/부산진구법무사",
  },
  양정: {
    primaryHost: "/양정동법무사",
    aliases: ["양정동", "양정역", "양정 법무"],
    stationEntities: ["양정역"],
    guHub: "/부산진구법무사",
  },
  복산: {
    primaryHost: "/동래구법무사",
    aliases: ["복산동", "동래 복산동"],
    notes: "공식 행정동은 복천동·온천동 등. '복산동'은 검색 별칭으로 동래권 허브에 흡수",
    guHub: "/동래역법무사",
  },
};

export const PAGE_RELATIONS: PageRelationEntry[] = [
  {
    path: PUBLIC_SECTOR_CHAMPION,
    role: "PUBLIC_SECTOR_CHAMPION",
    parentHub: "/partners",
    services: ["public-agency", "corporate", "real-estate", "lecture"],
    situations: [
      "public-registration",
      "agency-officer-change",
      "shared-property",
      "compensation-transfer",
      "scrivener-procurement",
    ],
    relatedPages: [
      "/공공기관법인등기",
      "/공공기관부동산등기",
      "/공공기관이전등기",
      "/공공기관촉탁등기",
      "/공공기관법률교육",
      PUBLIC_SECTOR_CONVERSION,
      "/partners",
      "/부산법인법무사",
      "/부산부동산등기",
    ],
    notes:
      "B2G information Hub. Distinct from /부산법무사 and /부산법인법무사. Conversion is /협업문의?partner=public. title/H1/canonical immutable. CREATE_NEW spokes already exist — do not duplicate.",
  },
  {
    path: BUSAN_LEGAL_SCRIVENER_CHAMPION,
    role: "HUB",
    region: ["부산"],
    services: ["inheritance", "real-estate", "corporate", "rehab", "civil"],
    situations: ["provider-selection", "unknown-task"],
    relatedPages: [
      "/부산상속법무사",
      "/부산부동산등기",
      "/부산법인법무사",
      "/부산법무사비용",
      "/부산법무사추천",
      "/해운대법무사",
      "/센텀법무사",
    ],
    notes:
      "Supporting guide for 업무·비용·선택 기준. Broad query 「부산 법무사」 champion is HOME `/`.",
  },
  {
    path: BUSAN_CORPORATE_CHAMPION,
    parentHub: BUSAN_LEGAL_SCRIVENER_CHAMPION,
    role: "SERVICE_CHAMPION",
    region: ["부산"],
    services: ["corporate", "real-estate", "civil"],
    situations: [
      "corporate-legal-ops",
      "company-change",
      "establishment",
      "dissolution",
    ],
    relatedPages: [
      "/부산법인등기",
      "/법인변경등기",
      "/부산법인설립등기",
      "/부산임원변경등기",
      "/부산본점이전등기",
      "/부산사업목적변경등기",
      "/부산유상증자등기",
      "/부산법인해산청산등기",
      "/부산부동산등기",
      "/부산기업법률자문",
      "/부산기업법무사",
    ],
    notes:
      "BUSAN_CORPORATE_CHAMPION = CORPORATE_LEGAL_OPERATIONS_CHAMPION. Provider(부산 법인 법무사)와 operations(법인법무·기업법무·회사법무) 동일 URL. title/H1/canonical immutable. CREATE_NEW=0.",
  },
  {
    path: COST_CHAMPION,
    parentHub: BUSAN_LEGAL_SCRIVENER_CHAMPION,
    role: "COST_CHAMPION",
    situations: ["cost-comparison", "fee-transparency"],
    relatedPages: [
      "/부산법무사보수표",
      "/부산법무사수임료",
      "/부산법무사상담",
      "/왜상속등기비용이다를까",
    ],
  },
  {
    path: SELECTION_CHAMPION,
    parentHub: BUSAN_LEGAL_SCRIVENER_CHAMPION,
    role: "SELECTION_CHAMPION",
    situations: ["provider-selection", "recommendation-research"],
    notes:
      "Spoke only. 「부산 법무사 추천」 Primary Champion은 `/부산법무사추천`. `/부산법무사`는 업무·선택 안내.",
    relatedPages: [
      "/부산법무사비교",
      "/부산법무사상담",
      "/부산등기법무사추천",
    ],
  },
  {
    path: LEGAL_CONSULTATION_CHAMPION,
    parentHub: BUSAN_LEGAL_SCRIVENER_CHAMPION,
    role: "SELECTION_CHAMPION",
    situations: ["consultation-prep", "unknown-task", "scope-check"],
    relatedPages: [
      "/부산법률상담",
      "/상담",
      "/전세사기피해대응절차",
      "/개인회생파산",
      "/부산상속법무사",
      "/부산법인법무사",
    ],
    notes:
      "BUSAN_LEGAL_CONSULTATION_CHAMPION. City-wide consult hub. Distinct from /부산법무사 and station pages. URL immutable.",
  },
  {
    path: JEONSE_DAMAGE_CHAMPION,
    parentHub: REAL_ESTATE_CHAMPION,
    role: "SERVICE_CHAMPION",
    situations: ["jeonse-fraud", "unpaid-deposit", "landlord-uncontactable"],
    relatedPages: [
      "/부산임차권등기명령",
      "/부산전세보증금반환법무사",
      "/부산경매권리분석",
      "/민사소송",
      "/부산법무사상담",
      "/전세사기예방교육",
    ],
    notes:
      "BUSAN_JEONSE_DAMAGE_CHAMPION. Victim action hub. 예방교육은 별 클러스터. 임차권/지급명령/경매 권리분석은 고유 의도 유지. URL immutable.",
  },
  {
    path: INSOLVENCY_CHAMPION,
    role: "HUB",
    services: ["rehab", "bankruptcy"],
    situations: ["rehab-vs-bankruptcy"],
    relatedPages: [
      "/부산개인회생",
      "/부산개인파산",
      "/부산파산",
      "/부산개인회생법무사",
    ],
    notes: "BUSAN_INSOLVENCY_CHAMPION. Comparison hub — do not target 부산개인회생 long-tails.",
  },
  {
    path: PERSONAL_REHABILITATION_CHAMPION,
    parentHub: INSOLVENCY_CHAMPION,
    role: "SERVICE_CHAMPION",
    services: ["rehab"],
    situations: ["personal-rehabilitation"],
    relatedPages: [
      "/개인회생파산",
      "/부산개인회생법무사",
      "/개인회생필요서류",
      "/개인회생비용",
    ],
    notes: "BUSAN_PERSONAL_REHABILITATION_CHAMPION. title/H1 guarded.",
  },
  {
    path: PERSONAL_BANKRUPTCY_CHAMPION,
    parentHub: INSOLVENCY_CHAMPION,
    role: "SERVICE_CHAMPION",
    services: ["bankruptcy"],
    situations: ["personal-bankruptcy"],
    relatedPages: ["/개인회생파산", "/부산파산", "/부산개인파산법무사"],
    notes: "BUSAN_PERSONAL_BANKRUPTCY_CHAMPION. Do not compete with insolvency hub.",
  },
  {
    path: FINANCE_REGISTRATION_CHAMPION,
    parentHub: REAL_ESTATE_CHAMPION,
    role: "FINANCE_CHAMPION",
    situations: [
      "잔금대출",
      "근저당설정",
      "소유권이전",
      "은행서류",
      "매수인담보대출",
    ],
    relatedPages: [
      "/부산잔금일법무사",
      "/부산근저당설정등기",
      "/부산근저당말소등기",
      "/부산소유권이전등기",
    ],
    notes: "No bank partnership claims; natural finance+registration context",
  },
  {
    path: FINANCE_CLOSING_DAY_CHAMPION,
    parentHub: REAL_ESTATE_CHAMPION,
    role: "FINANCE_CHAMPION",
    situations: ["잔금일", "매매잔금", "아파트잔금등기"],
    relatedPages: [
      "/부산잔금대출근저당",
      "/부산근저당말소등기",
      "/부산소유권이전등기",
    ],
  },
  {
    path: FINANCE_MORTGAGE_RELEASE_CHAMPION,
    parentHub: REAL_ESTATE_CHAMPION,
    role: "FINANCE_CHAMPION",
    situations: ["근저당말소", "대출상환", "담보해제"],
    relatedPages: [
      "/방문없이준비하는근저당말소",
      "/부산잔금대출근저당",
      "/부산부동산등기",
    ],
  },
  {
    path: "/민락동법무사",
    parentHub: "/수영구법무사",
    role: "LOCAL_CHAMPION",
    region: ["민락동", "민락"],
    regionAliases: ["민락역"],
    stationEntities: ["민락역"],
    services: ["real-estate-registration", "inheritance-registration"],
    relatedPages: [
      "/광안리법무사",
      "/남천동법무사",
      "/수영구부동산등기",
      "/부산부동산등기",
    ],
    localEntities: ["민락", "광안", "수영"],
  },
  {
    path: "/좌동법무사",
    parentHub: "/해운대법무사",
    role: "LOCAL_CHAMPION",
    region: ["좌동", "장산"],
    regionAliases: ["장산역"],
    stationEntities: ["장산역"],
    services: ["inheritance-registration", "real-estate-registration"],
    relatedPages: [
      "/해운대구상속등기",
      "/좌동상속등기",
      "/부산상속등기",
    ],
    localEntities: ["장산", "좌동", "해운대"],
  },
  {
    path: "/전포동법무사",
    parentHub: "/부산진구법무사",
    role: "LOCAL_CHAMPION",
    region: ["전포동", "전포"],
    regionAliases: ["전포역"],
    stationEntities: ["전포역"],
    services: ["real-estate-registration", "corporate-registration"],
    relatedPages: [
      "/서면법무사",
      "/개금동법무사",
      "/부산부동산등기",
    ],
    localEntities: ["전포", "서면", "부산진"],
  },
  {
    path: "/양정동법무사",
    parentHub: "/부산진구법무사",
    role: "LOCAL_CHAMPION",
    region: ["양정동", "양정"],
    regionAliases: ["양정역", "양정 법무"],
    stationEntities: ["양정역"],
    services: ["real-estate-registration", "inheritance-registration"],
    relatedPages: [
      "/연지동법무사",
      "/개금동법무사",
      "/부산진구부동산등기",
    ],
    localEntities: ["양정", "개금", "부산진"],
  },
  {
    path: "/동래구법무사",
    parentHub: BUSAN_LEGAL_SCRIVENER_CHAMPION,
    role: "LOCAL_CHAMPION",
    region: ["동래구", "복천동", "온천동"],
    regionAliases: ["복산동", "동래 복산동"],
    services: ["inheritance-registration", "real-estate-registration"],
    relatedPages: [
      "/동래역법무사",
      "/사직동법무사",
      "/온천동법무사",
      "/동래구상속등기",
    ],
    localEntities: ["동래", "복천", "온천"],
    notes: "'복산동' 검색은 공식 복천동·동래권 허브로 흡수",
  },
];

export function getPageRelation(path: string): PageRelationEntry | undefined {
  return PAGE_RELATIONS.find((p) => p.path === path);
}

export function getLocalChampionForQuery(query: string): string | undefined {
  const q = query.replace(/\s+/g, " ").trim().toLowerCase();
  for (const [key, cfg] of Object.entries(LOCAL_CHAMPION_MAP)) {
    const terms = [key, ...cfg.aliases].map((t) => t.toLowerCase());
    if (terms.some((t) => q.includes(t))) return cfg.primaryHost;
  }
  if (/부산\s*법무사/.test(q) && !/비용|수임|저렴|추천|은행|등기|잔금|근저당/.test(q)) {
    return HOME_BROAD_CHAMPION;
  }
  if (/부산.*(비용|수임|저렴)/.test(q)) return COST_CHAMPION;
  if (/부산.*추천/.test(q)) return SELECTION_CHAMPION;
  if (/부산.*(은행|잔금|근저당|대출).*(등기|법무)/.test(q)) {
    return FINANCE_REGISTRATION_CHAMPION;
  }
  return undefined;
}

export function getChampionForTargetQuery(query: string): {
  query: string;
  champion: string;
  intent: string;
} {
  const champions: Record<string, { champion: string; intent: string }> = {
    "민락 법무사": { champion: "/민락동법무사", intent: "local-provider-selection" },
    "민락동 법무사": { champion: "/민락동법무사", intent: "local-provider-selection" },
    "민락역 법무사": { champion: "/민락동법무사", intent: "station-local-selection" },
    "장산 법무사": { champion: "/좌동법무사", intent: "local-provider-selection" },
    "장산역 법무사": { champion: "/좌동법무사", intent: "station-local-selection" },
    "전포동 법무사": { champion: "/전포동법무사", intent: "local-provider-selection" },
    "전포역 법무사": { champion: "/전포동법무사", intent: "station-local-selection" },
    "양정 법무": { champion: "/양정동법무사", intent: "local-provider-selection" },
    "양정 법무사": { champion: "/양정동법무사", intent: "local-provider-selection" },
    "양정역 법무사": { champion: "/양정동법무사", intent: "station-local-selection" },
    "복산동 법무사": { champion: "/동래구법무사", intent: "local-provider-selection" },
    "동래 복산동 법무사": { champion: "/동래구법무사", intent: "local-alias-selection" },
    "부산 법무사": { champion: HOME_BROAD_CHAMPION, intent: "broad-provider-selection" },
    "부산 법무사 추천": { champion: SELECTION_CHAMPION, intent: "selection-research" },
    "부산 법무사 사무소 추천": { champion: SELECTION_CHAMPION, intent: "office-selection-research" },
    "부산 저렴한 법무사": { champion: COST_CHAMPION, intent: "cost-comparison" },
    "부산 법무사 비용": { champion: COST_CHAMPION, intent: "cost-transparency" },
    "부산 법무사 법률 상담": { champion: LEGAL_CONSULTATION_CHAMPION, intent: "scrivener-consultation" },
    "부산 법률 상담": { champion: "/부산법률상담", intent: "civic-vs-scrivener-routing" },
    "부산 법무사 상담": { champion: LEGAL_CONSULTATION_CHAMPION, intent: "city-wide-consultation" },
    "부산법률상담": { champion: "/부산법률상담", intent: "civic-vs-scrivener-routing" },
    "부산 법무사 사무소": { champion: HOME_BROAD_CHAMPION, intent: "office-brand-home" },
    "상속 법무사": { champion: "/상속", intent: "national-inheritance-router" },
    "법무사 상속": { champion: "/상속", intent: "national-inheritance-router" },
    "상속 법무사 추천": { champion: "/상속", intent: "inheritance-selection-criteria" },
    "상속 법무사 비용": { champion: "/상속등기비용", intent: "inheritance-fee-buckets" },
    "상속 법무사 수수료": { champion: "/상속등기비용", intent: "inheritance-fee-buckets" },
    "상속 법무사 수임료": { champion: "/상속등기비용", intent: "inheritance-fee-buckets" },
    "상속 법무사 보수": { champion: "/상속등기비용", intent: "inheritance-fee-buckets" },
    "상속 법무사 상담": {
      champion: "/상속상담전준비서류와비용",
      intent: "inheritance-consult-prep",
    },
    "상속포기 법무사": { champion: "/부산상속포기", intent: "renunciation-national" },
    "상속포기 법무사 비용": { champion: "/상속포기비용", intent: "renunciation-fee-buckets" },
    "상속포기 법무사 수수료": { champion: "/상속포기비용", intent: "renunciation-fee-buckets" },
    "상속포기 법무사 보수": { champion: "/상속포기비용", intent: "renunciation-fee-buckets" },
    "상속등기 법무사": { champion: "/전국상속등기", intent: "nationwide-inheritance-registration" },
    "상속등기": { champion: "/전국상속등기", intent: "nationwide-inheritance-registration" },
    "주변 상속등기 법무사": { champion: "/전국상속등기", intent: "nationwide-inheritance-registration" },
    "근처 상속등기 법무사": { champion: "/전국상속등기", intent: "nationwide-inheritance-registration" },
    "저렴한 상속등기 법무사": { champion: "/상속등기비용", intent: "inheritance-fee-buckets" },
    "상속등기 비용": { champion: "/상속등기비용", intent: "inheritance-fee-buckets" },
    "상속등기 서류": { champion: "/상속등기필요서류", intent: "inheritance-documents" },
    "상속등기 필요서류": { champion: "/상속등기필요서류", intent: "inheritance-documents" },
    "상속등기 기간": { champion: "/상속등기기간", intent: "inheritance-timeline" },
    "상속등기 절차": { champion: "/상속등기기간", intent: "inheritance-timeline" },
    "상속등기 순서": { champion: "/상속등기기간", intent: "inheritance-timeline" },
    "상속등기 셀프": { champion: "/방문없이준비하는상속등기", intent: "diy-vs-entrust" },
    "셀프 상속등기": { champion: "/방문없이준비하는상속등기", intent: "diy-vs-entrust" },
    "상속포기 셀프": { champion: "/방문없이준비하는상속포기한정승인", intent: "diy-vs-entrust" },
    "셀프 상속포기": { champion: "/방문없이준비하는상속포기한정승인", intent: "diy-vs-entrust" },
    "상속하는법": { champion: "/상속", intent: "national-inheritance-router" },
    "한정승인 법무사": { champion: "/부산한정승인", intent: "qualified-acceptance" },
    "상속포기 서류": { champion: "/상속포기필요서류", intent: "renunciation-documents" },
    "서울 상속 법무사": { champion: "/업무사례/서울상속등기법무사", intent: "remote-inheritance" },
    "인천 상속 법무사": { champion: "/업무사례/인천상속등기법무사", intent: "remote-inheritance" },
    "수원 상속 법무사": { champion: "/업무사례/수원상속등기법무사", intent: "remote-inheritance" },
    "대구 상속 법무사": { champion: "/업무사례/대구상속등기법무사", intent: "remote-inheritance" },
    "대전 상속 법무사": { champion: "/업무사례/대전상속등기법무사", intent: "remote-inheritance" },
    "울산 상속 법무사": { champion: "/업무사례/울산상속등기법무사", intent: "remote-inheritance" },
    "세종 상속 법무사": { champion: "/업무사례/세종상속등기법무사", intent: "remote-inheritance" },
    "광주 상속 법무사": { champion: "/업무사례/광주상속등기법무사", intent: "remote-inheritance" },
    "창원 상속 법무사": { champion: "/업무사례/창원상속등기법무사", intent: "remote-inheritance" },
    "김해 상속 법무사": { champion: "/업무사례/김해상속등기법무사", intent: "remote-inheritance" },
    "양산 상속 법무사": { champion: "/업무사례/양산상속등기법무사", intent: "remote-inheritance" },
    "용인 상속 법무사": { champion: "/업무사례/용인상속등기법무사", intent: "remote-inheritance" },
    "거제 상속 법무사": { champion: "/업무사례/거제상속등기법무사", intent: "remote-inheritance" },
    "청주 상속 법무사": { champion: "/업무사례/청주상속등기법무사", intent: "remote-inheritance" },
    "천안 상속 법무사": { champion: "/업무사례/천안상속등기법무사", intent: "remote-inheritance" },
    "포항 상속 법무사": { champion: "/업무사례/포항상속등기법무사", intent: "remote-inheritance" },
    "부산 상속": { champion: "/부산상속법무사", intent: "inheritance-router" },
    "부산 상속 법무사": { champion: "/부산상속법무사", intent: "inheritance-router" },
    "부산 법무사 상속": { champion: "/부산상속법무사", intent: "inheritance-router" },
    "부산 진로특강": { champion: "/법무사진로특강", intent: "school-career-lecture" },
    "부산 회사 법무사": {
      champion: "/부산법인법무사",
      intent: "company-operations-observed",
    },
    "부산 등기 법무사": { champion: "/부산등기법무사", intent: "registry-hub" },
    "부산 등기전문 법무사": {
      champion: "/부산부동산등기전문법무사",
      intent: "real-estate-registry-specialist-observed",
    },
    "부산 부동산 법무사": { champion: "/부산부동산등기", intent: "real-estate-hub" },
    "부산 법인등기 법무사": { champion: "/부산법인등기", intent: "corporate-registry-changes" },
    "부산 법인 법무사": { champion: HOME_BROAD_CHAMPION, intent: "corporate-home-observed" },
    "부산 법인설립 법무사": {
      champion: "/부산법인설립등기",
      intent: "incorporation-procedure",
    },
    "부산 법인설립": {
      champion: "/부산법인설립등기",
      intent: "incorporation-procedure",
    },
    "부산 회사설립 법무사": {
      champion: "/부산법인설립등기",
      intent: "incorporation-procedure",
    },
    "부산 법인법무": {
      champion: "/부산법인법무사",
      intent: "company-operations-observed",
    },
    "부산 상업등기": {
      champion: "/부산법인등기",
      intent: "corporate-registry-changes",
    },
    "부산 법인변경": {
      champion: "/부산법인등기",
      intent: "corporate-registry-changes",
    },
    "부산 임원변경 법무사": {
      champion: "/부산임원변경등기",
      intent: "officer-change",
    },
    "부산 본점이전": {
      champion: "/부산본점이전등기",
      intent: "head-office-move",
    },
    "부산 법인전문 법무사": {
      champion: "/부산법인설립전문법무사",
      intent: "corporate-specialist-observed",
    },
    "부산 상속포기 법무사": { champion: "/부산상속포기", intent: "renunciation" },
    "부산 상속전문 법무사": { champion: "/부산상속전문법무사", intent: "provider-selection" },
    "부산 한정승인 법무사": { champion: "/부산한정승인", intent: "qualified-acceptance" },
    "부산 상속등기 법무사": { champion: "/부산상속등기", intent: "inheritance-registration" },
    "부산 상속 상담": { champion: "/부산상속법무사", intent: "inheritance-router" },
    "부산 상속상담": { champion: "/부산상속법무사", intent: "inheritance-router" },
    "부산 상속 절차": { champion: "/부산상속법무사", intent: "inheritance-router" },
    "부산 상속 법무사 선택": { champion: "/부산상속전문법무사", intent: "provider-selection" },
    "부산 상속 법무사 추천": { champion: "/부산상속법무사추천", intent: "recommend" },
    "부산 상속 비용": { champion: "/상속등기비용", intent: "inheritance-fee-buckets" },
    "부산 상속포기 비용": { champion: "/상속포기비용", intent: "renunciation-fee-buckets" },
    "부산 한정승인 비용": { champion: "/한정승인비용", intent: "qualified-fee-buckets" },
    "부산 상속 명의이전": { champion: "/부산상속등기", intent: "inheritance-registration" },
    "부산 상속포기 3개월": { champion: "/부산상속포기", intent: "renunciation" },
    "부산 상속포기 후순위": { champion: "/부산상속포기", intent: "renunciation" },
    "부산 전세사기": { champion: JEONSE_DAMAGE_CHAMPION, intent: "jeonse-damage-navigator" },
    "부산 전세사기 법무사": { champion: JEONSE_DAMAGE_CHAMPION, intent: "jeonse-damage-scrivener" },
    "부산 전세사기 피해": { champion: JEONSE_DAMAGE_CHAMPION, intent: "jeonse-damage-navigator" },
    "부산 전세보증금 미반환": { champion: JEONSE_DAMAGE_CHAMPION, intent: "unpaid-deposit" },
    "부산 전세보증금 반환 법무사": { champion: "/부산전세보증금반환법무사", intent: "deposit-return" },
    "부산 임차권등기명령": { champion: "/부산임차권등기명령", intent: "lease-registration-order" },
    "부산회생파산": { champion: INSOLVENCY_CHAMPION, intent: "rehab-vs-bankruptcy" },
    "부산개인회생": { champion: PERSONAL_REHABILITATION_CHAMPION, intent: "personal-rehab-application" },
    "부산 개인파산": { champion: PERSONAL_BANKRUPTCY_CHAMPION, intent: "personal-bankruptcy" },
    "부산 은행 법무사": { champion: FINANCE_REGISTRATION_CHAMPION, intent: "finance-registration-mixed" },
    "부산 은행 등기 법무사": { champion: FINANCE_REGISTRATION_CHAMPION, intent: "finance-registration-closing" },
    "부산 잔금 법무사": { champion: FINANCE_CLOSING_DAY_CHAMPION, intent: "closing-day-registration" },
    "부산 근저당 법무사": { champion: FINANCE_MORTGAGE_RELEASE_CHAMPION, intent: "mortgage-registration" },
  };
  const hit = champions[query];
  if (hit) return { query, ...hit };
  const lectureChampion = LECTURE_CHAMPION_BY_QUERY.get(query);
  if (lectureChampion) {
    return { query, champion: lectureChampion, intent: "lecture-hiring" };
  }
  const exactPath = getExactKeywordChampionPath(query);
  if (exactPath) {
    return {
      query,
      champion: exactPath,
      intent: exactPath === HOME_BROAD_CHAMPION ? "broad-provider-selection" : "local-provider-selection",
    };
  }
  const inferred = getLocalChampionForQuery(query);
  return {
    query,
    champion: inferred ?? HOME_BROAD_CHAMPION,
    intent: "inferred",
  };
}
