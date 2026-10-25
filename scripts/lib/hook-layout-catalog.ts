/**
 * 이미지별 훅 텍스트 위치.
 * 얼굴을 가리지 않고, 빈 여백(머리 위·건물·재킷)에 둔다.
 * 얼굴·몸은 변형하지 않는다.
 */
import type { HookThumbnailInput } from "./render-hook-thumbnail";

export type HookPlate = "none" | "soft" | "banner";
export type HookAnchor = "above" | "below" | "center";

export type HookLayout = {
  textAnchor: HookAnchor;
  /** 텍스트 블록 중심 y (0–1). 얼굴 밖 여백 */
  textCenterY: number;
  plate: HookPlate;
  /** true면 얼굴을 위로 올려 재킷에 글을 쓴다 (스튜디오) */
  liftFace: boolean;
  crop?: { x: number; y: number; width: number; height: number };
  sourceFaceY?: number;
  faceY?: number;
  faceBox?: { x: number; y: number; width: number; height: number };
};

/** 포트레이트별: 머리 위 여백이 있으면 above, 스튜디오만 재킷(below) */
export const LAYOUT_BY_PORTRAIT: Record<string, HookLayout> = {
  "portrait-studio-01": {
    textAnchor: "below",
    textCenterY: 0.64,
    plate: "none",
    liftFace: true,
    crop: { x: 0, y: 0, width: 1, height: 1 },
    sourceFaceY: 0.3,
    faceY: 0.26,
    faceBox: { x: 0.34, y: 0.06, width: 0.36, height: 0.4 },
  },
  "portrait-desk-front-01": {
    textAnchor: "above",
    textCenterY: 0.26,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.16, y: 0, width: 0.68, height: 0.9 },
    sourceFaceY: 0.32,
    faceY: 0.48,
    faceBox: { x: 0.32, y: 0.32, width: 0.36, height: 0.36 },
  },
  "portrait-consult-01": {
    textAnchor: "above",
    textCenterY: 0.25,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.16, y: 0, width: 0.68, height: 0.9 },
    sourceFaceY: 0.34,
    faceY: 0.5,
    faceBox: { x: 0.32, y: 0.34, width: 0.36, height: 0.34 },
  },
  "portrait-registry-01": {
    textAnchor: "above",
    textCenterY: 0.4,
    plate: "banner",
    liftFace: false,
    crop: { x: 0.12, y: 0, width: 0.8, height: 1 },
    sourceFaceY: 0.28,
    faceY: 0.62,
    faceBox: { x: 0.48, y: 0.48, width: 0.4, height: 0.4 },
  },
  "portrait-docs-01": {
    textAnchor: "above",
    textCenterY: 0.25,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.16, y: 0, width: 0.68, height: 0.88 },
    sourceFaceY: 0.36,
    faceY: 0.5,
    faceBox: { x: 0.3, y: 0.34, width: 0.38, height: 0.34 },
  },
  "portrait-corporate-01": {
    textAnchor: "above",
    textCenterY: 0.24,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.18, y: 0, width: 0.72, height: 0.92 },
    sourceFaceY: 0.34,
    faceY: 0.5,
    faceBox: { x: 0.4, y: 0.32, width: 0.4, height: 0.36 },
  },
  "portrait-corporate-02": {
    textAnchor: "above",
    textCenterY: 0.24,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.12, y: 0, width: 0.76, height: 0.95 },
    sourceFaceY: 0.47,
    faceY: 0.55,
    faceBox: { x: 0.42, y: 0.38, width: 0.36, height: 0.36 },
  },
  "portrait-phone-01": {
    textAnchor: "above",
    textCenterY: 0.24,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.16, y: 0, width: 0.68, height: 0.88 },
    sourceFaceY: 0.34,
    faceY: 0.5,
    faceBox: { x: 0.3, y: 0.34, width: 0.4, height: 0.34 },
  },
  "portrait-writing-01": {
    textAnchor: "above",
    textCenterY: 0.24,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.16, y: 0, width: 0.68, height: 0.88 },
    sourceFaceY: 0.32,
    faceY: 0.48,
    faceBox: { x: 0.3, y: 0.32, width: 0.4, height: 0.36 },
  },
};

