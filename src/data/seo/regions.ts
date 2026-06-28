import { BUSAN_CITY_ID, seoEntity } from "./helpers";
import type { SeoIntentEntity } from "./types";

const INSTITUTION_IDS = {
  districtCourt: "inst-busan-district-court",
  registryOffice: "inst-busan-registry-office",
  eastCourt: "inst-busan-east-branch-court",
  eastRegistry: "inst-busan-east-registry",
  rehabCourt: "inst-busan-rehab-court",
  familyCourt: "inst-busan-family-court",
  namRegistry: "inst-nam-busan-registry",
  bukRegistry: "inst-buk-busan-registry",
  jungRegistry: "inst-jung-busan-registry",
  busanjinRegistry: "inst-busanjin-registry",
} as const;

function district(
  id: string,
  name: string,
  slug: string,
  keywords: string[],
  description: string,
  relatedRegions: string[],
  relatedServices: string[],
  institutions: string[],
  priority = 82,
): SeoIntentEntity {
  return seoEntity({
    id,
    name,
    slug,
    type: "district",
    parentRegion: BUSAN_CITY_ID,
    keywords,
    description,
    relatedServices,
    relatedRegions: [...relatedRegions, ...institutions],
    searchIntent: "local-discovery",
    priority,
  });
}

function neighborhood(
  id: string,
  name: string,
  slug: string,
  parentRegion: string,
  keywords: string[],
  description: string,
  relatedServices: string[],
  priority = 72,
): SeoIntentEntity {
  return seoEntity({
    id,
    name,
    slug,
    type: "neighborhood",
    parentRegion,
    keywords,
    description,
    relatedServices,
    relatedRegions: [parentRegion, BUSAN_CITY_ID],
    searchIntent: "local-discovery",
    priority,
  });
}

function livingArea(
  id: string,
  name: string,
  slug: string,
  parentRegion: string,
  keywords: string[],
  description: string,
  relatedServices: string[],
  priority = 78,
): SeoIntentEntity {
  return seoEntity({
    id,
    name,
    slug,
    type: "living-area",
    parentRegion,
    keywords,
    description,
    relatedServices,
    relatedRegions: [parentRegion, BUSAN_CITY_ID],
    searchIntent: "local-discovery",
    priority,
  });
}

function stationArea(
  id: string,
  name: string,
  slug: string,
  parentRegion: string,
  keywords: string[],
  description: string,
  relatedServices: string[],
  priority = 74,
): SeoIntentEntity {
  return seoEntity({
    id,
    name,
    slug,
    type: "station-area",
    parentRegion,
    keywords,
    description,
    relatedServices,
    relatedRegions: [parentRegion, BUSAN_CITY_ID],
    searchIntent: "local-discovery",
    priority,
  });
}

function newTown(
  id: string,
  name: string,
  slug: string,
  parentRegion: string,
  keywords: string[],
  description: string,
  relatedServices: string[],
  priority = 76,
): SeoIntentEntity {
  return seoEntity({
    id,
    name,
    slug,
    type: "new-town",
    parentRegion,
    keywords,
    description,
    relatedServices,
    relatedRegions: [parentRegion, BUSAN_CITY_ID],
    searchIntent: "local-discovery",
    priority,
  });
}

function industrialZone(
  id: string,
  name: string,
  slug: string,
  parentRegion: string,
  keywords: string[],
  description: string,
  relatedServices: string[],
  priority = 75,
): SeoIntentEntity {
  return seoEntity({
    id,
    name,
    slug,
    type: "industrial-zone",
    parentRegion,
    keywords,
    description,
    relatedServices,
    relatedRegions: [parentRegion, BUSAN_CITY_ID],
    searchIntent: "industry",
    priority,
  });
}

