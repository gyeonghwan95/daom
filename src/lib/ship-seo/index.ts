import type { BreadcrumbItem } from "@/types/breadcrumb";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { busanShipSpec } from "./existing/busan";
import { shipChangwonSpec } from "./pages/changwon";
import { shipGeojeSpec } from "./pages/geoje";
import { shipHubSpec } from "./pages/hub";
import { shipInheritanceSpec } from "./pages/inheritance";
import { shipManagerSpec } from "./pages/manager";
import { shipTongyeongSpec } from "./pages/tongyeong";
import { shipUlsanSpec } from "./pages/ulsan";
import { shipVsRegistrationSpec } from "./pages/vs-registration";
import type { ShipSeoSpec } from "./types";

/**
 * 선박등기 클러스터 신규 URL. 여기 slug만 정적 경로에 추가된다.
 * scripts/lib/published-paths.mjs 가 pages/ 폴더의 slug 리터럴을 읽어 sitemap에 넣는다.
 */
const NEW_SHIP_PAGES: readonly ShipSeoSpec[] = [
  shipHubSpec,
  shipInheritanceSpec,
  shipVsRegistrationSpec,
  shipManagerSpec,
  shipGeojeSpec,
  shipTongyeongSpec,
  shipChangwonSpec,
  shipUlsanSpec,
];

/** TARGET_ALLOWLIST — 기존 URL을 유지한 채 전용 레이아웃으로 렌더하는 선박 페이지 */
const ALLOWLISTED_EXISTING_SHIP_PAGES: readonly ShipSeoSpec[] = [busanShipSpec];

const ALL_SHIP_PAGES = [...NEW_SHIP_PAGES, ...ALLOWLISTED_EXISTING_SHIP_PAGES];

const specBySlug = new Map(
  ALL_SHIP_PAGES.map((spec) => [normalizeRouteSlug(spec.slug), spec] as const),
);

export function getShipSeoPage(slug: string): ShipSeoSpec | undefined {
  return specBySlug.get(normalizeRouteSlug(slug));
}

export function getNewShipSeoSlugs(): string[] {
  return NEW_SHIP_PAGES.map((spec) => spec.slug);
}

export function getAllShipSeoPages(): readonly ShipSeoSpec[] {
  return ALL_SHIP_PAGES;
}

export function getShipBreadcrumbs(spec: ShipSeoSpec): BreadcrumbItem[] {
  if (spec.path === shipHubSpec.path) {
    return [{ label: "홈", href: "/" }, { label: "선박등기" }];
  }
  return [
    { label: "홈", href: "/" },
    { label: "선박등기", href: shipHubSpec.path },
    { label: spec.metaTitle.split("｜")[0].trim() },
  ];
}
