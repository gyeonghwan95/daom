export const INQUIRY_FIELD_OPTIONS = [
  { value: "inheritance-registration", label: "상속등기" },
  { value: "inheritance-renunciation", label: "상속포기·한정승인" },
  { value: "real-estate-registration", label: "부동산등기" },
  { value: "corporate-registration", label: "법인등기" },
  { value: "business-support", label: "기업 법률실무·등기 지원" },
  { value: "business-debt", label: "기업 미수금·채권서류" },
  { value: "preservation-registration", label: "신축 보존등기" },
  { value: "mortgage", label: "근저당권 설정·말소" },
  { value: "personal-rehabilitation", label: "개인회생·파산" },
  { value: "civil-debt", label: "지급명령·내용증명" },
  { value: "legal-lecture", label: "법률 강의·출강" },
  { value: "other", label: "기타" },
] as const;

export type InquiryFieldValue = (typeof INQUIRY_FIELD_OPTIONS)[number]["value"];

/** 기업·법인 문의 하위 선택 — analytics/이메일 본문용, 개인정보 아님 */
export const CORPORATE_LEGAL_TASK_OPTIONS = [
  { value: "establishment", label: "법인설립" },
  { value: "officer-change", label: "임원변경" },
  { value: "head-office", label: "본점/주소" },
  { value: "charter-purpose", label: "정관/목적" },
  { value: "capital", label: "증자" },
  { value: "dissolution", label: "해산·청산" },
  { value: "corporate-real-estate", label: "법인 부동산" },
  { value: "court-docs", label: "법원서류" },
  { value: "other-corporate", label: "기타" },
] as const;

export type CorporateLegalTaskValue =
  (typeof CORPORATE_LEGAL_TASK_OPTIONS)[number]["value"];

export function getCorporateLegalTaskLabel(value: string): string {
  return (
    CORPORATE_LEGAL_TASK_OPTIONS.find((option) => option.value === value)
      ?.label ?? value
  );
}

export function getInquiryFieldLabel(value: string): string {
  return (
    INQUIRY_FIELD_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}
