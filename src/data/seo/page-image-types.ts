/** 페이지 대표 이미지 시스템 — 공통 타입 */

export type PageTypeTag =
  | "primary-hub"
  | "service-hub"
  | "service-detail"
  | "situation-hub"
  | "situation-detail"
  | "region-hub"
  | "region-detail"
  | "case-list"
  | "case-detail"
  | "faq"
  | "diagnosis"
  | "calculator"
  | "glossary"
  | "lecture-hub"
  | "lecture-topic"
  | "lecture-history"
  | "business-b2b"
  | "collaboration"
  | "public-institution"
  | "profile"
  | "office-info"
  | "contact"
  | "blog-link"
  | "utility"
  | "other";

export type ImagePriority = "critical" | "high" | "medium" | "low" | "none";

export type RecommendedImageAction =
  | "create-image"
  | "replace-image"
  | "reuse-existing"
  | "keep-current"
  | "no-image-needed";

export type PageInventoryItem = {
  url: string;
  title: string;
  pageType: PageTypeTag;
  parentUrl?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  menuLocation?: string[];
  isIndexed: boolean;
  isInSitemap: boolean;
  canonical?: string;
  currentOgImage?: string;
  currentBodyImage?: string;
  imageDuplicateCount?: number;
  trafficPriority: number;
  conversionPriority: number;
  carouselPotential: number;
  imagePriority: ImagePriority;
  recommendedAction: RecommendedImageAction;
};

export type PageImageManifestStatus =
  | "needed"
  | "existing-review"
  | "approved"
  | "applied"
  | "not-required";

export type PageImageManifestItem = {
  id: string;
  pageUrl: string;
  pageTitle: string;
  pageType: PageTypeTag;
  parentHub?: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  imagePriority: Exclude<ImagePriority, "none">;
  imageFileName: string;
  imagePath: string;
  width: number;
  height: number;
  format: "webp" | "jpg" | "png";
  headline: string;
  subheadline?: string;
  visualConcept: string;
  visualObjects: string[];
  avoidObjects: string[];
  photoRequirement:
    | "none"
    | "office-photo"
    | "speaker-photo"
    | "lecture-photo"
    | "document-photo"
    | "custom";
  safeArea: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  alt: string;
  ogImageRequired: boolean;
  bodyImageRequired: boolean;
  cardImageRequired: boolean;
  carouselCandidate: boolean;
  existingImage?: string;
  status: PageImageManifestStatus;
};

export type CarouselHubCandidate = {
  hubUrl: string;
  hubTitle: string;
  childUrls: string[];
  childCount: number;
  suitable: boolean;
  itemListRecommended: boolean;
  imagesNeeded: number;
  reason: string;
  currentImageState: string;
};

export type PageImageDesignSystem = {
  colors: {
    navy: string;
    navyDark: string;
    navyLight: string;
    cream: string;
    beige: string;
    surface: string;
    textPrimary: string;
  };
  typography: {
    headline: string;
    subheadline: string;
    brandMark: string;
  };
  canvas: {
    width: number;
    height: number;
    safeAreaPercent: number;
  };
  rules: string[];
};
