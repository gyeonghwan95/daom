/**
 * 부산 도시철도·광역철도 Station Entity
 * 출처: 부산교통공사 역정보(humetro.busan.kr) 호선별 역명 목록 확인 (2026-08-10)
 * 양산 구간·동해선·부산김해경전철은 공식 노선도에 존재하는 역만 포함.
 * 검색량 추측·가짜 지역특성 문구 금지.
 */

export type BusanRailNetwork =
  | "busan-metro"
  | "donghae"
  | "bgl"
  | "other";

export type StationSearchPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type StationContentArchetype =
  | "transfer" // TYPE A
  | "local" // TYPE B
  | "office-access" // TYPE C
  | "remote-docs" // TYPE D
  | "gateway" // TYPE E
  | "boundary"; // TYPE F

export type BusanRailStation = {
  id: string;
  name: string;
  normalizedName: string;
  network: BusanRailNetwork;
  lines: string[];
  district?: string;
  dong?: string;
  transfer: boolean;
  transferLines?: string[];
  officialSource?: string;
  seoAliases: string[];
  searchPriority: StationSearchPriority;
  hostPage?: string;
  secondaryHostPages?: string[];
  stationSectionId?: string;
  archetype: StationContentArchetype;
  verified: boolean;
  verifiedAt?: string;
  notes?: string;
  /** Phase1 섹션 구현 여부 */
  phase1Implemented?: boolean;
};

const SRC_HUMETRO =
  "https://www2.humetro.busan.kr/homepage/default/stationinfo/page/list01.do?menu_no=1001010201";
const VERIFIED_AT = "2026-08-10";

function s(
  partial: Omit<BusanRailStation, "verified" | "verifiedAt" | "officialSource" | "normalizedName"> &
    Partial<Pick<BusanRailStation, "normalizedName" | "officialSource">>,
): BusanRailStation {
  return {
    officialSource: SRC_HUMETRO,
    verified: true,
    verifiedAt: VERIFIED_AT,
    normalizedName: partial.normalizedName ?? partial.name.replace(/역$/, ""),
    ...partial,
  };
}