/** 부산 광역시 */
const busanCity: SeoIntentEntity = seoEntity({
  id: BUSAN_CITY_ID,
  name: "부산",
  slug: "region-busan",
  type: "city",
  parentRegion: null,
  keywords: ["부산 법무사", "부산 등기", "부산 법률사무소", "부산 법무사 상담"],
  description:
    "부산광역시 전역 상속등기·부동산등기·법인등기·개인회생·파산 등 법무사 업무를 다루는 핵심 지역입니다.",
  relatedServices: [
    "inheritance-registration",
    "corporate-registration",
    "real-estate-registration",
    "personal-rehabilitation",
  ],
  relatedRegions: Object.values(INSTITUTION_IDS),
  searchIntent: "local-discovery",
  priority: 100,
});

/** 16개 구·군 */
const districts: SeoIntentEntity[] = [
  district(
    "jung-gu",
    "중구",
    "region-jung-gu",
    ["중구 법무사", "부산 중구 상속등기", "중구 부동산등기"],
    "부산 원도심·국제시장·보수동 일대 상가·주택 상속·등기 수요가 있는 구입니다.",
    ["seomyeon"],
    ["inheritance-registration", "real-estate-registration"],
    [INSTITUTION_IDS.busanjinRegistry],
  ),
  district(
    "seo-gu",
    "서구",
    "region-seo-gu",
    ["서구 법무사", "부산 서구 상속등기", "서구 부동산등기"],
    "아미동·동대신동·부민동 일대 주택·상가 상속·매매 등기 문의가 이어지는 구입니다.",
    ["seomyeon"],
    ["inheritance-registration", "ownership-transfer"],
    [INSTITUTION_IDS.busanjinRegistry],
  ),
  district(
    "dong-gu",
    "동구",
    "region-dong-gu",
    ["동구 법무사", "부산 동구 상속등기", "초량 법무사"],
    "초량·범일동·수정동 일대 오래된 주택·상가의 상속·등기 사건이 있는 구입니다.",
    ["busan-station"],
    ["inheritance-registration", "real-estate-registration"],
    [INSTITUTION_IDS.jungRegistry],
  ),
  district(
    "yeongdo-gu",
    "영도구",
    "region-yeongdo-gu",
    ["영도구 법무사", "영도 상속등기", "영도 선박등기"],
    "영도·남항 일대 선박·어선·해운 관련 등기와 주택 상속 수요가 있는 구입니다.",
    [],
    ["ship-registration", "inheritance-registration", "corporate-registration"],
    [INSTITUTION_IDS.namRegistry],
  ),
  district(
    "busanjin-gu",
    "부산진구",
    "region-busanjin-gu",
    ["부산진구 법무사", "서면 법무사", "부전동 법무사"],
    "서면·부전·전포·양정 일대 상가·오피스·주택 등기 수요가 집중되는 핵심 상권입니다.",
    ["seomyeon", "jeonpo", "yangjeong"],
    ["real-estate-registration", "corporate-registration", "ownership-transfer"],
    [INSTITUTION_IDS.busanjinRegistry],
    88,
  ),
  district(
    "dongnae-gu",
    "동래구",
    "region-dongnae-gu",
    ["동래구 법무사", "온천동 법무사", "사직동 법무사"],
    "온천·사직·명륜 일대 재건축·주택 상속·한정승인 사건이 꾸준한 구입니다.",
    ["onsan", "sajik"],
    ["inheritance-registration", "qualified-acceptance", "reconstruction-registration"],
    [INSTITUTION_IDS.jungRegistry],
    84,
  ),
  district(
    "nam-gu",
    "남구",
    "region-nam-gu",
    ["남구 법무사", "대연동 법무사", "용호동 법무사"],
    "대연·용호·문현 일대 아파트·상가 상속·매매 등기와 법인 사무소 수요가 있습니다.",
    ["daeyeon", "munhyeon"],
    ["real-estate-registration", "inheritance-registration"],
    [INSTITUTION_IDS.namRegistry],
  ),
  district(
    "buk-gu",
    "북구",
    "region-buk-gu",
    ["북구 법무사", "덕천동 법무사", "화명동 법무사"],
    "덕천·화명·구포 일대 대단지 아파트 상속·개인회생 상담이 많은 구입니다.",
    ["deokcheon", "hwamyeong"],
    ["inheritance-registration", "personal-rehabilitation", "real-estate-registration"],
    [INSTITUTION_IDS.bukRegistry],
    83,
  ),
  district(
    "haeundae-gu",
    "해운대구",
    "region-haeundae-gu",
    ["해운대구 법무사", "해운대 법무사", "센텀 법무사"],
    "센텀·재송·반여·우동·좌동 일대 고가 부동산·법인 사옥 등기 수요가 가장 많은 구입니다.",
    ["centum", "jaesong", "banyeo", "udong"],
    ["inheritance-registration", "corporate-registration", "real-estate-registration"],
    [INSTITUTION_IDS.eastCourt, INSTITUTION_IDS.eastRegistry, INSTITUTION_IDS.namRegistry],
    92,
  ),
  district(
    "saha-gu",
    "사하구",
    "region-saha-gu",
    ["사하구 법무사", "괴정동 법무사", "하단 법무사"],
    "하단·괴정·당리 일대 주택·상가 상속·전세 관련 등기 문의가 있는 구입니다.",
    [],
    ["inheritance-registration", "jeonse-registration"],
    [INSTITUTION_IDS.namRegistry],
  ),
  district(
    "geumjeong-gu",
    "금정구",
    "region-geumjeong-gu",
    ["금정구 법무사", "부곡동 법무사", "장전동 법무사"],
    "부곡·장전·서동 일대 주택·다가구 상속·한정승인 사건이 있는 구입니다.",
    ["bugok", "jangjeon"],
    ["inheritance-registration", "qualified-acceptance"],
    [INSTITUTION_IDS.bukRegistry, INSTITUTION_IDS.jungRegistry],
  ),
  district(
    "gangseo-gu",
    "강서구",
    "region-gangseo-gu",
    ["강서구 법무사", "대저동 법무사", "명지 법무사"],
    "대저·명지·녹산 일대 신도시·산업단지 인근 법인·부동산 등기 수요가 있는 구입니다.",
    ["myeongji-new-town", "myeongrye-industrial"],
    ["corporate-registration", "real-estate-registration", "ship-registration"],
    [INSTITUTION_IDS.bukRegistry],
  ),
  district(
    "yeonje-gu",
    "연제구",
    "region-yeonje-gu",
    ["연제구 법무사", "연산동 법무사", "거제동 법무사"],
    "연산·거제 일대 실거주 아파트·법인 사무실의 상속·임원변경 등기 수요가 있습니다.",
    ["yeonsan", "geoje"],
    ["inheritance-registration", "director-change", "corporate-registration"],
    [INSTITUTION_IDS.jungRegistry, INSTITUTION_IDS.registryOffice],
    85,
  ),
  district(
    "suyeong-gu",
    "수영구",
    "region-suyeong-gu",
    ["수영구 법무사", "광안동 법무사", "민락동 법무사"],
    "광안리·민락·망미 일대 전월세·매매·상속이 겹치는 부동산 등기 수요가 많습니다.",
    ["gwangan", "millak"],
    ["real-estate-registration", "jeonse-registration", "inheritance-registration"],
    [INSTITUTION_IDS.namRegistry],
    86,
  ),
  district(
    "sasang-gu",
    "사상구",
    "region-sasang-gu",
    ["사상구 법무사", "엄궁동 법무사", "감전동 법무사"],
    "엄궁·감전·주례 일대 상속·개인회생·상속포기 문의가 잦은 구입니다.",
    [],
    ["inheritance-renunciation", "personal-rehabilitation", "inheritance-registration"],
    [INSTITUTION_IDS.bukRegistry],
  ),
  district(
    "gijang-gun",
    "기장군",
    "region-gijang-gun",
    ["기장군 법무사", "기장 법무사", "정관 법무사"],
    "기장·정관·일광 일대 토지·전원주택 상속과 산업단지 법인 등기 수요가 있습니다.",
    ["gijang-town", "jeonggwan"],
    ["inheritance-registration", "corporate-registration", "redevelopment-registration"],
    [INSTITUTION_IDS.eastCourt, INSTITUTION_IDS.bukRegistry],
    82,
  ),
];

