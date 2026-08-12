/**
 * Busan local / lifestyle-area intent registry.
 * verified: only entities with known site host or clear geographic reality.
 * contentNeed defaults to absorb into existing hosts — no thin geo clones.
 */

export type LocalRegionType =
  | "gu"
  | "dong"
  | "station"
  | "business-district"
  | "industrial-area"
  | "residential-area"
  | "court-area"
  | "public-office-area"
  | "other";

export type LocalContentNeed =
  | "existing-page"
  | "add-section"
  | "faq"
  | "new-page-candidate"
  | "do-not-create";

export type LocalIntent = {
  id: string;
  regionName: string;
  regionType: LocalRegionType;
  verified: boolean;
  primaryHostPage?: string;
  relatedServices: string[];
  userSituations: string[];
  candidateQueries: string[];
  contentNeed: LocalContentNeed;
  uniquenessReason?: string;
  searchVolume: "SEARCH_VOLUME_UNKNOWN";
};

export const BUSAN_LOCAL_INTENT_REGISTRY: LocalIntent[] = [
  {
    id: "haeundae",
    regionName: "해운대",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/해운대법무사",
    relatedServices: ["inheritance", "real-estate", "corporate"],
    userSituations: [
      "상속 받은 아파트 명의변경",
      "전세금 미반환 후 이사",
      "근저당 말소",
    ],
    candidateQueries: [
      "해운대 상속 받은 아파트 명의변경",
      "해운대 전세금 못 받고 이사",
      "해운대 근저당 말소",
    ],
    contentNeed: "existing-page",
    uniquenessReason: "지역 호스트 존재 — 업무 본문은 Champion으로",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "centum",
    regionName: "센텀",
    regionType: "business-district",
    verified: true,
    primaryHostPage: "/센텀법무사",
    relatedServices: ["corporate", "real-estate"],
    userSituations: [
      "회사 주소 변경 등기",
      "임원변경",
      "법인설립",
    ],
    candidateQueries: [
      "센텀 회사 주소 변경 등기",
      "센텀 임원변경",
      "센텀 법인설립",
    ],
    contentNeed: "add-section",
    uniquenessReason: "업무지구 — 법인 상황 모듈을 호스트/법인 Champion에 연결",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "seomyeon",
    regionName: "서면",
    regionType: "business-district",
    verified: true,
    primaryHostPage: "/서면법무사",
    relatedServices: ["corporate", "civil", "real-estate"],
    userSituations: [
      "회사 등기",
      "임원변경",
      "미수금 지급명령",
    ],
    candidateQueries: [
      "서면 회사 등기",
      "서면 법인 임원변경",
      "서면 미수금 지급명령",
    ],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "yeonsan",
    regionName: "연산",
    regionType: "dong",
    verified: true,
    primaryHostPage: "/연산동법무사",
    relatedServices: ["corporate", "inheritance"],
    userSituations: ["본점이전", "법인설립", "상속포기"],
    candidateQueries: [
      "연산동 회사 본점이전",
      "연산동 법인설립",
      "연산동 상속포기",
    ],
    contentNeed: "existing-page",
    uniquenessReason: "동 단위 호스트 있으면 흡수. /연산상속등기 식 복제 금지",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "dongrae",
    regionName: "동래",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/동래법무사",
    relatedServices: ["inheritance", "real-estate"],
    userSituations: ["근저당 말소", "상속 명의", "전세"],
    candidateQueries: [
      "동래 근저당 말소",
      "동래 부모님 집 명의변경",
    ],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "suyeong",
    regionName: "수영",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/수영법무사",
    relatedServices: ["real-estate", "inheritance"],
    userSituations: ["아파트 명의", "전세보증금"],
    candidateQueries: ["수영 아파트 명의변경", "광안 전세금"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "busanjin",
    regionName: "부산진",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/부산진구법무사",
    relatedServices: ["corporate", "civil", "real-estate"],
    userSituations: ["법인등기", "지급명령", "잔금등기"],
    candidateQueries: ["부산진구 회사 등기", "서면 근처 지급명령"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "namgu",
    regionName: "남구",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/남구법무사",
    relatedServices: ["real-estate", "inheritance"],
    userSituations: ["매매등기", "상속"],
    candidateQueries: ["남구 아파트 매매등기"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "geumjeong",
    regionName: "금정",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/금정구법무사",
    relatedServices: ["inheritance", "real-estate"],
    userSituations: ["상속등기", "근저당"],
    candidateQueries: ["금정구 상속 명의", "금정 근저당 말소"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "sasang",
    regionName: "사상",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/사상구법무사",
    relatedServices: ["corporate", "real-estate"],
    userSituations: ["공단 인근 법인", "부동산등기"],
    candidateQueries: ["사상 법인등기", "사상 공단 회사 주소"],
    contentNeed: "add-section",
    uniquenessReason: "산업·물류 밀집 — 법인 주소/본점 상황 FAQ 후보",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "saha",
    regionName: "사하",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/사하구법무사",
    relatedServices: ["real-estate", "inheritance"],
    userSituations: ["신축·입주", "상속"],
    candidateQueries: ["사하 입주등기", "하단 상속"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "bukgu",
    regionName: "북구",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/북구법무사",
    relatedServices: ["real-estate", "inheritance"],
    userSituations: ["화명 등 주거단지 명의", "상속"],
    candidateQueries: ["북구 아파트 명의변경", "화명 상속등기"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "gijang",
    regionName: "기장",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/기장법무사",
    relatedServices: ["inheritance", "real-estate"],
    userSituations: ["토지·전원 상속", "매매"],
    candidateQueries: ["기장 상속토지", "기장 매매등기"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "gangseo",
    regionName: "강서",
    regionType: "gu",
    verified: true,
    primaryHostPage: "/강서구법무사",
    relatedServices: ["corporate", "real-estate"],
    userSituations: ["명지 신도시 입주", "산업단지 법인"],
    candidateQueries: [
      "명지 신축 입주등기",
      "강서 법인 본점이전",
    ],
    contentNeed: "add-section",
    uniquenessReason: "신도시·산업단지 — 입주/법인 상황 연결 (신규 지역 URL 금지)",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "busan-station",
    regionName: "부산역",
    regionType: "station",
    verified: true,
    primaryHostPage: "/부산역법무사",
    relatedServices: ["civil", "real-estate"],
    userSituations: ["접근성 중심 상담", "등기 문의"],
    candidateQueries: ["부산역 근처 등기", "부산역 법무사"],
    contentNeed: "existing-page",
    uniquenessReason: "역세권 호스트 유지. 업무 복제 페이지 금지",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "court-area",
    regionName: "부산지방법원 인근",
    regionType: "court-area",
    verified: true,
    primaryHostPage: "/부산법무사",
    relatedServices: ["inheritance", "civil", "rehab"],
    userSituations: [
      "가정법원 상속포기",
      "지급명령",
      "개인회생",
    ],
    candidateQueries: [
      "부산지방법원 상속포기",
      "부산가정법원 한정승인",
      "부산지방법원 지급명령",
    ],
    contentNeed: "faq",
    uniquenessReason: "기관명 검색은 Champion FAQ/기관 모듈로 — 가짜 관할 페이지 금지",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "registry-office",
    regionName: "부산 등기소",
    regionType: "public-office-area",
    verified: true,
    primaryHostPage: "/등기소어디인가요",
    relatedServices: ["real-estate", "corporate", "inheritance"],
    userSituations: ["관할 등기소 확인", "소유권이전", "근저당 말소"],
    candidateQueries: [
      "부산 등기소 소유권이전",
      "부산 등기소 근저당 말소",
      "법인등기 관할 등기소",
    ],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "millak",
    regionName: "민락",
    regionType: "dong",
    verified: true,
    primaryHostPage: "/민락동법무사",
    relatedServices: ["real-estate", "inheritance"],
    userSituations: ["아파트 잔금등기", "전세·매매", "상속 명의"],
    candidateQueries: [
      "민락 법무사",
      "민락동 법무사",
      "민락역 법무사",
      "민락 아파트 등기",
    ],
    contentNeed: "add-section",
    uniquenessReason: "Local Champion overlay + station cluster — no new URL",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "jangsan",
    regionName: "장산",
    regionType: "station",
    verified: true,
    primaryHostPage: "/좌동법무사",
    relatedServices: ["inheritance", "real-estate"],
    userSituations: ["대단지 아파트 상속", "잔금등기"],
    candidateQueries: ["장산 법무사", "장산역 법무사", "좌동 상속등기"],
    contentNeed: "existing-page",
    uniquenessReason: "장산역 → 좌동 Host; station section on /좌동법무사",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "jeonpo",
    regionName: "전포",
    regionType: "dong",
    verified: true,
    primaryHostPage: "/전포동법무사",
    relatedServices: ["real-estate", "corporate"],
    userSituations: ["상가·권리금", "카페거리 매매"],
    candidateQueries: ["전포동 법무사", "전포역 법무사", "전포카페거리 등기"],
    contentNeed: "existing-page",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "yangjeong",
    regionName: "양정",
    regionType: "dong",
    verified: true,
    primaryHostPage: "/양정동법무사",
    relatedServices: ["real-estate", "inheritance"],
    userSituations: ["역세권 매매", "공동상속", "잔금대출"],
    candidateQueries: [
      "양정 법무",
      "양정 법무사",
      "양정역 법무사",
      "양정동 법무사",
    ],
    contentNeed: "add-section",
    uniquenessReason: "Local Champion overlay + yangjeong station section",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "boksan-alias",
    regionName: "복산(동래권 별칭)",
    regionType: "dong",
    verified: true,
    primaryHostPage: "/동래구법무사",
    relatedServices: ["inheritance", "real-estate"],
    userSituations: ["동래권 상속", "재건축 아파트"],
    candidateQueries: ["복산동 법무사", "동래 복산동 법무사"],
    contentNeed: "faq",
    uniquenessReason:
      "공식 행정동은 복천동 등. '복산동' 검색은 동래구 Host FAQ로 흡수 — 신규 URL 금지",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "busan-cost",
    regionName: "부산(비용)",
    regionType: "other",
    verified: true,
    primaryHostPage: "/부산법무사비용",
    relatedServices: ["inheritance", "real-estate", "corporate"],
    userSituations: ["비용 비교", "견적 문의"],
    candidateQueries: [
      "부산 저렴한 법무사",
      "부산 법무사 비용",
      "부산 법무사 수수료",
    ],
    contentNeed: "existing-page",
    uniquenessReason: "Cost Champion — no '최저가' claims on public pages",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "busan-selection",
    regionName: "부산(선택)",
    regionType: "other",
    verified: true,
    primaryHostPage: "/부산법무사추천",
    relatedServices: ["inheritance", "real-estate", "corporate", "rehab"],
    userSituations: ["처음 의뢰", "비교·후기"],
    candidateQueries: ["부산 법무사 추천", "부산 등기 법무사 추천"],
    contentNeed: "existing-page",
    uniquenessReason: "Selection Champion — criteria not self-recommendation",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "busan-finance-registration",
    regionName: "부산(잔금·대출·등기)",
    regionType: "other",
    verified: true,
    primaryHostPage: "/부산잔금대출근저당",
    relatedServices: ["real-estate"],
    userSituations: [
      "잔금대출",
      "근저당 설정",
      "매도인 말소",
      "은행서류",
    ],
    candidateQueries: [
      "부산 은행 법무사",
      "부산 은행 등기 법무사",
      "부산 잔금 법무사",
      "부산 잔금 등기",
      "부산 근저당 법무사",
      "부산 아파트 잔금 등기",
      "부산 주택담보대출 등기",
    ],
    contentNeed: "add-section",
    uniquenessReason:
      "Finance cluster — no bank partnership language; situation modules",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
  {
    id: "dong-thin-clone",
    regionName: "(예시) 동별 상속등기 복제",
    regionType: "dong",
    verified: false,
    relatedServices: ["inheritance"],
    userSituations: ["동일 상속등기 절차"],
    candidateQueries: ["서면상속등기", "연산상속등기", "동래상속등기"],
    contentNeed: "do-not-create",
    uniquenessReason: "THIN_LOCAL_RISK / doorway — 지역명만 다른 동일 본문",
    searchVolume: "SEARCH_VOLUME_UNKNOWN",
  },
];

export function getLocalIntentsNeedingAttention() {
  return BUSAN_LOCAL_INTENT_REGISTRY.filter(
    (i) =>
      i.contentNeed === "add-section" ||
      i.contentNeed === "faq" ||
      i.contentNeed === "new-page-candidate",
  );
}
