import type {
  EngagementCard,
  EngagementType,
  PartnerCard,
  PartnerType,
  PrepStage,
  ProjectSizeBand,
  ServiceType,
} from "./types";

export const PARTNER_OPTIONS: {
  value: PartnerType;
  label: string;
}[] = [
  { value: "legal-professional", label: "법무사·법무법인·변호사사무실" },
  { value: "broker", label: "공인중개사·부동산중개사무소" },
  { value: "architect", label: "건축사사무소" },
  { value: "developer", label: "시행사·건설사·분양대행사" },
  { value: "company", label: "기업·산업단지" },
  { value: "public", label: "공공기관·공기업" },
  { value: "tax-accounting", label: "세무·회계·노무 등 전문직" },
  { value: "finance-trust", label: "금융·신탁·자산관리" },
  { value: "individual-builder", label: "개인 건축주" },
  { value: "other", label: "기타" },
];

export const SERVICE_OPTIONS: {
  value: ServiceType;
  label: string;
}[] = [
  { value: "delegation", label: "부산 복대리" },
  { value: "receipt-correction", label: "등기 접수·보정 관련" },
  { value: "transfer-collab", label: "매매·잔금 등기 협업" },
  { value: "preservation", label: "신축건물 보존등기" },
  { value: "bulk", label: "집단·대량등기" },
  { value: "corporate", label: "법인등기 반복 업무" },
  { value: "public", label: "공공기관 등기업무" },
  { value: "redevelopment", label: "재개발·재건축 관련" },
  { value: "demolition-change", label: "건물 멸실·표시변경" },
  { value: "quote", label: "견적·제안 요청" },
  { value: "other", label: "기타" },
];

export const SIZE_BAND_OPTIONS: {
  value: ProjectSizeBand;
  label: string;
}[] = [
  { value: "1", label: "1건" },
  { value: "2-5", label: "2~5건" },
  { value: "6-20", label: "6~20건" },
  { value: "21-50", label: "21~50건" },
  { value: "51+", label: "51건 이상" },
  { value: "unknown", label: "아직 미정" },
];

export const PREP_STAGE_OPTIONS: {
  value: PrepStage;
  label: string;
}[] = [
  { value: "exploring", label: "처음 검토 중" },
  { value: "negotiating", label: "계약·협의 진행 중" },
  { value: "documents", label: "서류 준비 중" },
  { value: "use-approved", label: "사용승인 완료" },
  { value: "schedule-set", label: "등기 일정 확정" },
  { value: "urgent", label: "긴급 검토 필요" },
  { value: "unsure", label: "잘 모르겠음" },
];

export const PARTNER_CARDS: PartnerCard[] = [
  {
    id: "legal-professional",
    title: "법무사·법무법인·변호사사무실",
    description:
      "부산 소재 부동산·법인등기와 관할 등기소 관련 현지 업무가 필요한 경우, 업무 범위와 기한을 먼저 확인합니다.",
    href: "/부산법무사복대리",
  },
  {
    id: "broker",
    title: "공인중개사·부동산중개사무소",
    description:
      "잔금일, 매도인·매수인 서류, 근저당 설정·말소 등 거래 이후의 등기 절차를 함께 정리합니다.",
    href: "/부산부동산협력법무사",
  },
  {
    id: "architect",
    title: "건축사사무소",
    description:
      "사용승인과 건축물대장 정리 이후 보존등기로 이어지는 과정에서 필요한 자료와 역할을 확인합니다.",
    href: "/부산건축사등기협업",
  },
  {
    id: "developer",
    title: "시행사·건설사·분양대행사",
    description:
      "신축건물 보존등기, 분양에 따른 소유권이전, 담보권 설정·말소가 연결되는 프로젝트의 범위와 일정을 검토합니다.",
    href: "/부산시행사등기",
  },
  {
    id: "company",
    title: "기업·산업단지",
    description:
      "법인설립, 임원변경, 본점이전, 증자, 부동산 취득·처분 등 반복 등기업무를 일정별로 관리할 수 있습니다.",
    href: "/부산법인등기아웃소싱",
  },
  {
    id: "public",
    title: "공기업·공공기관",
    description:
      "내부 의결, 공문, 촉탁 여부, 법인등기와 부동산등기가 함께 관련된 사안을 검토합니다.",
    href: "/공공기관등기업무",
  },
  {
    id: "tax-accounting",
    title: "세무·회계·노무 등 전문직",
    description:
      "법인변경, 상속·증여, 부동산 거래 과정에서 등기 절차가 필요한 경우 역할을 구분해 협업합니다.",
    href: "/협업문의?partner=tax-accounting",
    inquiryParams: { partner: "tax-accounting" },
  },
  {
    id: "finance-trust",
    title: "신탁·금융·자산관리 업체",
    description:
      "신탁·담보·말소·부동산 권리변동과 관련된 등기는 자료와 권리구조를 먼저 확인합니다.",
    href: "/부산신탁등기",
  },
  {
    id: "other",
    title: "학교법인·비영리기관",
    description:
      "학교법인·비영리법인의 법인·기본재산 등기는 의결·승인 서류를 함께 확인합니다. 개요를 보내주시면 검토 항목부터 안내합니다.",
    href: "/협업문의?partner=public&service=public",
    inquiryParams: { partner: "public", service: "public" },
  },
  {
    id: "individual-builder",
    title: "기타 프로젝트 담당자",
    description:
      "정형화하기 어려운 여러 건의 등기나 부산 현지 업무가 필요한 경우, 개요를 보내주시면 검토할 항목부터 안내합니다.",
    href: "/협업문의?partner=other",
    inquiryParams: { partner: "other" },
  },
];

