import type { LocalLandingConfig } from "@/types/local-landing";

/** SEO 확장 55페이지 (기존 50페이지와 병합) */
export const expansionLandingConfigs: LocalLandingConfig[] = [
  // 지역 대표 19
  { slug: "부산법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["해운대구", "센텀", "서면", "연제구"], caseAngle: "부산 전역 상속·등기·법인 통합 상담" },
  { slug: "해운대법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "haeundae", regionLabel: "해운대", neighborhoods: ["센텀", "우동", "재송동", "반여동"], caseAngle: "해운대구 고가 아파트·상가 상속등기" },
  { slug: "센텀법무사", pageType: "region-hub", serviceSlug: "corporate-registration", regionKey: "centum", regionLabel: "센텀", neighborhoods: ["센텀시티", "재송동", "벡스코"], caseAngle: "센텀 법인·스타트업 등기 상담" },
  { slug: "재송동법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "jaesong", regionLabel: "재송동", neighborhoods: ["재송동", "센텀시티"], caseAngle: "재송 아파트 상속·매매 등기" },
  { slug: "반여동법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "banyeo", regionLabel: "반여동", neighborhoods: ["반여동", "반송동", "좌동"], caseAngle: "반여동 아파트 공동상속 등기" },
  { slug: "수영구법무사", pageType: "region-hub", serviceSlug: "real-estate-registration", regionKey: "suyeong", regionLabel: "수영구", neighborhoods: ["광안동", "민락동", "망미동"], caseAngle: "광안리 인근 부동산 등기", linkedNeighborhoodSlugs: ["광안리법무사", "남천동법무사"] },
  { slug: "연제구법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "yeonje", regionLabel: "연제구", neighborhoods: ["연산동", "거제동"], caseAngle: "연산동 다세대·아파트 상속등기", linkedNeighborhoodSlugs: ["연산동법무사"] },
  { slug: "동래구법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["온천동", "사직동", "명륜동"], caseAngle: "동래구 단독주택·재건축 상속", linkedNeighborhoodSlugs: ["동래역법무사"] },
  { slug: "부산진구법무사", pageType: "region-hub", serviceSlug: "real-estate-registration", regionKey: "busanjin", regionLabel: "부산진구", neighborhoods: ["서면", "부전동", "전포동"], caseAngle: "서면 상가·오피스 등기", linkedNeighborhoodSlugs: ["서면법무사"] },
  { slug: "남구법무사", pageType: "region-hub", serviceSlug: "corporate-registration", regionKey: "namgu", regionLabel: "남구", neighborhoods: ["대연동", "용호동", "문현동"], caseAngle: "문현금융단지 인근 법인등기", linkedNeighborhoodSlugs: ["대연동법무사"] },
  { slug: "금정구법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "geumjeong", regionLabel: "금정구", neighborhoods: ["부곡동", "서동", "금사동"], caseAngle: "금정구 다가구주택 상속등기" },
  { slug: "북구법무사", pageType: "region-hub", serviceSlug: "personal-rehabilitation", regionKey: "buk", regionLabel: "북구", neighborhoods: ["덕천동", "화명동", "구포동"], caseAngle: "북구 거주 개인회생·상속 상담", linkedNeighborhoodSlugs: ["덕천동법무사"] },
  { slug: "기장군법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "gijang", regionLabel: "기장군", neighborhoods: ["기장읍", "정관읍", "일광읍"], caseAngle: "기장군 토지·전원주택 상속", linkedNeighborhoodSlugs: ["정관법무사"] },
  { slug: "사상구법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "sasang", regionLabel: "사상구", neighborhoods: ["엄궁동", "감전동", "주례동"], caseAngle: "사상구 상가·주택 상속등기", linkedNeighborhoodSlugs: ["사상법무사"] },
  { slug: "사하구법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "saha", regionLabel: "사하구", neighborhoods: ["하단동", "괴정동", "당리동"], caseAngle: "사하구 아파트 상속·매매", linkedNeighborhoodSlugs: ["하단법무사"] },
  { slug: "중구법무사", pageType: "region-hub", serviceSlug: "real-estate-registration", regionKey: "junggu", regionLabel: "중구", neighborhoods: ["남포동", "중앙동", "보수동"], caseAngle: "원도심 상가·건물 등기" },
  { slug: "서구법무사", pageType: "region-hub", serviceSlug: "inheritance-registration", regionKey: "seogu", regionLabel: "서구", neighborhoods: ["충무동", "동대신동", "아미동"], caseAngle: "서구 주택·상가 상속등기" },
  { slug: "영도구법무사", pageType: "region-hub", serviceSlug: "corporate-registration", regionKey: "yeongdo", regionLabel: "영도구", neighborhoods: ["남항동", "동삼동", "봉래동"], caseAngle: "영도구 법인·부동산 등기" },
  { slug: "강서구법무사", pageType: "region-hub", serviceSlug: "company-establishment", regionKey: "gangseo", regionLabel: "강서구", neighborhoods: ["명지", "명지국제신도시", "가락동"], caseAngle: "명지 신도시 법인설립·등기", linkedNeighborhoodSlugs: ["명지법무사"] },

  // 고전환 10
  { slug: "부산법무사비용", pageType: "conversion", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["센텀", "해운대구"], conversionKey: "lawyer-fee-busan", caseAngle: "항목별 투명 견적 안내" },
  { slug: "부산법무사보수표", pageType: "conversion", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["센텀"], conversionKey: "lawyer-fee-table", caseAngle: "협회 보수 기준 참고 견적" },
  { slug: "상속등기비용", pageType: "conversion", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["해운대구", "연제구"], conversionKey: "inheritance-reg-cost", caseAngle: "아파트 상속등기 비용 산정" },
  { slug: "상속포기비용", pageType: "conversion", serviceSlug: "inheritance-renunciation", regionKey: "busan", regionLabel: "부산", neighborhoods: ["동래구", "북구"], conversionKey: "renunciation-cost", caseAngle: "채무 과다 시 상속포기 비용" },
  { slug: "한정승인비용", pageType: "conversion", serviceSlug: "qualified-acceptance", regionKey: "busan", regionLabel: "부산", neighborhoods: ["금정구", "연제구"], conversionKey: "qualified-cost", caseAngle: "재산·채무 조사 포함 견적" },
  { slug: "법인설립등기비용", pageType: "conversion", serviceSlug: "company-establishment", regionKey: "centum", regionLabel: "센텀", neighborhoods: ["센텀시티"], conversionKey: "company-est-cost", caseAngle: "스타트업 설립등기 비용" },
  { slug: "임원변경등기과태료", pageType: "conversion", serviceSlug: "director-change", regionKey: "busan", regionLabel: "부산", neighborhoods: ["센텀", "연제구"], conversionKey: "director-penalty", caseAngle: "등기 지연 과태료 예방" },
  { slug: "소유권이전등기서류", pageType: "conversion", serviceSlug: "ownership-transfer", regionKey: "busan", regionLabel: "부산", neighborhoods: ["부산진구", "해운대구"], conversionKey: "ownership-docs", caseAngle: "매매 등기 서류 체크리스트" },
  { slug: "상속등기필요서류", pageType: "conversion", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["수영구", "동래구"], conversionKey: "inheritance-docs", caseAngle: "상속인 3인 협의 서류 준비" },
  { slug: "상속등기기간", pageType: "conversion", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["해운대구", "기장군"], conversionKey: "inheritance-period", caseAngle: "3개월 기한 내 등기 완료" },

  // 법원·등기소 10
  { slug: "부산지방법원법무사", pageType: "court-registry", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["센텀", "해운대구"], institutionKey: "busan-district-court", caseAngle: "민사·가사 서류 접수 전 상담" },
  { slug: "부산지방법원등기국", pageType: "court-registry", serviceSlug: "real-estate-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["연제구", "동래구"], institutionKey: "busan-registry-office", caseAngle: "등기 신청서 작성·접수 대리" },
  { slug: "부산지방법원동부지원법무사", pageType: "court-registry", serviceSlug: "personal-rehabilitation", regionKey: "haeundae", regionLabel: "해운대", neighborhoods: ["센텀", "재송동"], institutionKey: "busan-east-branch-court", caseAngle: "동부지원 관할 민사 사건" },
  { slug: "부산지방법원동부지원등기과", pageType: "court-registry", serviceSlug: "corporate-registration", regionKey: "centum", regionLabel: "센텀", neighborhoods: ["센텀시티"], institutionKey: "busan-east-registry", caseAngle: "동부권 법인·부동산 등기" },
  { slug: "부산회생법원법무사", pageType: "court-registry", serviceSlug: "personal-rehabilitation", regionKey: "busan", regionLabel: "부산", neighborhoods: ["사상구", "북구"], institutionKey: "busan-rehab-court", caseAngle: "개인회생 신청서 보정 대응" },
  { slug: "부산가정법원상속", pageType: "court-registry", serviceSlug: "inheritance-renunciation", regionKey: "busan", regionLabel: "부산", neighborhoods: ["연제구", "동래구"], institutionKey: "busan-family-court", caseAngle: "상속포기·한정승인 신고" },
  { slug: "남부산등기소법무사", pageType: "court-registry", serviceSlug: "ownership-transfer", regionKey: "namgu", regionLabel: "남구", neighborhoods: ["대연동", "문현동"], institutionKey: "nam-busan-registry", caseAngle: "남부산권 부동산 등기" },
  { slug: "북부산등기소법무사", pageType: "court-registry", serviceSlug: "inheritance-registration", regionKey: "buk", regionLabel: "북구", neighborhoods: ["덕천동", "화명동"], institutionKey: "buk-busan-registry", caseAngle: "북부산권 토지·주택 등기" },
  { slug: "중부산등기소법무사", pageType: "court-registry", serviceSlug: "director-change", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["온천동", "명륜동"], institutionKey: "jung-busan-registry", caseAngle: "중부산권 법인 임원변경" },
  { slug: "부산진등기소법무사", pageType: "court-registry", serviceSlug: "ownership-transfer", regionKey: "busanjin", regionLabel: "부산진구", neighborhoods: ["서면", "부전동"], institutionKey: "busanjin-registry", caseAngle: "서면 상가 매매 등기" },

  // 기업·산업 7 (센텀법인설립등기는 기존)
  { slug: "센텀법인등기", pageType: "business-zone", serviceSlug: "corporate-registration", regionKey: "centum", regionLabel: "센텀", neighborhoods: ["센텀시티", "재송동"], businessZoneKey: "centumCorp", caseAngle: "센텀 법인 본점 이전 등기" },
  { slug: "문현금융단지법인등기", pageType: "business-zone", serviceSlug: "corporate-registration", regionKey: "munhyeon", regionLabel: "문현동", neighborhoods: ["문현금융단지", "문현동"], businessZoneKey: "munhyeonFinance", caseAngle: "금융단지 법인 임원변경" },
  { slug: "부산국제금융센터법인등기", pageType: "business-zone", serviceSlug: "corporate-registration", regionKey: "munhyeon", regionLabel: "문현동", neighborhoods: ["부산국제금융센터", "BIFC"], businessZoneKey: "bifc", caseAngle: "BIFC 입주 법인 등기" },
  { slug: "명지국제신도시법인등기", pageType: "business-zone", serviceSlug: "company-establishment", regionKey: "myeongji", regionLabel: "명지", neighborhoods: ["명지국제신도시"], businessZoneKey: "myeongji", caseAngle: "명지 신도시 법인 설립" },
  { slug: "에코델타시티법인등기", pageType: "business-zone", serviceSlug: "company-establishment", regionKey: "ecodelta", regionLabel: "에코델타시티", neighborhoods: ["에코델타시티", "강서구"], businessZoneKey: "ecodelta", caseAngle: "에코델타 입주 기업 설립등기" },
  { slug: "정관법인등기", pageType: "business-zone", serviceSlug: "corporate-registration", regionKey: "jeonggwan", regionLabel: "정관", neighborhoods: ["정관읍", "정관신도시"], businessZoneKey: "jeonggwan", caseAngle: "정관 공장 법인 등기" },
  { slug: "명례산업단지법인등기", pageType: "business-zone", serviceSlug: "corporate-registration", regionKey: "myeongrye", regionLabel: "명례일반산업단지", neighborhoods: ["명례일반산업단지", "기장군"], businessZoneKey: "myeongrye", caseAngle: "명례 산업단지 임원변경" },

  // 부동산·개발 8
  { slug: "부산재개발등기", pageType: "real-estate-dev", serviceSlug: "real-estate-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["해운대구", "동래구"], realEstateDevKey: "redevelopment", caseAngle: "재개발 조합원 지위 승계" },
  { slug: "부산재건축등기", pageType: "real-estate-dev", serviceSlug: "real-estate-registration", regionKey: "dongnae", regionLabel: "동래구", neighborhoods: ["온천동", "사직동"], realEstateDevKey: "reconstruction", caseAngle: "재건축 후 신축 아파트 등기" },
  { slug: "부산신축아파트소유권이전등기", pageType: "real-estate-dev", serviceSlug: "ownership-transfer", regionKey: "busan", regionLabel: "부산", neighborhoods: ["강서구", "기장군"], realEstateDevKey: "newApt", caseAngle: "분양 입주 후 최초 등기" },
  { slug: "부산오피스텔소유권이전등기", pageType: "real-estate-dev", serviceSlug: "ownership-transfer", regionKey: "busanjin", regionLabel: "부산진구", neighborhoods: ["서면", "전포동"], realEstateDevKey: "officetel", caseAngle: "서면 오피스텔 매매 등기" },
  { slug: "부산상가등기", pageType: "real-estate-dev", serviceSlug: "real-estate-registration", regionKey: "junggu", regionLabel: "중구", neighborhoods: ["남포동", "중앙동"], realEstateDevKey: "commercial", caseAngle: "남포동 상가 매매 등기" },
  { slug: "부산토지상속등기", pageType: "real-estate-dev", serviceSlug: "inheritance-registration", regionKey: "busan", regionLabel: "부산", neighborhoods: ["기장군", "금정구"], realEstateDevKey: "landInheritance", caseAngle: "토지·임야 공동상속 분할" },
  { slug: "기장토지상속등기", pageType: "real-estate-dev", serviceSlug: "inheritance-registration", regionKey: "gijang", regionLabel: "기장군", neighborhoods: ["기장읍", "정관읍"], realEstateDevKey: "gijangLand", caseAngle: "기장군 농지·전원주택 상속" },
  { slug: "해운대재개발상속등기", pageType: "real-estate-dev", serviceSlug: "inheritance-registration", regionKey: "haeundae", regionLabel: "해운대", neighborhoods: ["우동", "재송동"], realEstateDevKey: "haeundaeRedev", caseAngle: "재개발 지역 조합원 지위 상속" },

  // 신규 업무+지역 (기존 부산파산 유지)
  { slug: "부산개인파산", pageType: "service-region", serviceSlug: "bankruptcy", regionKey: "busan", regionLabel: "부산", neighborhoods: ["동래구", "사상구", "북구"], caseAngle: "사업 실패 후 개인파산 절차 검토" },
];
