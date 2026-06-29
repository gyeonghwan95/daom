import type { BusanDistrictDef, BusanLegalMapHubConfig } from "./types";

const S = {
  parent: { href: "/situations/parent-passed-away", label: "부모님이 돌아가셨을 때" },
  siblings: { href: "/situations/siblings-not-cooperating", label: "형제자매가 협조하지 않을 때" },
  debt: { href: "/situations/inheritance-unknown-debt", label: "상속 채무가 불분명할 때" },
  sale: { href: "/situations/real-estate-sale-registration", label: "부동산 매매 등기" },
  jeonse: { href: "/situations/jeonse-deposit-unpaid", label: "전세보증금 미반환" },
  corp: { href: "/situations/corporate-officer-address-change", label: "법인 임원·주소 변경" },
  payment: { href: "/situations/payment-order-certified-mail", label: "지급명령·내용증명" },
  rehab: { href: "/situations/personal-rehabilitation-bankruptcy", label: "개인회생·파산 검토" },
};

export const busanDistricts: BusanDistrictDef[] = [
  {
    id: "haeundae-gu",
    regionKey: "haeundae",
    label: "해운대구",
    neighborhoods: ["반여동", "재송동", "센텀", "우동", "좌동"],
    context:
      "센텀시티·마린시티·재송·반여 일대 고가 아파트와 법인 사옥이 밀집해, 공동상속·해외 거주 상속인·잔금 후 등기 문의가 많습니다.",
    commonServices: ["상속등기", "부동산등기", "법인등기", "전세보증금", "근저당 말소"],
    keywords: ["해운대 상속등기", "센텀 법인등기", "재송동 등기", "해운대구 부동산등기", "부산 법무사"],
    hubPath: "/해운대법무사",
    serviceLinks: [
      { href: "/해운대구상속등기", label: "해운대구 상속등기" },
      { href: "/해운대구부동산등기", label: "해운대구 부동산등기" },
      { href: "/해운대구법인등기", label: "해운대구 법인등기" },
      { href: "/센텀법인등기", label: "센텀 법인등기" },
      { href: "/센텀임원변경등기", label: "센텀 임원변경등기" },
    ],
    situationLinks: [S.parent, S.siblings, S.corp, S.sale],
  },
  {
    id: "suyeong-gu",
    regionKey: "suyeong",
    label: "수영구",
    neighborhoods: ["광안동", "민락동", "망미동", "남천동"],
    context:
      "광안리·민락 일대 전월세·매매와 상속이 겹치는 사건이 많고, 보증금 반환 지연·확정일자·대항력 확인이 먼저인 경우가 많습니다.",
    commonServices: ["부동산등기", "상속등기", "전세보증금", "개인회생"],
    keywords: ["수영구 부동산등기", "광안동 상속등기", "전세보증금", "수영구 법무사", "부산 법무사"],
    hubPath: "/수영구법무사",
    serviceLinks: [
      { href: "/수영구상속등기", label: "수영구 상속등기" },
      { href: "/수영구부동산등기", label: "수영구 부동산등기" },
      { href: "/수영구법인등기", label: "수영구 법인등기" },
      { href: "/수영구개인회생", label: "수영구 개인회생" },
      { href: "/임대차전세", label: "임대차·전세 허브" },
    ],
    situationLinks: [S.jeonse, S.sale, S.parent, S.rehab],
  },
  {
    id: "yeonje-gu",
    regionKey: "yeonje",
    label: "연제구",
    neighborhoods: ["연산동", "거제동", "연산역"],
    context:
      "연산·거제 일대 실거주 아파트와 소규모 법인 사무실이 많아, 상속등기와 임원변경·한정승인 상담이 이어지는 지역입니다.",
    commonServices: ["상속등기", "임원변경등기", "법인등기", "한정승인"],
    keywords: ["연제구 상속등기", "연산동 등기", "임원변경등기", "연제구 법무사", "부산 법무사"],
    hubPath: "/연제구법무사",
    serviceLinks: [
      { href: "/연제구상속등기", label: "연제구 상속등기" },
      { href: "/연제구임원변경등기", label: "연제구 임원변경등기" },
      { href: "/연제구부동산등기", label: "연제구 부동산등기" },
      { href: "/연제구한정승인", label: "연제구 한정승인" },
    ],
    situationLinks: [S.parent, S.debt, S.corp, S.siblings],
  },
  {
    id: "dongnae-gu",
    regionKey: "dongnae",
    label: "동래구",
    neighborhoods: ["온천동", "사직동", "명륜동"],
    context:
      "온천·사직·명륜 일대 오래된 주택과 재건축 이슈가 있는 부동산의 상속·한정승인·등기 사건이 꾸준합니다.",
    commonServices: ["상속등기", "한정승인", "부동산등기", "임원변경등기"],
    keywords: ["동래구 상속등기", "한정승인", "재건축 등기", "동래구 법무사", "부산 법무사"],
    hubPath: "/동래구법무사",
    serviceLinks: [
      { href: "/동래구상속등기", label: "동래구 상속등기" },
      { href: "/동래구한정승인", label: "동래구 한정승인" },
      { href: "/동래구부동산등기", label: "동래구 부동산등기" },
      { href: "/부산재건축등기", label: "부산 재건축 등기" },
    ],
    situationLinks: [S.debt, S.parent, S.sale, S.siblings],
  },
  {
    id: "nam-gu",
    regionKey: "namgu",
    label: "남구",
    neighborhoods: ["대연동", "용호동", "문현동"],
    context:
      "대연·용호 주거지와 문현금융단지 인근 법인 사옥이 함께 있어, 법인등기·임원변경과 부동산 등기 문의가 겹칩니다.",
    commonServices: ["법인등기", "임원변경등기", "부동산등기", "상속등기"],
    keywords: ["남구 법인등기", "문현금융단지", "남부산 등기", "남구 법무사", "부산 법무사"],
    hubPath: "/남구법무사",
    serviceLinks: [
      { href: "/문현금융단지법인등기", label: "문현금융단지 법인등기" },
      { href: "/부산국제금융센터법인등기", label: "BIFC 법인등기" },
      { href: "/남부산등기소법무사", label: "남부산등기소 안내" },
      { href: "/법인등기", label: "법인등기 허브" },
    ],
    situationLinks: [S.corp, S.sale, S.parent],
  },
  {
    id: "busanjin-gu",
    regionKey: "busanjin",
    label: "부산진구",
    neighborhoods: ["서면", "부전동", "전포동", "범천동"],
    context:
      "서면·부전·전포 일대 상업지와 오피스텔·상가 밀집 지역으로, 매매 등기·채권회수·지급명령 문의가 많습니다.",
    commonServices: ["부동산등기", "소유권이전등기", "지급명령", "법인등기"],
    keywords: ["서면 등기", "부산진구 부동산등기", "오피스텔 등기", "부산진구 법무사", "부산 법무사"],
    hubPath: "/부산진구법무사",
    serviceLinks: [
      { href: "/부산진등기소법무사", label: "부산진등기소 안내" },
      { href: "/부산오피스텔소유권이전등기", label: "오피스텔 소유권이전" },
      { href: "/부산지방법원지급명령", label: "부산지방법원 지급명령" },
      { href: "/민사소송", label: "민사·채권 허브" },
    ],
    situationLinks: [S.payment, S.sale, S.corp],
  },
  {
    id: "buk-gu",
    regionKey: "buk",
    label: "북구",
    neighborhoods: ["덕천동", "구포동", "화명동"],
    context:
      "덕천·구포·화명 일대 실거주 아파트와 상가에서 상속·매매 등기와 개인회생 상담이 꾸준히 이어집니다.",
    commonServices: ["상속등기", "개인회생", "부동산등기", "상속포기"],
    keywords: ["북구 상속등기", "덕천동 등기", "북구 개인회생", "북구 법무사", "부산 법무사"],
    hubPath: "/북구법무사",
    serviceLinks: [
      { href: "/북구상속등기", label: "북구 상속등기" },
      { href: "/북구부동산등기", label: "북구 부동산등기" },
      { href: "/북구개인회생", label: "북구 개인회생" },
      { href: "/북부산등기소법무사", label: "북부산등기소 안내" },
    ],
    situationLinks: [S.rehab, S.debt, S.parent],
  },
  {
    id: "geumjeong-gu",
    regionKey: "geumjeong",
    label: "금정구",
    neighborhoods: ["부곡동", "서동", "금사동"],
    context:
      "부곡·서동·금사 일대 다가구·상가의 상속등기와 한정승인, 부산대 인근 임대·매매 등기 문의가 있습니다.",
    commonServices: ["상속등기", "한정승인", "부동산등기"],
    keywords: ["금정구 상속등기", "부곡동 등기", "한정승인", "금정구 법무사", "부산 법무사"],
    hubPath: "/금정구법무사",
    serviceLinks: [
      { href: "/금정구상속등기", label: "금정구 상속등기" },
      { href: "/금정구한정승인", label: "금정구 한정승인" },
      { href: "/금정구부동산등기", label: "금정구 부동산등기" },
    ],
    situationLinks: [S.debt, S.parent, S.siblings],
  },
  {
    id: "sasang-gu",
    regionKey: "sasang",
    label: "사상구",
    neighborhoods: ["엄궁동", "감전동", "주례동"],
    context:
      "엄궁·감전·주례 일대 상가·주택 상속과 채무 관련 상속포기·개인회생 문의가 잦은 지역입니다.",
    commonServices: ["상속등기", "상속포기", "개인회생", "부동산등기"],
    keywords: ["사상구 상속등기", "엄궁동 등기", "사상구 개인회생", "사상구 법무사", "부산 법무사"],
    hubPath: "/사상구법무사",
    serviceLinks: [
      { href: "/사상구상속등기", label: "사상구 상속등기" },
      { href: "/사상구상속포기", label: "사상구 상속포기" },
      { href: "/사상구개인회생", label: "사상구 개인회생" },
      { href: "/사상구부동산등기", label: "사상구 부동산등기" },
    ],
    situationLinks: [S.rehab, S.debt, S.parent],
  },
  {
    id: "jung-gu",
    regionKey: "junggu",
    label: "중구",
    neighborhoods: ["남포동", "중앙동", "보수동"],
    context:
      "원도심 상가·오래된 건물의 상속·매매 등기와 소규모 법인 사무실 등기 수요가 있는 지역입니다.",
    commonServices: ["부동산등기", "상속등기", "상가 등기", "법인등기"],
    keywords: ["중구 부동산등기", "남포동 상가 등기", "중구 상속등기", "중구 법무사", "부산 법무사"],
    hubPath: "/중구법무사",
    serviceLinks: [
      { href: "/중구상속등기", label: "중구 상속등기" },
      { href: "/중구부동산등기", label: "중구 부동산등기" },
      { href: "/부산상가등기", label: "부산 상가 등기" },
      { href: "/중구법인등기", label: "중구 법인등기" },
    ],
    situationLinks: [S.sale, S.parent, S.corp],
  },
  {
    id: "seo-gu",
    regionKey: "seogu",
    label: "서구",
    neighborhoods: ["충무동", "동대신동", "아미동"],
    context:
      "충무·동대신 일대 주택·상가의 상속등기와 전세·매매 관련 등기 문의가 꾸준합니다.",
    commonServices: ["상속등기", "부동산등기", "전세보증금"],
    keywords: ["서구 상속등기", "동대신동 등기", "서구 부동산등기", "서구 법무사", "부산 법무사"],
    hubPath: "/서구법무사",
    serviceLinks: [
      { href: "/서구상속등기", label: "서구 상속등기" },
      { href: "/서구부동산등기", label: "서구 부동산등기" },
      { href: "/서구소유권이전등기", label: "서구 소유권이전등기" },
    ],
    situationLinks: [S.parent, S.jeonse, S.sale],
  },
  {
    id: "yeongdo-gu",
    regionKey: "yeongdo",
    label: "영도구",
    neighborhoods: ["남항동", "동삼동", "봉래동"],
    context:
      "항만·조선 관련 업체와 주거지가 함께 있어 법인등기·상속·부동산 등기 사건이 다양합니다.",
    commonServices: ["법인등기", "상속등기", "부동산등기", "임원변경등기"],
    keywords: ["영도구 법인등기", "영도구 상속등기", "남항동 등기", "영도구 법무사", "부산 법무사"],
    hubPath: "/영도구법무사",
    serviceLinks: [
      { href: "/영도구상속등기", label: "영도구 상속등기" },
      { href: "/영도구법인등기", label: "영도구 법인등기" },
      { href: "/영도구부동산등기", label: "영도구 부동산등기" },
    ],
    situationLinks: [S.corp, S.parent, S.sale],
  },
  {
    id: "gijang-gun",
    regionKey: "gijang",
    label: "기장군",
    neighborhoods: ["기장읍", "정관읍", "일광읍"],
    context:
      "토지·전원주택·농지 상속과 정관·명례 산업단지 법인 등기 문의가 있으며, 관할 등기소 확인이 중요합니다.",
    commonServices: ["상속등기", "토지 등기", "법인등기", "부동산등기"],
    keywords: ["기장군 상속등기", "정관 등기", "토지 상속", "기장군 법무사", "부산 법무사"],
    hubPath: "/기장군법무사",
    serviceLinks: [
      { href: "/기장군상속등기", label: "기장군 상속등기" },
      { href: "/기장토지상속등기", label: "기장 토지 상속등기" },
      { href: "/기장군부동산등기", label: "기장군 부동산등기" },
      { href: "/정관법인등기", label: "정관 법인등기" },
    ],
    situationLinks: [S.parent, S.siblings, S.sale],
  },
  {
    id: "gangseo-gu",
    regionKey: "gangseo",
    label: "강서구",
    neighborhoods: ["명지", "명지국제신도시", "가락동", "에코델타시티"],
    context:
      "명지·에코델타시티 일대 신축 아파트·상가·법인 사옥이 늘며 설립등기와 소유권이전 수요가 빠르게 커지는 지역입니다.",
    commonServices: ["법인설립등기", "부동산등기", "상속등기", "임원변경등기"],
    keywords: ["명지 법인등기", "강서구 등기", "에코델타시티", "강서구 법무사", "부산 법무사"],
    hubPath: "/강서구법무사",
    serviceLinks: [
      { href: "/명지국제신도시법인등기", label: "명지국제신도시 법인등기" },
      { href: "/에코델타시티법인등기", label: "에코델타시티 법인등기" },
      { href: "/강서구상속등기", label: "강서구 상속등기" },
      { href: "/부산신축아파트소유권이전등기", label: "신축 아파트 등기" },
    ],
    situationLinks: [S.corp, S.sale, S.parent],
  },
  {
    id: "saha-gu",
    regionKey: "saha",
    label: "사하구",
    neighborhoods: ["하단동", "괴정동", "당리동"],
    context:
      "하단·괴정·당리 일대 실거주 아파트와 상가의 상속·매매 등기 문의가 많습니다.",
    commonServices: ["상속등기", "부동산등기", "상속포기"],
    keywords: ["사하구 상속등기", "하단동 등기", "사하구 부동산등기", "사하구 법무사", "부산 법무사"],
    hubPath: "/사하구법무사",
    serviceLinks: [
      { href: "/사하구상속등기", label: "사하구 상속등기" },
      { href: "/사하구부동산등기", label: "사하구 부동산등기" },
      { href: "/사하구법인등기", label: "사하구 법인등기" },
    ],
    situationLinks: [S.parent, S.sale, S.debt],
  },
  {
    id: "dong-gu",
    regionKey: "donggu",
    label: "동구",
    neighborhoods: ["초량동", "범일동", "수정동"],
    context:
      "항만·물류 인근 상가·창고와 주거지가 섞여 있어, 상속·매매 등기와 소규모 법인 등기 문의가 이어집니다.",
    commonServices: ["상속등기", "부동산등기", "법인등기"],
    keywords: ["동구 상속등기", "초량동 등기", "동구 부동산등기", "동구 법무사", "부산 법무사"],
    hubPath: "/동구법무사",
    serviceLinks: [
      { href: "/동구상속등기", label: "동구 상속등기" },
      { href: "/동구부동산등기", label: "동구 부동산등기" },
      { href: "/동구법인등기", label: "동구 법인등기" },
    ],
    situationLinks: [S.parent, S.sale, S.corp],
  },
];

