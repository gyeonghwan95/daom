/**
 * 1:1 에디토리얼 썸네일용 실사 포트레이트 레지스트리.
 * 좌표는 소스 이미지 기준 normalized 0~1.
 * 얼굴·몸은 AI로 변형하지 않으며, crop/resize/overlay만 허용.
 */

export type ThumbnailMood =
  | "professional"
  | "consulting"
  | "document"
  | "field"
  | "lecture";

export type ThumbnailCategory =
  | "inheritance"
  | "realestate"
  | "corporate"
  | "rehabilitation"
  | "lease"
  | "civil"
  | "local"
  | "lecture"
  | "office"
  | "services";

export type NormalizedBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ThumbnailPortrait = {
  id: string;
  src: string;
  facePosition: { x: number; y: number };
  /** 최종 1:1 crop 프레임 기준 얼굴 안전영역 */
  faceSafeBox: NormalizedBox;
  preferredTextSide: "left" | "right" | "bottom";
  /** 소스에서 1:1로 자를 영역 (없으면 중앙 정사각) */
  crop: NormalizedBox;
  mood: ThumbnailMood;
  suitableFor: ThumbnailCategory[];
  notes?: string;
};

export const THUMBNAIL_PORTRAITS: ThumbnailPortrait[] = [
  {
    id: "portrait-studio-01",
    src: "/image/홈-신뢰안내.png",
    facePosition: { x: 0.56, y: 0.3 },
    faceSafeBox: { x: 0.38, y: 0.06, width: 0.48, height: 0.58 },
    preferredTextSide: "left",
    crop: { x: 0, y: 0, width: 1, height: 1 },
    mood: "professional",
    suitableFor: ["office", "services", "local", "inheritance", "corporate"],
    notes: "스튜디오 정면. 좌측 여백이 넓어 EDITORIAL_LEFT에 최적.",
  },
  {
    id: "portrait-desk-front-01",
    src: "/image/썸네일-정면.jpg",
    facePosition: { x: 0.5, y: 0.32 },
    faceSafeBox: { x: 0.32, y: 0.1, width: 0.36, height: 0.42 },
    preferredTextSide: "left",
    crop: { x: 0.17, y: 0.02, width: 0.66, height: 0.88 },
    mood: "consulting",
    suitableFor: ["office", "local", "inheritance", "civil"],
    notes: "책상 정면 미소. 상단·좌측 여백 활용.",
  },
  {
    id: "portrait-consult-01",
    src: "/image/썸네일-상담협의.jpg",
    facePosition: { x: 0.52, y: 0.34 },
    faceSafeBox: { x: 0.34, y: 0.14, width: 0.38, height: 0.4 },
    preferredTextSide: "left",
    crop: { x: 0.18, y: 0.05, width: 0.64, height: 0.85 },
    mood: "consulting",
    suitableFor: ["inheritance", "civil", "office", "services"],
    notes: "서류 확인 장면. 좌상단 벽면이 텍스트에 적합.",
  },
  {
    id: "portrait-registry-01",
    src: "/image/썸네일-등기소.jpg",
    facePosition: { x: 0.72, y: 0.28 },
    faceSafeBox: { x: 0.52, y: 0.06, width: 0.42, height: 0.55 },
    preferredTextSide: "left",
    crop: { x: 0.22, y: 0.05, width: 0.7, height: 0.93 },
    mood: "field",
    suitableFor: ["realestate", "local", "office"],
    notes: "등기국 현장. 인물 우측, 표지판·좌측이 텍스트 영역.",
  },
  {
    id: "portrait-docs-01",
    src: "/image/썸네일-서류확인.jpg",
    facePosition: { x: 0.48, y: 0.36 },
    faceSafeBox: { x: 0.32, y: 0.16, width: 0.34, height: 0.38 },
    preferredTextSide: "left",
    crop: { x: 0.2, y: 0.08, width: 0.6, height: 0.8 },
    mood: "document",
    suitableFor: ["inheritance", "realestate", "civil"],
    notes: "서류 검토. CENTER_LOW·좌측 텍스트 모두 가능.",
  },
  {
    id: "portrait-corporate-01",
    src: "/image/썸네일-계약임원.jpg",
    facePosition: { x: 0.62, y: 0.34 },
    faceSafeBox: { x: 0.42, y: 0.12, width: 0.46, height: 0.48 },
    preferredTextSide: "left",
    crop: { x: 0.18, y: 0.05, width: 0.7, height: 0.93 },
    mood: "document",
    suitableFor: ["corporate", "realestate"],
    notes: "측면 서류 검토. 좌측 블라인드 영역이 텍스트에 유리.",
  },
  {
    id: "portrait-phone-01",
    src: "/image/썸네일-사무실_전화중.jpg",
    facePosition: { x: 0.5, y: 0.34 },
    faceSafeBox: { x: 0.34, y: 0.14, width: 0.34, height: 0.4 },
    preferredTextSide: "bottom",
    crop: { x: 0.2, y: 0.05, width: 0.6, height: 0.8 },
    mood: "consulting",
    suitableFor: ["office", "civil", "lease", "rehabilitation"],
    notes: "전화·작성 장면. 하단 책상 여백에 CENTER_LOW 적합.",
  },
  {
    id: "portrait-writing-01",
    src: "/image/썸네일-사무실.jpg",
    facePosition: { x: 0.5, y: 0.32 },
    faceSafeBox: { x: 0.34, y: 0.12, width: 0.34, height: 0.42 },
    preferredTextSide: "left",
    crop: { x: 0.2, y: 0.04, width: 0.6, height: 0.8 },
    mood: "document",
    suitableFor: ["realestate", "corporate", "office"],
    notes: "서류 작성. 좌·상단 여백 활용.",
  },
];

export function getThumbnailPortrait(
  id: string,
): ThumbnailPortrait | undefined {
  return THUMBNAIL_PORTRAITS.find((p) => p.id === id);
}

/** slug hash 기반 deterministic portrait 선택 (연속 반복 완화) */
export function pickPortraitForPage(
  slug: string,
  category: ThumbnailCategory,
  index = 0,
): ThumbnailPortrait {
  const pool = THUMBNAIL_PORTRAITS.filter((p) =>
    p.suitableFor.includes(category),
  );
  const candidates = pool.length > 0 ? pool : THUMBNAIL_PORTRAITS;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  hash = (hash + index * 17) >>> 0;
  return candidates[hash % candidates.length];
}
