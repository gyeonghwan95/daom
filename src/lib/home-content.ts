export const homeHero = {
  /** 첫 화면 머리말(위치) */
  locationLabel: "부산 해운대·센텀 다옴법무사사무소",
  /** 첫 화면 강조 문장 */
  headline: "복잡한 사정은 꼼꼼히. 필요한 절차는 명확하게.",
  /** 첫 화면 설명 */
  lead: "상속·부동산·법인등기와 개인회생·파산, 안윤정 법무사가 직접 상담하고 진행합니다.",
  ctaNote: "어떤 일인지와 연락처만 남기시면 절차·비용·준비할 것을 먼저 안내해 드리고, 맡기기로 하시면 그때 진행합니다.",
  /** 작은 신뢰 근거 — 기존 상세 링크로 연결 */
  proofLinks: [
    { label: "직접 상담·진행", href: "/about" },
    { label: "대한법무사협회장 표창", href: "/about#awards" },
    { label: "방송·강의 이력", href: "/media" },
  ],
  /** 업무 바로가기(작은 링크) */
  quickLinks: [
    { label: "상속", href: "/상속" },
    { label: "부동산등기", href: "/부산부동산등기" },
    { label: "법인등기", href: "/부산법인등기" },
    { label: "개인회생·파산", href: "/개인회생파산" },
  ],
  officeName: "다옴법무사사무소",
  h1: "부산 법무사 안윤정",
  representative: "안윤정 법무사",
  subtitle: "해운대·센텀에서 부산 전역 사건을 상담합니다",
  sub: "부산 법무사를 찾고 있다면 필요한 업무명부터 정확히 알고 오실 필요는 없습니다. 다옴법무사사무소 안윤정 법무사가 상속등기·부동산등기·법인등기·개인회생·파산 등 현재 상황을 확인하고 필요한 절차와 준비서류부터 안내합니다. 사무소는 부산 해운대구 센텀에 있습니다.",
  promise: "서류 준비 전에도 · 법무사 직접 상담",
  proof: ["법무사 직접 상담", "대한법무사협회장 표창", "해운대·센텀 법무사사무소"] as const,
  serviceTags: ["상속등기", "부동산등기", "법인등기", "개인회생·파산"] as const,
  locationHint: "부산광역시 해운대구 센텀동로 200 · 재송역·센텀역 도보 5분",
  mobileCta: "지금 전화하기",
  mobileCtaNote: "카카오톡·네이버 톡톡으로도 바로 남기실 수 있습니다",
  ctaPrimary: "1분만에 문의하기",
  contactTitle: "부담 없이 연락해 주세요",
  contactSub: "전화 · 카카오톡 · 네이버 톡톡 — 편한 방법 하나만 고르시면 됩니다.",
  scrollHint: "소개·후기 더 보기",
  scrollHintDetail: "안윤정 법무사 소개",
} as const;

export const homeSituationChips = [
  { label: "상속 종합", situationId: "inheritance-hub", href: "/상속" },
  { label: "상속 절차", situationId: "inheritance-choice", href: "/부산상속법무사" },
  { label: "상속등기", situationId: "inheritance-registration", href: "/부산상속등기" },
  { label: "부동산등기", situationId: "real-estate-trade", href: "/부산부동산등기" },
  { label: "법인등기", situationId: "corporate", href: "/부산법인등기" },
  { label: "개인회생·파산", situationId: "rehab-bankruptcy", href: "/개인회생파산" },
] as const;

export const homeServicesIntro = {
  title: "이런 일로 찾아오십니다",
  description:
    "사건마다 필요한 서류와 순서가 다릅니다. 지금 상황에 맞는 업무를 확인해 보세요.",
} as const;

export const homeFeaturedServiceSlugs = [
  "inheritance-registration",
  "real-estate-registration",
  "corporate-registration",
  "personal-rehabilitation",
] as const;

