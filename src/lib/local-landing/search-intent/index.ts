import { buildSearchIntentContent } from "./factory";
import { searchIntentSeeds } from "./seeds";
import type { SearchIntentContent } from "./types";
import { 부산등기복대리Override } from "./overrides/busan-subproxy";
import { 부산집단등기Override } from "./overrides/busan-mass-registry";
import { 부산매매등기법무사Override } from "./overrides/busan-sale-registration";
import { 부산증여등기Override } from "./overrides/busan-gift-registration";
import { 부산명의변경등기Override } from "./overrides/busan-name-change";
import { 부산아파트매매등기Override } from "./overrides/busan-apartment-sale";
import { 부산전세보증금반환법무사Override } from "./overrides/busan-jeonse-deposit-return";
import { 부산임차권등기명령Override } from "./overrides/busan-lease-registration-order";
import { 부산매수인법무사Override } from "./overrides/busan-buyer-scrivener";
import { 부산경매낙찰등기Override } from "./overrides/busan-auction-winning";
import { 부산공동명의등기Override } from "./overrides/busan-joint-ownership";
import { 부산지분이전등기Override } from "./overrides/busan-share-transfer";
import { 부산이혼재산분할등기Override } from "./overrides/busan-divorce-property";
import { 부산입주등기Override } from "./overrides/busan-move-in-registration";
import { 부산셀프등기Override } from "./overrides/busan-self-registration";
import { 부산등기권리증분실Override } from "./overrides/busan-registration-certificate-lost";
import {
  부산가압류말소등기Override,
  부산공매낙찰등기Override,
  부산등기명의인표시변경Override,
  부산빌라매매등기Override,
  부산상가매매등기Override,
  부산상속후매매등기Override,
  부산신탁등기Override,
  부산압류말소등기Override,
  부산오피스텔매매등기Override,
  부산외국인부동산등기Override,
  부산잔금대출근저당Override,
  부산중도금대출근저당Override,
  부산토지매매등기Override,
  부산확정일자전세권비교Override,
} from "./overrides/busan-real-estate-p2";

export type {
  SearchGuideEntry,
  SearchIntentCategory,
  SearchIntentContent,
  SearchIntentSeed,
} from "./types";

export {
  getAllSearchGuideEntries,
  getSearchGuideCategoryLabel,
  getSearchGuideEntriesByCategory,
} from "./hub-catalog";

export { searchIntentSeeds } from "./seeds";
export { subproxyJurisdictionData } from "./overrides/busan-subproxy";

const CONTENT_OVERRIDES: Record<string, SearchIntentContent> = {
  부산등기복대리: 부산등기복대리Override,
  부산집단등기: 부산집단등기Override,
  부산매매등기법무사: 부산매매등기법무사Override,
  부산증여등기: 부산증여등기Override,
  부산명의변경등기: 부산명의변경등기Override,
  부산아파트매매등기: 부산아파트매매등기Override,
  부산전세보증금반환법무사: 부산전세보증금반환법무사Override,
  부산임차권등기명령: 부산임차권등기명령Override,
  부산매수인법무사: 부산매수인법무사Override,
  부산경매낙찰등기: 부산경매낙찰등기Override,
  부산공동명의등기: 부산공동명의등기Override,
  부산지분이전등기: 부산지분이전등기Override,
  부산이혼재산분할등기: 부산이혼재산분할등기Override,
  부산입주등기: 부산입주등기Override,
  부산셀프등기: 부산셀프등기Override,
  부산등기권리증분실: 부산등기권리증분실Override,
  부산빌라매매등기: 부산빌라매매등기Override,
  부산오피스텔매매등기: 부산오피스텔매매등기Override,
  부산상가매매등기: 부산상가매매등기Override,
  부산토지매매등기: 부산토지매매등기Override,
  부산가압류말소등기: 부산가압류말소등기Override,
  부산압류말소등기: 부산압류말소등기Override,
  부산중도금대출근저당: 부산중도금대출근저당Override,
  부산잔금대출근저당: 부산잔금대출근저당Override,
  부산상속후매매등기: 부산상속후매매등기Override,
  부산확정일자전세권비교: 부산확정일자전세권비교Override,
  부산외국인부동산등기: 부산외국인부동산등기Override,
  부산등기명의인표시변경: 부산등기명의인표시변경Override,
  부산공매낙찰등기: 부산공매낙찰등기Override,
  부산신탁등기: 부산신탁등기Override,
};

const contentCache = new Map<string, SearchIntentContent>();

function ensureCache(): Map<string, SearchIntentContent> {
  if (contentCache.size === 0) {
    for (const seed of searchIntentSeeds) {
      contentCache.set(
        seed.slug,
        CONTENT_OVERRIDES[seed.slug] ?? buildSearchIntentContent(seed),
      );
    }
  }
  return contentCache;
}

export function getSearchIntentContent(
  key: string,
): SearchIntentContent | undefined {
  return ensureCache().get(key);
}

export function getAllSearchIntentSlugs(): string[] {
  return searchIntentSeeds.map((s) => s.slug);
}

export function getAllSearchIntentContents(): SearchIntentContent[] {
  return [...ensureCache().values()];
}
