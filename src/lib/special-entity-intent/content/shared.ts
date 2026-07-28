export const SPECIAL_ENTITY_OFFICE_LINE =
  "다옴법무사사무소 안윤정 법무사 · 부산 해운대·센텀";

export const SPECIAL_ENTITY_SCOPE_NOTICE =
  "법무사는 법인설립등기·변경등기·해산·청산 등기 신청, 등기서류 작성·검토, 접수 대리 등 등기 관련 업무를 지원합니다. 주무관청 허가·인가·인증 신청, 세무·노무·소송대리, 경영·운영 자문은 별도 전문 영역이며 사안별로 지원 범위를 확인합니다. 허가·인가를 보장하거나 설립 전 과정을 모두 대행한다고 안내하지 않습니다.";

export const SPECIAL_ENTITY_HUB_LINKS = {
  master: { href: "/특수비영리법인등기", label: "특수·비영리법인 종합 허브" },
  nonprofit: { href: "/부산비영리법인설립등기", label: "부산 비영리법인 설립등기" },
  association: { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
  foundation: { href: "/부산재단법인설립", label: "부산 재단법인 설립" },
  special: { href: "/부산특수법인등기", label: "부산 특수법인 등기" },
  cooperative: { href: "/부산조합협동조합등기", label: "부산 조합·협동조합 등기" },
  change: { href: "/부산비영리법인변경등기", label: "비영리법인 변경등기" },
  specialLaw: { href: "/특별법법인설립등기", label: "특별법 법인 설립" },
  professional: { href: "/전문직법인등기", label: "전문직 법인 등기" },
  agriculture: { href: "/농어업법인설립등기", label: "농·어업 법인" },
  permitThenRegistry: {
    href: "/주무관청허가후설립등기",
    label: "주무관청 허가 후 설립등기",
  },
  compareAssociationFoundation: {
    href: "/사단법인과재단법인차이",
    label: "사단법인과 재단법인 차이",
  },
  compareNgoAssociation: {
    href: "/비영리민간단체와사단법인차이",
    label: "비영리민간단체와 사단법인 차이",
  },
  corporatePillar: { href: "/법인등기", label: "법인등기 업무 허브" },
  corporateChange: { href: "/법인변경등기", label: "주식회사 변경등기 허브" },
  corporateMain: { href: "/부산법인법무사", label: "부산 법인 법무사" },
  contact: { href: "/contact", label: "법인등기 상담 문의" },
} as const;

export const baseSpecialRelated = [
  SPECIAL_ENTITY_HUB_LINKS.master,
  SPECIAL_ENTITY_HUB_LINKS.nonprofit,
  SPECIAL_ENTITY_HUB_LINKS.corporatePillar,
  SPECIAL_ENTITY_HUB_LINKS.contact,
];
