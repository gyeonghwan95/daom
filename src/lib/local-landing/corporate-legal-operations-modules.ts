/**
 * `/부산법인법무사` — 기업·법인 법무 인접 Intent 모듈
 * title / H1 / meta / canonical 불변. 본문 앞단(첫 문단)에 병합하지 않음.
 * 2026-08-10 extra modules(corporate-champion-modules.ts)와 별도. 재적용 금지.
 */
import { contactInquiryHref } from "@/lib/consultation-inquiry";

export const CORPORATE_LEGAL_OPERATIONS_SLUG = "부산법인법무사";

export const corporateLegalInquiryHref = contactInquiryHref({
  field: "corporate-registration",
  from: CORPORATE_LEGAL_OPERATIONS_SLUG,
  intent: "회사 변경사항 확인",
  cluster: "corporate-legal",
});

export const corporateLegalHeroCta = "회사 변경사항 문의";
export const corporateLegalDocsCta = "법인 업무 준비서류 확인";

export type CorporateLegalCard = {
  title: string;
  description: string;
  href: string;
  task: string;
};

/** Broad Champion 안 6개 영역 — 별도 URL 없음 */
export const corporateSixAreaNav: CorporateLegalCard[] = [
  {
    title: "회사를 만들 때",
    description: "상호·목적·본점·임원·자본금을 정한 뒤 설립등기로 이어집니다.",
    href: "/부산법인설립등기",
    task: "설립",
  },
  {
    title: "운영 중 변경이 생겼을 때",
    description: "대표·임원·주소·목적·상호가 바뀌면 변경등기 여부를 확인합니다.",
    href: "/법인변경등기",
    task: "변경등기",
  },
  {
    title: "정관·주주총회·이사회 서류",
    description: "결의·의사록이 등기 첨부자료가 되는 경우가 많습니다. 공증은 공증인 업무입니다.",
    href: "/법인정관업무",
    task: "정관·결의",
  },
  {
    title: "자본금·주식 관련 변경",
    description: "투자·신주·납입 이후 증자등기로 연결되는 부분만 안내합니다.",
    href: "/부산유상증자등기",
    task: "증자",
  },
  {
    title: "회사 명의 부동산",
    description: "취득·이전·근저당. 부동산 전체 절차는 부동산 안내에서 이어집니다.",
    href: "/부산부동산등기",
    task: "부동산등기",
  },
  {
    title: "종료하거나 법원서류가 필요할 때",
    description: "폐업과 해산·청산은 다릅니다. 미수금은 지급명령 등 신청서류 범위입니다.",
    href: "/부산법인해산청산등기",
    task: "해산·법원서류",
  },
];

/** ① 회사에 이런 변화가 생겼다면 */
export const corporateChangeSituationCards: CorporateLegalCard[] = [
  {
    title: "대표가 바뀌었다",
    description: "대표권·인감·은행 권한이 바뀌면 등기부 반영 여부를 먼저 봅니다.",
    href: "/부산대표이사변경등기",
    task: "대표이사 변경등기",
  },
  {
    title: "이사가 그만뒀다",
    description: "사임·퇴임 후에도 등기부에 남아 있으면 대외 표시가 어긋날 수 있습니다.",
    href: "/부산임원변경등기",
    task: "임원변경등기",
  },
  {
    title: "임원의 임기가 끝났다",
    description: "중임·퇴임 결의와 등기 기한을 같이 확인합니다. 방치하면 과태료 위험이 있습니다.",
    href: "/부산임원임기만료등기",
    task: "임기만료·중임등기",
  },
  {
    title: "회사를 이전한다",
    description: "본점 주소가 바뀌면 등기와 사업자등록·계약 주소를 맞출 필요가 있습니다.",
    href: "/부산본점이전등기",
    task: "본점이전등기",
  },
  {
    title: "사업을 추가한다",
    description: "등기된 목적에 없는 업종이면 목적변경 등기 검토가 필요합니다.",
    href: "/부산사업목적변경등기",
    task: "목적변경등기",
  },
  {
    title: "회사 이름을 변경한다",
    description: "상호 변경 후 은행·거래처 표시도 함께 정리하는 경우가 많습니다.",
    href: "/부산법인등기",
    task: "상호변경등기",
  },
  {
    title: "투자를 받는다",
    description: "신주·납입·등기 순서를 맞춥니다. 투자계약 자체 대리는 범위 밖입니다.",
    href: "/부산유상증자등기",
    task: "유상증자등기",
  },
  {
    title: "회사를 정리한다",
    description: "세무 폐업과 해산·청산등기는 다릅니다. 법인이 남아 있는지부터 봅니다.",
    href: "/부산법인해산청산등기",
    task: "해산·청산등기",
  },
];

export type CorporateStageColumn = {
  stage: string;
  items: { label: string; href: string }[];
};