/** Phase1 Priority — 기존 Host에 섹션 추가 대상 */
export const busanRailStationsPhase1: BusanRailStation[] = [
  s({
    id: "seomyeon",
    name: "서면역",
    network: "busan-metro",
    lines: ["1호선", "2호선"],
    district: "부산진구",
    dong: "부전동",
    transfer: true,
    transferLines: ["1호선", "2호선"],
    seoAliases: ["서면역", "서면"],
    searchPriority: "critical",
    hostPage: "/서면법무사",
    secondaryHostPages: ["/부산진구법무사"],
    stationSectionId: "station-seomyeon",
    archetype: "transfer",
    phase1Implemented: true,
    notes: "1·2호선 환승",
  }),
  s({
    id: "yeonsan",
    name: "연산역",
    network: "busan-metro",
    lines: ["1호선", "3호선"],
    district: "연제구",
    dong: "연산동",
    transfer: true,
    transferLines: ["1호선", "3호선"],
    seoAliases: ["연산역", "연산"],
    searchPriority: "critical",
    hostPage: "/연산동법무사",
    secondaryHostPages: ["/연제구법무사"],
    stationSectionId: "station-yeonsan",
    archetype: "transfer",
    phase1Implemented: true,
  }),
  s({
    id: "dongnae",
    name: "동래역",
    network: "busan-metro",
    lines: ["1호선", "4호선"],
    district: "동래구",
    transfer: true,
    transferLines: ["1호선", "4호선"],
    seoAliases: ["동래역", "동래"],
    searchPriority: "critical",
    hostPage: "/동래역법무사",
    secondaryHostPages: ["/동래구법무사"],
    stationSectionId: "station-dongnae",
    archetype: "transfer",
    phase1Implemented: true,
  }),
  s({
    id: "busan-station",
    name: "부산역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "동구",
    dong: "초량동",
    transfer: false,
    seoAliases: ["부산역"],
    searchPriority: "critical",
    hostPage: "/부산역법무사",
    stationSectionId: "station-busan",
    archetype: "gateway",
    phase1Implemented: true,
    notes: "도시명과 역명이 겹치므로 문맥을 ‘부산역 인근’으로 명확히 함",
  }),
  s({
    id: "suyeong",
    name: "수영역",
    network: "busan-metro",
    lines: ["2호선", "3호선"],
    district: "수영구",
    transfer: true,
    transferLines: ["2호선", "3호선"],
    seoAliases: ["수영역", "수영"],
    searchPriority: "critical",
    hostPage: "/수영구법무사",
    stationSectionId: "station-suyeong",
    archetype: "transfer",
    phase1Implemented: true,
  }),
  s({
    id: "centum-city",
    name: "센텀시티역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "해운대구",
    dong: "우동",
    transfer: false,
    seoAliases: ["센텀시티역", "센텀시티", "센텀역"],
    searchPriority: "critical",
    hostPage: "/센텀법무사",
    secondaryHostPages: ["/해운대법무사"],
    stationSectionId: "station-centum-city",
    archetype: "office-access",
    phase1Implemented: true,
    notes: "사무소(센텀동로)와 접근 연관 — ‘가깝다’ 과장 없이 방문 전 안내",
  }),
  s({
    id: "haeundae",
    name: "해운대역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "해운대구",
    dong: "우동",
    transfer: false,
    seoAliases: ["해운대역", "해운대"],
    searchPriority: "high",
    hostPage: "/해운대법무사",
    stationSectionId: "station-haeundae",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "jangsan",
    name: "장산역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "해운대구",
    dong: "좌동",
    transfer: false,
    seoAliases: ["장산역", "장산"],
    searchPriority: "high",
    hostPage: "/좌동법무사",
    secondaryHostPages: ["/해운대법무사"],
    stationSectionId: "station-jangsan",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "sasang",
    name: "사상역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "사상구",
    transfer: true,
    transferLines: ["2호선", "부산김해경전철"],
    seoAliases: ["사상역", "사상"],
    searchPriority: "high",
    hostPage: "/사상법무사",
    secondaryHostPages: ["/사상구법무사"],
    stationSectionId: "station-sasang",
    archetype: "transfer",
    phase1Implemented: true,
  }),
  s({
    id: "gyodae",
    name: "교대역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "연제구",
    dong: "거제동",
    transfer: true,
    transferLines: ["1호선", "동해선"],
    seoAliases: ["교대역", "교대"],
    searchPriority: "high",
    hostPage: "/거제동법무사",
    secondaryHostPages: ["/연제구법무사"],
    stationSectionId: "station-gyodae",
    archetype: "transfer",
    phase1Implemented: true,
  }),
  s({
    id: "jaesong",
    name: "재송역",
    network: "donghae",
    lines: ["동해선"],
    district: "해운대구",
    dong: "재송동",
    transfer: false,
    seoAliases: ["재송역", "재송"],
    searchPriority: "high",
    hostPage: "/재송동법무사",
    stationSectionId: "station-jaesong",
    archetype: "remote-docs",
    phase1Implemented: true,
    officialSource: "한국철도공사 동해선 광역전철 노선(부산권)",
  }),
  s({
    id: "bexco",
    name: "벡스코역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "해운대구",
    dong: "우동",
    transfer: true,
    transferLines: ["2호선", "동해선"],
    seoAliases: ["벡스코역", "벡스코"],
    searchPriority: "high",
    hostPage: "/센텀법무사",
    stationSectionId: "station-bexco",
    archetype: "office-access",
    phase1Implemented: true,
  }),
  s({
    id: "gwangan",
    name: "광안역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "수영구",
    dong: "광안동",
    transfer: false,
    seoAliases: ["광안역", "광안"],
    searchPriority: "high",
    hostPage: "/광안리법무사",
    secondaryHostPages: ["/수영구법무사"],
    stationSectionId: "station-gwangan",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "jeonpo",
    name: "전포역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "부산진구",
    dong: "전포동",
    transfer: false,
    seoAliases: ["전포역", "전포"],
    searchPriority: "high",
    hostPage: "/전포동법무사",
    secondaryHostPages: ["/부산진구법무사"],
    stationSectionId: "station-jeonpo",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "nampo",
    name: "남포역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "중구",
    transfer: false,
    seoAliases: ["남포역", "남포"],
    searchPriority: "high",
    hostPage: "/중구법무사",
    stationSectionId: "station-nampo",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "jagalchi",
    name: "자갈치역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "중구",
    transfer: false,
    seoAliases: ["자갈치역", "자갈치"],
    searchPriority: "medium",
    hostPage: "/중구법무사",
    stationSectionId: "station-jagalchi",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "minam",
    name: "미남역",
    network: "busan-metro",
    lines: ["3호선", "4호선"],
    district: "동래구",
    transfer: true,
    transferLines: ["3호선", "4호선"],
    seoAliases: ["미남역", "미남"],
    searchPriority: "high",
    hostPage: "/동래구법무사",
    stationSectionId: "station-minam",
    archetype: "transfer",
    phase1Implemented: true,
  }),
  s({
    id: "city-hall",
    name: "시청역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "연제구",
    transfer: false,
    seoAliases: ["시청역", "시청"],
    searchPriority: "high",
    hostPage: "/연제구법무사",
    stationSectionId: "station-city-hall",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "bujeon",
    name: "부전역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "부산진구",
    transfer: true,
    transferLines: ["1호선", "동해선"],
    seoAliases: ["부전역", "부전"],
    searchPriority: "high",
    hostPage: "/부산진구법무사",
    secondaryHostPages: ["/서면법무사"],
    stationSectionId: "station-bujeon",
    archetype: "transfer",
    phase1Implemented: true,
  }),
  s({
    id: "jungang",
    name: "중앙역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "중구",
    transfer: false,
    seoAliases: ["중앙역", "중앙"],
    searchPriority: "medium",
    hostPage: "/중구법무사",
    stationSectionId: "station-jungang",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "dongbaek",
    name: "동백역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "해운대구",
    transfer: false,
    seoAliases: ["동백역", "동백"],
    searchPriority: "medium",
    hostPage: "/해운대법무사",
    stationSectionId: "station-dongbaek",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "millak",
    name: "민락역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "수영구",
    dong: "민락동",
    transfer: false,
    seoAliases: ["민락역", "민락"],
    searchPriority: "medium",
    hostPage: "/민락동법무사",
    secondaryHostPages: ["/수영구법무사", "/광안리법무사"],
    stationSectionId: "station-millak",
    archetype: "local",
    phase1Implemented: true,
  }),
  s({
    id: "yangjeong",
    name: "양정역",
    network: "busan-metro",
    lines: ["1호선", "2호선"],
    district: "부산진구",
    dong: "양정동",
    transfer: true,
    transferLines: ["1호선", "2호선"],
    seoAliases: ["양정역", "양정"],
    searchPriority: "high",
    hostPage: "/양정동법무사",
    secondaryHostPages: ["/부산진구법무사", "/서면법무사"],
    stationSectionId: "station-yangjeong",
    archetype: "transfer",
    phase1Implemented: true,
  }),
];