export const busanLegalMapHub: BusanLegalMapHubConfig = {
  slug: "busan-legal-map",
  path: "/busan-legal-map",
  h1: "부산 어디에서 어떤 법률 문제가 많을까요?",
  intro:
    "해운대·센텀·연제·동래 등 부산 16개 구·군별로 자주 찾는 상속·등기·법인·전세·채무 상담 주제를 정리했습니다. 지역명만 나열한 페이지가 아니라, 실제로 많이 문의하는 상황과 연결된 안내입니다. 다옴법무사사무소는 해운대·센텀에 있으며 부산 전역 사건을 상담합니다.",
  metaDescriptionBase:
    "부산 16개 구·군별 상속등기·부동산등기·법인등기·전세보증금·개인회생 등 법무사 상담 주제를 지역별로 정리한 부산 법률지도. 해운대·수영·연제·동래·기장 등 지역 검색 유입 안내.",
  faqs: [
    {
      question: "해운대·센텀 사무소인데 다른 구도 상담 가능한가요?",
      answer:
        "네. 부산 전역 사건을 전화·카카오톡·방문(예약)으로 상담합니다. 관할 등기소·법원은 사건별로 달라지므로, 지역과 함께 사건 내용을 알려주시면 됩니다.",
    },
    {
      question: "지역 페이지와 업무안내는 무엇이 다른가요?",
      answer:
        "지역 페이지는 ‘해운대구 상속등기’처럼 구·군과 업무를 함께 검색하신 분을 위한 안내입니다. 업무안내(/services)는 절차·서류를 항목별로 정리한 페이지입니다.",
    },
    {
      question: "상황별 법률문제와 어떻게 연결되나요?",
      answer:
        "‘부모님이 돌아가셨다’, ‘전세보증금을 못 받았다’처럼 생활 상황 중심 안내는 상황별 법률문제(/situations)에서, 기한·비용 점검은 법률 계산기(/tools)에서 이어서 확인할 수 있습니다.",
    },
  ],
  districts: busanDistricts,
};

export function getBusanDistrictById(id: string): BusanDistrictDef | undefined {
  return busanDistricts.find((d) => d.id === id);
}

export function getAllBusanDistricts(): BusanDistrictDef[] {
  return busanDistricts;
}
