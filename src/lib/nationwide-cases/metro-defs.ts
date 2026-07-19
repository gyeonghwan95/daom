import type { RegionLandingDef } from "./types";

function metro(
  partial: Omit<
    RegionLandingDef,
    "kind" | "priority" | "published" | "noticeType" | "regionType"
  > & { regionType?: RegionLandingDef["regionType"] },
): RegionLandingDef {
  return {
    kind: "region",
    priority: 1,
    published: true,
    noticeType: "jurisdiction-exception",
    regionType: partial.regionType ?? "시도",
    ...partial,
  };
}

/** 1차 광역 16개 — 부산은 생성하지 않음 */
export const metroRegionDefs: RegionLandingDef[] = [
  metro({
    slug: "서울상속등기법무사",
    regionName: "서울",
    primaryKeyword: "서울 상속등기 법무사",
    secondaryKeywords: [
      "서울 법무사 상속등기",
      "서울 비대면 상속등기",
      "서울 아파트 상속등기",
    ],
    seoTitle: "서울 법무사 상속등기 알아볼 때｜타지역 법무사에게 맡기는 방법",
    metaDescription:
      "서울 법무사 상속등기를 검색할 때 확인할 점. 서울 지점이 아닌 부산 해운대 사무소에서 관할 특례·비대면으로 서울 소재 상속부동산 진행 가능 여부를 검토합니다.",
    h1: "서울에 있는 상속부동산도 부산 법무사에게 맡길 수 있을까",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 서울에 별도 지점이 있는 것은 아닙니다. 상속등기의 관할 특례와 비대면 서류 전달 방식을 검토하여 서울 소재 부동산도 진행 가능 여부를 안내합니다.",
    localIntro:
      "서울 법무사 상속등기를 검색하셔도, 반드시 서울에 사무소가 있어야만 맡길 수 있는 것은 아닙니다. 상속인이 지방·해외에 있거나 여러 구에 아파트·상가가 분산된 경우, 협의분할 후 매도를 예정한 경우처럼 거리보다 서류·관할 정리가 중요합니다.",
    scenarioIds: ["heir-scattered", "multi-gu", "office-retail", "sell-first"],
    propertyTypeIds: ["apt", "retail", "house"],
    uniqueFaqIds: ["seoul-search", "branch-myth", "gangnam-apt", "jurisdiction-special"],
    relatedRegionSlugs: [
      "강남구상속등기법무사",
      "서초구상속등기법무사",
      "송파구상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속등기법무사", "전국상속부동산일괄등기"],
    ctaTitle: "서울 상속등기 가능 여부 확인",
    ctaDescription: "서울 어느 구의 부동산인지, 상속인 거주지만 알려주셔도 됩니다.",
  }),
  metro({
    slug: "경기상속등기법무사",
    regionName: "경기",
    primaryKeyword: "경기 상속등기 법무사",
    secondaryKeywords: ["경기도 상속등기", "경기 비대면 상속등기"],
    seoTitle: "경기 상속등기 법무사｜여러 시·군 부동산 비대면 진행",
    metaDescription:
      "경기 상속등기 법무사 안내. 서로 다른 시에 아파트·토지가 있거나 상속인이 서울·부산으로 흩어진 경우 목록부터 정리합니다. 경기 지점 없음.",
    h1: "경기도에 흩어진 상속부동산을 한 번에 정리하려면",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 경기에 별도 지점이 있는 것은 아닙니다. 관할 특례와 비대면 방식을 검토하여 경기 소재 부동산도 진행 가능 여부를 안내합니다.",
    localIntro:
      "경기에서는 서로 다른 시에 아파트와 토지가 있는 경우, 신도시 아파트와 외곽 토지가 함께 있는 경우가 많습니다. 상속인 거주지가 서울·부산 등으로 갈라져도 한 사무소에서 목록을 관리할 수 있습니다.",
    scenarioIds: ["newtown-outer", "multi-gu", "apt-land-mix", "heir-scattered"],
    propertyTypeIds: ["apt", "land", "farm"],
    uniqueFaqIds: ["gyeonggi-cities", "multi-prop", "branch-myth", "cost-split"],
    relatedRegionSlugs: [
      "수원상속등기법무사",
      "성남상속등기법무사",
      "분당상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속등기법무사", "전국상속부동산일괄등기"],
    ctaTitle: "경기 부동산 필요서류 문의",
    ctaDescription: "시·군 이름과 부동산 종류만 알려주셔도 서류 목록을 안내합니다.",
  }),
  metro({
    slug: "인천상속등기법무사",
    regionName: "인천",
    primaryKeyword: "인천 상속등기 법무사",
    secondaryKeywords: ["송도 상속등기", "청라 상속등기", "영종 상속등기"],
    seoTitle: "인천 상속등기 법무사｜송도·청라·영종 부동산 비대면 진행",
    metaDescription:
      "인천 상속등기 법무사. 송도·청라·영종 아파트 비대면 진행, 육지 거주 상속인 안내. 인천 지점 없이 부산 사무소에서 가능 여부를 검토합니다.",
    h1: "인천 상속부동산을 방문 없이 진행하는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 인천에 별도 지점이 있는 것은 아닙니다. 상속등기 관할 특례와 비대면 서류 전달을 검토합니다.",
    localIntro:
      "송도·청라·영종처럼 생활권이 나뉜 인천 부동산도 소재지와 상속인 거주 지역을 먼저 맞춥니다. 방문 없이 서류 사진으로 개요를 확인할 수 있습니다.",
    scenarioIds: ["heir-scattered", "office-retail", "busan-remote"],
    propertyTypeIds: ["apt", "retail", "land"],
    uniqueFaqIds: ["incheon-songdo", "visit-need", "branch-myth"],
    relatedRegionSlugs: [
      "송도상속등기법무사",
      "청라상속등기법무사",
      "영종도상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속등기법무사", "전국비대면법무사"],
    ctaTitle: "인천 상속등기 가능 여부 확인",
    ctaDescription: "송도·청라·영종 등 생활권과 상속인 거주지를 알려주세요.",
  }),
  metro({
    slug: "경남상속등기법무사",
    regionName: "경남",
    primaryKeyword: "경남 상속등기 법무사",
    secondaryKeywords: [
      "경남 상속등기",
      "경남 비대면 상속등기",
      "경남 상속등기 비용",
      "부산 법무사 경남 상속등기",
    ],
    seoTitle: "경남 상속등기 법무사｜김해·양산·창원 부동산 한 번에 진행",
    metaDescription:
      "경남 상속등기 법무사. 김해 아파트·양산 토지·창원 상가처럼 여러 시·군 부동산을 한 사무소에서 검토. 경남 지점 없이 부산 해운대에서 관할 특례·방문·비대면 가능 여부를 안내합니다.",
    h1: "경남에 있는 상속부동산도 부산 법무사에게 맡길 수 있습니다",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 경남에 별도 지점이 있는 것은 아닙니다. 관할 특례와 방문·비대면 진행 가능 여부를 안내합니다.",
    localIntro:
      "김해 아파트, 양산 토지, 창원 상가처럼 경남 여러 지역에 상속부동산이 있더라도 부동산마다 다른 사무소를 찾기 전에 한 번에 진행할 수 있는지 검토할 수 있습니다. 상속등기의 관할 특례, 상속인 거주지와 부동산 수를 확인하여 적절한 신청 방법을 안내합니다.",
    scenarioIds: ["multi-gu", "apt-land-mix", "busan-remote", "heir-scattered"],
    propertyTypeIds: ["apt", "land", "house", "farm"],
    uniqueFaqIds: ["multi-prop", "visit-need", "cost-split", "jurisdiction-special"],
    relatedRegionSlugs: [
      "창원상속등기법무사",
      "김해상속등기법무사",
      "양산상속등기법무사",
      "경남법무사업무",
      "장유상속등기법무사",
      "물금상속등기법무사",
    ],
    relatedServiceSlugs: [
      "전국상속등기법무사",
      "전국상속부동산일괄등기",
      "경남오래된상속등기",
      "경남여러필지토지상속",
    ],
    ctaTitle: "경남 상속등기 가능 여부 확인",
    ctaDescription: "시·군과 부동산 개수·상속인 거주지만 알려주셔도 됩니다.",
  }),
  metro({
    slug: "울산상속등기법무사",
    regionName: "울산",
    primaryKeyword: "울산 상속등기 법무사",
    secondaryKeywords: ["울산 아파트 상속등기", "울산 비대면 상속등기"],
    seoTitle: "울산 상속등기 법무사｜아파트·토지 비대면 상속등기",
    metaDescription:
      "울산 상속등기 법무사. 아파트·토지 비대면 진행, 상속인 타지역 거주 시 절차. 울산 지점 없이 부산 사무소에서 검토합니다.",
    h1: "울산 상속부동산을 부산 방문 없이 맡기는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 울산에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "울산 아파트·토지 상속도 서류 개요만으로 먼저 상담할 수 있습니다. 상속인이 수도권에 있어도 위임·협의 방식을 안내합니다.",
    scenarioIds: ["heir-scattered", "apt-land-mix", "busan-remote"],
    propertyTypeIds: ["apt", "land", "retail"],
    uniqueFaqIds: ["visit-need", "deadline-3m", "branch-myth"],
    relatedRegionSlugs: ["울산남구상속등기법무사", "울주군상속등기법무사", "지역별상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사"],
    ctaTitle: "울산 상속등기 가능 여부 확인",
    ctaDescription: "구·군과 부동산 종류를 알려주시면 서류를 안내합니다.",
  }),
  metro({
    slug: "대구상속등기법무사",
    regionName: "대구",
    primaryKeyword: "대구 상속등기 법무사",
    secondaryKeywords: ["대구 아파트 상속등기", "대구 상속등기 비용"],
    seoTitle: "대구 상속등기 법무사｜아파트·상가·토지 상속 절차",
    metaDescription:
      "대구 상속등기 법무사. 아파트·상가·토지 절차·비용·서류. 대구 지점 없이 부산 해운대에서 비대면으로 가능 여부를 검토합니다.",
    h1: "대구 부동산 상속등기 비용과 필요서류",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 대구에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "대구에서는 아파트·상가·토지 조합과 상속인 간 협의 여부에 따라 서류가 달라집니다. 공과금과 보수를 구분해 안내합니다.",
    scenarioIds: ["office-retail", "heir-scattered", "apt-land-mix"],
    propertyTypeIds: ["apt", "retail", "land"],
    uniqueFaqIds: ["cost-split", "jurisdiction-special", "branch-myth"],
    relatedRegionSlugs: [
      "대구수성구상속등기법무사",
      "대구달서구상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속등기법무사"],
    ctaTitle: "대구 상속등기 예상 비용 확인",
    ctaDescription: "부동산 종류와 상속인 수만 알려주셔도 견적 포인트를 안내합니다.",
  }),
  metro({
    slug: "대전상속등기법무사",
    regionName: "대전",
    primaryKeyword: "대전 상속등기 법무사",
    secondaryKeywords: ["대전 비대면 상속등기", "대전 상속부동산"],
    seoTitle: "대전 상속등기 법무사｜상속인이 다른 지역에 살아도 진행 가능",
    metaDescription:
      "대전 상속등기 법무사. 상속인이 타지역에 살아도 비대면 진행 가능 여부를 검토. 대전 지점 없이 부산 사무소에서 안내합니다.",
    h1: "대전 상속부동산을 비대면으로 정리하려면",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 대전에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "상속인이 수도권·영남에 흩어져 있어도 협의·위임 일정을 맞춰 진행할 수 있는지 먼저 확인합니다.",
    scenarioIds: ["heir-scattered", "busan-remote", "sell-first"],
    propertyTypeIds: ["apt", "house", "land"],
    uniqueFaqIds: ["visit-need", "multi-prop", "deadline-3m"],
    relatedRegionSlugs: ["대전유성구상속등기법무사", "지역별상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사", "전국비대면법무사"],
    ctaTitle: "대전 부동산 방문 없이 진행 확인",
    ctaDescription: "구 이름과 상속인 거주 지역을 알려주세요.",
  }),
  metro({
    slug: "세종상속등기법무사",
    regionName: "세종",
    primaryKeyword: "세종 상속등기 법무사",
    secondaryKeywords: ["세종시 아파트 상속등기", "세종 상속등기 비용"],
    seoTitle: "세종 상속등기 법무사｜아파트·상가 상속 절차와 비용",
    metaDescription:
      "세종 상속등기 법무사. 아파트·상가 절차와 비용. 세종 지점 없이 부산 해운대에서 비대면으로 진행 가능 여부를 검토합니다.",
    h1: "세종시 상속부동산을 방문 없이 진행하는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 세종에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "세종시 아파트·상가 상속은 서류 사진으로 개요를 확인한 뒤 원본 단계를 안내하는 방식이 많습니다.",
    scenarioIds: ["office-retail", "busan-remote", "heir-scattered"],
    propertyTypeIds: ["apt", "retail"],
    uniqueFaqIds: ["cost-split", "visit-need", "branch-myth"],
    relatedRegionSlugs: ["지역별상속등기법무사", "대전상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사"],
    ctaTitle: "세종 상속등기 가능 여부 확인",
    ctaDescription: "단지·상가 여부와 상속인 수만 알려주셔도 됩니다.",
  }),
  metro({
    slug: "충남상속등기법무사",
    regionName: "충남",
    primaryKeyword: "충남 상속등기 법무사",
    secondaryKeywords: ["천안 상속등기", "아산 상속등기", "당진 상속등기"],
    seoTitle: "충남 상속등기 법무사｜천안·아산·당진 부동산 일괄 진행",
    metaDescription:
      "충남 상속등기 법무사. 천안·아산·당진 등 여러 시·군 부동산 일괄 검토. 충남 지점 없이 부산에서 비대면 상담합니다.",
    h1: "충남 여러 시·군의 상속부동산을 정리하려면",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 충남에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "천안·아산·당진처럼 시·군이 나뉜 부동산은 목록 누락을 막는 것이 우선입니다. 토지와 주택이 함께 있는 경우도 많습니다.",
    scenarioIds: ["multi-gu", "farm-forest", "apt-land-mix"],
    propertyTypeIds: ["apt", "land", "farm", "house"],
    uniqueFaqIds: ["multi-prop", "cost-split", "branch-myth"],
    relatedRegionSlugs: ["천안상속등기법무사", "아산상속등기법무사", "지역별상속등기법무사"],
    relatedServiceSlugs: ["전국상속부동산일괄등기", "전국상속등기법무사"],
    ctaTitle: "충남 부동산 일괄 정리 문의",
    ctaDescription: "시·군 목록을 알려주시면 누락 점검부터 안내합니다.",
  }),
  metro({
    slug: "충북상속등기법무사",
    regionName: "충북",
    primaryKeyword: "충북 상속등기 법무사",
    secondaryKeywords: ["청주 상속등기", "충주 상속등기", "제천 상속등기"],
    seoTitle: "충북 상속등기 법무사｜청주·충주·제천 비대면 진행",
    metaDescription:
      "충북 상속등기 법무사. 청주·충주·제천 비대면 진행과 필요서류. 충북 지점 없이 부산 해운대에서 안내합니다.",
    h1: "충북 상속부동산의 등기 절차와 준비서류",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 충북에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "청주·충주·제천 등 시별로 부동산이 나뉘거나 토지·주택이 함께 있는 경우 지번 목록을 먼저 맞춥니다.",
    scenarioIds: ["farm-forest", "heir-scattered", "busan-remote"],
    propertyTypeIds: ["house", "land", "farm"],
    uniqueFaqIds: ["jurisdiction-special", "visit-need", "deadline-3m"],
    relatedRegionSlugs: ["청주상속등기법무사", "충주상속등기법무사", "지역별상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사"],
    ctaTitle: "충북 상속등기 서류 문의",
    ctaDescription: "시·군과 토지·주택 여부를 알려주세요.",
  }),
  metro({
    slug: "광주상속등기법무사",
    regionName: "광주",
    primaryKeyword: "광주 상속등기 법무사",
    secondaryKeywords: ["광주광역시 상속등기", "광주 상속등기 비용"],
    seoTitle: "광주 상속등기 법무사｜상속부동산 비용·서류·절차 안내",
    metaDescription:
      "광주 상속등기 법무사. 비용·서류·절차와 비대면 진행. 광주 지점 없이 부산 사무소에서 가능 여부를 검토합니다.",
    h1: "광주광역시 상속등기를 비대면으로 맡기는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 광주에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "광주광역시 상속부동산도 보수와 공과금을 구분해 안내합니다. 상속인이 타지역에 있어도 협의 방식을 확인할 수 있습니다.",
    scenarioIds: ["heir-scattered", "office-retail", "busan-remote"],
    propertyTypeIds: ["apt", "house", "retail"],
    uniqueFaqIds: ["cost-split", "branch-myth", "choose-lawyer"],
    relatedRegionSlugs: ["지역별상속등기법무사", "전남상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사", "타지역법무사의뢰"],
    ctaTitle: "광주 상속등기 가능 여부 확인",
    ctaDescription: "구와 부동산 종류를 알려주시면 됩니다.",
  }),
  metro({
    slug: "전남상속등기법무사",
    regionName: "전남",
    primaryKeyword: "전남 상속등기 법무사",
    secondaryKeywords: ["여수 상속등기", "순천 상속등기", "목포 상속등기"],
    seoTitle: "전남 상속등기 법무사｜여수·순천·목포 토지와 주택 상속",
    metaDescription:
      "전남 상속등기 법무사. 여수·순천·목포 토지·주택 일괄 정리. 전남 지점 없이 부산에서 비대면으로 검토합니다.",
    h1: "전남 여러 지역의 상속부동산을 한 번에 정리하려면",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 전남에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "여수·순천·목포처럼 연안·내륙 도시가 나뉜 경우 토지·주택 필지 확인이 중요합니다. 상속인이 수도권에 거주하는 경우도 많습니다.",
    scenarioIds: ["farm-forest", "multi-gu", "heir-scattered"],
    propertyTypeIds: ["land", "farm", "house"],
    uniqueFaqIds: ["multi-prop", "visit-need", "jurisdiction-special"],
    relatedRegionSlugs: [
      "순천상속등기법무사",
      "여수상속등기법무사",
      "목포상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속부동산일괄등기"],
    ctaTitle: "전남 토지·주택 상속 문의",
    ctaDescription: "시·군과 필지 대략 개수를 알려주세요.",
  }),
  metro({
    slug: "전북상속등기법무사",
    regionName: "전북",
    primaryKeyword: "전북 상속등기 법무사",
    secondaryKeywords: ["전주 상속등기", "익산 상속등기", "군산 상속등기"],
    seoTitle: "전북 상속등기 법무사｜전주·익산·군산 부동산 상속 절차",
    metaDescription:
      "전북 상속등기 법무사. 전주·익산·군산 부동산 상속 절차·서류. 전북 지점 없이 부산 해운대에서 안내합니다.",
    h1: "전북 상속부동산의 필요서류와 비용",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 전북에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "전주·익산·군산 등 시별로 아파트·상가·토지가 섞인 경우 비용 항목을 구분해 설명합니다.",
    scenarioIds: ["apt-land-mix", "office-retail", "busan-remote"],
    propertyTypeIds: ["apt", "retail", "land"],
    uniqueFaqIds: ["cost-split", "deadline-3m", "branch-myth"],
    relatedRegionSlugs: [
      "전주상속등기법무사",
      "익산상속등기법무사",
      "군산상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속등기법무사"],
    ctaTitle: "전북 상속등기 서류·비용 확인",
    ctaDescription: "시 이름과 상속인 수를 알려주세요.",
  }),
  metro({
    slug: "경북상속등기법무사",
    regionName: "경북",
    primaryKeyword: "경북 상속등기 법무사",
    secondaryKeywords: ["포항 상속등기", "구미 상속등기", "경산 상속등기"],
    seoTitle: "경북 상속등기 법무사｜포항·구미·경산 여러 부동산 정리",
    metaDescription:
      "경북 상속등기 법무사. 포항·구미·경산 여러 부동산 정리. 경북 지점 없이 부산에서 비대면으로 검토합니다.",
    h1: "경북 아파트·토지 상속등기를 한 사무소에서 진행하려면",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 경북에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "포항·구미·경산처럼 산업·주거 도시가 나뉜 경우 아파트와 토지 목록을 분리해 확인합니다.",
    scenarioIds: ["multi-gu", "apt-land-mix", "farm-forest"],
    propertyTypeIds: ["apt", "land", "farm"],
    uniqueFaqIds: ["multi-prop", "jurisdiction-special", "visit-need"],
    relatedRegionSlugs: [
      "포항상속등기법무사",
      "구미상속등기법무사",
      "경산상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속부동산일괄등기"],
    ctaTitle: "경북 부동산 일괄 정리 문의",
    ctaDescription: "시·군과 아파트·토지 여부를 알려주세요.",
  }),
  metro({
    slug: "강원상속등기법무사",
    regionName: "강원",
    primaryKeyword: "강원 상속등기 법무사",
    secondaryKeywords: ["원주 상속등기", "춘천 상속등기", "강릉 상속등기"],
    seoTitle: "강원 상속등기 법무사｜원주·춘천·강릉 토지·주택 상속",
    metaDescription:
      "강원 상속등기 법무사. 원주·춘천·강릉 토지·주택 상속과 비대면 진행. 강원 지점 없이 부산 사무소에서 안내합니다.",
    h1: "강원도 상속부동산을 비대면으로 정리하는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 강원에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "토지·임야·농지와 주택이 함께 있는 경우가 많아 지번 확인이 중요합니다. 상속인이 수도권에 거주하는 상담도 많습니다.",
    scenarioIds: ["farm-forest", "heir-scattered", "busan-remote"],
    propertyTypeIds: ["land", "farm", "house"],
    uniqueFaqIds: ["visit-need", "multi-prop", "choose-lawyer"],
    relatedRegionSlugs: [
      "원주상속등기법무사",
      "춘천상속등기법무사",
      "강릉상속등기법무사",
      "지역별상속등기법무사",
    ],
    relatedServiceSlugs: ["전국상속등기법무사", "전국비대면법무사"],
    ctaTitle: "강원 토지·주택 상속 문의",
    ctaDescription: "시·군과 필지 개략만 알려주셔도 됩니다.",
  }),
  metro({
    slug: "제주상속등기법무사",
    regionName: "제주",
    primaryKeyword: "제주 상속등기 법무사",
    secondaryKeywords: ["제주 비대면 상속등기", "제주 부동산 상속"],
    seoTitle: "제주 상속등기 법무사｜육지에 살아도 제주 부동산 상속 가능",
    metaDescription:
      "제주 상속등기 법무사. 육지 거주 상속인의 제주 부동산 비대면 진행. 제주 지점 없이 부산 해운대에서 가능 여부를 검토합니다.",
    h1: "제주 상속부동산을 부산 법무사에게 맡기는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 제주에 별도 지점이 있는 것은 아닙니다. 관할 특례와 비대면 서류 전달을 검토합니다.",
    localIntro:
      "상속부동산은 제주에 있고 상속인은 육지에 거주하는 경우가 많습니다. 토지와 주택이 여러 필지로 나뉜 경우 방문 횟수를 줄이는 절차를 안내합니다.",
    scenarioIds: ["mainland-jeju", "farm-forest", "heir-scattered", "busan-remote"],
    propertyTypeIds: ["land", "farm", "house"],
    uniqueFaqIds: ["jeju-visit", "branch-myth", "visit-need", "jurisdiction-special"],
    relatedRegionSlugs: ["제주시상속등기법무사", "서귀포상속등기법무사", "지역별상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사", "전국비대면법무사"],
    ctaTitle: "제주 상속등기 가능 여부 확인",
    ctaDescription: "제주시·서귀포와 상속인 거주 지역을 알려주세요.",
  }),
];
