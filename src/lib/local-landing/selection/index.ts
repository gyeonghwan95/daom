import type { SelectionHubContent } from "./types";
import { 부산법무사추천 } from "./topics/busan-recommend";
import { 부산등기법무사추천 } from "./topics/busan-registry-recommend";
import { 부산상속등기전문 } from "./topics/busan-inheritance-guide";
import { 부산부동산등기전문 } from "./topics/busan-real-estate-guide";
import { 부산법인등기전문 } from "./topics/busan-corporate-guide";
import { 부산법무사상담 } from "./topics/busan-consult";
import { 부산법무사후기 } from "./topics/busan-reviews";
import { 부산법무사비교 } from "./topics/busan-compare";
import { 부산법무사무소 } from "./topics/busan-office";
import { 부산법무사서류준비 } from "./topics/busan-docs";
import { 부산법무사방문상담 } from "./topics/busan-visit";
import { 부산법무사비대면상담 } from "./topics/busan-remote";

export type { SelectionHubContent, SelectionComparisonRow, SelectionExtraSection, SelectionServiceCheckpoint } from "./types";

export const selectionHubTopics: Record<string, SelectionHubContent> = {
  부산법무사추천,
  부산등기법무사추천,
  부산상속등기전문,
  부산부동산등기전문,
  부산법인등기전문,
  부산법무사상담,
  부산법무사후기,
  부산법무사비교,
  부산법무사무소,
  부산법무사서류준비,
  부산법무사방문상담,
  부산법무사비대면상담,
};

export function getSelectionHubContent(
  key: string,
): SelectionHubContent | undefined {
  return selectionHubTopics[key];
}

export function getAllSelectionHubSlugs(): string[] {
  return Object.keys(selectionHubTopics);
}
