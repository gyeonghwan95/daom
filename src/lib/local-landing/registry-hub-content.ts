import type { ServiceFaq } from "@/types/service";
import type { KeywordTopic } from "./keyword-topics";

export type RegistryHubLink = { href: string; label: string };

export type RegistryHubSituation = {
  title: string;
  links: RegistryHubLink[];
};

export type RegistryHubWorkArea = {
  title: string;
  items: string[];
  links: RegistryHubLink[];
};

export type RegistryHubProcess = {
  title: string;
  body: string;
};

export type RegistryHubIntake = {
  title: string;
  items: string[];
};

export type RegistryHubCase = {
  title: string;
  situation: string;
  checked: string;
  registration: string;
  documents: string;
  href: string;
};

export type RegistryHubMidCta = {
  title: string;
  body: string;
  href: string;
  buttonLabel: string;
};

export const REGISTRY_HUB_SLUG = "부산등기법무사" as const;
export const REGISTRY_HUB_PATH = "/부산등기법무사" as const;

export const registryHubEyebrow = "BUSAN REGISTRATION";

export const registryHubHeroParagraphs = [
  "부산에서 등기 법무사를 찾을 때는 부동산·상속·법인 중 어떤 등기인지부터 나눕니다. 매매·증여·근저당과 상속 명의이전, 법인설립·임원변경은 서류와 접수 순서가 다릅니다.",
  "정확한 등기명을 몰라도 됩니다. 등기부·계약서 또는 지금 상황만 알려 주시면, 해운대·센텀 다옴법무사사무소 안윤정 법무사가 필요한 등기와 준비서류를 구분합니다. 아래 상황별 안내에서 부동산·상속·법인 갈래로 이동하세요.",
];

export const registryHubSituations: RegistryHubSituation[] = [
  {
    title: "아파트·상가를 사고팔 예정입니다",
    links: [
      { href: "/부산소유권이전등기", label: "소유권이전등기" },
      { href: "/부산근저당말소등기", label: "근저당 말소" },
      { href: "/부산잔금일법무사", label: "잔금일 등기" },
    ],
  },
  {
    title: "가족의 부동산을 상속받았습니다",
    links: [
      { href: "/부산상속등기", label: "상속등기" },
      { href: "/부산상속재산분할법무사", label: "협의분할" },
      { href: "/부산상속법무사", label: "상속인 확인" },
    ],
  },
  {
    title: "가족에게 부동산을 증여하려 합니다",
    links: [
      { href: "/부산증여등기", label: "증여등기" },
      { href: "/부산소유권이전등기", label: "지분이전" },
      { href: "/faq/gift-registration-faq", label: "취득세 관련 확인" },
    ],
  },
  {
    title: "회사를 만들거나 변경할 예정입니다",
    links: [
      { href: "/부산법인설립등기", label: "법인설립" },
      { href: "/부산임원변경등기", label: "임원변경" },
      { href: "/부산본점이전등기", label: "본점이전" },
      { href: "/부산사업목적변경등기", label: "목적변경" },
    ],
  },
  {
    title: "대출 관련 등기를 해야 합니다",
    links: [
      { href: "/부산근저당설정등기", label: "근저당설정" },
      { href: "/부산근저당말소등기", label: "근저당말소" },
    ],
  },
  {
    title: "신축건물이 있습니다",
    links: [
      { href: "/부산신축건물보존등기", label: "소유권보존등기" },
    ],
  },
];

export const registryHubWorkAreas: RegistryHubWorkArea[] = [
  {
    title: "부동산등기",
    items: ["소유권이전", "증여", "근저당", "전세권", "보존등기", "가등기"],
    links: [
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/부산소유권이전등기", label: "소유권이전등기" },
      { href: "/부산가등기", label: "가등기" },
      { href: "/부산신축건물보존등기", label: "신축 보존등기" },
    ],
  },
  {
    title: "상속등기",
    items: ["법정상속", "협의분할", "대습상속", "여러 지역 상속부동산"],
    links: [
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/대습상속등기", label: "대습상속등기" },
      { href: "/여러지역상속부동산등기", label: "여러 지역 상속부동산" },
    ],
  },
  {
    title: "법인등기",
    items: ["법인설립", "임원변경", "본점이전", "목적변경", "증자", "해산·청산"],
    links: [
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/부산법인설립등기", label: "법인설립등기" },
      { href: "/부산임원변경등기", label: "임원변경등기" },
    ],
  },
];