/** 주요 동·생활권 (필수 포함 목록) */
const livingAreasAndNeighborhoods: SeoIntentEntity[] = [
  livingArea("centum", "센텀", "living-centum", "haeundae-gu", ["센텀 법무사", "센텀시티 법무사", "센텀 법인등기"], "센텀시티·벡스코·마린시티 인근 법인·부동산 등기 핵심 생활권입니다.", ["corporate-registration", "company-establishment", "real-estate-registration"], 90),
  neighborhood("jaesong", "재송동", "hood-jaesong", "haeundae-gu", ["재송동 법무사", "재송 상속등기"], "재송동 아파트·상가 상속·매매 등기 수요가 많은 동입니다.", ["inheritance-registration", "ownership-transfer"]),
  neighborhood("banyeo", "반여동", "hood-banyeo", "haeundae-gu", ["반여동 법무사", "반여 상속등기"], "반여·반송 일대 주택·상가 등기 문의가 이어지는 동입니다.", ["inheritance-registration", "real-estate-registration"]),
  neighborhood("udong", "우동", "hood-udong", "haeundae-gu", ["우동 법무사", "마린시티 등기"], "마린시티·우동 고급 주거·상가 등기 수요가 있는 동입니다.", ["real-estate-registration", "ownership-transfer"]),
  neighborhood("jwadong", "좌동", "hood-jwadong", "haeundae-gu", ["좌동 법무사", "좌동 상속등기"], "좌동 대단지 아파트 상속·매매 등기가 많은 동입니다.", ["inheritance-registration", "ownership-transfer"]),
  neighborhood("jungdong-haeundae", "중동", "hood-jungdong-haeundae", "haeundae-gu", ["해운대 중동 법무사", "해운대역 인근 등기"], "해운대 해수욕장·중동 상권 인근 부동산 등기 수요가 있습니다.", ["real-estate-registration"]),
  neighborhood("songjeong", "송정동", "hood-songjeong", "haeundae-gu", ["송정동 법무사", "송정 해변 인근 등기"], "송정 일대 주택·펜션·상가 상속·등기 문의가 있는 동입니다.", ["inheritance-registration"]),
  neighborhood("gwangan", "광안동", "hood-gwangan", "suyeong-gu", ["광안동 법무사", "광안리 등기"], "광안리 해변 인근 아파트·상가 전세·매매·상속 등기 수요가 많습니다.", ["jeonse-registration", "real-estate-registration"], 80),
  neighborhood("namcheon", "남천동", "hood-namcheon", "suyeong-gu", ["남천동 법무사", "남천동 상속등기"], "남천동 실거주 아파트 상속·매매 등기가 있는 동입니다.", ["inheritance-registration"]),
  neighborhood("millak", "민락동", "hood-millak", "suyeong-gu", ["민락동 법무사", "민락수변공원 인근"], "민락·수변공원 인근 주택·상가 등기 문의가 있는 동입니다.", ["real-estate-registration"]),
  neighborhood("yeonsan", "연산동", "hood-yeonsan", "yeonje-gu", ["연산동 법무사", "연산 상속등기"], "연산동 대단지·상가 상속·법인 사무실 등기 수요가 많습니다.", ["inheritance-registration", "corporate-registration"], 80),
  neighborhood("geoje", "거제동", "hood-geoje", "yeonje-gu", ["거제동 법무사", "거제동 등기"], "거제동 주택·상가 상속·등기 문의가 있는 동입니다.", ["inheritance-registration"]),
  livingArea("seomyeon", "서면", "living-seomyeon", "busanjin-gu", ["서면 법무사", "서면역 법무사", "부산 서면 등기"], "부산 최대 상권 서면·부전 일대 상가·오피스 등기 핵심 생활권입니다.", ["real-estate-registration", "corporate-registration"], 88),
  neighborhood("bujeon", "부전동", "hood-bujeon", "busanjin-gu", ["부전동 법무사", "부전동 상가등기"], "부전동 상가·오피스텔 매매 등기 수요가 있는 동입니다.", ["ownership-transfer"]),
  neighborhood("jeonpo", "전포동", "hood-jeonpo", "busanjin-gu", ["전포동 법무사", "전포카페거리 인근"], "전포동 상가·주택 매매·상속 등기 문의가 있는 동입니다.", ["real-estate-registration"]),
  neighborhood("yangjeong", "양정동", "hood-yangjeong", "busanjin-gu", ["양정동 법무사", "양정역 인근 등기"], "양정·개금 일대 주택·상가 등기 수요가 있는 동입니다.", ["inheritance-registration"]),
  neighborhood("daeyeon", "대연동", "hood-daeyeon", "nam-gu", ["대연동 법무사", "대연동 상속등기"], "대연동 아파트·다세대 상속·매매 등기가 있는 동입니다.", ["inheritance-registration"]),
  neighborhood("munhyeon", "문현동", "hood-munhyeon", "nam-gu", ["문현동 법무사", "문현금융단지 법무사"], "문현금융단지·전포 인근 법인·부동산 등기 수요가 있습니다.", ["corporate-registration", "head-office-transfer"], 79),
  neighborhood("myeongji", "명지동", "hood-myeongji", "gangseo-gu", ["명지동 법무사", "명지국제신도시 등기"], "명지국제신도시 인근 법인 설립·부동산 등기 수요가 있는 동입니다.", ["company-establishment", "real-estate-registration"]),
  newTown("ecodelta-city", "에코델타시티", "newtown-ecodelta", "gangseo-gu", ["에코델타시티 법무사", "에코델타 법인등기"], "친환경 신도시 입주 기업·주거 단지 법인·부동산 등기 수요가 있는 신도시입니다.", ["company-establishment", "corporate-registration"], 77),
  neighborhood("jeonggwan", "정관", "hood-jeonggwan", "gijang-gun", ["정관 법무사", "정관신도시 등기"], "정관·정관신도시 일대 산업·물류 법인 등기 수요가 있는 지역입니다.", ["corporate-registration", "company-establishment"]),
  neighborhood("gijang-town", "기장", "hood-gijang-town", "gijang-gun", ["기장 법무사", "기장읍 상속등기"], "기장읍 토지·전원주택 상속등기 수요가 있는 지역입니다.", ["inheritance-registration"]),
  neighborhood("deokcheon", "덕천동", "hood-deokcheon", "buk-gu", ["덕천동 법무사", "덕천 상속등기"], "덕천·구포 일대 아파트 상속·개인회생 상담이 많은 동입니다.", ["inheritance-registration", "personal-rehabilitation"], 78),
  neighborhood("hwamyeong", "화명동", "hood-hwamyeong", "buk-gu", ["화명동 법무사", "화명동 등기"], "화명·금곡 일대 대단지 아파트 등기 수요가 있는 동입니다.", ["real-estate-registration"]),
  neighborhood("sajik", "사직동", "hood-sajik", "dongnae-gu", ["사직동 법무사", "사직야구장 인근"], "사직·온천 일대 재건축·주택 상속 사건이 있는 동입니다.", ["reconstruction-registration", "inheritance-registration"]),
  neighborhood("onsan", "온천동", "hood-onsan", "dongnae-gu", ["온천동 법무사", "온천동 상속등기"], "온천동 주택·상가 상속·등기 문의가 있는 동입니다.", ["inheritance-registration"]),
  neighborhood("jangjeon", "장전동", "hood-jangjeon", "geumjeong-gu", ["장전동 법무사", "부산대 인근 등기"], "장전·부산대 인근 임대·매매·상속 등기 수요가 있습니다.", ["real-estate-registration"]),
  neighborhood("bugok", "부곡동", "hood-bugok", "geumjeong-gu", ["부곡동 법무사", "부곡 상속등기"], "부곡동 다가구·상가 상속·한정승인 사건이 있는 동입니다.", ["qualified-acceptance", "inheritance-registration"]),
];

