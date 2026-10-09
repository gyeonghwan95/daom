import type { BreadcrumbItem } from "@/types/breadcrumb";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { busanConsultSpec } from "./existing/busan-consult";
import { busanLawyerSpec } from "./existing/busan-lawyer";
import { busanRecommendSpec } from "./existing/busan-recommend";
import { qualifiedAcceptanceSpec } from "./existing/qualified-acceptance";
import { depositCriminalSpec } from "./pages/deposit-criminal";
import { depositExecutionSpec } from "./pages/deposit-execution";
import { depositHubSpec } from "./pages/deposit-hub";
import { depositPaymentSpec } from "./pages/deposit-payment";
import { depositReleaseSpec } from "./pages/deposit-release";
import { depositSecuritySpec } from "./pages/deposit-security";
import { attachmentReleaseSpec } from "./pages/attachment-release";
import { inheritanceEstateBankruptcySpec } from "./pages/inheritance-estate-bankruptcy";
import type { PrioritySeoSpec } from "./types";

/**
 * 공탁 클러스터 신규 URL. 여기 slug만 정적 경로에 추가된다.
 * scripts/lib/published-paths.mjs 가 pages/ 폴더의 slug 리터럴을 읽어 sitemap에 넣는다.
 */
const NEW_PRIORITY_PAGES: readonly PrioritySeoSpec[] = [
  depositHubSpec,
  depositPaymentSpec,
  depositExecutionSpec,
  depositSecuritySpec,
  depositCriminalSpec,
  depositReleaseSpec,
  attachmentReleaseSpec,
  inheritanceEstateBankruptcySpec,
];

/** TARGET_ALLOWLIST — 기존 URL을 유지한 채 전용 레이아웃으로 렌더하는 페이지 */
const ALLOWLISTED_EXISTING_PAGES: readonly PrioritySeoSpec[] = [
  qualifiedAcceptanceSpec,
  busanLawyerSpec,
  busanConsultSpec,
  busanRecommendSpec,
];

const ALL_PRIORITY_PAGES = [...NEW_PRIORITY_PAGES, ...ALLOWLISTED_EXISTING_PAGES];

const specBySlug = new Map(
  ALL_PRIORITY_PAGES.map((spec) => [normalizeRouteSlug(spec.slug), spec] as const),
);

export function getPrioritySeoPage(slug: string): PrioritySeoSpec | undefined {
  return specBySlug.get(normalizeRouteSlug(slug));
}

export function getNewPrioritySeoSlugs(): string[] {
  return NEW_PRIORITY_PAGES.map((spec) => spec.slug);
}

export function getAllPrioritySeoPages(): readonly PrioritySeoSpec[] {
  return ALL_PRIORITY_PAGES;
}

export function getPriorityBreadcrumbs(spec: PrioritySeoSpec): BreadcrumbItem[] {
  if (spec.cluster === "DEPOSIT" && spec.path !== depositHubSpec.path) {
    return [
      { label: "홈", href: "/" },
      { label: depositHubSpec.shortName, href: depositHubSpec.path },
      { label: spec.shortName },
    ];
  }
  return [{ label: "홈", href: "/" }, { label: spec.shortName }];
}
