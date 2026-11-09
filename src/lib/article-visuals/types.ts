/**
 * 본문형 ArticleVisual 타입.
 * 원본 public/image 파일은 덮어쓰지 않으며, 가능하면 derived WebP를 우선 사용한다.
 */

export type ArticleVisualAspect = "16:9" | "3:2" | "4:3" | "2:1";

export type ArticleVisualOverlayPosition = "left" | "center" | "right";

export type ArticleVisualTone = "dark" | "light" | "auto";

export type ArticleVisualMobileFocus =
  | "center"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "face";

export type ArticleVisualSlot =
  | "after-intro"
  | "before-procedures"
  | "before-example"
  | "before-cta"
  | "mid-body";

export type ArticleImageCategory =
  | "lawyer-portrait"
  | "document-review"
  | "registration-document"
  | "office"
  | "registry-court"
  | "consultation"
  | "lecture"
  | "agency"
  | "media"
  | "map-directions"
  | "brand"
  | "other";

export type ArticleImageAsset = {
  id: string;
  /** 원본 경로 (/image/...) — 절대 삭제·덮어쓰기 금지 */
  originalSrc: string;
  /** 파생 WebP가 있으면 표시에 우선 사용 */
  derivedSrc?: string;
  width: number;
  height: number;
  category: ArticleImageCategory;
  isLawyerPhoto: boolean;
  usable: boolean;
  excludeReason?: string;
  fields: string[];
  overlaySafe: ArticleVisualOverlayPosition[];
  mobileFocus: ArticleVisualMobileFocus;
  /** 가로로 넓게 자를 때의 세로 기준점(%) — 인물·핵심이 글자와 겹치지 않게 고른다. 없으면 mobileFocus를 따른다 */
  focusY?: number;
  /** 본문 사용 상한(페이지 수) */
  maxBodyUses: number;
  notes?: string;
};

export type ArticleVisualPlacement = {
  path: string;
  slot: ArticleVisualSlot;
  assetId: string;
  alt: string;
  overlayText?: string;
  caption?: string;
  aspectRatio?: ArticleVisualAspect;
  overlayPosition?: ArticleVisualOverlayPosition;
  tone?: ArticleVisualTone;
  priority?: boolean;
};