/** 주요 역세권 */
const stationAreas: SeoIntentEntity[] = [
  stationArea("centum-city-station", "센텀시티역", "station-centum-city", "haeundae-gu", ["센텀시티역 법무사", "센텀역 인근 법무사"], "2호선 센텀시티역·벡스코 인근 법인·부동산 등기 검색 수요가 많습니다.", ["corporate-registration", "inheritance-registration"], 82),
  stationArea("seomyeon-station", "서면역", "station-seomyeon", "busanjin-gu", ["서면역 법무사", "서면역 인근 등기"], "1·2호선 서면역 최대 환승역 인근 상가·오피스 등기 수요가 집중됩니다.", ["real-estate-registration", "corporate-registration"], 84),
  stationArea("haeundae-station", "해운대역", "station-haeundae", "haeundae-gu", ["해운대역 법무사", "해운대역 인근"], "해운대역·중동 인근 주거·상가 등기 검색이 많습니다.", ["real-estate-registration"]),
  stationArea("gwangan-station", "광안역", "station-gwangan", "suyeong-gu", ["광안역 법무사", "광안역 인근"], "광안역·광안리 인근 전세·매매 등기 수요가 있습니다.", ["jeonse-registration"]),
  stationArea("yeonsan-station", "연산역", "station-yeonsan", "yeonje-gu", ["연산역 법무사", "연산역 인근"], "연산역 인근 아파트·상가 상속·등기 문의가 많습니다.", ["inheritance-registration"]),
  stationArea("sasang-station", "사상역", "station-sasang", "sasang-gu", ["사상역 법무사", "사상역 인근"], "사상역·서부산 유통지구 인근 등기·회생 상담이 있습니다.", ["personal-rehabilitation"]),
  stationArea("myeongji-station", "명지역", "station-myeongji", "gangseo-gu", ["명지역 법무사", "명지역 인근"], "명지역·신도시 인근 법인·부동산 등기 수요가 있습니다.", ["company-establishment"]),
  stationArea("busan-station", "부산역", "station-busan", "dong-gu", ["부산역 법무사", "부산역 인근"], "부산역·초량 인근 상가·주택 등기 문의가 있습니다.", ["real-estate-registration"]),
];

