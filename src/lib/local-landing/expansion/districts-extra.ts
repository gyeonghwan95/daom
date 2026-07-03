import type { DistrictProfile } from "@/lib/local-landing/districts";

/** SEO 확장용 추가 지역 프로필 */
export const extraDistrictProfiles: Record<string, DistrictProfile> = {
  donggu: {
    key: "donggu",
    label: "동구",
    type: "district",
    neighborhoods: ["부산역", "초량동", "수정동", "범일동"],
    context:
      "동구는 부산역·초량·범일 일대 KTX·항만·상가가 밀집한 관문 지역으로, 역세권 상가·주택의 매매·상속등기와 소규모 법인·채권(지급명령·공탁) 문의가 함께 이어집니다.",
    registryOffice: "중부산등기소",
    registryAddress: "부산광역시 동래구 중앙대로 1333",
    courtNote: "민사·가사 일부는 부산지방법원 본원, 등기는 부동산 소재지 관할",
    demandNotes: [
      "부산역 인근 상가·오피스 매매 등기",
      "초량동 다세대·상가 상속등기",
      "역세권 법인 사무실 설립·변경등기",
    ],
  },
  busanjin: {
    key: "busanjin",
    label: "부산진구",
    type: "district",
    neighborhoods: ["서면", "부전동", "범천동", "전포동"],
    context:
      "부산진구는 서면·부전·전포 일대 상업지와 오피스·상가 밀집 지역으로, 매매·상속·법인등기와 채무 관련 상담이 많이 이어지는 곳입니다.",
  },
  gwanganri: {
    key: "gwanganri",
    label: "광안리",
    type: "district",
    neighborhoods: ["광안동", "민락동", "광안리"],
    context:
      "광안리·광안동은 해변 인근 아파트·상가·전세 밀집 지역으로, 매매·전세권·상속등기 문의가 계절·학기와 함께 늘어나는 생활권입니다.",
    registryOffice: "남부산등기소",
    demandNotes: [
      "광안리 인근 아파트·상가 매매 등기",
      "전세권 설정·말소 등기",
      "광안동 오래된 주택 상속등기",
    ],
  },
  namgu: {
    key: "namgu",
    label: "남구",
    type: "district",
    neighborhoods: ["대연동", "용호동", "문현동"],
    context:
      "남구는 대연·용호·문현 일대 주거·상가가 혼재하고, 문현금융단지 인근 법인·부동산 등기 문의가 함께 발생합니다.",
  },
  junggu: {
    key: "junggu",
    label: "중구",
    type: "district",
    neighborhoods: ["남포동", "중앙동", "보수동"],
    context:
      "중구는 원도심 상가·오래된 건물의 상속·매매 등기와 소규모 법인 사무실 등기 수요가 있는 지역입니다.",
  },
  seogu: {
    key: "seogu",
    label: "서구",
    type: "district",
    neighborhoods: ["충무동", "아미동", "동대신동"],
    context:
      "서구는 충무·동대신 일대 주택·상가의 상속등기와 전세·매매 관련 등기 문의가 꾸준합니다.",
  },
  yeongdo: {
    key: "yeongdo",
    label: "영도구",
    type: "district",
    neighborhoods: ["남항동", "동삼동", "봉래동"],
    context:
      "영도구는 항만·조선 관련 업체와 주거지가 함께 있어 법인등기·상속·부동산 등기 사건이 다양합니다.",
  },
  gangseo: {
    key: "gangseo",
    label: "강서구",
    type: "district",
    neighborhoods: ["명지", "명지국제신도시", "가락동"],
    context:
      "강서구는 명지·명지국제신도시 일대 신도시 아파트·상가와 법인 사옥 등기 수요가 빠르게 늘고 있는 지역입니다.",
  },
  saha: {
    key: "saha",
    label: "사하구",
    type: "district",
    neighborhoods: ["하단동", "괴정동", "당리동"],
    context:
      "사하구는 하단·괴정 일대 실거주 아파트와 상가의 상속·매매 등기 문의가 많습니다.",
  },
  jaesong: {
    key: "jaesong",
    label: "재송동",
    type: "district",
    neighborhoods: ["재송동", "센텀", "센텀시티"],
    context:
      "재송동은 센텀시티와 인접한 주거·업무 복합 지역으로, 아파트 상속·법인 사옥·오피스 등기 문의가 집중됩니다.",
  },
  banyeo: {
    key: "banyeo",
    label: "반여동",
    type: "district",
    neighborhoods: ["반여동", "반송동", "좌동"],
    context:
      "반여동은 해운대구 동부 주거지로, 고가 아파트 상속·매매와 가족 간 지분 이전 등기 사건이 잦습니다.",
  },
  munhyeon: {
    key: "munhyeon",
    label: "문현동",
    type: "district",
    neighborhoods: ["문현동", "문현금융단지", "부산국제금융센터"],
    context:
      "문현동은 금융·법률·전문서비스 업체가 밀집한 지역으로, 법인등기·임원변경·사옥 매매 등기 수요가 높습니다.",
  },
  myeongji: {
    key: "myeongji",
    label: "명지",
    type: "district",
    neighborhoods: ["명지", "명지국제신도시", "강서구"],
    context:
      "명지·명지국제신도시는 신축 아파트·상가·법인 사옥이 빠르게 늘며, 설립등기와 소유권이전 수요가 큽니다.",
  },
  ecodelta: {
    key: "ecodelta",
    label: "에코델타시티",
    type: "district",
    neighborhoods: ["에코델타시티", "강서구", "명지"],
    context:
      "에코델타시티는 스마트시티 조성 지역으로, 신축 부동산·입주 기업의 법인등기와 등기 절차 문의가 늘고 있습니다.",
  },
  jeonggwan: {
    key: "jeonggwan",
    label: "정관",
    type: "district",
    neighborhoods: ["정관읍", "정관신도시", "기장군"],
    context:
      "정관·정관신도시는 기장군 내 신흥 주거·산업 단지로, 토지·주택 상속과 법인 등기 문의가 함께 발생합니다.",
  },
  myeongrye: {
    key: "myeongrye",
    label: "명례일반산업단지",
    type: "district",
    neighborhoods: ["명례일반산업단지", "기장군", "일광읍"],
    context:
      "명례일반산업단지는 기장군 내 80여 개 기업이 입주한 산업단지로, 법인등기·임원변경·사업장 관련 등기 수요가 많습니다.",
  },
};
