export const seoBrand = {
  siteName: "다옴법무사사무소",
  representative: "안윤정 법무사",
  representativeName: "안윤정",
  jobTitle: "법무사",
  primaryRegion: "부산광역시",
  areaServed: [
    "부산광역시",
    "해운대구",
    "센텀",
    "센텀시티",
    "재송동",
    "반여동",
    "수영구",
    "연제구",
    "동래구",
    "기장군",
  ],
  /** JSON-LD serviceType / knowsAbout 전문분야 */
  services: [
    "상속등기",
    "상속포기",
    "한정승인",
    "부동산등기",
    "법인설립등기",
    "임원변경등기",
    "개인회생",
    "개인파산",
  ],
  targetKeywords: [
    "부산 법무사",
    "부산법무사",
    "해운대 법무사",
    "센텀 법무사",
    "부산 상속등기",
    "부산 상속포기",
    "부산 한정승인",
    "부산 부동산등기",
    "부산 법인설립등기",
    "부산 임원변경등기",
    "부산 개인회생",
    "부산 개인파산",
  ],
  defaultDescription:
    "부산 해운대구·센텀 소재 다옴법무사사무소. 상속등기, 상속포기, 한정승인, 부동산등기, 법인설립등기, 임원변경등기 상담.",
  address: {
    addressLocality: "해운대구",
    addressRegion: "부산광역시",
    streetAddress: "센텀동로 200 D동 1층 LAB9호",
  addressCountry: "KR",
    postalCode: "48058",
  },
  geo: {
    latitude: 35.1838851,
    longitude: 129.1209835,
  },
} as const;

export type SeoBrand = typeof seoBrand;