/** 신도시 */
const newTowns: SeoIntentEntity[] = [
  newTown("myeongji-new-town", "명지국제신도시", "newtown-myeongji", "gangseo-gu", ["명지국제신도시 법무사", "명지 법인설립"], "명지국제신도시 입주 기업·상가 법인 설립·등기 수요가 있는 신도시입니다.", ["company-establishment", "corporate-registration"], 78),
];

/** 산업단지·업무지구 */
const industrialZones: SeoIntentEntity[] = [
  industrialZone("munhyeon-finance", "문현금융단지", "industrial-munhyeon-finance", "nam-gu", ["문현금융단지 법무사", "문현 법인등기"], "금융·법률·전문서비스 업체가 밀집한 문현금융단지 법인 등기 수요가 있습니다.", ["corporate-registration", "director-change"], 80),
  industrialZone("bifc", "부산국제금융센터", "industrial-bifc", "nam-gu", ["BIFC 법무사", "국제금융센터 법인등기"], "BIFC 입주 금융·법인 사무소 본점·임원 등기 수요가 있습니다.", ["corporate-registration"]),
  industrialZone("myeongrye-industrial", "명례산업단지", "industrial-myeongrye", "gijang-gun", ["명례산업단지 법무사", "명례 법인등기"], "기장군 명례일반산업단지 제조·물류 법인 등기 수요가 있습니다.", ["corporate-registration", "director-change"], 77),
  industrialZone("noksan-industrial", "녹산국가산단", "industrial-noksan", "gangseo-gu", ["녹산국가산단 법무사", "녹산 법인등기"], "녹산·강서구 일대 제조·물류 법인 설립·변경 등기 수요가 있습니다.", ["corporate-registration", "company-establishment"]),
];

export const seoRegions: SeoIntentEntity[] = [
  busanCity,
  ...districts,
  ...livingAreasAndNeighborhoods,
  ...stationAreas,
  ...newTowns,
  ...industrialZones,
];

export { INSTITUTION_IDS };