export const registryHubProcess: RegistryHubProcess[] = [
  {
    title: "등기부부터 먼저 확인합니다",
    body: "등기 종류가 같아도 현재 설정된 근저당·가압류·전세권에 따라 접수 순서가 달라질 수 있습니다. 계약서만 보고 이전등기를 먼저 접수하면 보정·지연이 생기는 경우가 있어, 최신 등기부 상태를 기준으로 순서를 잡습니다.",
  },
  {
    title: "필요한 서류를 사건별로 구분합니다",
    body: "처음부터 긴 서류 목록을 일괄 보내 드리지 않습니다. 매매·상속·증여·법인 변경처럼 사건 구조를 확인한 뒤, 지금 단계에서 필요한 자료만 안내합니다.",
  },
  {
    title: "법무사가 직접 상담·진행합니다",
    body: "해운대·센텀 다옴법무사사무소 안윤정 법무사가 상담부터 접수 준비까지 직접 진행합니다. 사건의 기본 구조와 관할을 확인한 뒤 다음 단계를 설명합니다.",
  },
  {
    title: "진행 후 등기사항을 확인합니다",
    body: "접수 이후에는 완료 여부와 등기부 반영을 확인합니다. 취득세 신고, 사업자등록, 후속 말소처럼 이어서 필요한 절차가 있으면 그 범위도 안내합니다.",
  },
];

export const registryHubIntake: RegistryHubIntake[] = [
  {
    title: "매매",
    items: ["부동산 주소", "매매금액", "잔금일", "매수인 수"],
  },
  {
    title: "상속",
    items: ["사망일", "상속인 관계", "부동산 주소", "협의 여부"],
  },
  {
    title: "증여",
    items: ["부동산 주소", "증여자·수증자 관계", "전체 또는 일부 지분"],
  },
  {
    title: "법인",
    items: ["법인명", "현재 등기사항증명서", "변경하려는 내용"],
  },
];

export const registryHubCases: RegistryHubCase[] = [
  {
    title: "센텀 오피스텔 매매 소유권이전",
    situation: "센텀 일대 오피스텔 매매에 따른 소유권이전등기 의뢰.",
    checked: "매매계약서와 등기부로 저당권·권리관계를 확인하고, 잔금일과 취득세 신고 일정을 맞춰 보았습니다.",
    registration: "잔금일 전후 소유권이전등기를 접수하고, 완료 후 등기부등본을 전달했습니다.",
    documents: "매매계약서, 매도인·매수인 인감증명서, 등기부·대장, 취득세 납부 영수증.",
    href: "/services/cases/centum-ownership-transfer-case",
  },
  {
    title: "해운대 아파트 상속등기",
    situation: "해운대구 아파트 1채, 상속인 3명(배우자·자녀 2명, 해외 거주 상속인 포함).",
    checked: "등기부·가족관계증명서로 상속인과 부동산 현황을 확인하고, 배우자 단독 상속 방향으로 협의 내용을 정리했습니다.",
    registration: "상속등기를 관할 등기소에 접수해 배우자 명의로 마쳤습니다.",
    documents: "피상속인 가족관계·제적 서류, 상속인 인감(해외 거주자 위임 포함), 아파트 등기부·대장, 협의 관련 서류.",
    href: "/services/cases/haeundae-inheritance-registration-case",
  },
  {
    title: "수영구 주식회사 설립등기",
    situation: "수영구에서 개인사업을 하던 의뢰인이 주식회사 설립등기를 의뢰한 사건. 본점 수영구, 대표이사 1인.",
    checked: "법인 형태·상호·목적·자본금과 본점 사용 승낙, 설립등기와 사업자등록 순서를 확인했습니다.",
    registration: "설립등기 접수 후 법인이 성립했고, 이후 사업자등록·법인 계좌 개설 안내를 이어 드렸습니다.",
    documents: "정관, 발기인·주주·취임 서류, 자본금 납입 증명, 본점 사용 승낙서, 대표이사 인감증명서.",
    href: "/services/cases/suyeong-company-establishment-case",
  },
];

export const registryHubMidCtas: RegistryHubMidCta[] = [
  {
    title: "매매 잔금일이 정해져 있나요?",
    body: "계약서와 부동산 주소를 알려 주시면 준비할 등기서류부터 확인합니다.",
    href: "/contact/inquiry?field=ownership-transfer&from=부산등기법무사&intent=매매등기 문의",
    buttonLabel: "매매등기 문의",
  },
  {
    title: "상속 부동산이 있나요?",
    body: "사망일·상속인 관계·부동산 주소를 먼저 알려 주세요.",
    href: "/contact/inquiry?field=inheritance-registration&from=부산등기법무사&intent=상속등기 문의",
    buttonLabel: "상속등기 문의",
  },
  {
    title: "회사 등기를 변경해야 하나요?",
    body: "법인등기사항증명서와 변경 내용을 알려 주세요.",
    href: "/contact/inquiry?field=corporate-registration&from=부산등기법무사&intent=법인등기 문의",
    buttonLabel: "법인등기 문의",
  },
];