/**
 * 전체 Entity 레지스트리 = Phase1 + 추가 검증 역(섹션 미구현, 매핑만).
 * 신규 URL 생성 없음.
 */
export const busanRailStationsAdditional: BusanRailStation[] = [
  // 1호선 잔여 (호스트는 구 단위로 묶음 — Phase2 섹션 후보)
  s({
    id: "nopo",
    name: "노포역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "금정구",
    transfer: false,
    seoAliases: ["노포역"],
    searchPriority: "low",
    hostPage: "/금정구법무사",
    stationSectionId: "station-nopo",
    archetype: "boundary",
    phase1Implemented: false,
  }),
  s({
    id: "pnu",
    name: "부산대역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "금정구",
    transfer: false,
    seoAliases: ["부산대역"],
    searchPriority: "medium",
    hostPage: "/금정구법무사",
    stationSectionId: "station-pnu",
    archetype: "local",
    phase1Implemented: false,
  }),
  s({
    id: "gupo",
    name: "구포역",
    network: "busan-metro",
    lines: ["3호선"],
    district: "북구",
    transfer: true,
    seoAliases: ["구포역"],
    searchPriority: "medium",
    hostPage: "/북구법무사",
    stationSectionId: "station-gupo",
    archetype: "gateway",
    phase1Implemented: false,
  }),
  s({
    id: "deokcheon",
    name: "덕천역",
    network: "busan-metro",
    lines: ["2호선", "3호선"],
    district: "북구",
    transfer: true,
    transferLines: ["2호선", "3호선"],
    seoAliases: ["덕천역"],
    searchPriority: "medium",
    hostPage: "/북구법무사",
    stationSectionId: "station-deokcheon",
    archetype: "transfer",
    phase1Implemented: false,
  }),
  s({
    id: "hadan",
    name: "하단역",
    network: "busan-metro",
    lines: ["1호선"],
    district: "사하구",
    transfer: false,
    seoAliases: ["하단역"],
    searchPriority: "medium",
    hostPage: "/사하구법무사",
    stationSectionId: "station-hadan",
    archetype: "local",
    phase1Implemented: false,
  }),
  s({
    id: "mangmi",
    name: "망미역",
    network: "busan-metro",
    lines: ["3호선"],
    district: "수영구",
    transfer: false,
    seoAliases: ["망미역"],
    searchPriority: "medium",
    hostPage: "/망미동법무사",
    secondaryHostPages: ["/수영구법무사"],
    stationSectionId: "station-mangmi",
    archetype: "local",
    phase1Implemented: false,
  }),
  s({
    id: "geoje",
    name: "거제역",
    network: "busan-metro",
    lines: ["3호선"],
    district: "연제구",
    dong: "거제동",
    transfer: false,
    seoAliases: ["거제역"],
    searchPriority: "medium",
    hostPage: "/거제동법무사",
    stationSectionId: "station-geoje",
    archetype: "local",
    phase1Implemented: false,
  }),
  s({
    id: "middong",
    name: "중동역",
    network: "busan-metro",
    lines: ["2호선"],
    district: "해운대구",
    transfer: false,
    seoAliases: ["중동역"],
    searchPriority: "medium",
    hostPage: "/해운대법무사",
    stationSectionId: "station-middong",
    archetype: "local",
    phase1Implemented: false,
  }),
];

export const allBusanRailStations: BusanRailStation[] = [
  ...busanRailStationsPhase1,
  ...busanRailStationsAdditional,
];

export function getStationById(id: string): BusanRailStation | undefined {
  return allBusanRailStations.find((st) => st.id === id);
}

export function getStationsByHost(hostPage: string): BusanRailStation[] {
  return allBusanRailStations.filter(
    (st) =>
      st.hostPage === hostPage || st.secondaryHostPages?.includes(hostPage),
  );
}

export function getPhase1Stations(): BusanRailStation[] {
  return busanRailStationsPhase1.filter((st) => st.phase1Implemented);
}