export const ENGAGEMENT_CARDS: EngagementCard[] = [
  {
    id: "single-delegation",
    title: "한 건의 복대리",
    description: "부산 관할 접수·보정·현지 확인이 필요한 단건",
    href: "/부산부동산등기복대리",
  },
  {
    id: "recurring",
    title: "반복 협업",
    description: "연락 창구와 자료 형식을 맞춰 두고 싶은 경우",
    href: "/부산법인등기아웃소싱",
  },
  {
    id: "urgent",
    title: "긴급 일정 확인",
    description: "접수일·잔금일·보정 기한이 촉박한 경우",
    href: "/협업문의?type=urgent",
  },
  {
    id: "bulk-project",
    title: "대량·집단등기",
    description: "여러 호실·필지·세대를 일정에 맞춰 관리",
    href: "/부산시행사등기",
  },
  {
    id: "quote",
    title: "프로젝트 견적 요청",
    description: "건수·권리구조·일정을 확인한 뒤 범위 안내",
    href: "/협업문의?type=quote",
  },
  {
    id: "local-support",
    title: "부산 현지 확인",
    description: "원거리 의뢰에서 현지 확인·전달이 필요한 경우",
    href: "/부산원거리등기협업",
  },
  {
    id: "corporate-recurring",
    title: "기업 반복 등기업무",
    description: "임원·본점·증자 등 변경등기를 일정별로 관리",
    href: "/부산법인등기아웃소싱",
  },
  {
    id: "public-bid",
    title: "공공기관·입찰 관련 문의",
    description: "견적·용역·공문 검토에 필요한 기본정보 정리",
    href: "/협업문의?partner=public&service=public",
  },
  {
    id: "preservation",
    title: "신축건물 보존등기",
    description: "사용승인 이후 보존등기 준비·역할 확인",
    href: "/부산건축사등기협업",
  },
  {
    id: "multi-unit",
    title: "여러 필지·호실 등기",
    description: "목록·일정·후속 이전·설정 연결 여부 검토",
    href: "/부산분양등기",
  },
  {
    id: "special-review",
    title: "특수 등기 검토",
    description: "멸실·표시변경·분할·합병 등 사전 확인",
    href: "/협업문의?service=demolition-change",
  },
];

