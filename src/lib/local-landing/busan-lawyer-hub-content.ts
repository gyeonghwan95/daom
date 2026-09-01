import type { ServiceFaq } from "@/types/service";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeHours, officeLocation } from "@/lib/office-location";
import { defaultContact } from "@/lib/contact";

export type BusanLawyerHubLink = { href: string; label: string };

export type BusanLawyerHubSituation = {
  title: string;
  body: string;
  links: BusanLawyerHubLink[];
};

export type BusanLawyerHubWorkArea = {
  title: string;
  items: string[];
  links: BusanLawyerHubLink[];
};

export type BusanLawyerHubProcess = {
  title: string;
  body: string;
};

export type BusanLawyerHubIntake = {
  title: string;
  items: string[];
};

export type BusanLawyerHubCase = {
  title: string;
  situation: string;
  checked: string;
  next: string;
  href: string;
};

export const BUSAN_LAWYER_HUB_SLUG = "부산법무사" as const;
export const BUSAN_LAWYER_HUB_PATH = "/부산법무사" as const;

export const busanLawyerHubEyebrow = "BUSAN OFFICE";
export const busanLawyerHubReviewedOn = "2026-08-18";
export const busanLawyerHubReviewedLabel = "2026년 8월 18일 확인";

export const busanLawyerHubMetaTitle =
  "부산에서 법무사 찾을 때 확인할 업무·비용·상담 기준 | 다옴법무사사무소";

export const busanLawyerHubH1 =
  "부산에서 법무사를 찾을 때 먼저 확인할 기준";

/** 80–120자. buildMetaDescription이 접미사를 붙이지 않도록 길이를 맞춘다. */
export const busanLawyerHubDescription =
  "부산에서 법무사를 찾을 때 확인할 업무 범위, 비용 항목, 관할·기한, 상담 전 준비사항을 정리합니다. 다옴법무사사무소 안윤정 법무사가 안내합니다.";

export const busanLawyerHubHeroParagraphs = [
  "부산에서 법무사를 고를 때는 사무소 이름보다 지금 필요한 업무, 관할, 기한, 비용 항목부터 가리는 편이 안전합니다. 상속인지 매매등기인지, 법인 변경인지, 개인회생인지에 따라 준비서류와 접수처가 달라집니다.",
  "「부산 법무사」로 사무소·대표를 찾는 검색은 홈(다옴법무사사무소)에서, 이 페이지는 업무·비용·상담 전 확인 기준을 정리합니다. 상담 채널은 부산 법무사 상담, 선택 비교는 부산 법무사 추천 안내를 함께 보시면 됩니다.",
];

export const busanLawyerHubSituations: BusanLawyerHubSituation[] = [
  {
    title: "가족이 돌아가셨습니다",
    body: "부동산 명의, 상속포기, 한정승인 중 무엇이 먼저인지부터 가립니다.",
    links: [
      { href: "/부산상속법무사", label: "상속 절차 선택" },
      { href: "/부산상속등기", label: "상속등기" },
      { href: "/부산상속포기", label: "상속포기" },
      { href: "/부산한정승인", label: "한정승인" },
    ],
  },
  {
    title: "아파트·상가를 사고팔거나 증여합니다",
    body: "잔금일, 근저당 말소, 소유권이전 순서를 맞춰야 합니다.",
    links: [
      { href: "/부산부동산등기", label: "부동산등기" },
      { href: "/부산소유권이전등기", label: "소유권이전" },
      { href: "/부산등기법무사", label: "등기업무 전체" },
    ],
  },
  {
    title: "회사를 만들거나 임원·본점을 바꿉니다",
    body: "정관과 등기부를 보고 기한·과태료부터 확인합니다.",
    links: [
      { href: "/부산법인법무사", label: "법인 법무사" },
      { href: "/부산법인등기", label: "법인등기" },
      { href: "/부산임원변경등기", label: "임원변경" },
    ],
  },
  {
    title: "빚이 쌓여 회생·파산을 고민합니다",
    body: "소득·채무·재산을 보고 신청 가능 절차를 나눕니다.",
    links: [
      { href: "/부산개인회생법무사", label: "개인회생" },
      { href: "/부산개인파산법무사", label: "개인파산" },
      { href: "/개인회생파산", label: "회생·파산 비교" },
    ],
  },
];

export const busanLawyerHubWorkAreas: BusanLawyerHubWorkArea[] = [
  {
    title: "상속",
    items: ["상속등기", "상속포기", "한정승인", "협의분할"],
    links: [
      { href: "/부산상속법무사", label: "부산 상속 법무사" },
      { href: "/부산상속등기", label: "상속등기" },
    ],
  },
  {
    title: "부동산등기",
    items: ["소유권이전", "증여", "근저당", "보존등기", "가등기"],
    links: [
      { href: "/부산등기법무사", label: "부산 등기 법무사" },
      { href: "/부산부동산등기", label: "부동산등기" },
      { href: "/부산가등기", label: "가등기" },
    ],
  },
  {
    title: "법인등기",
    items: ["설립", "임원변경", "본점이전", "목적변경"],
    links: [
      { href: "/부산법인법무사", label: "부산 법인 법무사" },
      { href: "/부산법인등기", label: "법인등기" },
    ],
  },
  {
    title: "개인회생·파산",
    items: ["신청 가능성", "서류", "법원 접수"],
    links: [
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/부산개인파산", label: "부산 개인파산" },
    ],
  },
];

