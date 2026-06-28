import {
  buildSeoLandingSpecs,
  getAllSeoLandingPaths,
  getAllSeoLandingSlugs,
  getSeoLandingSpecBySlug,
  getSeoLandingStats,
  validateSeoLandingSpecs,
} from "./combinations";
import { buildPageDataFromSeoLanding } from "./page-data";

export {
  buildSeoLandingSpecs,
  getAllSeoLandingPaths,
  getAllSeoLandingSlugs,
  getSeoLandingSpecBySlug,
  getSeoLandingStats,
  validateSeoLandingSpecs,
};

export { buildPageDataFromSeoLanding };

export function getSeoLandingPageDataBySlug(slug: string) {
  const spec = getSeoLandingSpecBySlug(slug);
  if (!spec) return undefined;
  return buildPageDataFromSeoLanding(spec);
}

export function getAllSeoLandingPageData() {
  return buildSeoLandingSpecs().map(buildPageDataFromSeoLanding);
}
