export type DistrictProfile = {
  key: string;
  label: string;
  type: "city" | "district";
  neighborhoods: string[];
  context: string;
};

export const districtProfiles: Record<string, DistrictProfile> = {
  busan: {
    key: "busan",
    label: "부산",
    type: "city",
    neighborhoods: [
      "해운대구",
      "반여동",
      "재송동",
      "센텀",
      "우동",
      "수영구",
      "광안동",
      "연제구",
      "연산동",
      "동래구",
      "북구",
      "덕천동",
      "금정구",
      "부곡동",
      "사상구",
      "엄궁동",
      "기장군",
    ],
    context:
      "부산은 광역시 전체에서 아파트·상가·토지·법인 사옥 등기 수요가 꾸준한 지역입니다. 관할 등기소와 법원이 사건별로 달라 절차와 서류를 미리 정리하는 것이 중요합니다.",
  },
  haeundae: {
    key: "haeundae",
    label: "해운대구",
    type: "district",
    neighborhoods: ["센텀", "재송동", "반여동", "우동", "좌동"],
    context:
      "해운대구는 센텀시티·마린시티·재송·반여 일대 고가 아파트와 상가, 법인 사옥이 밀집해 상속·매매·법인등기 문의가 많은 지역입니다.",
  },
  yeonje: {
    key: "yeonje",
    label: "연제구",
    type: "district",
    neighborhoods: ["연산동", "거제동"],
    context:
      "연제구는 연산·거제 일대 실거주 아파트와 상가, 소규모 법인 사무실이 많아 상속등기와 임원변경·법인등기 상담이 이어지는 지역입니다.",
  },
  suyeong: {
    key: "suyeong",
    label: "수영구",
    type: "district",
    neighborhoods: ["광안동", "민락동", "망미동"],
    context:
      "수영구는 광안리·민락·망미 일대 전월세·매매와 상속이 겹치는 사건이 많고, 부동산 가액에 따라 등기 비용과 절차가 달라지는 경우가 많습니다.",
  },
  dongnae: {
    key: "dongnae",
    label: "동래구",
    type: "district",
    neighborhoods: ["온천동", "사직동", "명륜동"],
    context:
      "동래구는 온천·사직·명륜 일대 오래된 주택과 재건축·재개발 이슈가 있는 부동산의 상속·등기 사건이 꾸준히 발생합니다.",
  },
  gijang: {
    key: "gijang",
    label: "기장군",
    type: "district",
    neighborhoods: ["기장읍", "정관읍", "일광읍"],
    context:
      "기장군은 토지·전원주택·농지 관련 상속과 법인 사옥 이전 등기 문의가 있으며, 관할 등기소와 거리를 고려한 일정 조율이 필요합니다.",
  },
  buk: {
    key: "buk",
    label: "북구",
    type: "district",
    neighborhoods: ["덕천동", "구포동", "화명동"],
    context:
      "북구는 덕천·구포·화명 일대 실거주 아파트와 상가가 많고, 상속·매매 등기와 개인회생 상담이 꾸준히 이어지는 지역입니다.",
  },
  sasang: {
    key: "sasang",
    label: "사상구",
    type: "district",
    neighborhoods: ["엄궁동", "감전동", "주례동"],
    context:
      "사상구는 엄궁·감전·주례 일대 신·구 아파트와 상가, 토지 상속 사건이 많으며 채무 관련 상속포기·개인회생 문의도 잦습니다.",
  },
  geumjeong: {
    key: "geumjeong",
    label: "금정구",
    type: "district",
    neighborhoods: ["부곡동", "서동", "금사동"],
    context:
      "금정구는 부곡·서동·금사 일대 주택·다가구·상가의 상속등기와 한정승인 사건이 발생하며, 부산대 인근 임대·매매 등기도 있습니다.",
  },
  centum: {
    key: "centum",
    label: "센텀",
    type: "district",
    neighborhoods: ["센텀시티", "재송동", "우동"],
    context:
      "센텀은 해운대구 핵심 업무지구로 법인 사옥·스타트업·고급 오피스가 밀집해 법인설립·임원변경·부동산 등기 수요가 집중되는 지역입니다.",
  },
};

export const serviceLabels: Record<string, string> = {
  "inheritance-registration": "상속등기",
  "inheritance-renunciation": "상속포기",
  "qualified-acceptance": "한정승인",
  "company-establishment": "법인설립등기",
  "director-change": "임원변경등기",
  "real-estate-registration": "부동산등기",
  "corporate-registration": "법인등기",
  "ownership-transfer": "소유권이전등기",
  "personal-rehabilitation": "개인회생",
  bankruptcy: "개인파산",
};
