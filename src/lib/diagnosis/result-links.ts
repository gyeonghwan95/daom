import type { Diagnosis } from "@/data/diagnosis";
import type { PageRelatedLink } from "@/lib/pageData/types";

type DiagnosisResultLinkPack = {
  service?: PageRelatedLink;
  cost?: PageRelatedLink;
  documents?: PageRelatedLink;
  faq?: PageRelatedLink;
};

const RESULT_LINK_PACKS: Record<string, DiagnosisResultLinkPack> = {
  상속등기자가진단: {
    service: { href: "/services/inheritance-registration", label: "상속등기 업무 안내" },
    cost: { href: "/상속등기비용", label: "상속등기 비용" },
    documents: { href: "/상속등기필요서류", label: "상속등기 필요서류" },
    faq: { href: "/faq/inheritance-registration-cost", label: "상속등기 비용 FAQ" },
  },
  상속포기자가진단: {
    service: { href: "/services/inheritance-renunciation", label: "상속포기 업무 안내" },
    cost: { href: "/상속등기비용", label: "상속 관련 비용" },
    documents: { href: "/상속등기필요서류", label: "상속 관련 필요서류" },
    faq: { href: "/faq/inheritance-renunciation-family-effect", label: "상속포기 FAQ" },
  },
  한정승인자가진단: {
    service: { href: "/services/qualified-acceptance", label: "한정승인 업무 안내" },
    cost: { href: "/상속등기비용", label: "상속 관련 비용" },
    documents: { href: "/상속등기필요서류", label: "한정승인 필요서류" },
    faq: { href: "/faq/qualified-acceptance-vs-simple-acceptance", label: "한정승인 FAQ" },
  },
  법인등기자가진단: {
    service: { href: "/services/corporate-registration", label: "법인등기 업무 안내" },
    cost: { href: "/법인설립등기비용", label: "법인등기 비용" },
    documents: { href: "/faq/company-establishment-documents-faq", label: "법인등기 필요서류" },
    faq: { href: "/faq/corporate-address-change-faq", label: "법인등기 FAQ" },
  },
  임원변경등기자가진단: {
    service: { href: "/services/director-change", label: "임원변경등기 업무 안내" },
    cost: { href: "/임원변경등기과태료", label: "임원변경등기 과태료·비용" },
    documents: { href: "/faq/company-establishment-documents-faq", label: "임원변경 필요서류" },
    faq: { href: "/faq/director-change-deadline-faq", label: "임원변경등기 FAQ" },
  },
  법인설립자가진단: {
    service: { href: "/services/company-establishment", label: "법인설립 업무 안내" },
    cost: { href: "/법인설립등기비용", label: "법인설립등기 비용" },
    documents: { href: "/faq/company-establishment-documents-faq", label: "법인설립 필요서류" },
    faq: { href: "/faq/company-establishment-documents-faq", label: "법인설립 FAQ" },
  },
  부동산등기자가진단: {
    service: { href: "/services/real-estate-registration", label: "부동산등기 업무 안내" },
    cost: { href: "/부산법무사비용", label: "부동산등기 비용" },
    documents: { href: "/소유권이전등기서류", label: "부동산등기 필요서류" },
    faq: { href: "/faq/ownership-transfer-documents", label: "부동산등기 FAQ" },
  },
  소유권이전등기자가진단: {
    service: { href: "/services/ownership-transfer", label: "소유권이전등기 업무 안내" },
    cost: { href: "/부산법무사비용", label: "소유권이전등기 비용" },
    documents: { href: "/소유권이전등기서류", label: "소유권이전등기 필요서류" },
    faq: { href: "/faq/ownership-transfer-documents", label: "소유권이전등기 FAQ" },
  },
  개인회생자가진단: {
    service: { href: "/services/personal-rehabilitation", label: "개인회생 업무 안내" },
    cost: { href: "/부산법무사비용", label: "개인회생 비용" },
    documents: { href: "/faq/personal-rehabilitation-documents-faq", label: "개인회생 필요서류" },
    faq: { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 FAQ" },
  },
  개인파산자가진단: {
    service: { href: "/services/bankruptcy", label: "개인파산 업무 안내" },
    cost: { href: "/부산법무사비용", label: "개인파산 비용" },
    documents: { href: "/faq/personal-rehabilitation-documents-faq", label: "개인파산 필요서류" },
    faq: { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "개인파산 FAQ" },
  },
  전세보증금자가진단: {
    service: { href: "/services/real-estate-registration", label: "전세·임대차 업무 안내" },
    cost: { href: "/부산법무사비용", label: "전세보증금 반환 비용" },
    documents: { href: "/faq/jeonse-registration-faq", label: "전세보증금 필요서류" },
    faq: { href: "/faq/jeonse-registration-faq", label: "전세보증금 FAQ" },
  },
  임차권등기명령자가진단: {
    service: { href: "/services/real-estate-registration", label: "임차권등기명령 업무 안내" },
    cost: { href: "/부산법무사비용", label: "임차권등기명령 비용" },
    documents: { href: "/faq/jeonse-registration-faq", label: "임차권등기명령 필요서류" },
    faq: { href: "/faq/jeonse-registration-faq", label: "임차권등기명령 FAQ" },
  },
  지급명령자가진단: {
    service: { href: "/contact", label: "지급명령·채권회수 상담" },
    cost: { href: "/부산법무사비용", label: "지급명령 비용" },
    documents: { href: "/contact", label: "지급명령 필요서류 상담" },
    faq: { href: "/faq", label: "채권회수 FAQ" },
  },
  내용증명자가진단: {
    service: { href: "/contact", label: "내용증명·채권회수 상담" },
    cost: { href: "/부산법무사비용", label: "내용증명 비용" },
    documents: { href: "/contact", label: "내용증명 필요서류 상담" },
    faq: { href: "/faq", label: "내용증명 FAQ" },
  },
  공탁자가진단: {
    service: { href: "/contact", label: "공탁 업무 상담" },
    cost: { href: "/부산법무사비용", label: "공탁 비용" },
    documents: { href: "/contact", label: "공탁 필요서류 상담" },
    faq: { href: "/faq", label: "공탁 FAQ" },
  },
  성년후견자가진단: {
    service: { href: "/contact", label: "성년후견 업무 상담" },
    cost: { href: "/부산법무사비용", label: "성년후견 비용" },
    documents: { href: "/contact", label: "성년후견 필요서류 상담" },
    faq: { href: "/faq", label: "성년후견 FAQ" },
  },
  특별대리인자가진단: {
    service: { href: "/contact", label: "특별대리인 업무 상담" },
    cost: { href: "/부산법무사비용", label: "특별대리인 비용" },
    documents: { href: "/contact", label: "특별대리인 필요서류 상담" },
    faq: { href: "/faq", label: "특별대리인 FAQ" },
  },
  선박등기자가진단: {
    service: { href: "/contact", label: "선박등기 업무 상담" },
    cost: { href: "/부산법무사비용", label: "선박등기 비용" },
    documents: { href: "/contact", label: "선박등기 필요서류 상담" },
    faq: { href: "/faq", label: "선박등기 FAQ" },
  },
};

function fallbackFromServiceSlug(diagnosis: Diagnosis): DiagnosisResultLinkPack {
  if (!diagnosis.serviceSlug) {
    return {};
  }
  return {
    service: {
      href: `/services/${diagnosis.serviceSlug}`,
      label: `${diagnosis.serviceName} 업무 안내`,
    },
  };
}

export function getDiagnosisResultLinks(diagnosis: Diagnosis): PageRelatedLink[] {
  const pack =
    RESULT_LINK_PACKS[diagnosis.slug] ?? fallbackFromServiceSlug(diagnosis);

  const links: PageRelatedLink[] = [];

  if (pack.service) links.push(pack.service);
  if (pack.cost) links.push(pack.cost);
  if (pack.documents) links.push(pack.documents);
  if (pack.faq) links.push(pack.faq);
  links.push({ href: "/contact", label: "상담 문의" });

  return links;
}

/** 업무안내·FAQ 등에 노출할 대표 자가진단 링크 */
export function getFeaturedDiagnosisLinks(): PageRelatedLink[] {
  return [
    { href: "/자가진단", label: "업무별 자가진단 모음" },
    { href: "/상속등기자가진단", label: "상속등기 자가진단" },
    { href: "/상속포기자가진단", label: "상속포기 자가진단" },
    { href: "/법인등기자가진단", label: "법인등기 자가진단" },
    { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
    { href: "/개인회생자가진단", label: "개인회생 자가진단" },
    { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
  ];
}
