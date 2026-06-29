import type { PageRelatedLink } from "@/lib/pageData/types";

export const D = {
  inheritanceReg: { href: "/상속등기자가진단", label: "상속등기 자가진단" },
  renunciation: { href: "/상속포기자가진단", label: "상속포기 자가진단" },
  qualified: { href: "/한정승인자가진단", label: "한정승인 자가진단" },
  realEstate: { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
  ownership: { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
  jeonse: { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
  leaseOrder: { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
  paymentOrder: { href: "/지급명령자가진단", label: "지급명령 자가진단" },
  certified: { href: "/내용증명자가진단", label: "내용증명 자가진단" },
  corporate: { href: "/법인등기자가진단", label: "법인등기 자가진단" },
  director: { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
  company: { href: "/법인설립자가진단", label: "법인설립 자가진단" },
  rehab: { href: "/개인회생자가진단", label: "개인회생 자가진단" },
  bankruptcy: { href: "/개인파산자가진단", label: "개인파산 자가진단" },
} as const satisfies Record<string, PageRelatedLink>;

export const S = {
  inheritanceReg: { href: "/services/inheritance-registration", label: "상속등기 안내" },
  renunciation: { href: "/services/inheritance-renunciation", label: "상속포기 안내" },
  qualified: { href: "/services/qualified-acceptance", label: "한정승인 안내" },
  realEstate: { href: "/services/real-estate-registration", label: "부동산등기 안내" },
  ownership: { href: "/services/ownership-transfer", label: "소유권이전등기 안내" },
  corporate: { href: "/services/corporate-registration", label: "법인등기 안내" },
  company: { href: "/services/company-establishment", label: "법인설립등기 안내" },
  director: { href: "/services/director-change", label: "임원변경등기 안내" },
  rehab: { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
  bankruptcy: { href: "/services/bankruptcy", label: "개인파산 안내" },
  inheritanceHub: { href: "/상속", label: "상속 허브" },
  civilHub: { href: "/민사소송", label: "민사·채권 허브" },
  leaseHub: { href: "/임대차전세", label: "임대차·전세 허브" },
  rehabHub: { href: "/개인회생파산", label: "개인회생·파산 허브" },
  corpHub: { href: "/법인등기", label: "법인등기 허브" },
} as const satisfies Record<string, PageRelatedLink>;

export const F = {
  inheritanceWhen: { href: "/faq/when-to-file-inheritance-registration", label: "상속등기 시기 FAQ" },
  inheritanceCost: { href: "/faq/inheritance-registration-cost", label: "상속등기 비용 FAQ" },
  renunciationDeadline: { href: "/faq/inheritance-renunciation-deadline", label: "상속포기 기한 FAQ" },
  qualifiedVs: { href: "/faq/qualified-acceptance-vs-simple-acceptance", label: "한정승인 vs 단순승인" },
  qualifiedProc: { href: "/faq/qualified-acceptance-procedure", label: "한정승인 절차 FAQ" },
  ownershipDocs: { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류 FAQ" },
  mortgage: { href: "/faq/inheritance-registration-with-mortgage", label: "근저당 있는 상속등기" },
  jeonse: { href: "/faq/jeonse-registration-faq", label: "전세·임대차 FAQ" },
  directorDeadline: { href: "/faq/director-change-deadline-faq", label: "임원변경 기한 FAQ" },
  rehabElig: { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 요건 FAQ" },
  rehabDocs: { href: "/faq/personal-rehabilitation-documents-faq", label: "개인회생 서류 FAQ" },
  bankruptcyVs: { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "파산 vs 회생 FAQ" },
  companyDocs: { href: "/faq/company-establishment-documents-faq", label: "법인설립 서류 FAQ" },
  corpAddress: { href: "/faq/corporate-address-change-faq", label: "법인 주소 변경 FAQ" },
} as const satisfies Record<string, PageRelatedLink>;

export const C = {
  haeundaeInheritance: {
    href: "/services/cases/haeundae-inheritance-registration-case",
    label: "해운대 상속등기 사례",
  },
  renunciation: {
    href: "/services/cases/jaesong-inheritance-renunciation-consultation",
    label: "상속포기 상담 사례",
  },
  qualified: {
    href: "/services/cases/dongnae-qualified-acceptance-consultation",
    label: "한정승인 상담 사례",
  },
  ownership: {
    href: "/services/cases/centum-ownership-transfer-case",
    label: "소유권이전등기 사례",
  },
  director: {
    href: "/services/cases/yeonje-director-change-case",
    label: "임원변경등기 사례",
  },
  company: {
    href: "/services/cases/suyeong-company-establishment-case",
    label: "법인설립등기 사례",
  },
  rehab: {
    href: "/services/cases/busan-personal-rehabilitation-consultation",
    label: "개인회생 상담 사례",
  },
  gijang: {
    href: "/services/cases/gijang-land-inheritance-case",
    label: "기장 토지 상속 사례",
  },
} as const satisfies Record<string, PageRelatedLink>;
