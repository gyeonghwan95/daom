export const consultationCopy = {
  default:
    "등기와 법률 절차는 상황에 따라 필요한 서류와 순서가 달라질 수 있습니다. 다옴법무사사무소 안윤정 법무사가 현재 상황을 차분히 확인해 드리겠습니다.",
  contact:
    "전화, 카카오톡, 네이버 톡톡 중 편한 방법으로 연락해 주세요. 사무소 방문은 예약 후 이용해 주시며, 개인정보는 사이트에 저장되지 않습니다.",
  inline:
    "절차나 서류가 막막하시면 편하게 문의해 주세요. 다옴법무사사무소 안윤정 법무사가 확인해 드립니다.",
  inquiryNotice:
    "사무소 방문 예약은 네이버 예약으로 신청하실 수 있습니다. 사이트에는 개인정보를 저장하지 않습니다.",
  feeNotice:
    "※ 자세한 사건 검토 및 법률 자문은 별도 비용이 발생할 수 있으며, 필요 시 상담 중 안내드립니다.",
} as const;

export type InquiryFormProvider = "google" | "tally" | "naver";

export type InquiryFormLink = {
  provider: InquiryFormProvider;
  label: string;
  url: string;
};

const INQUIRY_FORM_LABELS: Record<InquiryFormProvider, string> = {
  google: "Google Forms 문의",
  tally: "Tally 문의",
  naver: "네이버폼 문의",
};

export function getInquiryForms(): InquiryFormLink[] {
  const forms: InquiryFormLink[] = [];

  const google = process.env.NEXT_PUBLIC_INQUIRY_FORM_GOOGLE?.trim();
  const tally = process.env.NEXT_PUBLIC_INQUIRY_FORM_TALLY?.trim();
  const naver = process.env.NEXT_PUBLIC_INQUIRY_FORM_NAVER?.trim();

  if (google) {
    forms.push({ provider: "google", label: INQUIRY_FORM_LABELS.google, url: google });
  }
  if (tally) {
    forms.push({ provider: "tally", label: INQUIRY_FORM_LABELS.tally, url: tally });
  }
  if (naver) {
    forms.push({ provider: "naver", label: INQUIRY_FORM_LABELS.naver, url: naver });
  }

  const legacy = process.env.NEXT_PUBLIC_INQUIRY_FORM_URL?.trim();
  if (legacy && forms.length === 0) {
    forms.push({ provider: "google", label: "온라인 문의", url: legacy });
  }

  return forms;
}

export function getPrimaryInquiryForm(): InquiryFormLink | null {
  const forms = getInquiryForms();
  if (forms.length === 0) return null;

  const primary = process.env.NEXT_PUBLIC_INQUIRY_FORM_PRIMARY?.trim() as
    | InquiryFormProvider
    | undefined;

  if (primary) {
    const match = forms.find((form) => form.provider === primary);
    if (match) return match;
  }

  return forms[0];
}
