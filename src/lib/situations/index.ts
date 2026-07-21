export {
  buildPageDataFromSituation,
  buildSituationsHubPageData,
  buildSituationCategoryHubPageData,
  buildAllSituationCategoryHubPageData,
  resolveSituationPageData,
  resolveSituationsHubPageData,
  resolveSituationCategoryHubPageData,
  getAllSituationPages,
  getAllSituationSlugs,
  getSituationBySlug,
  getSituationsByCategory,
  getUrgentSituations,
  getPopularSituations,
  getRecentSituations,
  getRelatedSituationLinks,
  situationsHub,
  getAllSituationCategorySlugs,
  getSituationCategoryBySlug,
  getSituationCategoryById,
  SITUATION_CATEGORIES,
  SITUATION_CATEGORY_ORDER,
  SITUATION_CATEGORY_LABELS,
} from "./builder";

export type {
  SituationPage,
  SituationsHubConfig,
  SituationSolution,
  SituationCaseExample,
} from "./types";

export type { SituationCategoryId, SituationCategoryDef } from "./categories";
