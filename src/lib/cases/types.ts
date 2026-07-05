import type { ContentRelations } from "@/types/content-relations";

export const CASE_DISCLAIMER =
  "본 사례는 참고용으로 정리한 내용입니다. 비슷한 상황이라도 서류·기한·관계에 따라 절차가 달라질 수 있으니, 본인 사건은 상담으로 확인하시면 좋습니다. 개인정보 보호를 위해 구체적 의뢰인 정보는 비공개합니다.";

export const CASE_CATEGORIES = [
  "상속",
  "부동산등기",
  "법인등기",
  "전세보증금",
  "민사서류",
  "회생파산",
  "기타",
] as const;

export type CaseCategory = (typeof CASE_CATEGORIES)[number];

export const CASE_SITUATION_TAGS = [
  "공동상속인 불협조",
  "빚이 있는 상속",
  "미성년자 포함",
  "해외거주자 포함",
  "근저당 말소",
  "잔금 후 등기",
  "임원 임기만료",
  "본점이전",
  "내용증명",
  "지급명령",
] as const;

export type CaseSituationTag = (typeof CASE_SITUATION_TAGS)[number];

export const CASE_REGIONS = [
  "해운대구",
  "수영구",
  "연제구",
  "동래구",
  "남구",
  "부산진구",
  "북구",
  "금정구",
  "사상구",
  "기장군",
  "부산 전역",
] as const;

export type CaseRegion = (typeof CASE_REGIONS)[number];

export type CaseSections = {
  background: string;
  concerns: string[];
  issues: string[];
  documents: string[];
  procedures: string[];
  outcome: string;
  cautions: string[];
};

export type CaseRecord = ContentRelations & {
  slug: string;
  href: string;
  title: string;
  description: string;
  date: string;
  category: string;
  caseCategory: CaseCategory;
  situationTags: CaseSituationTag[];
  region: CaseRegion;
  tags: string[];
  relatedServices: string[];
  relatedFaqs: string[];
  area?: string;
  sections: CaseSections;
};

export type CaseFilters = {
  caseCategory?: CaseCategory | "all";
  situationTag?: CaseSituationTag | "all";
  region?: CaseRegion | "all";
};