export const corporateGrowthStageMap: CorporateStageColumn[] = [
  {
    stage: "설립",
    items: [
      { label: "법인설립", href: "/부산법인설립등기" },
      { label: "정관", href: "/법인정관업무" },
      { label: "임원·자본금", href: "/부산법인설립등기" },
    ],
  },
  {
    stage: "운영",
    items: [
      { label: "임원변경", href: "/부산임원변경등기" },
      { label: "본점이전", href: "/부산본점이전등기" },
      { label: "목적·상호", href: "/부산사업목적변경등기" },
    ],
  },
  {
    stage: "성장",
    items: [
      { label: "증자", href: "/부산유상증자등기" },
      { label: "법인 부동산", href: "/부산부동산등기" },
      { label: "정기점검", href: "/부산법인정기점검" },
    ],
  },
  {
    stage: "정리",
    items: [
      { label: "해산·청산", href: "/부산법인해산청산등기" },
      { label: "해산 전 확인", href: "/부산법인해산전확인사항" },
      { label: "과태료", href: "/부산법인등기과태료" },
    ],
  },
];

export const corporateChangeChecklist: { item: string; href: string }[] = [
  { item: "대표·임원 변경 여부", href: "/부산임원변경등기" },
  { item: "본점·지점 주소", href: "/부산본점이전등기" },
  { item: "사업목적·상호", href: "/부산사업목적변경등기" },
  { item: "자본금·주식 변동", href: "/부산유상증자등기" },
  { item: "정관과 등기부 불일치", href: "/법인정관변경" },
  { item: "해산·청산 필요 여부", href: "/부산법인해산전확인사항" },
];

export const corporateScopeRows: {
  area: string;
  level: "DIRECT" | "RELATED" | "OUT_OF_SCOPE";
  note: string;
  href?: string;
}[] = [
  {
    area: "법인등기·변경등기",
    level: "DIRECT",
    note: "설립, 임원, 본점, 목적, 증자, 해산 등 등기 신청",
    href: "/부산법인등기",
  },
  {
    area: "등기 관련 서류",
    level: "DIRECT",
    note: "신청서·첨부서류 작성, 결의·기한 확인",
    href: "/법인변경등기",
  },
  {
    area: "회사 명의 부동산등기",
    level: "DIRECT",
    note: "취득·이전·근저당. 절차 복제는 부동산 안내에서",
    href: "/부산부동산등기",
  },
  {
    area: "법원 제출서류",
    level: "DIRECT",
    note: "지급명령·공탁 등 신청서류. 회수 대행·소송대리는 아님",
    href: "/부산기업채권관리",
  },
  {
    area: "정관·의사록 공증",
    level: "RELATED",
    note: "필요 여부·등기 전후 안내. 공증 자체는 공증인 업무",
    href: "/법인공증준비",
  },
  {
    area: "주주·경영권 분쟁, 소송대리",
    level: "OUT_OF_SCOPE",
    note: "별도 전문가 영역. 이 사이트에서 Target하지 않음",
  },
];

export const corporateLegalExtraFaqs: { question: string; answer: string }[] = [
  {
    question: "사업자등록 변경과 법인등기는 같은 절차인가요?",
    answer:
      "아닙니다. 법인등기는 등기소에 신청하는 상업등기이고, 사업자등록 정정은 세무 행정입니다. 본점·대표가 바뀌면 둘 다 필요할 수 있어 순서를 같이 확인합니다.",
  },
  {
    question: "정관을 변경하면 항상 등기가 필요한가요?",
    answer:
      "정관 조항 중 등기사항(상호·목적·임원·자본금 등)이 바뀌면 등기를 검토합니다. 내부 규정만 고치는 경우는 등기 대상이 아닐 수 있습니다. 공증이 필요한지는 별도로 확인합니다.",
  },
  {
    question: "퇴사한 이사가 등기부에 남아 있으면 어떻게 하나요?",
    answer:
      "사임·퇴임 사실이 있어도 등기가 없으면 등기부상 임원으로 남습니다. 사임서·결의 자료를 맞춰 임원변경등기를 진행합니다. 세부 서류는 임원변경 안내를 보세요.",
  },
  {
    question: "회사 명의로 부동산을 사면 어떤 등기가 필요한가요?",
    answer:
      "소유권이전등기가 기본이고, 대출이 있으면 근저당 설정을 함께 봅니다. 법인 인감·등기사항증명서가 맞아야 합니다. 부동산 절차 상세는 부산 부동산등기 안내로 이어집니다.",
  },
  {
    question: "회사 법무를 외주하면 모든 법률문제를 맡기나요?",
    answer:
      "그렇지 않습니다. 다옴법무사사무소는 등기·법원서류 등 법무사 업무를 사건별로 지원합니다. 상시 고문·소송대리·세무·노무는 범위가 아닙니다.",
  },
  {
    question: "미수금을 법무사가 받아 주나요?",
    answer:
      "채권 회수 대행이나 협상 대리는 하지 않습니다. 내용증명·지급명령 등 신청서류 작성을 지원할 수 있습니다. 다툼이 커지면 별도 전문가 검토가 필요합니다.",
  },
];
