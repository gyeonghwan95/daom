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
      "서울 법무사 상속등기를 검색할 때 확인할 점. 서울 지점이 아닌 부산 해운대 사무소에서 관할 특례·비대면 진행으로 서울 소재 상속부동산 상담부터 신청까지 진행합니다.",
    h1: "서울에 있는 상속부동산도 부산 법무사에게 맡길 수 있을까",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 서울에 별도 지점이 있는 것은 아닙니다. 상속등기의 관할 특례와 비대면 서류 전달 방식을 검토하여 서울 소재 부동산도 진행 바로 진행 방법을 안내합니다.",
    localIntro:
      "서울 법무사 상속등기를 검색하셔도, 반드시 서울에 사무소가 있어야만 맡길 수 있는 것은 아닙니다. 상속인이 지방·해외에 있거나 여러 구에 아파트·상가가 분산된 경우, 협의분할 후 매도를 예정한 경우처럼 거리보다 서류·관할 정리가 중요합니다.",
    scenarioIds: ["heir-scattered", "multi-gu", "office-retail", "sell-first"],
    propertyTypeIds: ["apt", "retail", "house"],
    uniqueFaqIds: ["seoul-search", "branch-myth", "gangnam-apt", "jurisdiction-special"],
    relatedRegionSlugs: [
      "강남구상속등기법무사",
      "서초구상속등기법무사",
      "송파구상속등기법무사",
      "강동구상속등기법무사",
      "관악구상속등기법무사",
      "구로구상속등기법무사",
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
      "다옴법무사사무소는 부산 해운대구에 있으며 경기에 별도 지점이 있는 것은 아닙니다. 관할 특례와 비대면 방식을 검토하여 경기 소재 부동산도 진행 바로 진행 방법을 안내합니다.",
    localIntro:
      "경기도는 31개 시·군이라 부동산마다 관할 등기소가 다릅니다. 수원·용인·고양처럼 여러 시에 흩어진 상속부동산은 2025년 1월 31일부터 관할이 아닌 등기소에서도 상속등기를 처리할 수 있어(부동산등기법 제7조의3), 접수처를 한곳으로 모을 수 있는지부터 봅니다. 경기 광주시는 광주광역시와 이름이 같아 등기부의 '경기도 광주시' 표기로 구분합니다.",
    scenarioIds: ["newtown-outer", "multi-gu", "apt-land-mix", "heir-scattered"],
    propertyTypeIds: ["apt", "land", "farm"],
    uniqueFaqIds: ["gyeonggi-cities", "multi-prop", "branch-myth", "cost-split"],
    relatedRegionSlugs: [
      "수원상속등기법무사",
      "성남상속등기법무사",
      "분당상속등기법무사",
      "시흥상속등기법무사",
      "경기광주상속등기법무사",
      "이천상속등기법무사",
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
      "인천은 송도·청라·영종처럼 새로 조성된 지역의 아파트와 강화·옹진의 토지·섬 부동산이 한 상속에 섞이는 경우가 있습니다. 행정체제 개편으로 구 이름이 바뀐 지역(중구·동구·서구 일부)은 등기부의 옛 주소와 현재 주소를 대조해 상속부동산 목록을 만듭니다. 섬 토지는 토지대장 면적과 등기부 면적이 다른지도 함께 확인합니다.",
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
      "경남 상속등기 법무사. 김해 아파트·양산 토지·창원 상가처럼 여러 시·군 부동산을 한 사무소에서 검토. 경남 지점 없이 부산 해운대에서 관할 특례·방문·비대면 바로 진행 방법을 안내합니다.",
    h1: "경남에 있는 상속부동산도 부산 법무사에게 맡길 수 있습니다",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 경남에 별도 지점이 있는 것은 아닙니다. 관할 특례와 방문·비대면 진행 바로 진행 방법을 안내합니다.",
    localIntro:
      "경남은 18개 시·군이고, 상속포기·한정승인 신고처는 고인의 마지막 주소에 따라 다릅니다. 창원 의창·성산·진해와 김해는 창원지방법원 본원, 마산합포·마산회원은 마산지원, 통영·거제·고성은 통영지원, 진주·사천·하동·남해·산청은 진주지원, 밀양·창녕은 밀양지원입니다. 2010년 창원·마산·진해 통합 전 주소가 등기부에 남아 있으면 현재 주소와 함께 확인합니다.",
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
    primaryKeyword: "울산 상속 법무사",
    secondaryKeywords: [
      "울산 상속등기 법무사",
      "울산 아파트 상속등기",
      "울산 비대면 상속등기",
    ],
    seoTitle: "울산 상속등기 법무사｜아파트·토지 비대면 상속등기",
    metaDescription:
      "울산 상속 법무사·상속등기 안내. 울산 부동산과 부산·타지역 거주 상속인, 해외·미성년 상속인, 방문 전 자료확인·원본서류 전달 순서를 정리합니다. 울산 지점 없이 부산 해운대 사무소에서 검토합니다.",
    h1: "울산 상속부동산을 부산 방문 없이 맡기는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 울산에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "울산은 중구·남구·동구·북구·울주군 5개 구·군입니다. 상속포기·한정승인은 울산가정법원에 신고하며, 이 법원은 경남 양산시도 함께 관할합니다. 울주군의 공장 부지·농지와 시내 아파트가 한 상속에 함께 있으면 토지대장과 등기부 면적부터 맞춘 뒤 등기 목록을 만듭니다.",
    scenarioIds: ["heir-scattered", "apt-land-mix", "busan-remote"],
    propertyTypeIds: ["apt", "land", "retail"],
    uniqueFaqIds: ["visit-need", "deadline-3m", "branch-myth"],
    relatedRegionSlugs: ["울산남구상속등기법무사", "울주군상속등기법무사", "지역별상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사", "/부산상속법무사", "울산상속포기한정승인"],
    ctaTitle: "울산 상속 가능 여부 확인",
    ctaDescription:
      "구·군, 부동산 종류, 상속인 거주 지역, 채무 여부를 알려주시면 서류와 방문 필요 여부를 안내합니다.",
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
      "대전 상속등기 법무사. 상속인이 타지역에 살아도 비대면 끝까지 진행. 대전 지점 없이 부산 사무소에서 안내합니다.",
    h1: "대전 상속부동산을 비대면으로 정리하려면",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 대전에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "상속인이 수도권·영남에 흩어져 있어도 협의·위임 일정을 맞춰 진행할 수 있는지 먼저 확인합니다.",
    scenarioIds: ["heir-scattered", "busan-remote", "sell-first"],
    propertyTypeIds: ["apt", "house", "land"],
    uniqueFaqIds: ["visit-need", "multi-prop", "deadline-3m"],
    relatedRegionSlugs: ["대전유성구상속등기법무사", "대전서구상속등기법무사", "지역별상속등기법무사"],
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
      "세종 상속등기 법무사. 아파트·상가 절차와 비용. 세종 지점 없이 부산 해운대에서 비대면으로 상담부터 신청까지 진행합니다.",
    h1: "세종시 상속부동산을 방문 없이 진행하는 방법",
    disclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 세종에 별도 지점이 있는 것은 아닙니다.",
    localIntro:
      "세종특별자치시는 2012년 옛 충남 연기군 전역과 공주시·청원군 일부로 출범했습니다. 오래된 등기부에는 '연기군'이나 '공주시' 주소가 그대로 남아 있는 경우가 있어, 현재 동·읍·면 주소와 지번을 대조해 상속부동산을 특정합니다. 상속포기·한정승인은 고인의 마지막 주소지를 관할하는 가정법원에 신고합니다.",
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
      "충남은 15개 시·군입니다. 2012년 연기군 전역이 세종시로 넘어갔고 당진군은 당진시가 되었기 때문에, 오래된 등기부의 주소가 지금 행정구역과 다를 수 있습니다. 천안·아산의 아파트와 서산·홍성·예산의 농지가 한 상속에 함께 있으면 주택과 농지를 목록에서 나눠 서류를 준비합니다.",
    scenarioIds: ["multi-gu", "farm-forest", "apt-land-mix"],
    propertyTypeIds: ["apt", "land", "farm", "house"],
    uniqueFaqIds: ["multi-prop", "cost-split", "branch-myth"],
    relatedRegionSlugs: ["천안상속등기법무사", "아산상속등기법무사", "당진상속등기법무사", "지역별상속등기법무사"],
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
      "충북은 11개 시·군입니다. 2014년 청원군이 청주시로 통합되어, 오래된 등기부에 '청원군' 주소가 남아 있으면 현재 청주시 구·읍·면 주소와 지번을 대조합니다. 청주 아파트와 충주·제천 쪽 토지가 함께 있으면 상속등기 관할 특례로 접수처를 모을 수 있는지 먼저 봅니다(부동산등기법 제7조의3).",
    scenarioIds: ["farm-forest", "heir-scattered", "busan-remote"],
    propertyTypeIds: ["house", "land", "farm"],
    uniqueFaqIds: ["jurisdiction-special", "visit-need", "deadline-3m"],
    relatedRegionSlugs: ["청주상속등기법무사", "충주상속등기법무사", "제천상속등기법무사", "지역별상속등기법무사"],
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
      "광주광역시는 동구·서구·남구·북구·광산구 5개 구입니다. 경기도 광주시와 이름이 같아, 등기부와 가족관계 서류의 '광주광역시'·'경기도 광주시' 표기부터 확인합니다. 상속인이 수도권·부산 등 다른 지역에 흩어져 있어도 협의서와 인감 서류를 우편으로 모아 진행할 수 있습니다.",
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
      "전남은 22개 시·군으로 섬과 연안 지역이 많아, 여러 필지로 나뉜 토지나 등기가 없는 건물이 상속재산에 섞이는 경우가 있습니다. 여수·순천·목포 등 도시 아파트와 섬 토지를 한 번에 정리할 때는 토지대장·건축물대장과 등기부를 대조해 누락을 막습니다. 상속인이 수도권에 사는 경우 서류는 우편으로 모읍니다.",
    scenarioIds: ["farm-forest", "multi-gu", "heir-scattered"],
    propertyTypeIds: ["land", "farm", "house"],
    uniqueFaqIds: ["multi-prop", "visit-need", "jurisdiction-special"],
    relatedRegionSlugs: [
      "순천상속등기법무사",
      "여수상속등기법무사",
      "목포상속등기법무사",
      "광양상속등기법무사",
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
      "전북은 14개 시·군이며 2024년 1월 전북특별자치도가 되었습니다. 등기부에는 '전라북도' 표기가 그대로 남아 있는 경우가 많아, 상속부동산 목록을 만들 때 옛 표기와 현재 표기를 함께 확인합니다. 전주·군산·익산의 주택과 김제·정읍 등의 농지가 함께 있으면 목록을 나눠 서류를 준비합니다.",
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
      "경북은 22개 시·군입니다. 2023년 7월 군위군이 대구광역시로 편입되어, 군위 부동산은 주소 표기를 대구 기준으로 다시 확인합니다. 상속포기·한정승인 신고처는 고인의 마지막 주소에 따라 포항은 대구가정법원 포항지원, 경주는 경주지원, 김천·구미는 김천지원, 영천·경산·청도·칠곡·성주·고령은 대구가정법원 본원입니다.",
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
      "강원은 18개 시·군이며 2023년 6월 강원특별자치도가 되었습니다. 등기부에는 '강원도' 표기가 남아 있는 경우가 많아 현재 주소와 함께 확인합니다. 춘천·원주 아파트와 홍천·평창 등 산간 임야가 함께 상속되면 임야는 공유 지분인 경우가 있어 지분 목록을 먼저 만듭니다.",
    scenarioIds: ["farm-forest", "heir-scattered", "busan-remote"],
    propertyTypeIds: ["land", "farm", "house"],
    uniqueFaqIds: ["visit-need", "multi-prop", "choose-lawyer"],
    relatedRegionSlugs: [
      "원주상속등기법무사",
      "춘천상속등기법무사",
      "강릉상속등기법무사",
      "속초상속등기법무사",
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
      "제주특별자치도는 제주시와 서귀포시 두 행정시로 나뉩니다. 섬 밖에 사는 상속인이 많아 협의서·인감증명서를 우편으로 모으는 일정이 전체 기간을 좌우하는 경우가 많습니다. 과수원 같은 농지와 주택이 함께 있으면 토지·건물 목록을 나눠 준비합니다.",
    scenarioIds: ["mainland-jeju", "farm-forest", "heir-scattered", "busan-remote"],
    propertyTypeIds: ["land", "farm", "house"],
    uniqueFaqIds: ["jeju-visit", "branch-myth", "visit-need", "jurisdiction-special"],
    relatedRegionSlugs: ["제주시상속등기법무사", "서귀포상속등기법무사", "지역별상속등기법무사"],
    relatedServiceSlugs: ["전국상속등기법무사", "전국비대면법무사"],
    ctaTitle: "제주 상속등기 가능 여부 확인",
    ctaDescription: "제주시·서귀포와 상속인 거주 지역을 알려주세요.",
  }),
];
