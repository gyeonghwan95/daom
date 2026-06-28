import type { SeoIntentEntity } from "@/data/seo";
import { getSeoEntityById } from "@/data/seo";

/** 지역+법무사 slug 라벨 (기존 URL 관례 유지) */
const LAWYER_SLUG_LABEL: Record<string, string> = {
  busan: "부산",
  "haeundae-gu": "해운대",
  "jung-gu": "중구",
  "seo-gu": "서구",
  "dong-gu": "동구",
  "yeongdo-gu": "영도구",
  "busanjin-gu": "부산진구",
  "dongnae-gu": "동래구",
  "nam-gu": "남구",
  "buk-gu": "북구",
  "saha-gu": "사하구",
  "geumjeong-gu": "금정구",
  "gangseo-gu": "강서구",
  "yeonje-gu": "연제구",
  "suyeong-gu": "수영구",
  "sasang-gu": "사상구",
  "gijang-gun": "기장군",
  centum: "센텀",
  jaesong: "재송동",
  banyeo: "반여동",
  seomyeon: "서면",
};

/** 지역+업무 slug 접두사 */
const SERVICE_PREFIX_OVERRIDES: Record<string, string> = {
  "hood-myeongji": "명지",
  "myeongji-new-town": "명지",
  "newtown-myeongji": "명지",
  "hood-gijang-town": "기장",
  "industrial-munhyeon-finance": "문현금융단지",
  "industrial-myeongrye": "명례산업단지",
  "industrial-noksan": "녹산산업단지",
  "newtown-ecodelta": "에코델타시티",
};

/** 기관 slug 짧은 이름 */
const INSTITUTION_SLUG_SHORT: Record<string, string> = {
  "inst-busan-district-court": "부산지방법원",
  "inst-busan-registry-office": "부산지방법원등기국",
  "inst-busan-east-branch-court": "부산지방법원동부지원",
  "inst-busan-east-registry": "부산지방법원동부지원등기과",
  "inst-busan-rehab-court": "부산회생법원",
  "inst-busan-family-court": "부산가정법원",
  "inst-nam-busan-registry": "남부산등기소",
  "inst-buk-busan-registry": "북부산등기소",
  "inst-jung-busan-registry": "중부산등기소",
  "inst-busanjin-registry": "부산진등기소",
};

/** 검색 의도 → URL 접미사 */
export const INTENT_URL_SUFFIX: Record<string, string> = {
  "intent-cost": "비용",
  "intent-fee-table": "보수표",
  "intent-required-documents": "필요서류",
  "intent-preparation-documents": "준비서류",
  "intent-period": "기간",
  "intent-deadline": "기한",
  "intent-penalty": "과태료",
};

/** 특수 키워드 → 한글 slug */
export const SPECIAL_KOREAN_SLUG: Record<string, string> = {
  "special-female-lawyer-busan": "부산여성법무사",
  "special-female-lawyer-haeundae": "해운대여성법무사",
  "special-female-lawyer-centum": "센텀여성법무사",
  "special-female-lawyer-inheritance": "상속여성법무사",
  "special-female-lawyer-rehab": "개인회생여성법무사",
  "special-lawyer-fee-busan": "부산법무사비용",
  "special-lawyer-fee-table-busan": "부산법무사보수표",
  "special-near-court-busan": "부산법원근처법무사",
  "special-near-registry": "등기소근처법무사",
  "special-ship-registration-busan": "부산선박등기",
  "special-shipping-corp-registration": "해운회사법인등기",
  "special-logistics-corp-registration": "물류회사법인등기",
  "special-industrial-park-corp": "산업단지법인등기",
};

/** 사이트에 실제 /services/ 페이지가 있는 slug */
export const SITE_SERVICE_SLUGS = new Set([
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "real-estate-registration",
  "ownership-transfer",
  "corporate-registration",
  "company-establishment",
  "director-change",
  "personal-rehabilitation",
  "bankruptcy",
]);

export function resolveServiceSiteSlug(serviceId: string): string | undefined {
  if (SITE_SERVICE_SLUGS.has(serviceId)) return serviceId;
  const service = getSeoEntityById(serviceId);
  const fallback = service?.relatedServices.find((id) => SITE_SERVICE_SLUGS.has(id));
  return fallback;
}

export function getLawyerSlugLabel(region: SeoIntentEntity): string {
  return LAWYER_SLUG_LABEL[region.id] ?? region.name;
}

export function getRegionServicePrefix(region: SeoIntentEntity): string {
  if (SERVICE_PREFIX_OVERRIDES[region.id]) {
    return SERVICE_PREFIX_OVERRIDES[region.id]!;
  }
  if (region.type === "district") return region.name;
  if (region.type === "city") return "부산";
  return region.name;
}

export function getInstitutionShortName(institution: SeoIntentEntity): string {
  return INSTITUTION_SLUG_SHORT[institution.id] ?? institution.name.replace(/\s/g, "");
}

export function entityToRegionKey(region: SeoIntentEntity): string {
  return region.id.replace(/-gu$/, "").replace(/-gun$/, "").replace(/^hood-/, "");
}