export const homeTrust = {
  title: "안윤정 법무사",
  quote:
    "법률 용어보다, 지금 무엇을 해야 하는지가 더 중요합니다. 불안하신 부분부터 편하게 말씀해 주세요.",
  identity:
    "다옴법무사사무소는 부산광역시 해운대구 센텀에 있는 법무사 사무소입니다. 안윤정 법무사가 상속등기·부동산등기·법인등기·개인회생·파산을 직접 상담하고 진행합니다. 부동산이나 법인 본점이 부산 어디에 있든 같은 마음으로 꼼꼼히 챙겨 드립니다.",
  points: [
    {
      title: "직접 상담·진행",
      body: "상담부터 등기·신청까지 법무사가 직접 맡습니다.",
    },
    {
      title: "절차를 쉽게 설명",
      body: "기한, 서류, 비용을 단계별로 알기 쉽게 안내합니다.",
    },
    {
      title: "해운대·센텀 밀착",
      body: "동해선 재송역·센텀역에서 걸어서 오실 수 있고, 부산 어느 지역 사건이든 똑같이 정성껏 맡습니다.",
    },
  ],
} as const;

export const homeInsightsIntro = {
  title: "먼저 읽어보셔도 좋습니다",
  description: "비슷한 상황의 사례와 법률칼럼을 정리해 두었습니다.",
} as const;

export const homeFaqIntro = {
  title: "상담 전 자주 묻는 질문",
} as const;

/** 홈 FAQ — 「부산 법무사」 검색의도에 맞춘 질문. 파산·유상증자 FAQ를 앞에 두지 않는다. */
export const homeFaqs = [
  {
    question: "부산 법무사는 어떤 일을 하나요?",
    answer:
      "법무사는 상속등기·부동산등기·법인등기·개인회생·파산처럼 등기소·법원에 내는 서류 작성과 신청을 맡습니다. 다옴법무사사무소 안윤정 법무사가 지금 상황에 맞는 절차와 준비서류부터 안내합니다. 소송·형사 변론이 필요하면 변호사 업무이므로 그 범위는 분명히 말씀드립니다.",
  },
  {
    question: "해운대 센텀에 있는데 부산 다른 구 사건도 맡길 수 있나요?",
    answer:
      "가능합니다. 사무소는 해운대구 센텀동로 200에 있고, 상담은 부산 전역 사건을 같은 기준으로 진행합니다. 등기 관할은 거주지보다 부동산·법인 본점 소재지를 따릅니다. 구·군별 안내는 부산 법률지도에서, 사무소가 다른 구여도 되는지는 등기 관할과 사무소 위치 안내에서 확인하실 수 있습니다. 방문이 어려우면 전화·카카오톡으로 먼저 상황을 남겨 주세요.",
  },
  {
    question: "법무사와 변호사는 어떻게 다른가요?",
    answer:
      "법무사는 등기·서류 작성·법원·등기소 제출 등 비송·등기 실무가 중심입니다. 변호사는 소송·형사 변론 등 대리 범위가 넓습니다. 네이버에서 ‘부산 법무사’를 검색하면 로펌이 함께 보이기도 하니, 등기·상속 서류·법인변경·개인회생 신청이라면 법무사 상담이 맞습니다.",
  },
  {
    question: "상담은 어떻게 시작하면 되나요?",
    answer:
      "전화·카카오톡·네이버 톡톡 중 편한 방법으로 현재 상황만 알려 주시면 됩니다. 업무명을 몰라도 됩니다. 방문은 평일 09:00–18:00(점심 12:00–13:00) 예약 후 이용해 주세요. 서류가 없어도 1차 안내는 가능한 경우가 많습니다.",
  },
] as const;

export const homeReviewedOn = "2026-08-27";
/** 실제 홈 본문 수정일. 프로필·안내의 전문가 최종 확인일과 구분한다. */
export const homeModifiedOn = "2026-10-14";

export const homeClosing = {
  eyebrow: "안윤정 법무사",
  title: "지금 상황을 말씀해 주시면,\n다음 절차부터 안내해 드립니다.",
  description:
    "업무명을 몰라도 됩니다. 지금 겪으시는 일만 편하게 남겨 주시면, 필요한 순서와 준비서류부터 안내합니다.",
  steps: [
    { index: "01", label: "상황만 남겨 주세요" },
    { index: "02", label: "절차와 서류를 안내합니다" },
    { index: "03", label: "법무사가 직접 진행합니다" },
  ],
} as const;

export const homeSeoKeywords = [
  "부산 법무사",
  "부산법무사",
  "해운대 법무사",
  "센텀 법무사",
  "부산 상속등기",
  "부산 법인등기",
] as const;
