import { buildSearchIntentContent } from "./factory";
import { searchIntentSeeds } from "./seeds";
import type { SearchIntentContent } from "./types";
import {
  공기업등기Override,
  공공기관부동산등기Override,
  공공기관법인등기Override,
  공공기관이전등기Override,
  공공기관촉탁등기Override,
  지방공기업등기Override,
  촉탁등기Override,
} from "./overrides/public-agency-spokes";
import { 부산등기복대리Override } from "./overrides/busan-subproxy";
import { 부산집단등기Override } from "./overrides/busan-mass-registry";
import { 부산매매등기법무사Override } from "./overrides/busan-sale-registration";
import { 부산증여등기Override } from "./overrides/busan-gift-registration";
import {
  부산공동명의지분증여등기Override,
  부산부모자녀아파트증여등기Override,
  부산부부간증여등기Override,
  부산부담부증여등기Override,
} from "./overrides/busan-gift-situations";
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
import { 부산개인회생법무사Override } from "./overrides/busan-personal-rehabilitation-lawyer";
import { 부산상속전문법무사Override } from "./overrides/busan-inheritance-specialist-lawyer";
import { specialistLawyerOverrides } from "./overrides/busan-specialist-lawyers";
import { specialistLawyerPhase2Overrides } from "./overrides/busan-specialist-lawyers-phase2";
import { 부산회생법무사Override } from "./overrides/busan-rehabilitation-lawyer";
import {
  부모님사망후해야할일Override,
  방문없이준비하는상속등기Override,
  부모빚상속방법Override,
  사망신고와상속등기차이Override,
  사망자재산채무조회Override,
  상속상담전준비서류와비용Override,
  안심상속원스톱서비스이후Override,
  장례후재산채무정리Override,
} from "./overrides/inheritance-lifecycle-phase1";
import {
  고인계좌장례비사용Override,
  미성년상속인Override,
  사망후3개월지난상속Override,
  오래된상속토지정리Override,
  해외거주상속인Override,
  연락두절상속인Override,
  임대인사망전세계약Override,
  재혼가정상속Override,
} from "./overrides/inheritance-lifecycle-phase2";
import {
  경상도비대면상속등기Override,
  타지역상속인경상도부동산Override,
} from "./overrides/gyeongsang-remote-inheritance";
import {
  법무사비용먼저확인하는방법Override,
  방문없이준비하는법무사업무Override,
  방문없이준비하는상속포기한정승인Override,
  부동산과거주지가다른상속등기Override,
  사진전자파일우편으로서류전달Override,
  상속인이여러지역에있는경우Override,
} from "./overrides/nationwide-remote-phase1";
import {
  방문없이준비하는근저당말소Override,
  방문없이준비하는법인설립Override,
  방문없이준비하는임원변경Override,
  방문없이준비하는지급명령서류Override,
  부모자녀다른지역증여등기Override,
  이사후임차권등기명령준비Override,
  해외대표이사주주법인등기Override,
} from "./overrides/nationwide-remote-phase2";
import {
  등기권리증없이소유권이전Override,
  사업자폐업후법인정리Override,
  해외서류가필요한증여등기Override,
} from "./overrides/nationwide-remote-phase3";
import {
  공유물분할등기서류준비Override,
  방문없이준비하는부담부증여Override,
  방문없이준비하는전세권말소Override,
} from "./overrides/nationwide-remote-phase4a";
import {
  가압류신청서류준비Override,
  내용증명작성준비Override,
  방문없이준비하는유상증자Override,
  제주타지역상속인부동산Override,
  휴면법인계속등기준비Override,
} from "./overrides/nationwide-remote-phase4b";
import {
  가처분신청서류준비Override,
  변제공탁서류준비Override,
  채권압류추심서류준비Override,
} from "./overrides/nationwide-remote-phase5a";
import {
  상속등기후매매서류준비Override,
  압류말소등기서류준비Override,
  이혼재산분할등기서류준비Override,
} from "./overrides/nationwide-remote-phase5b";
import { keywordGapBatch1Overrides } from "./overrides/keyword-gap-batch1";
import { situationIntentBatch1Overrides } from "./overrides/situation-intent-batch1";
import { busanMissingKeywordIntentOverrides } from "./overrides/busan-missing-keyword-intents";
import { wave1TrueGapOverrides } from "./overrides/wave1-true-gaps";

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
  ...specialistLawyerOverrides,
  ...specialistLawyerPhase2Overrides,
  ...keywordGapBatch1Overrides,
  ...situationIntentBatch1Overrides,
  ...busanMissingKeywordIntentOverrides,
  ...wave1TrueGapOverrides,
  공공기관법인등기: 공공기관법인등기Override,
  공공기관부동산등기: 공공기관부동산등기Override,
  공공기관이전등기: 공공기관이전등기Override,
  공공기관촉탁등기: 공공기관촉탁등기Override,
  공기업등기: 공기업등기Override,
  지방공기업등기: 지방공기업등기Override,
  촉탁등기: 촉탁등기Override,
  부산개인회생법무사: 부산개인회생법무사Override,
  부산상속전문법무사: 부산상속전문법무사Override,
  부산회생법무사: 부산회생법무사Override,
  부산등기복대리: 부산등기복대리Override,
  부산집단등기: 부산집단등기Override,
  부산매매등기법무사: 부산매매등기법무사Override,
  부산증여등기: 부산증여등기Override,
  부산부모자녀아파트증여등기: 부산부모자녀아파트증여등기Override,
  부산부부간증여등기: 부산부부간증여등기Override,
  부산부담부증여등기: 부산부담부증여등기Override,
  부산공동명의지분증여등기: 부산공동명의지분증여등기Override,
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
  부모님사망후해야할일: 부모님사망후해야할일Override,
  장례후재산채무정리: 장례후재산채무정리Override,
  사망신고와상속등기차이: 사망신고와상속등기차이Override,
  안심상속원스톱서비스이후: 안심상속원스톱서비스이후Override,
  사망자재산채무조회: 사망자재산채무조회Override,
  부모빚상속방법: 부모빚상속방법Override,
  방문없이준비하는상속등기: 방문없이준비하는상속등기Override,
  상속상담전준비서류와비용: 상속상담전준비서류와비용Override,
  오래된상속토지정리: 오래된상속토지정리Override,
  연락두절상속인: 연락두절상속인Override,
  미성년상속인: 미성년상속인Override,
  재혼가정상속: 재혼가정상속Override,
  고인계좌장례비사용: 고인계좌장례비사용Override,
  사망후3개월지난상속: 사망후3개월지난상속Override,
  해외거주상속인: 해외거주상속인Override,
  임대인사망전세계약: 임대인사망전세계약Override,
  경상도비대면상속등기: 경상도비대면상속등기Override,
  타지역상속인경상도부동산: 타지역상속인경상도부동산Override,
  방문없이준비하는법무사업무: 방문없이준비하는법무사업무Override,
  상속인이여러지역에있는경우: 상속인이여러지역에있는경우Override,
  부동산과거주지가다른상속등기: 부동산과거주지가다른상속등기Override,
  방문없이준비하는상속포기한정승인: 방문없이준비하는상속포기한정승인Override,
  사진전자파일우편으로서류전달: 사진전자파일우편으로서류전달Override,
  법무사비용먼저확인하는방법: 법무사비용먼저확인하는방법Override,
  방문없이준비하는법인설립: 방문없이준비하는법인설립Override,
  방문없이준비하는임원변경: 방문없이준비하는임원변경Override,
  해외대표이사주주법인등기: 해외대표이사주주법인등기Override,
  부모자녀다른지역증여등기: 부모자녀다른지역증여등기Override,
  방문없이준비하는근저당말소: 방문없이준비하는근저당말소Override,
  이사후임차권등기명령준비: 이사후임차권등기명령준비Override,
  방문없이준비하는지급명령서류: 방문없이준비하는지급명령서류Override,
  사업자폐업후법인정리: 사업자폐업후법인정리Override,
  등기권리증없이소유권이전: 등기권리증없이소유권이전Override,
  해외서류가필요한증여등기: 해외서류가필요한증여등기Override,
  방문없이준비하는부담부증여: 방문없이준비하는부담부증여Override,
  방문없이준비하는전세권말소: 방문없이준비하는전세권말소Override,
  공유물분할등기서류준비: 공유물분할등기서류준비Override,
  가압류신청서류준비: 가압류신청서류준비Override,
  내용증명작성준비: 내용증명작성준비Override,
  방문없이준비하는유상증자: 방문없이준비하는유상증자Override,
  휴면법인계속등기준비: 휴면법인계속등기준비Override,
  제주타지역상속인부동산: 제주타지역상속인부동산Override,
  가처분신청서류준비: 가처분신청서류준비Override,
  채권압류추심서류준비: 채권압류추심서류준비Override,
  변제공탁서류준비: 변제공탁서류준비Override,
  이혼재산분할등기서류준비: 이혼재산분할등기서류준비Override,
  압류말소등기서류준비: 압류말소등기서류준비Override,
  상속등기후매매서류준비: 상속등기후매매서류준비Override,
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
