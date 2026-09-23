/**
 * 안윤정 법무사 실사 포트레이트 레지스트리 (SERP·카드 공통).
 * thumbnail-portraits와 동일 소스 — 얼굴 AI 변형 금지.
 */
export {
  THUMBNAIL_PORTRAITS as PORTRAIT_REGISTRY,
  getThumbnailPortrait as getPortrait,
  pickPortraitForPage,
  type ThumbnailPortrait as PortraitEntry,
  type NormalizedBox,
  type ThumbnailCategory as VisualCategory,
  type ThumbnailMood,
} from "@/data/media/thumbnail-portraits";
