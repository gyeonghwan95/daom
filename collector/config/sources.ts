/**
 * 수집 소스 중앙 레지스트리.
 *
 * 새 수집처는 이 파일에 항목을 추가하는 것만으로 활성화한다.
 * 수집 코드에 URL·기관명을 분산 하드코딩하지 않는다.
 *
 * 원칙:
 * - 공식 Open API / 공개 데이터를 우선한다.
 * - robots·이용약관을 검토하지 않은 소스는 enabled: false로 둔다.
 * - 자동수집이 불가한 소스는 type: "manual-link"로 등록해 브리핑에
 *   수동 확인 링크로만 포함한다.
 */

import type { BidSource } from "../src/types";

export const BID_SOURCES: BidSource[] = [
  // ── Phase 1: 나라장터 공공데이터 API (조달청_나라장터 입찰공고정보서비스) ──
  {
    id: "g2b-servc",
    name: "나라장터 입찰공고 (용역)",
    organization: "조달청",
    type: "official-api",
    baseUrl: "https://www.g2b.go.kr",
    apiUrl:
      "https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoServcPPSSrch",
    enabled: true,
    priority: 1,
    categories: ["direct-bid", "registration", "lecture", "debt-court-document"],
    requiresApiKey: true,
    secretEnvName: "G2B_SERVICE_KEY",
    collectionMethod: "공공데이터포털 Open API (JSON, 게시일시 기간조회)",
    termsReviewed: true,
    robotsReviewed: true,
    requestIntervalMs: 400,
    parserId: "g2b",
    notes: "법무사 수임기회 탐색의 기본 소스. 용역 공고 전수 조회 후 키워드·규칙 분류.",
  },
  {
    id: "g2b-thng",
    name: "나라장터 입찰공고 (물품)",
    organization: "조달청",
    type: "official-api",
    baseUrl: "https://www.g2b.go.kr",
    apiUrl:
      "https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoThngPPSSrch",
    enabled: true,
    priority: 2,
    categories: ["direct-bid"],
    requiresApiKey: true,
    secretEnvName: "G2B_SERVICE_KEY",
    collectionMethod: "공공데이터포털 Open API (JSON)",
    termsReviewed: true,
    robotsReviewed: true,
    requestIntervalMs: 400,
    parserId: "g2b",
    notes: "물품 공고 중 법무·문서·등기 관련 항목만 키워드 필터로 선별.",
  },
  {
    id: "g2b-cnstwk",
    name: "나라장터 입찰공고 (공사)",
    organization: "조달청",
    type: "official-api",
    baseUrl: "https://www.g2b.go.kr",
    apiUrl:
      "https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoCnstwkPPSSrch",
    enabled: false,
    priority: 3,
    categories: ["registration", "real-estate"],
    requiresApiKey: true,
    secretEnvName: "G2B_SERVICE_KEY",
    collectionMethod: "공공데이터포털 Open API (JSON)",
    termsReviewed: true,
    robotsReviewed: true,
    requestIntervalMs: 400,
    parserId: "g2b",
    notes:
      "공사 공고 중 등기·보상·권리정리 부대용역 탐색용. 데이터량이 많아 기본 비활성. 필요 시 enabled: true.",
  },

  // ── Phase 1+: 누리장터 민간입찰 (아파트관리사무소·영리법인 등) ──
  // 나라장터 공공입찰과 별도 서비스. 공공데이터포털에서 별도 활용신청 필요.
  {
    id: "nuri-servc",
    name: "누리장터 민간입찰 (용역)",
    organization: "조달청 누리장터",
    type: "official-api",
    baseUrl: "https://www.g2b.go.kr",
    apiUrl:
      "https://apis.data.go.kr/1230000/ao/PrvtBidNtceService/getPrvtBidPblancListInfoServc",
    enabled: true,
    priority: 2,
    categories: ["direct-bid", "registration", "lecture"],
    requiresApiKey: true,
    secretEnvName: "G2B_SERVICE_KEY",
    collectionMethod:
      "공공데이터포털 Open API (JSON, 공고게시일시 기간조회, inqryDiv=2)",
    termsReviewed: true,
    robotsReviewed: true,
    requestIntervalMs: 400,
    parserId: "nuri",
    notes:
      "아파트관리사무소·영리법인 등 민간 발주. 법무사 선정·집단등기·법률용역에 특히 중요. '조달청_누리장터 민간입찰공고서비스' 별도 활용신청 필요.",
  },
  {
    id: "nuri-etc",
    name: "누리장터 민간입찰 (기타)",
    organization: "조달청 누리장터",
    type: "official-api",
    baseUrl: "https://www.g2b.go.kr",
    apiUrl:
      "https://apis.data.go.kr/1230000/ao/PrvtBidNtceService/getPrvtBidPblancListInfoEtc",
    enabled: true,
    priority: 3,
    categories: ["direct-bid", "lecture", "collaboration"],
    requiresApiKey: true,
    secretEnvName: "G2B_SERVICE_KEY",
    collectionMethod: "공공데이터포털 Open API (JSON)",
    termsReviewed: true,
    robotsReviewed: true,
    requestIntervalMs: 400,
    parserId: "nuri",
    notes: "기타 업무구분에 법무·교육·용역성 공고가 섞일 수 있어 함께 수집.",
  },
  {
    id: "nuri-thng",
    name: "누리장터 민간입찰 (물품)",
    organization: "조달청 누리장터",
    type: "official-api",
    baseUrl: "https://www.g2b.go.kr",
    apiUrl:
      "https://apis.data.go.kr/1230000/ao/PrvtBidNtceService/getPrvtBidPblancListInfoThng",
    enabled: false,
    priority: 4,
    categories: ["direct-bid"],
    requiresApiKey: true,
    secretEnvName: "G2B_SERVICE_KEY",
    collectionMethod: "공공데이터포털 Open API (JSON)",
    termsReviewed: true,
    robotsReviewed: true,
    requestIntervalMs: 400,
    parserId: "nuri",
    notes: "물품 공고는 법무사 관련성이 낮아 기본 비활성.",
  },

  // ── Phase 2 이후: 수동 확인 링크 (자동수집 조건 미검토 → 무단 크롤링 금지) ──
  {
    id: "onbid",
    name: "온비드 공매·공유재산",
    organization: "한국자산관리공사",
    type: "manual-link",
    baseUrl: "https://www.onbid.co.kr",
    enabled: true,
    priority: 5,
    categories: ["auction-public-sale", "registration"],
    regions: ["부산", "울산", "경남"],
    requiresApiKey: false,
    collectionMethod:
      "수동 확인 링크. 공공데이터포털의 온비드 공식 API 활용신청 후 official-api로 전환 예정.",
    termsReviewed: false,
    robotsReviewed: false,
    notes: "공매 낙찰 후 이전등기·말소등기 잠재수요 확인용.",
  },
  {
    id: "lh-ebid",
    name: "LH 전자조달",
    organization: "한국토지주택공사",
    type: "manual-link",
    baseUrl: "https://ebid.lh.or.kr",
    enabled: true,
    priority: 5,
    categories: ["direct-bid", "registration"],
    requiresApiKey: false,
    collectionMethod: "수동 확인 링크. 공식 API·RSS 확인 후 자동수집 전환 검토(Phase 2).",
    termsReviewed: false,
    robotsReviewed: false,
    notes: "공공주택 보존등기·집단등기 관련 공고 다수.",
  },
  {
    id: "busan-city",
    name: "부산광역시 고시공고",
    organization: "부산광역시",
    type: "manual-link",
    baseUrl: "https://www.busan.go.kr/nbgosi",
    enabled: true,
    priority: 4,
    categories: ["direct-bid", "lecture", "registration"],
    regions: ["부산"],
    requiresApiKey: false,
    collectionMethod: "수동 확인 링크. 공공데이터포털 지자체 고시공고 API 검토 후 전환(Phase 2).",
    termsReviewed: false,
    robotsReviewed: false,
    notes: "법무사 선정·강사 모집·공유재산 매각 공고 확인.",
  },
  {
    id: "court-auction",
    name: "법원경매정보 (시장신호)",
    organization: "대한민국 법원",
    type: "manual-link",
    baseUrl: "https://www.courtauction.go.kr",
    enabled: true,
    priority: 6,
    categories: ["market-signal"],
    regions: ["부산", "울산", "경남"],
    requiresApiKey: false,
    collectionMethod:
      "수동 확인 링크. 개인 사건정보를 저장하지 않으며 시장신호 파악 용도로만 사용(Phase 3).",
    termsReviewed: false,
    robotsReviewed: false,
  },
];

export function getEnabledApiSources(): BidSource[] {
  return BID_SOURCES.filter((s) => s.enabled && s.type === "official-api").sort(
    (a, b) => a.priority - b.priority,
  );
}

export function getManualLinkSources(): BidSource[] {
  return BID_SOURCES.filter((s) => s.enabled && s.type === "manual-link").sort(
    (a, b) => a.priority - b.priority,
  );
}

export function getSourceById(id: string): BidSource | undefined {
  return BID_SOURCES.find((s) => s.id === id);
}
