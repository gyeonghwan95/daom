/**
 * 안윤정 법무사 사진 인벤토리 (실제 이미지 내용 확인 기준)
 * — 파일명이 아닌 실제 내용·기존 사용 맥락으로 분류.
 * — 원본은 절대 수정하지 않는다. 생성물은 public/images/generated/carousel/.
 */

export type AttorneyPhoto = {
  id: string;
  src: string;
  fileName: string;
  orientation: "portrait" | "landscape" | "square";
  context:
    | "profile"
    | "office"
    | "consultation"
    | "lecture"
    | "document"
    | "event"
    | "other";
  peopleCount?: number;
  facePosition?: "left" | "center" | "right";
  cropSuitability: {
    square: boolean;
    landscape: boolean;
    portrait: boolean;
  };
  usageSuitability: "excellent" | "good" | "limited" | "do-not-use";
  currentUsageUrls: string[];
  privacyRisk: boolean;
  notes?: string;
};

export const ATTORNEY_PHOTOS: AttorneyPhoto[] = [
  {
    id: "studio-profile",
    src: "/image/홈-신뢰안내.png",
    fileName: "홈-신뢰안내.png",
    orientation: "square",
    context: "profile",
    peopleCount: 1,
    facePosition: "center",
    cropSuitability: { square: true, landscape: true, portrait: true },
    usageSuitability: "excellent",
    currentUsageUrls: ["/", "/about"],
    privacyRisk: false,
    notes: "스튜디오 단독 프로필(정장·배지). 배경 단색 — 합성 최적. 대표 허브 우선.",
  },
  {
    id: "desk-front",
    src: "/image/썸네일-정면.jpg",
    fileName: "썸네일-정면.jpg",
    orientation: "landscape",
    context: "office",
    peopleCount: 1,
    facePosition: "center",
    cropSuitability: { square: true, landscape: true, portrait: true },
    usageSuitability: "good",
    currentUsageUrls: ["/about", "/강사소개"],
    privacyRisk: false,
    notes: "사무실 책상 정면. 자연스러운 상담 맥락. 세로 crop 시 인물 중앙 유지.",
  },
  {
    id: "desk-review",
    src: "/image/썸네일-아래.jpg",
    fileName: "썸네일-아래.jpg",
    orientation: "landscape",
    context: "document",
    peopleCount: 1,
    facePosition: "center",
    cropSuitability: { square: true, landscape: true, portrait: false },
    usageSuitability: "good",
    currentUsageUrls: [],
    privacyRisk: false,
    notes: "서류 검토 장면(시선 아래). 서류·검토 주제 페이지에 적합. 현재 미사용.",
  },
  {
    id: "lecture-library",
    src: "/image/강의-시민도서관1주차.jpg",
    fileName: "강의-시민도서관1주차.jpg",
    orientation: "landscape",
    context: "lecture",
    peopleCount: 10,
    facePosition: "right",
    cropSuitability: { square: false, landscape: true, portrait: false },
    usageSuitability: "limited",
    currentUsageUrls: ["/강의이력"],
    privacyRisk: false,
    notes:
      "실제 강의 현장(강사 우측, 청중은 뒷모습). 강의 페이지 전용. 강사 얼굴이 작아 인물 crop 부적합.",
  },
  {
    id: "lecture-jeonse",
    src: "/image/강의-부산광역시자립지원전담기관전세사기예방.jpg",
    fileName: "강의-부산광역시자립지원전담기관전세사기예방.jpg",
    orientation: "landscape",
    context: "lecture",
    peopleCount: 8,
    facePosition: "left",
    cropSuitability: { square: false, landscape: true, portrait: false },
    usageSuitability: "limited",
    currentUsageUrls: ["/강의이력"],
    privacyRisk: false,
    notes: "전세사기 예방 특강 현장(청중 뒷모습). 전세사기 교육 페이지 전용.",
  },
];

/** 대표이미지 소스로 제외 (실사 인물 아님/부적합) */
export const EXCLUDED_IMAGE_NOTES: { src: string; reason: string }[] = [
  { src: "/image/상담-대면.png", reason: "일러스트 배너 — 실제 사진 아님" },
  { src: "/image/상담-전화.png", reason: "일러스트 배너" },
  { src: "/image/상담-출장.png", reason: "일러스트 배너" },
  {
    src: "/image/활동-기획예산처청년자문단위촉.jpg",
    reason: "타인(위촉 관계자) 얼굴 크게 노출 — 대표이미지 제외, 활동 카드 전용",
  },
  { src: "/image/로고.png", reason: "로고 단독 — 대표이미지 금지" },
];

export function getAttorneyPhoto(id: string): AttorneyPhoto | undefined {
  return ATTORNEY_PHOTOS.find((p) => p.id === id);
}
