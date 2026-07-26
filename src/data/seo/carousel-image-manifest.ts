/**
 * 캐러셀 대표이미지 manifest — 실제 존재 URL만.
 * 생성물: /images/generated/carousel/<category>/<file>.webp (1200×800)
 * status가 approved|applied 일 때만 metadata·캐러셀·ItemList에 연결된다.
 */

export type CarouselLayoutVariant =
  | "portrait-left"
  | "portrait-right"
  | "portrait-center"
  | "document-focus"
  | "illustration-focus"
  | "lecture-focus"
  | "minimal-type";

export type CarouselImageStatus =
  | "planned"
  | "generated"
  | "review-required"
  | "approved"
  | "applied";

export type CarouselImageManifestItem = {
  id: string;
  pageUrl: string;
  pageTitle: string;
  pageType: string;
  parentHub?: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  /** attorney-photo-inventory id (인물 사용 시) */
  sourcePhotoId?: string;
  /** 인물 외 실사 소스 (public 경로) */
  sourcePhotoPath?: string;
  outputFileName: string;
  outputPath: string;
  width: number;
  height: number;
  headline: string;
  subheadline?: string;
  layoutVariant: CarouselLayoutVariant;
  visualConcept: string;
  topicIcon?: "family" | "calendar" | "scale" | "building" | "key" | "seal" | "court" | "doc" | "check" | "chart";
  backgroundConcept: string;
  accent: "navy" | "warm" | "sage" | "slate";
  /** sharp resize position 오버라이드 (기본 centre). 얼굴 훼손 방지용 */
  cropPosition?: "centre" | "top" | "bottom" | "left" | "right" | "right top" | "left top";
  alt: string;
  carouselCandidate: boolean;
  ogImageRequired: boolean;
  bodyImageRequired: boolean;
  status: CarouselImageStatus;
};

const W = 1200;
const H = 800;

function out(category: string, file: string) {
  return {
    outputFileName: file,
    outputPath: `/images/generated/carousel/${category}/${file}`,
    width: W,
    height: H,
  };
}

