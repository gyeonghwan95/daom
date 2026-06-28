import type { LocalLandingConfig } from "@/types/local-landing";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { expansionLandingConfigs } from "./expansion/config-expansion";

const baseLandingConfigs: LocalLandingConfig[] = [
  { slug: "부산상속등기", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["해운대구", "센텀", "재송동", "수영구", "연제구"], caseAngle: "형제 상속인 간 분쟁 없이 해운대 아파트 상속등기 완료", relatedCaseSlug: "haeundae-inheritance-registration-case" },
  { slug: "부산상속포기", serviceSlug: "inheritance-renunciation", regionKey: "busan", regionLabel: "부산", neighborhoods: ["동래구", "북구", "사상구"], caseAngle: "채무가 재산보다 많아 상속포기 신고 진행", relatedCaseSlug: "jaesong-inheritance-renunciation-consultation" },
  { slug: "부산한정승인", serviceSlug: "qualified-acceptance", regionKey: "busan", regionLabel: "부산", neighborhoods: ["연제구", "금정구"], caseAngle: "모르는 채무가 있어 한정승인으로 상속 범위 제한", relatedCaseSlug: "dongnae-qualified-acceptance-consultation" },
  { slug: "부산법인설립등기", serviceSlug: "company-establishment", regionKey: "busan", regionLabel: "부산", neighborhoods: ["센텀", "해운대구"], caseAngle: "센텀 스타트업 2인 창업 법인 설립 등기", relatedCaseSlug: "suyeong-company-establishment-case" },
  { slug: "부산임원변경등기", serviceSlug: "director-change", regionKey: "busan", regionLabel: "부산", neighborhoods: ["센텀", "연제구"], caseAngle: "대표이사 교체에 따른 임원변경등기", relatedCaseSlug: "yeonje-director-change-case" },
  { slug: "부산부동산등기", serviceSlug: "real-estate-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["수영구", "광안동", "해운대구"], caseAngle: "광안 아파트 매매 소유권이전등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "부산법인등기", serviceSlug: "corporate-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["센텀", "재송동"], caseAngle: "본점 이전에 따른 법인등기" },
  { slug: "부산소유권이전등기", serviceSlug: "ownership-transfer", regionKey: "busan", regionLabel: "부산", neighborhoods: ["해운대구", "우동"], caseAngle: "증여 부동산 소유권이전등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "부산개인회생", serviceSlug: "personal-rehabilitation", regionKey: "busan", regionLabel: "부산", neighborhoods: ["사상구", "엄궁동", "북구"], caseAngle: "생활비 대출 누적으로 개인회생 신청", relatedCaseSlug: "busan-personal-rehabilitation-consultation" },
  { slug: "부산파산", serviceSlug: "bankruptcy", regionKey: "busan", regionLabel: "부산", neighborhoods: ["동래구", "금정구"], caseAngle: "사업 실패 후 개인파산 절차 검토" },
  { slug: "해운대구상속등기", serviceSlug: "inheritance-registration", regionKey: "haeundae", regionLabel: "해운대구", neighborhoods: ["센텀", "재송동", "반여동", "우동"], caseAngle: "센텀 아파트 공동상속인 협의 후 상속등기", relatedCaseSlug: "haeundae-inheritance-registration-case" },
  { slug: "해운대구상속포기", serviceSlug: "inheritance-renunciation", regionKey: "haeundae", regionLabel: "해운대구", neighborhoods: ["좌동", "반여동"], caseAngle: "재산보다 채무가 많아 상속포기 선택", relatedCaseSlug: "jaesong-inheritance-renunciation-consultation" },
  { slug: "해운대구한정승인", serviceSlug: "qualified-acceptance", regionKey: "haeundae", regionLabel: "해운대구", neighborhoods: ["센텀", "우동"], caseAngle: "상속 부동산은 받되 채무만 한정 승인", relatedCaseSlug: "dongnae-qualified-acceptance-consultation" },
  { slug: "해운대구법인등기", serviceSlug: "corporate-registration", regionKey: "haeundae", regionLabel: "해운대구", neighborhoods: ["센텀", "재송동"], caseAngle: "센텀 법인 본점 소재지 변경 등기", relatedCaseSlug: "suyeong-company-establishment-case" },
  { slug: "해운대구부동산등기", serviceSlug: "real-estate-registration", regionKey: "haeundae", regionLabel: "해운대구", neighborhoods: ["마린시티", "우동"], caseAngle: "해운대 상가 매매 등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "연제구상속등기", serviceSlug: "inheritance-registration", regionKey: "yeonje", regionLabel: "연제구", neighborhoods: ["연산동", "거제동"], caseAngle: "연산동 다세대주택 상속등기" },
  { slug: "연제구상속포기", serviceSlug: "inheritance-renunciation", regionKey: "yeonje", regionLabel: "연제구", neighborhoods: ["연산동"], caseAngle: "연제구 거주 상속인의 상속포기 신고", relatedCaseSlug: "jaesong-inheritance-renunciation-consultation" },
  { slug: "연제구법인등기", serviceSlug: "corporate-registration", regionKey: "yeonje", regionLabel: "연제구", neighborhoods: ["연산동"], caseAngle: "연제구 소재 법인 정관 변경 등기", relatedCaseSlug: "suyeong-company-establishment-case" },
  { slug: "연제구임원변경등기", serviceSlug: "director-change", regionKey: "yeonje", regionLabel: "연제구", neighborhoods: ["거제동", "연산동"], caseAngle: "연제구 법인 감사·이사 변경 등기", relatedCaseSlug: "yeonje-director-change-case" },
  { slug: "수영구상속등기", serviceSlug: "inheritance-registration", regionKey: "suyeong", regionLabel: "수영구", neighborhoods: ["광안동", "민락동"], caseAngle: "광안동 아파트 상속등기" },
  { slug: "수영구부동산등기", serviceSlug: "real-estate-registration", regionKey: "suyeong", regionLabel: "수영구", neighborhoods: ["광안동", "망미동"], caseAngle: "수영구 오피스텔 매매 등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "수영구법인등기", serviceSlug: "corporate-registration", regionKey: "suyeong", regionLabel: "수영구", neighborhoods: ["민락동"], caseAngle: "수영구 소재 소규모 법인 설립 후속 등기", relatedCaseSlug: "suyeong-company-establishment-case" },
  { slug: "수영구개인회생", serviceSlug: "personal-rehabilitation", regionKey: "suyeong", regionLabel: "수영구", neighborhoods: ["광안동"], caseAngle: "수영구 거주 직장인 개인회생", relatedCaseSlug: "busan-personal-rehabilitation-consultation" },
  { slug: "동래구상속등기", serviceSlug: "inheritance-registration", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["온천동", "사직동"], caseAngle: "동래구 단독주택 상속등기" },
  { slug: "동래구법인등기", serviceSlug: "corporate-registration", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["명륜동", "온천동"], caseAngle: "동래구 법인 자본금 변경 등기" },
  { slug: "동래구한정승인", serviceSlug: "qualified-acceptance", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["사직동"], caseAngle: "동래구 상속 채무 조사 후 한정승인", relatedCaseSlug: "dongnae-qualified-acceptance-consultation" },
  { slug: "동래구임원변경등기", serviceSlug: "director-change", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["온천동"], caseAngle: "동래구 소재 법인 대표이사 변경", relatedCaseSlug: "yeonje-director-change-case" },
  { slug: "기장군상속등기", serviceSlug: "inheritance-registration", regionKey: "gijang", regionLabel: "기장군", neighborhoods: ["기장읍", "정관읍"], caseAngle: "기장군 토지·주택 상속등기", relatedCaseSlug: "gijang-land-inheritance-case" },
  { slug: "기장군법인등기", serviceSlug: "corporate-registration", regionKey: "gijang", regionLabel: "기장군", neighborhoods: ["정관읍", "일광읍"], caseAngle: "기장군 공장 법인 본점 이전 등기" },
  { slug: "기장군부동산등기", serviceSlug: "real-estate-registration", regionKey: "gijang", regionLabel: "기장군", neighborhoods: ["기장읍"], caseAngle: "기장군 농지 매매 등기", relatedCaseSlug: "gijang-land-inheritance-case" },
  // 2차 우선순위 20페이지 — 북구·사상구·금정구·센텀 + 기존 구역 보강
  { slug: "북구상속등기", serviceSlug: "inheritance-registration", regionKey: "buk", regionLabel: "북구", neighborhoods: ["덕천동", "구포동"], caseAngle: "덕천동 아파트 형제 공동상속 등기", relatedCaseSlug: "haeundae-inheritance-registration-case" },
  { slug: "북구부동산등기", serviceSlug: "real-estate-registration", regionKey: "buk", regionLabel: "북구", neighborhoods: ["화명동", "덕천동"], caseAngle: "화명동 빌라 매매 소유권이전등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "북구개인회생", serviceSlug: "personal-rehabilitation", regionKey: "buk", regionLabel: "북구", neighborhoods: ["덕천동", "구포동"], caseAngle: "북구 거주 자영업자 개인회생 신청", relatedCaseSlug: "busan-personal-rehabilitation-consultation" },
  { slug: "북구상속포기", serviceSlug: "inheritance-renunciation", regionKey: "buk", regionLabel: "북구", neighborhoods: ["구포동"], caseAngle: "상속 채무 조사 후 상속포기 결정", relatedCaseSlug: "jaesong-inheritance-renunciation-consultation" },
  { slug: "사상구상속등기", serviceSlug: "inheritance-registration", regionKey: "sasang", regionLabel: "사상구", neighborhoods: ["엄궁동", "감전동"], caseAngle: "엄궁동 단독주택 상속등기", relatedCaseSlug: "haeundae-inheritance-registration-case" },
  { slug: "사상구부동산등기", serviceSlug: "real-estate-registration", regionKey: "sasang", regionLabel: "사상구", neighborhoods: ["주례동", "엄궁동"], caseAngle: "사상구 상가 임대차 종료 후 매매 등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "사상구상속포기", serviceSlug: "inheritance-renunciation", regionKey: "sasang", regionLabel: "사상구", neighborhoods: ["감전동"], caseAngle: "사망 전 채무가 많아 상속포기 신고", relatedCaseSlug: "jaesong-inheritance-renunciation-consultation" },
  { slug: "사상구개인회생", serviceSlug: "personal-rehabilitation", regionKey: "sasang", regionLabel: "사상구", neighborhoods: ["엄궁동", "주례동"], caseAngle: "사상구 거주 직장인 카드론 누적 개인회생", relatedCaseSlug: "busan-personal-rehabilitation-consultation" },
  { slug: "금정구상속등기", serviceSlug: "inheritance-registration", regionKey: "geumjeong", regionLabel: "금정구", neighborhoods: ["부곡동", "서동"], caseAngle: "부곡동 다가구주택 상속등기", relatedCaseSlug: "haeundae-inheritance-registration-case" },
  { slug: "금정구한정승인", serviceSlug: "qualified-acceptance", regionKey: "geumjeong", regionLabel: "금정구", neighborhoods: ["금사동", "부곡동"], caseAngle: "모르는 보증채무 확인 후 한정승인", relatedCaseSlug: "dongnae-qualified-acceptance-consultation" },
  { slug: "금정구부동산등기", serviceSlug: "real-estate-registration", regionKey: "geumjeong", regionLabel: "금정구", neighborhoods: ["서동", "부곡동"], caseAngle: "금정구 원룸 건물 매매 등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "센텀법인설립등기", serviceSlug: "company-establishment", regionKey: "centum", regionLabel: "센텀", neighborhoods: ["센텀시티", "재송동"], caseAngle: "센텀 IT 스타트업 1인 법인 설립 등기", relatedCaseSlug: "suyeong-company-establishment-case" },
  { slug: "센텀임원변경등기", serviceSlug: "director-change", regionKey: "centum", regionLabel: "센텀", neighborhoods: ["센텀시티", "우동"], caseAngle: "센텀 법인 투자 유치 후 대표이사 변경", relatedCaseSlug: "yeonje-director-change-case" },
  { slug: "센텀부동산등기", serviceSlug: "real-estate-registration", regionKey: "centum", regionLabel: "센텀", neighborhoods: ["센텀시티", "마린시티"], caseAngle: "센텀 오피스 매매 소유권이전등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "해운대구법인설립등기", serviceSlug: "company-establishment", regionKey: "haeundae", regionLabel: "해운대구", neighborhoods: ["센텀", "재송동"], caseAngle: "해운대구 소재 법인 신규 설립 등기", relatedCaseSlug: "suyeong-company-establishment-case" },
  { slug: "해운대구임원변경등기", serviceSlug: "director-change", regionKey: "haeundae", regionLabel: "해운대구", neighborhoods: ["센텀", "우동"], caseAngle: "해운대구 법인 이사회 개편에 따른 임원변경", relatedCaseSlug: "yeonje-director-change-case" },
  { slug: "연제구부동산등기", serviceSlug: "real-estate-registration", regionKey: "yeonje", regionLabel: "연제구", neighborhoods: ["연산동", "거제동"], caseAngle: "연산동 아파트 매매 등기", relatedCaseSlug: "centum-ownership-transfer-case" },
  { slug: "연제구한정승인", serviceSlug: "qualified-acceptance", regionKey: "yeonje", regionLabel: "연제구", neighborhoods: ["연산동"], caseAngle: "연제구 상속 부동산은 유지하고 채무만 한정", relatedCaseSlug: "dongnae-qualified-acceptance-consultation" },
  { slug: "수영구상속포기", serviceSlug: "inheritance-renunciation", regionKey: "suyeong", regionLabel: "수영구", neighborhoods: ["광안동", "민락동"], caseAngle: "수영구 거주 상속인의 상속포기 가정법원 신고", relatedCaseSlug: "jaesong-inheritance-renunciation-consultation" },
  { slug: "동래구부동산등기", serviceSlug: "real-estate-registration", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["온천동", "사직동"], caseAngle: "동래구 재건축 전 아파트 매매 등기", relatedCaseSlug: "centum-ownership-transfer-case" },
];

export const localLandingConfigs: LocalLandingConfig[] = [
  ...baseLandingConfigs,
  ...expansionLandingConfigs,
];

export function getAllLocalLandingSlugs(): string[] {
  return localLandingConfigs.map((item) => item.slug);
}

export function getLocalLandingConfig(
  slug: string,
): LocalLandingConfig | undefined {
  const key = normalizeRouteSlug(slug);
  return localLandingConfigs.find(
    (item) => normalizeRouteSlug(item.slug) === key,
  );
}
