import type { ContentMeta } from "@/types/content-mdx";
import {
  CASE_CATEGORIES,
  CASE_REGIONS,
  CASE_SITUATION_TAGS,
  type CaseCategory,
  type CaseRegion,
  type CaseSituationTag,
} from "./types";

const AREA_TO_REGION: Record<string, CaseRegion> = {
  해운대: "해운대구",
  센텀: "해운대구",
  재송동: "해운대구",
  수영: "수영구",
  연제: "연제구",
  동래: "동래구",
  남구: "남구",
  부산진: "부산진구",
  북구: "북구",
  금정: "금정구",
  사상: "사상구",
  기장: "기장군",
  부산: "부산 전역",
};

const CATEGORY_INFERENCE: Record<string, CaseCategory> = {
  상속등기: "상속",
  상속포기: "상속",
  한정승인: "상속",
  부동산등기: "부동산등기",
  소유권이전등기: "부동산등기",
  법인등기: "법인등기",
  법인설립: "법인등기",
  임원변경: "법인등기",
  개인회생: "회생파산",
  파산: "회생파산",
  전세: "전세보증금",
  지급명령: "민사서류",
  내용증명: "민사서류",
};

export function normalizeCaseCategory(
  meta: ContentMeta,
  explicit?: string,
): CaseCategory {
  const value = explicit ?? meta.caseCategory;
  if (value && CASE_CATEGORIES.includes(value as CaseCategory)) {
    return value as CaseCategory;
  }
  return CATEGORY_INFERENCE[meta.category] ?? "기타";
}

export function normalizeCaseRegion(meta: ContentMeta, explicit?: string): CaseRegion {
  const value = explicit ?? meta.region;
  if (value && CASE_REGIONS.includes(value as CaseRegion)) {
    return value as CaseRegion;
  }
  if (meta.area) {
    const mapped = AREA_TO_REGION[meta.area];
    if (mapped) return mapped;
    for (const region of CASE_REGIONS) {
      if (meta.area.includes(region.replace("구", "").replace("군", ""))) {
        return region;
      }
    }
  }
  return "부산 전역";
}

export function normalizeSituationTags(
  meta: ContentMeta,
  explicit?: string[],
): CaseSituationTag[] {
  const raw = explicit ?? meta.situationTags ?? [];
  return raw.filter((tag): tag is CaseSituationTag =>
    CASE_SITUATION_TAGS.includes(tag as CaseSituationTag),
  );
}