const LAYOUT_BY_SRC: Record<string, HookLayout> = {
  "/image/홈-신뢰안내.png": LAYOUT_BY_PORTRAIT["portrait-studio-01"],
  "/image/썸네일-정면.jpg": LAYOUT_BY_PORTRAIT["portrait-desk-front-01"],
  "/image/썸네일-상담협의.jpg": LAYOUT_BY_PORTRAIT["portrait-consult-01"],
  "/image/썸네일-등기소.jpg": LAYOUT_BY_PORTRAIT["portrait-registry-01"],
  "/image/썸네일-서류확인.jpg": LAYOUT_BY_PORTRAIT["portrait-docs-01"],
  "/image/썸네일-계약임원.jpg": LAYOUT_BY_PORTRAIT["portrait-corporate-01"],
  "/image/썸네일-사무실_겨울 (4).jpg": LAYOUT_BY_PORTRAIT["portrait-corporate-02"],
  "/image/썸네일-사무실_전화중.jpg": LAYOUT_BY_PORTRAIT["portrait-phone-01"],
  "/image/썸네일-사무실.jpg": LAYOUT_BY_PORTRAIT["portrait-writing-01"],
  "/image/상담-메인.jpg": {
    textAnchor: "above",
    textCenterY: 0.26,
    plate: "soft",
    liftFace: false,
    crop: { x: 0.12, y: 0, width: 0.76, height: 0.92 },
    sourceFaceY: 0.38,
    faceY: 0.5,
    faceBox: { x: 0.3, y: 0.34, width: 0.4, height: 0.36 },
  },
};

const FIELD: HookLayout = {
  textAnchor: "above",
  textCenterY: 0.4,
  plate: "banner",
  liftFace: false,
  faceY: 0.68,
  faceBox: { x: 0.35, y: 0.52, width: 0.3, height: 0.36 },
};

const BUILDING: HookLayout = {
  textAnchor: "center",
  textCenterY: 0.46,
  plate: "banner",
  liftFace: false,
};

const LECTURE: HookLayout = {
  textAnchor: "above",
  textCenterY: 0.34,
  plate: "banner",
  liftFace: false,
  faceY: 0.42,
  faceBox: { x: 0.62, y: 0.28, width: 0.28, height: 0.32 },
};

const DESK: HookLayout = {
  textAnchor: "above",
  textCenterY: 0.24,
  plate: "soft",
  liftFace: false,
  crop: { x: 0.12, y: 0, width: 0.76, height: 0.92 },
  sourceFaceY: 0.42,
  faceY: 0.52,
  faceBox: { x: 0.32, y: 0.36, width: 0.36, height: 0.34 },
};

const DOCUMENT: HookLayout = {
  textAnchor: "center",
  textCenterY: 0.48,
  plate: "banner",
  liftFace: false,
};

export function layoutForPortrait(id: string): HookLayout {
  return LAYOUT_BY_PORTRAIT[id] ?? DESK;
}

export function layoutForPhoto(src: string, alt = "", url = ""): HookLayout {
  if (LAYOUT_BY_SRC[src]) return LAYOUT_BY_SRC[src];
  const key = src + alt + url;
  if (src.includes("/현장/") || /앞에서|방문 안내/.test(alt)) return FIELD;
  if (/강의-/.test(src) || /강의|특강|교육 현장/.test(alt + url)) return LECTURE;
  if (/구청|청사|행정복지|우체국|외관/.test(key)) return BUILDING;
  if (/등기필증/.test(key)) return DOCUMENT;
  if (/사무실_겨울|사무소-내부|상담-/.test(src)) return DESK;
  if (/안윤정/.test(alt)) return DESK;
  return BUILDING;
}

export function toHookFields(layout: HookLayout): Partial<HookThumbnailInput> {
  return {
    textAnchor: layout.textAnchor,
    textCenterY: layout.textCenterY,
    plate: layout.plate,
    sourceCrop: layout.crop,
    sourceFaceY: layout.liftFace ? layout.sourceFaceY : undefined,
    cropPosition: layout.textAnchor === "above" ? "centre" : "north",
    face: layout.faceBox
      ? { ...layout.faceBox, faceY: layout.faceY }
      : undefined,
    hasPerson: Boolean(layout.faceBox),
  };
}