export const registryHubFaqs: ServiceFaq[] = [
  {
    question: "부산 등기 법무사에게 어떤 업무를 맡길 수 있나요?",
    answer:
      "부동산 소유권이전·증여·근저당·전세권·보존등기, 상속등기, 법인설립·임원변경·본점이전 같은 법인등기를 상담·진행합니다. 정확한 등기명을 몰라도 등기부나 현재 상황만 알려 주시면 됩니다.",
  },
  {
    question: "아파트 매매 잔금일에는 언제 상담하는 것이 좋나요?",
    answer:
      "잔금일이 정해진 뒤에는 가능한 한 빨리 상담하는 편이 안전합니다. 근저당 말소, 취득세 신고, 인감·위임 서류가 잔금일과 겹치는 경우가 많습니다.",
  },
  {
    question: "상속등기와 상속포기는 같은 절차인가요?",
    answer:
      "다릅니다. 상속등기는 부동산 명의를 상속인으로 옮기는 등기이고, 상속포기는 가정법원에 신고하는 별도 절차입니다. 채무가 불명확하면 등기보다 승인 방식부터 확인합니다.",
  },
  {
    question: "법인 임원변경도 등기업무인가요?",
    answer:
      "맞습니다. 대표이사·이사·감사 변경은 법인등기부에 기록하는 등기업무입니다. 결의일부터 등기 기한이 있어, 등기사항증명서와 변경 내용을 먼저 확인합니다.",
  },
  {
    question: "부산 외 지역 부동산도 진행할 수 있나요?",
    answer:
      "상담부터 신청까지 진행할 수 있는 사건이 있습니다. 부동산 소재지·법인 본점에 따라 관할 등기소가 달라지므로, 주소를 알려 주시면 접수 방법을 안내합니다.",
  },
    {
      question: "등기비용은 무엇에 따라 달라지나요?",
      answer:
        "등기 종류, 부동산 가액, 상속인 수, 법인 변경 항목, 말소·설정 동반 여부에 따라 달라집니다. 법무사 수임료와 등록면허세·취득세 등 공과금은 구분해 안내합니다.",
    },
    {
      question: "가등기·지상권·대지권도 등기업무인가요?",
      answer:
        "가등기 설정·말소는 가등기 안내에서, 집합건물의 대지권은 집합건물등기 허브에서 확인하시면 됩니다. 이 페이지는 어떤 등기인지 가른 뒤 해당 안내로 연결합니다.",
    },
  ];

export const registryHubInternalLinks: RegistryHubLink[] = [
  { href: "/부산부동산등기", label: "부산 부동산등기" },
  { href: "/부산상속등기", label: "부산 상속등기" },
  { href: "/부산법인등기", label: "부산 법인등기" },
  { href: "/부산소유권이전등기", label: "부산 소유권이전등기" },
  { href: "/부산근저당설정등기", label: "부산 근저당설정등기" },
  { href: "/부산근저당말소등기", label: "부산 근저당말소등기" },
  { href: "/부산신축건물보존등기", label: "부산 신축건물 보존등기" },
  { href: "/부산가등기", label: "부산 가등기" },
  { href: "/부동산실권리자명의등기", label: "실권리자명의등기" },
  { href: "/부산경매권리분석", label: "부산 경매 권리분석" },
  { href: "/등기비용", label: "등기비용" },
  { href: "/부산등기법무사추천", label: "등기 법무사 선택 기준" },
  { href: "/부산지방법원등기국", label: "부산지방법원 등기국" },
  { href: "/남부산등기소법무사", label: "남부산등기소" },
  { href: "/부산진등기소법무사", label: "부산진등기소" },
];