export const busanLawyerHubProcess: BusanLawyerHubProcess[] = [
  {
    title: "지금 상황을 확인합니다",
    body: "상속인지, 매매등기인지, 법인 변경인지, 채무 정리인지에 따라 관할·서류·기한이 달라집니다. 정확한 업무명을 몰라도 현재 사실관계만 말씀해 주시면 됩니다.",
  },
  {
    title: "기한과 관할을 먼저 가립니다",
    body: "상속 승인·포기는 인지일부터 3개월, 임원변경은 결의 후 등기 기한, 매매는 잔금·취득세 일정이 겹칩니다. 부동산·법인 본점 소재지에 따라 등기소와 법원이 달라집니다.",
  },
  {
    title: "지금 필요한 서류만 안내합니다",
    body: "처음부터 긴 목록을 드리지 않습니다. 등기부·가족관계·정관·계약서 중 해당하는 자료만 있으면 1차 순서를 잡을 수 있습니다.",
  },
  {
    title: "법무사가 직접 진행합니다",
    body: `${lawyerProfileMeta.fullTitle}가 상담부터 서류 작성과 접수 준비까지 직접 맡습니다. 방문은 예약 후, 가능한 사건은 전화·카카오톡으로도 이어갑니다.`,
  },
];

export const busanLawyerHubIntake: BusanLawyerHubIntake[] = [
  {
    title: "상속",
    items: ["사망일 또는 인지 시기", "상속인 관계", "부동산 주소", "채무 파악 여부"],
  },
  {
    title: "부동산",
    items: ["부동산 주소", "매매·증여 여부", "잔금일", "대출·근저당 유무"],
  },
  {
    title: "법인",
    items: ["본점 소재지", "설립·임원·본점 중 어떤 변경인지", "결의일"],
  },
  {
    title: "회생·파산",
    items: ["소득 형태", "채무 규모", "재산 유무", "급여압류 여부"],
  },
];

export const busanLawyerHubCases: BusanLawyerHubCase[] = [
  {
    title: "상속·등기 복합 상담",
    situation:
      "해운대 거주 의뢰인이 부모님 아파트 상속과 근저당 정리를 함께 문의하셨습니다.",
    checked: "채무 조사 후 단순승인 가능 여부를 확인했습니다.",
    next: "상속등기와 말소 순서를 잡아 진행했습니다.",
    href: "/services/cases/haeundae-inheritance-registration-case",
  },
  {
    title: "법인 임원변경·과태료 예방",
    situation:
      "센텀 소재 법인이 대표이사 변경 후 등기 기한이 임박해 상담하셨습니다.",
    checked: "의사록·취임승낙서를 점검했습니다.",
    next: "기한 내 접수를 준비했습니다.",
    href: "/services/cases/yeonje-director-change-case",
  },
  {
    title: "매매 잔금일 소유권이전",
    situation:
      "수영구 아파트 매매에서 잔금일과 근저당 말소·이전등기 일정을 맞춰야 했습니다.",
    checked: "등기부와 잔금 일정을 함께 확인했습니다.",
    next: "당일 연속 처리를 준비했습니다.",
    href: "/services/cases/centum-ownership-transfer-case",
  },
];

