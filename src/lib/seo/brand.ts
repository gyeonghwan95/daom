export const seoBrand = {
  siteName: "다옴법무사사무소",
  representative: "안윤정 법무사",
  representativeName: "안윤정",
  jobTitle: "법무사",
  areaServed: [
    "부산",
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
  services: [
    "상속등기",
    "상속포기",
    "한정승인",
    "부동산등기",
    "법인등기",
    "개인회생",
    "파산",
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
    "부산 법인등기",
    "부산 개인회생",
    "부산 파산",
  ],
  defaultDescription:
    "부산 해운대·센텀 다옴법무사사무소 안윤정 법무사. 상속등기, 부동산등기, 법인등기, 개인회생·파산 전문 상담.",
  address: {
    addressLocality: "해운대구",
    addressRegion: "부산광역시",
    streetAddress: "센텀동로 200 D동 1층 LAB9호",
    addressCountry: "KR",
  },
  geo: {
    latitude: 35.1689,
    longitude: 129.131,
  },
} as const;

export type SeoBrand = typeof seoBrand;