export const registryHubTopic: KeywordTopic = {
  slug: REGISTRY_HUB_SLUG,
  title: "부산 등기 법무사",
  metaTitle: "부산 등기 법무사 | 부동산·상속·법인등기 상담 - 다옴법무사사무소",
  metaDescription:
    "부산에서 소유권이전·상속·증여·근저당·법인등기를 준비한다면 필요한 서류와 절차를 확인해 보세요. 해운대·센텀 다옴법무사사무소 안윤정 법무사가 등기업무를 직접 상담·진행합니다.",
  h1: "부산 등기 법무사, 어떤 등기부터 준비해야 할까요?",
  serviceSlug: "real-estate-registration",
  primaryKeywords: ["부산 등기 법무사", "부산 등기업무"],
  summaryParagraphs: registryHubHeroParagraphs,
  problemStatement:
    "부산에서 등기 법무사를 찾는 이유는 사람마다 다릅니다. 아파트 매매 잔금일 소유권이전, 부모님 부동산 상속, 가족 간 증여, 대출에 따른 근저당 설정·말소, 회사 설립 또는 임원변경, 신축건물 보존등기처럼 사건이 갈립니다. 다옴법무사사무소의 부산 등기업무 대표 페이지에서는 등기부를 기준으로 필요한 절차와 서류를 정리하고, 부동산·상속·법인 세부 안내로 이어집니다.",
  whenNeeded: [
    "아파트·상가 매매 후 소유권이전등기가 필요한 경우",
    "부모님 부동산 상속으로 명의를 정리해야 하는 경우",
    "가족에게 부동산을 증여하는 경우",
    "법인 설립·임원변경·본점이전 등기가 필요한 경우",
    "대출을 위해 근저당설정등기를 하거나 상환 후 말소해야 하는 경우",
    "신축 건물 사용승인 후 보존등기가 필요한 경우",
  ],
  procedures: [
    "등기부·계약서·관련 서류로 사건 구조를 확인합니다.",
    "부동산 소재지·법인 본점에 따라 관할 등기소를 확인합니다.",
    "지금 단계에서 필요한 서류만 구분합니다.",
    "취득세·등록면허세 등 선행 신고가 있으면 일정을 맞춥니다.",
    "등기신청서·위임장을 준비해 관할 등기소 또는 전자등기로 접수합니다.",
    "완료 후 등기사항을 확인하고 후속 절차가 있으면 안내합니다.",
  ],
  documents: [
    "등기부등본(최신)",
    "매매계약서·증여계약서·상속 협의 관련 서류(해당 시)",
    "인감증명서·신분증",
    "가족관계증명서·기본증명서(상속 해당 시)",
    "법인 등기사항전부증명서·정관·의사록(법인 해당 시)",
    "위임장(수임 시)",
  ],
  costGuide:
    "등기 수임료는 등기 종류, 부동산 가액, 상속인 수, 법인 변경 항목 수에 따라 달라집니다. 등록면허세·취득세·인지대·증지대는 별도이며, 사건을 확인한 뒤 법무사 비용과 공과금을 구분해 안내합니다.",
  costFactors: [
    "등기 종류와 권리관계 복잡도",
    "부동산 시가표준액·채권최고액·자본금 규모",
    "상속인·공동명의자 수",
    "근저당·전세권·가압류 정리 필요 여부",
    "전자등기 가능 여부와 보정 발생 여부",
  ],
  lawyerNeededCases: [
    "등기부에 근저당·가압류·전세권이 있어 순서를 정해야 할 때",
    "매매 잔금일과 말소·이전등기를 맞춰야 할 때",
    "상속인 협의·해외 거주 상속인 서류가 필요할 때",
    "법인 정관과 등기부 기재가 달라 변경 항목을 나눠야 할 때",
  ],
  precautions: [
    "관할 등기소가 다르면 접수가 지연될 수 있습니다.",
    "상속포기·한정승인은 상속등기와 별도 기한이 있습니다.",
    "임원변경등기를 미루면 과태료가 문제될 수 있습니다.",
  ],
  faqs: registryHubFaqs,
  relatedServiceLinks: [
    { href: "/부산부동산등기", label: "부산 부동산등기" },
    { href: "/부산상속등기", label: "부산 상속등기" },
    { href: "/부산법인등기", label: "부산 법인등기" },
    { href: "/부산소유권이전등기", label: "부산 소유권이전등기" },
    { href: "/services/real-estate-registration", label: "부동산등기 업무안내" },
    { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
    { href: "/services/corporate-registration", label: "법인등기 업무안내" },
  ],
  relatedFaqLinks: [
    { href: "/faq/ownership-transfer-documents", label: "소유권이전등기 필요서류" },
    { href: "/faq/inheritance-registration-cost", label: "상속등기 비용 안내" },
    { href: "/faq/director-change-deadline-faq", label: "임원변경등기 기한" },
  ],
  relatedCaseLinks: [
    {
      href: "/services/cases/centum-ownership-transfer-case",
      label: "센텀 오피스텔 매매 등기 사례",
    },
    {
      href: "/services/cases/haeundae-inheritance-registration-case",
      label: "해운대 상속등기 사례",
    },
    {
      href: "/services/cases/suyeong-company-establishment-case",
      label: "수영구 법인설립 사례",
    },
  ],
  relatedKeywordLinks: [
    { href: "/부산부동산등기", label: "부산 부동산등기" },
    { href: "/부산상속등기", label: "부산 상속등기" },
    { href: "/부산법인등기", label: "부산 법인등기" },
    { href: "/부산등기법무사추천", label: "등기 법무사 선택 기준" },
    { href: "/부산신축건물보존등기", label: "부산 신축건물 보존등기" },
    { href: "/등기비용", label: "등기비용" },
  ],
  relatedCaseSlug: "centum-ownership-transfer-case",
  caseAngle: "센텀 오피스텔 매매 소유권이전등기",
};
