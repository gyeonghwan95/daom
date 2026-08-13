/**
 * Page Relation Registry — Busan Entity Graph
 * Maps existing URLs to region / service / situation entities.
 * No new URLs; additive internal-link and champion decisions only.
 */

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

/** Broad provider-selection — SEO_PROTECTED, do not change title/H1 */
export const BUSAN_LEGAL_SCRIVENER_CHAMPION = "/부산법무사";

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
    role: "BUSAN_MAIN_CHAMPION",
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
      "SEO_PROTECTED / BUSAN_GENERAL_CHAMPION. Queries: 부산 법무사, 부산 법무사 추천. title/H1/canonical immutable.",
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
      "Spoke only. 「부산 법무사 추천」 Primary Champion은 /부산법무사. 이 URL은 선택 기준 상세 Spoke. No self-recommendation spam.",
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
      "BUSAN_LEGAL_CONSULTATION_CHAMPION. Distinct from /부산법무사 (office+services). title/H1 guarded.",
  },
  {
    path: JEONSE_DAMAGE_CHAMPION,
    parentHub: REAL_ESTATE_CHAMPION,
    role: "SERVICE_CHAMPION",
    situations: ["jeonse-fraud", "unpaid-deposit", "landlord-uncontactable"],
    relatedPages: [
      "/부산임차권등기명령",
      "/부산전세보증금반환법무사",
      "/전세사기예방교육",
      "/민사소송",
      "/부산법무사상담",
    ],
    notes:
      "BUSAN_JEONSE_DAMAGE_CHAMPION. Navigator only — 임차권/지급명령 pages keep their own intent.",
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
    return BUSAN_LEGAL_SCRIVENER_CHAMPION;
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
    "부산 법무사": { champion: BUSAN_LEGAL_SCRIVENER_CHAMPION, intent: "broad-provider-selection" },
    "부산 저렴한 법무사": { champion: COST_CHAMPION, intent: "cost-comparison" },
    "부산 법무사 비용": { champion: COST_CHAMPION, intent: "cost-transparency" },
    "부산 법무사 추천": { champion: BUSAN_LEGAL_SCRIVENER_CHAMPION, intent: "selection-research" },
    "부산 법무사 법률 상담": { champion: LEGAL_CONSULTATION_CHAMPION, intent: "scrivener-consultation" },
    "부산 법률 상담": { champion: LEGAL_CONSULTATION_CHAMPION, intent: "public-vs-scrivener-routing" },
    "부산 법무사 상담": { champion: LEGAL_CONSULTATION_CHAMPION, intent: "consult-prep" },
    "부산 전세사기": { champion: JEONSE_DAMAGE_CHAMPION, intent: "jeonse-damage-navigator" },
    "부산 전세사기 법무사": { champion: JEONSE_DAMAGE_CHAMPION, intent: "jeonse-damage-scrivener" },
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
  const inferred = getLocalChampionForQuery(query);
  return {
    query,
    champion: inferred ?? BUSAN_LEGAL_SCRIVENER_CHAMPION,
    intent: "inferred",
  };
}