export const CAROUSEL_IMAGE_MANIFEST: CarouselImageManifestItem[] = [
  {
    id: "hub-services",
    pageUrl: "/services",
    pageTitle: "업무안내",
    pageType: "service-hub",
    primaryKeyword: "부산 법무사 업무",
    sourcePhotoId: "studio-profile",
    ...out("hub", "services-hub.webp"),
    headline: "업무안내",
    subheadline: "상속·부동산·법인·회생",
    layoutVariant: "portrait-right",
    visualConcept: "스튜디오 프로필 우측 + 좌측 업무 4분류 타이포",
    topicIcon: "check",
    backgroundConcept: "크림 바탕, 네이비 세로 패널",
    accent: "navy",
    alt: "다옴법무사사무소 업무안내 — 상속·부동산·법인·회생",
    carouselCandidate: false,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-inheritance-registration",
    pageUrl: "/services/inheritance-registration",
    pageTitle: "상속등기",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "상속등기",
    sourcePhotoPath: "/image/썸네일-등기필증_상속.jpg",
    ...out("inheritance", "inheritance-registration.webp"),
    headline: "상속등기",
    subheadline: "서류·절차·비용 확인",
    layoutVariant: "document-focus",
    visualConcept: "상속 등기필증 실사 + 가족관계 선 그래픽",
    topicIcon: "family",
    backgroundConcept: "따뜻한 중성(warm beige) 블록",
    accent: "warm",
    alt: "상속등기 서류·절차·비용 안내",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-inheritance-renunciation",
    pageUrl: "/services/inheritance-renunciation",
    pageTitle: "상속포기",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "상속포기",
    sourcePhotoPath: "/image/썸네일-법원절차.jpg",
    ...out("inheritance", "inheritance-renunciation.webp"),
    headline: "상속포기",
    subheadline: "3개월 안에 먼저 확인",
    layoutVariant: "document-focus",
    visualConcept: "법원 절차 실사 + 3개월 캘린더 마크",
    topicIcon: "calendar",
    backgroundConcept: "슬레이트 톤 상단 밴드",
    accent: "slate",
    alt: "상속포기 — 3개월 기한 확인",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-qualified-acceptance",
    pageUrl: "/services/qualified-acceptance",
    pageTitle: "한정승인",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "한정승인",
    sourcePhotoId: "desk-review",
    ...out("inheritance", "qualified-acceptance.webp"),
    headline: "한정승인",
    subheadline: "채무가 불확실할 때",
    layoutVariant: "portrait-left",
    cropPosition: "top",
    visualConcept: "서류 검토 실사(시선 아래) 좌측 + 재산/채무 비교 도식",
    topicIcon: "scale",
    backgroundConcept: "크림 + 네이비 비교 블록",
    accent: "navy",
    alt: "한정승인 — 채무 불확실 시 검토",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-real-estate",
    pageUrl: "/services/real-estate-registration",
    pageTitle: "부동산등기",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "부동산등기",
    sourcePhotoPath: "/image/썸네일-등기소.jpg",
    ...out("real-estate", "real-estate-registration.webp"),
    headline: "부동산등기",
    subheadline: "이전·말소·담보 정리",
    layoutVariant: "document-focus",
    visualConcept: "등기소 실사 + 건물 선 그래픽",
    topicIcon: "building",
    backgroundConcept: "네이비 하단 밴드",
    accent: "navy",
    alt: "부동산등기 — 소유권이전·말소·담보",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-ownership-transfer",
    pageUrl: "/services/ownership-transfer",
    pageTitle: "매매등기",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "소유권이전등기",
    sourcePhotoPath: "/image/썸네일-등기필증_매매증여.jpg",
    ...out("real-estate", "ownership-transfer.webp"),
    headline: "매매등기",
    subheadline: "잔금부터 명의이전까지",
    layoutVariant: "document-focus",
    visualConcept: "매매·증여 필증 실사 + 열쇠·화살표 흐름",
    topicIcon: "key",
    backgroundConcept: "웜 베이지 대각 블록",
    accent: "warm",
    alt: "매매 소유권이전등기 — 잔금부터 이전까지",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-corporate",
    pageUrl: "/services/corporate-registration",
    pageTitle: "법인등기",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "법인등기",
    sourcePhotoPath: "/image/썸네일-계약임원.jpg",
    ...out("corporate", "corporate-registration.webp"),
    headline: "법인등기",
    subheadline: "설립·임원·본점 변경",
    layoutVariant: "document-focus",
    visualConcept: "계약·임원 실사 + 법인인감 그래픽",
    topicIcon: "seal",
    backgroundConcept: "네이비 코너 블록",
    accent: "navy",
    alt: "법인등기 — 설립·임원변경·본점이전",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-company-establishment",
    pageUrl: "/services/company-establishment",
    pageTitle: "법인설립",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "법인설립",
    ...out("corporate", "company-establishment.webp"),
    headline: "법인설립",
    subheadline: "준비부터 등기까지",
    layoutVariant: "minimal-type",
    visualConcept: "정관·의사록 체크리스트 타이포 중심",
    topicIcon: "check",
    backgroundConcept: "크림 + 세이지 체크 블록",
    accent: "sage",
    alt: "법인설립등기 — 준비부터 등기까지",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-director-change",
    pageUrl: "/services/director-change",
    pageTitle: "임원변경",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "임원변경등기",
    ...out("corporate", "director-change.webp"),
    headline: "법인 임원변경",
    subheadline: "임기와 등기기한 확인",
    layoutVariant: "minimal-type",
    visualConcept: "임기 타임라인 그래픽 중심",
    topicIcon: "calendar",
    backgroundConcept: "슬레이트 타임라인 밴드",
    accent: "slate",
    alt: "법인 임원변경등기 — 임기·기한 확인",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-rehabilitation",
    pageUrl: "/services/personal-rehabilitation",
    pageTitle: "개인회생",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "개인회생",
    sourcePhotoPath: "/image/썸네일-동부지원.jpg",
    ...out("rehabilitation", "personal-rehabilitation.webp"),
    headline: "개인회생",
    subheadline: "자격·서류·변제계획",
    layoutVariant: "document-focus",
    visualConcept: "법원 실사 + 변제계획 차트 (차분한 톤)",
    topicIcon: "chart",
    backgroundConcept: "네이비 안정 블록",
    accent: "navy",
    alt: "개인회생 — 자격·서류·변제계획",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "svc-bankruptcy",
    pageUrl: "/services/bankruptcy",
    pageTitle: "개인파산",
    pageType: "service-detail",
    parentHub: "/services",
    primaryKeyword: "개인파산",
    sourcePhotoPath: "/image/썸네일-서부지원.jpg",
    ...out("rehabilitation", "bankruptcy.webp"),
    headline: "개인파산",
    subheadline: "면책까지 절차 확인",
    layoutVariant: "document-focus",
    visualConcept: "법원 실사 + 면책 단계 도식",
    topicIcon: "court",
    backgroundConcept: "슬레이트 하단 밴드",
    accent: "slate",
    alt: "개인파산·면책 절차 안내",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "local-busan-lawyer",
    pageUrl: "/부산법무사",
    pageTitle: "부산 법무사",
    pageType: "region-hub",
    primaryKeyword: "부산 법무사",
    sourcePhotoId: "desk-front",
    ...out("hub", "busan-lawyer.webp"),
    headline: "부산 법무사",
    subheadline: "해운대·센텀 상담",
    layoutVariant: "portrait-left",
    visualConcept: "사무실 정면 실사 좌측 + 지역·업무 요약",
    topicIcon: "check",
    backgroundConcept: "크림 + 네이비 지역 라벨",
    accent: "navy",
    alt: "부산 법무사 — 해운대·센텀 다옴법무사사무소",
    carouselCandidate: false,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "local-busan-inheritance",
    pageUrl: "/부산상속등기",
    pageTitle: "부산 상속등기",
    pageType: "region-detail",
    parentHub: "/부산법무사",
    primaryKeyword: "부산 상속등기",
    sourcePhotoPath: "/image/썸네일-등기운영과.jpg",
    ...out("inheritance", "busan-inheritance.webp"),
    headline: "부산 상속등기",
    subheadline: "관할·서류 먼저 확인",
    layoutVariant: "document-focus",
    visualConcept: "등기운영과 실사 + 부산 라벨 (상속등기 상세와 다른 소스)",
    topicIcon: "family",
    backgroundConcept: "웜 상단 밴드 + 지역 태그",
    accent: "warm",
    alt: "부산 상속등기 — 관할·서류 안내",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "lecture-hub",
    pageUrl: "/법률강의",
    pageTitle: "법률 강의",
    pageType: "lecture-hub",
    primaryKeyword: "부산 법률 강의",
    sourcePhotoId: "lecture-library",
    ...out("lecture", "lecture-hub.webp"),
    headline: "법률 강의·특강",
    subheadline: "기관·청년·도서관",
    layoutVariant: "lecture-focus",
    visualConcept: "시민도서관 실제 강의 사진 와이드 + 하단 타이틀 밴드",
    topicIcon: "doc",
    backgroundConcept: "실사 상단 + 네이비 타이틀 밴드",
    accent: "navy",
    alt: "부산 법무사 법률 강의·특강 — 실제 강의 현장",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
  {
    id: "lecture-jeonse",
    pageUrl: "/전세사기예방교육",
    pageTitle: "전세사기 예방 교육",
    pageType: "lecture-topic",
    parentHub: "/법률강의",
    primaryKeyword: "전세사기 예방 교육",
    sourcePhotoId: "lecture-jeonse",
    ...out("lecture", "lecture-jeonse.webp"),
    headline: "전세사기 예방",
    subheadline: "계약 전 확인 교육",
    layoutVariant: "lecture-focus",
    visualConcept: "자립지원기관 특강 실사 + 계약서 체크 아이콘",
    topicIcon: "check",
    backgroundConcept: "실사 상단 + 슬레이트 밴드",
    accent: "slate",
    alt: "전세사기 예방 법률 교육 — 실제 특강 현장",
    carouselCandidate: true,
    ogImageRequired: true,
    bodyImageRequired: false,
    status: "approved",
  },
];

export const CAROUSEL_HUBS: {
  hubUrl: string;
  heading: string;
  itemIds: string[];
}[] = [
  {
    hubUrl: "/services",
    heading: "업무별 안내",
    itemIds: [
      "svc-inheritance-registration",
      "svc-real-estate",
      "svc-corporate",
      "svc-rehabilitation",
      "svc-inheritance-renunciation",
      "svc-ownership-transfer",
      "svc-bankruptcy",
    ],
  },
  {
    hubUrl: "/법률강의",
    heading: "강의 주제",
    itemIds: ["lecture-jeonse", "lecture-hub"],
  },
];

export function getCarouselManifestItem(
  id: string,
): CarouselImageManifestItem | undefined {
  return CAROUSEL_IMAGE_MANIFEST.find((i) => i.id === id);
}

export function getCarouselManifestItemByUrl(
  url: string,
): CarouselImageManifestItem | undefined {
  return CAROUSEL_IMAGE_MANIFEST.find((i) => i.pageUrl === url);
}
