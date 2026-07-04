export const INQUIRY_FIELD_OPTIONS = [
  { value: "inheritance-registration", label: "상속등기" },
  { value: "inheritance-renunciation", label: "상속포기·한정승인" },
  { value: "real-estate-registration", label: "부동산등기" },
  { value: "corporate-registration", label: "법인등기" },
  { value: "preservation-registration", label: "신축 보존등기" },
  { value: "mortgage", label: "근저당권 설정·말소" },
  { value: "personal-rehabilitation", label: "개인회생·파산" },
  { value: "civil-debt", label: "지급명령·내용증명" },
  { value: "other", label: "기타" },
] as const;

export type InquiryFieldValue = (typeof INQUIRY_FIELD_OPTIONS)[number]["value"];

export function getInquiryFieldLabel(value: string): string {
  return (
    INQUIRY_FIELD_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}