export const COLLABORATION_PRINCIPLES = [
  {
    title: "업무 범위부터 확인",
    description: "가능한 업무와 사전 확인이 필요한 업무를 먼저 구분합니다.",
  },
  {
    title: "역할과 책임 구분",
    description:
      "의뢰 측·현지 사무소·중개·건축·시행·기관 담당자의 역할을 사전에 나눕니다.",
  },
  {
    title: "기한과 주요 일정 확인",
    description:
      "접수일·잔금일·사용승인일·보정 기한 등 일정에 영향을 주는 항목을 확인합니다.",
  },
  {
    title: "자료 전달 방식 협의",
    description:
      "초기에는 민감 원본을 요구하지 않고, 필요 자료와 안전한 전달 방법을 별도로 안내합니다.",
  },
  {
    title: "접수·보정·완료 단계 공유",
    description: "주요 단계가 바뀌면 합의된 연락 창구로 진행상황을 공유합니다.",
  },
  {
    title: "민감정보 최소 수집",
    description:
      "문의·검토 단계에서는 필요한 범위의 정보만 받고, 원본 서류는 신청 단계에서 안내합니다.",
  },
  {
    title: "자료 확인 후 견적 안내",
    description:
      "건수, 권리관계, 일정, 서류 상태, 후속 등기 여부를 확인한 뒤 견적 범위를 안내합니다.",
  },
  {
    title: "법무사가 직접 주요 내용 확인",
    description: "안윤정 법무사가 상담·진행의 주요 내용을 직접 확인합니다.",
  },
] as const;

export const PROJECT_PROCESS_STEPS = [
  {
    step: 1,
    title: "업무 개요 전달",
    description: "업무 종류, 소재지, 예상 건수, 희망 일정을 알려 주세요.",
  },
  {
    step: 2,
    title: "대상·건수·일정 확인",
    description: "권리 구조와 마감 일정을 기준으로 검토 항목을 정리합니다.",
  },
  {
    step: 3,
    title: "자료와 역할 분담",
    description: "누가 어떤 서류를 준비할지, 연락 창구를 정합니다.",
  },
  {
    step: 4,
    title: "견적·진행 방식 협의",
    description: "가능 범위와 진행 방식을 확인한 뒤 일정을 맞춥니다.",
  },
  {
    step: 5,
    title: "신청·보정·진행 공유",
    description: "접수·보정·변경사항을 합의된 방식으로 공유합니다.",
  },
  {
    step: 6,
    title: "완료 확인·결과 전달",
    description: "완료 기준과 결과물 전달 방식을 맞춰 마무리합니다.",
  },
] as const;

export const VERIFIED_TRUST_ITEMS = [
  {
    label: "법무사 직접 상담·진행",
    detail: "안윤정 법무사가 내용을 확인하고 진행합니다.",
  },
  {
    label: "공인중개사 자격",
    detail: "부동산 거래 흐름을 이해한 상태에서 등기 절차를 안내합니다.",
  },
  {
    label: "기업·공공기관 협력 활동",
    detail: "기관·교육·정책 자문 등 문서 중심 소통 경험이 있습니다.",
  },
  {
    label: "부산 해운대구·센텀 사무소",
    detail: "부산 현지 사무소에서 업무를 진행합니다.",
  },
] as const;

export const B2B_PATHS = [
  "/partners",
  "/부산법무사복대리",
  "/부산부동산협력법무사",
  "/부산집단등기",
  "/협업문의",
  "/부산부동산등기복대리",
  "/부산법인등기복대리",
  "/부산등기접수협업",
  "/부산등기보정업무",
  "/부산등기소현지업무",
  "/부산원거리등기협업",
  "/부산잔금등기협업",
  "/부산건축사등기협업",
  "/부산시행사등기",
  "/부산건설사등기",
  "/부산분양등기",
  "/부산법인등기아웃소싱",
] as const;

export function isB2BPath(pathname: string): boolean {
  const path = pathname.split("?")[0].split("#")[0];
  return (B2B_PATHS as readonly string[]).includes(path);
}

export function buildInquiryHref(
  params: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const q = search.toString();
  return q ? `/협업문의?${q}` : "/협업문의";
}

export function partnerLabel(value: PartnerType | ""): string {
  return PARTNER_OPTIONS.find((o) => o.value === value)?.label ?? "";
}

export function serviceLabel(value: ServiceType | ""): string {
  return SERVICE_OPTIONS.find((o) => o.value === value)?.label ?? "";
}

export function engagementLabel(value: EngagementType | ""): string {
  return ENGAGEMENT_CARDS.find((o) => o.id === value)?.title ?? "";
}
