export {
  flattenRecommendationGroups,
  hasRecommendationGroups,
} from "./groups";
export {
  recommendationFromCaseRecord,
  recommendationFromContentMeta,
  recommendationFromDiagnosis,
  recommendationFromGlossaryTerm,
  recommendationFromService,
  recommendationFromSituation,
  recommendationFromTool,
} from "./input-builders";
export {
  categoriesMatch,
  collectServiceSlugs,
  getGlossaryDomain,
  getServiceDomain,
  regionsMatch,
} from "./domains";
export {
  MAX_LINKS_PER_GROUP,
  RECOMMENDATION_GROUP_LABELS,
  RECOMMENDATION_GROUP_ORDER,
  type LinkCatalogItem,
  type LinkContentKind,
  type RecommendationGroupKey,
  type RecommendationGroups,
  type RecommendationSource,
} from "./types";