export const busanLawyerHubFaqs: ServiceFaq[] = [
  {
    question: "법무사와 변호사는 어떻게 다른가요?",
    answer:
      "법무사는 등기·서류 작성·법원·등기소 제출 등 비송·등기 실무를 중심으로 하고, 변호사는 소송·형사 변론 등 대리 범위가 넓습니다. 상속등기·법인등기·부동산등기·개인회생 신청 서류는 법무사 상담이 적합합니다. 사무소·대표를 「부산 법무사」로 찾는 안내는 홈에서 확인하실 수 있습니다.",
  },
  {
    question: "안윤정 법무사가 직접 상담하나요?",
    answer:
      "네. 다옴법무사사무소 대표 안윤정 법무사가 전화·카카오톡·방문(예약) 상담을 직접 진행합니다.",
  },
  {
    question: "해운대·센텀 사무소 위치는 어디인가요?",
    answer: `사무소는 ${officeLocation.fullAddress}입니다. ${officeLocation.subway}이며, 부산 전역 의뢰인을 상담합니다. 방문은 예약 후 이용해 주세요.`,
  },
  {
    question: "부산 법무사 비용은 어디서 보나요?",
    answer:
      "법무사 보수와 등록면허세·취득세·인지대·법원 수수료는 구분해 안내합니다. 항목 안내는 부산 법무사 비용 페이지에서 확인하고, 확정 금액은 사건을 본 뒤 견적합니다.",
  },
  {
    question: "방문 없이 비대면으로 진행할 수 있나요?",
    answer:
      "가능한 사건은 카카오톡·이메일·우편으로 서류를 받아 진행합니다. 상속·회생처럼 초기 판단이 중요한 사건은 상담을 권합니다.",
  },
  {
    question: "상속포기·한정승인 기한은 얼마인가요?",
    answer:
      "상속 개시를 안 날부터 3개월입니다. 기한이 임박하면 등기보다 승인·포기 방식을 먼저 상담하는 것이 안전합니다.",
  },
  {
    question: "주말·저녁에도 상담할 수 있나요?",
    answer:
      "평일 방문은 예약이 원칙입니다. 근무 시간 밖 상담이 필요하면 전화·카카오톡으로 가능 여부를 확인해 주세요. 방문 안내는 부산 법무사 방문상담 페이지를 보시면 됩니다.",
  },
  {
    question: "해운대·센텀에서 가까운 법무사를 찾습니다.",
    answer:
      "사무소는 해운대 센텀에 있습니다. 가까운 위치·주차·지하철은 오시는 길·사무소 안내에서 확인할 수 있습니다. 부산 전역 사건은 같은 사무소에서 상담합니다. 거주지나 부동산이 다른 구여도 되는지는 등기 관할과 사무소 위치 안내에서 확인하시면 됩니다.",
  },
  {
    question: "여성 법무사에게 상담하고 싶습니다.",
    answer:
      "다옴법무사사무소 대표 안윤정 법무사가 직접 상담합니다. 여성 법무사 안내는 부산 여성법무사 페이지를 보시면 됩니다.",
  },
];

export const busanLawyerHubNap = {
  officeName: "다옴법무사사무소",
  representative: lawyerProfileMeta.fullTitle,
  address: officeLocation.fullAddress,
  access: officeLocation.accessSummary,
  hours: officeHours.weekday,
  lunch: officeHours.lunch,
  closed: officeHours.closed,
  phone: defaultContact.phone,
  visit: officeLocation.visitNotice,
} as const;

export const busanLawyerHubInternalLinks: BusanLawyerHubLink[] = [
  { href: "/", label: "부산 법무사 · 다옴법무사사무소" },
  { href: "/부산법무사추천", label: "부산 법무사 추천" },
  { href: "/부산법무사상담", label: "부산 법무사 상담" },
  { href: "/부산등기법무사", label: "부산 등기 법무사" },
  { href: "/부산상속법무사", label: "부산 상속 법무사" },
  { href: "/부산법인법무사", label: "부산 법인 법무사" },
  { href: "/부산부동산등기", label: "부산 부동산등기" },
  { href: "/부산개인회생", label: "부산 개인회생" },
  { href: "/해운대법무사", label: "해운대 법무사" },
  { href: "/센텀법무사", label: "센텀 법무사" },
  { href: "/연제구법무사", label: "연제구 법무사" },
  { href: "/동래구법무사", label: "동래구 법무사" },
  { href: "/사직동법무사", label: "사직동 법무사" },
  { href: "/부산법무사무소", label: "사무소 안내" },
  { href: "/등기관할과사무소위치", label: "등기 관할과 사무소 위치" },
  { href: "/부산법무사비용", label: "비용 안내" },
  { href: "/부산법무사방문상담", label: "방문상담" },
];

export const busanLawyerHubDistrictLinks: BusanLawyerHubLink[] = [
  { href: "/중구법무사", label: "중구 법무사" },
  { href: "/서구법무사", label: "서구 법무사" },
  { href: "/동구법무사", label: "동구 법무사" },
  { href: "/영도구법무사", label: "영도구 법무사" },
  { href: "/부산진구법무사", label: "부산진구 법무사" },
  { href: "/동래구법무사", label: "동래구 법무사" },
  { href: "/남구법무사", label: "남구 법무사" },
  { href: "/북구법무사", label: "북구 법무사" },
  { href: "/해운대법무사", label: "해운대 법무사" },
  { href: "/사하구법무사", label: "사하구 법무사" },
  { href: "/금정구법무사", label: "금정구 법무사" },
  { href: "/강서구법무사", label: "강서구 법무사" },
  { href: "/연제구법무사", label: "연제구 법무사" },
  { href: "/수영구법무사", label: "수영구 법무사" },
  { href: "/사상구법무사", label: "사상구 법무사" },
  { href: "/기장군법무사", label: "기장군 법무사" },
];

export const busanLawyerHubCostGuide =
  "부산 법무사 비용은 업무 종류·부동산 가액·상속인 수·법인 변경 항목·말소 동반 여부에 따라 달라집니다. 법무사 보수와 등록면허세·취득세·인지대·법원 수수료는 구분해 안내합니다. 확정 견적은 상담 후 드립니다.";
