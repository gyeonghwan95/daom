/** 단계형 상담 — 상황·서류·경로 프리셋 (PII 없음) */

export type ConsultSituationId =
  | "family-passed"
  | "inheritance-registration"
  | "inheritance-renunciation"
  | "real-estate-trade"
  | "jeonse-deposit"
  | "corporate"
  | "rehab-bankruptcy"
  | "debt-collection"
  | "unknown-work"
  | "other";

export type ConsultDocId = string;

export type ContactPreference = "phone" | "sms" | "email" | "any";
export type ContactTimePreference = "morning" | "afternoon" | "evening" | "any";

export type ConsultSituation = {
  id: ConsultSituationId;
  label: string;
  /** 서류 그룹 키 */
  docGroup: "inheritance" | "real-estate" | "corporate" | "rehab" | "jeonse" | "debt" | "general";
};

export const CONSULT_SITUATIONS: ConsultSituation[] = [
  {
    id: "family-passed",
    label: "부모님·가족이 돌아가셨어요",
    docGroup: "inheritance",
  },
  {
    id: "inheritance-registration",
    label: "상속등기를 해야 해요",
    docGroup: "inheritance",
  },
  {
    id: "inheritance-renunciation",
    label: "상속포기·한정승인이 필요해요",
    docGroup: "inheritance",
  },
  {
    id: "real-estate-trade",
    label: "부동산을 매매·증여하려고 해요",
    docGroup: "real-estate",
  },
  {
    id: "jeonse-deposit",
    label: "전세금을 돌려받지 못하고 있어요",
    docGroup: "jeonse",
  },
  {
    id: "corporate",
    label: "법인을 설립하거나 변경해야 해요",
    docGroup: "corporate",
  },
  {
    id: "rehab-bankruptcy",
    label: "개인회생·파산을 알아보고 있어요",
    docGroup: "rehab",
  },
  {
    id: "debt-collection",
    label: "돈을 받지 못했어요",
    docGroup: "debt",
  },
  {
    id: "unknown-work",
    label: "등기·법률 문제가 있는데 업무명을 모르겠어요",
    docGroup: "general",
  },
  {
    id: "other",
    label: "기타 상황",
    docGroup: "general",
  },
];

export type ConsultDocOption = {
  id: ConsultDocId;
  label: string;
};

const DOC_NONE: ConsultDocOption = {
  id: "none-ready",
  label: "아직 준비된 자료가 없어도 상담할 수 있어요",
};

export const CONSULT_DOCS_BY_GROUP: Record<
  ConsultSituation["docGroup"],
  ConsultDocOption[]
> = {
  inheritance: [
    { id: "family-relation", label: "가족관계증명서" },
    { id: "basic-cert", label: "기본증명서" },
    { id: "jejeok", label: "제적등본" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    { id: "estate-list", label: "상속재산 자료" },
    DOC_NONE,
  ],
  "real-estate": [
    { id: "sale-contract", label: "매매·증여 계약서" },
    { id: "title-deed", label: "등기권리증" },
    { id: "id-docs", label: "주민등록·신분증 관련 서류" },
    { id: "acquisition-tax", label: "취득세 관련 자료" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    DOC_NONE,
  ],
  corporate: [
    { id: "corp-registry", label: "법인등기사항증명서" },
    { id: "articles", label: "정관" },
    { id: "shareholders", label: "주주명부" },
    { id: "minutes", label: "의사록" },
    DOC_NONE,
  ],
  rehab: [
    { id: "debt-list", label: "채무내역" },
    { id: "income", label: "소득자료" },
    { id: "assets", label: "재산자료" },
    { id: "accounts", label: "계좌내역" },
    DOC_NONE,
  ],
  jeonse: [
    { id: "lease-contract", label: "임대차계약서" },
    { id: "deposit-proof", label: "보증금·입금 증빙" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    { id: "content-proof", label: "내용증명·독촉 자료" },
    DOC_NONE,
  ],
  debt: [
    { id: "claim-docs", label: "채권·계약·영수증" },
    { id: "content-proof", label: "내용증명·독촉 자료" },
    { id: "judgment", label: "판결·지급명령 관련 자료" },
    DOC_NONE,
  ],
  general: [
    { id: "any-docs", label: "관련 서류 일부" },
    { id: "photos", label: "사진·캡처 자료" },
    DOC_NONE,
  ],
};

export const CONTACT_PREF_OPTIONS: { id: ContactPreference; label: string }[] = [
  { id: "phone", label: "전화" },
  { id: "sms", label: "문자" },
  { id: "email", label: "이메일" },
  { id: "any", label: "상관없음" },
];

export const CONTACT_TIME_OPTIONS: {
  id: ContactTimePreference;
  label: string;
}[] = [
  { id: "morning", label: "오전" },
  { id: "afternoon", label: "오후" },
  { id: "evening", label: "저녁" },
  { id: "any", label: "상관없음" },
];

/** pathname → 추천 상황 (사용자가 변경 가능) */
export function suggestSituationsFromPath(pathname: string): ConsultSituationId[] {
  const path = decodeURIComponent(pathname || "");

  if (/임차권|전세보증|전세|임대차/.test(path)) return ["jeonse-deposit"];
  if (/상속포기/.test(path)) return ["inheritance-renunciation"];
  if (/한정승인/.test(path)) return ["inheritance-renunciation"];
  if (/상속등기|상속/.test(path) && !/포기|한정/.test(path)) {
    return ["inheritance-registration", "family-passed"];
  }
  if (/법인|임원변경|설립/.test(path)) return ["corporate"];
  if (/개인회생|파산|회생/.test(path)) return ["rehab-bankruptcy"];
  if (/매매|증여|소유권이전|부동산등기/.test(path)) return ["real-estate-trade"];
  if (/지급명령|내용증명|대여금|공사대금/.test(path)) return ["debt-collection"];
  if (/무슨법률|업무명|서류가없어도|상담/.test(path)) return ["unknown-work"];

  return [];
}

export function getSituationLabel(id: ConsultSituationId): string {
  return CONSULT_SITUATIONS.find((s) => s.id === id)?.label ?? id;
}

export function getDocsForSituations(
  situationIds: ConsultSituationId[],
): ConsultDocOption[] {
  if (situationIds.length === 0) {
    return CONSULT_DOCS_BY_GROUP.general;
  }

  const groups = new Set(
    situationIds.map(
      (id) => CONSULT_SITUATIONS.find((s) => s.id === id)?.docGroup ?? "general",
    ),
  );

  const map = new Map<string, ConsultDocOption>();
  for (const group of groups) {
    for (const doc of CONSULT_DOCS_BY_GROUP[group]) {
      map.set(doc.id, doc);
    }
  }
  // none-ready always last
  const none = map.get("none-ready");
  map.delete("none-ready");
  const list = [...map.values()];
  if (none) list.push(none);
  return list;
}
