/** 단계형 상담 — 상황·서류·경로 프리셋 (PII 없음) */

export type ConsultSituationId =
  | "family-passed"
  | "inheritance-registration"
  | "inheritance-renunciation"
  | "guardianship"
  | "overseas-inheritance"
  | "sibling-conflict"
  | "will-probate"
  | "will-notary"
  | "real-estate-trade"
  | "gift"
  | "auction-winning"
  | "jeonse-deposit"
  | "company-setup"
  | "corporate"
  | "rehab-bankruptcy"
  | "debt-collection"
  | "unknown-work"
  | "other";

export type ConsultDocId = string;

export type ContactPreference = "phone" | "sms" | "email" | "any";
/** 전화 연락은 평일 09:00–18:00만 가능하므로 저녁 선택지는 두지 않는다(2026-11-12). */
export type ContactTimePreference = "morning" | "afternoon" | "any";

export type ConsultDocGroup =
  | "inheritance"
  | "guardianship"
  | "overseas"
  | "will"
  | "real-estate"
  | "gift"
  | "auction"
  | "corporate"
  | "rehab"
  | "jeonse"
  | "debt"
  | "general";

export type ConsultSituation = {
  id: ConsultSituationId;
  label: string;
  docGroup: ConsultDocGroup;
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
    id: "guardianship",
    label: "성년후견·후견이 필요해요",
    docGroup: "guardianship",
  },
  {
    id: "overseas-inheritance",
    label: "해외에 사는 상속인이 있어요",
    docGroup: "overseas",
  },
  {
    id: "sibling-conflict",
    label: "형제가 서류를 안 맞춰요",
    docGroup: "inheritance",
  },
  {
    id: "will-probate",
    label: "유언장을 발견했어요",
    docGroup: "will",
  },
  {
    id: "will-notary",
    label: "유언 공증을 알아봐요",
    docGroup: "will",
  },
  {
    id: "real-estate-trade",
    label: "부동산을 매매하려고 해요",
    docGroup: "real-estate",
  },
  {
    id: "gift",
    label: "부동산을 증여하려고 해요",
    docGroup: "gift",
  },
  {
    id: "auction-winning",
    label: "경매에 낙찰받아 등기가 필요해요",
    docGroup: "auction",
  },
  {
    id: "jeonse-deposit",
    label: "전세금을 돌려받지 못하고 있어요",
    docGroup: "jeonse",
  },
  {
    id: "company-setup",
    label: "법인을 처음 설립해요",
    docGroup: "corporate",
  },
  {
    id: "corporate",
    label: "법인을 변경해야 해요",
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

export const CONSULT_SITUATION_GROUPS: {
  title: string;
  ids: ConsultSituationId[];
}[] = [
  {
    title: "가족·상속",
    ids: [
      "family-passed",
      "inheritance-registration",
      "inheritance-renunciation",
      "guardianship",
      "overseas-inheritance",
      "sibling-conflict",
      "will-probate",
    ],
  },
  {
    title: "부동산",
    ids: ["real-estate-trade", "gift", "auction-winning", "jeonse-deposit"],
  },
  {
    title: "회사·채무",
    ids: ["company-setup", "corporate", "rehab-bankruptcy", "debt-collection"],
  },
  {
    title: "그 외",
    ids: ["will-notary", "unknown-work", "other"],
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
  ConsultDocGroup,
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
  guardianship: [
    { id: "family-relation", label: "가족관계증명서" },
    { id: "medical-opinion", label: "의사 소견서" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    DOC_NONE,
  ],
  overseas: [
    { id: "family-relation", label: "가족관계증명서" },
    { id: "poa-apostille", label: "위임장·공증·아포스티유" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    DOC_NONE,
  ],
  will: [
    { id: "will-photo", label: "유언장 사진" },
    { id: "family-relation", label: "가족관계증명서" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    DOC_NONE,
  ],
  "real-estate": [
    { id: "sale-contract", label: "매매 계약서" },
    { id: "title-deed", label: "등기권리증" },
    { id: "id-docs", label: "주민등록·신분증 관련 서류" },
    { id: "acquisition-tax", label: "취득세 관련 자료" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    DOC_NONE,
  ],
  gift: [
    { id: "gift-contract", label: "증여 계약서" },
    { id: "family-relation", label: "가족관계증명서" },
    { id: "registry", label: "등기사항증명서(등기부)" },
    DOC_NONE,
  ],
  auction: [
    { id: "auction-decision", label: "매각허가결정문" },
    { id: "payment-proof", label: "대금 납부 관련 자료" },
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
  { id: "any", label: "상관없음" },
];

function decodePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname || "");
  } catch {
    return pathname || "";
  }
}

/** pathname → 추천 상황 (사용자가 변경 가능) */
export function suggestSituationsFromPath(
  pathname: string,
): ConsultSituationId[] {
  const path = decodePath(pathname);

  if (/임차권|전세보증|전세|임대차/.test(path)) return ["jeonse-deposit"];
  if (/포기|한정승인/.test(path)) return ["inheritance-renunciation"];
  if (/후견|특별대리/.test(path)) return ["guardianship"];
  if (/연락두절|siblings-not-cooperating|형제.*협조|협조하지/.test(path)) {
    return ["sibling-conflict"];
  }
  if (/해외거주상속|재외국민|해외.?거주.?상속/.test(path)) {
    return ["overseas-inheritance"];
  }
  if (/유언검인/.test(path)) return ["will-probate"];
  if (/유언공증|유언/.test(path)) return ["will-notary"];
  if (/상속등기|상속/.test(path)) {
    return ["inheritance-registration", "family-passed"];
  }
  if (/법인설립|설립등기|설립자가진단/.test(path)) return ["company-setup"];
  if (/법인|임원변경|본점이전|대표이사/.test(path)) return ["corporate"];
  if (/개인회생|파산|회생/.test(path)) return ["rehab-bankruptcy"];
  if (/경매낙찰/.test(path)) return ["auction-winning"];
  if (/증여/.test(path)) return ["gift"];
  if (/매매|소유권이전|부동산등기/.test(path)) return ["real-estate-trade"];
  if (/지급명령|내용증명|대여금|공사대금/.test(path)) return ["debt-collection"];
  if (/무슨법률|업무명|서류가없어도|상담/.test(path)) return ["unknown-work"];

  return [];
}

export function getSituationLabel(id: ConsultSituationId): string {
  return CONSULT_SITUATIONS.find((s) => s.id === id)?.label ?? id;
}

export function isConsultSituationId(value: string): value is ConsultSituationId {
  return CONSULT_SITUATIONS.some((s) => s.id === value);
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
  const none = map.get("none-ready");
  map.delete("none-ready");
  const list = [...map.values()];
  if (none) list.push(none);
  return list;
}
