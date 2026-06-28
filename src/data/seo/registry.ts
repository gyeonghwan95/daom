import { seoInstitutions } from "./institutions";
import { seoIntents } from "./intents";
import { seoRegions } from "./regions";
import { seoServices } from "./services";
import { seoSpecialKeywords } from "./specialKeywords";
import type { SeoEntityType, SeoIntentEntity } from "./types";

export const allSeoIntentEntities: SeoIntentEntity[] = [
  ...seoRegions,
  ...seoServices,
  ...seoIntents,
  ...seoInstitutions,
  ...seoSpecialKeywords,
];

export function getSeoEntitiesByType(type: SeoEntityType): SeoIntentEntity[] {
  return allSeoIntentEntities.filter((entity) => entity.type === type);
}

export function getSeoEntityById(id: string): SeoIntentEntity | undefined {
  return allSeoIntentEntities.find((entity) => entity.id === id);
}

export function getSeoEntityBySlug(slug: string): SeoIntentEntity | undefined {
  return allSeoIntentEntities.find((entity) => entity.slug === slug);
}

export const seoIntentDbStats = {
  total: allSeoIntentEntities.length,
  regions: seoRegions.length,
  services: seoServices.length,
  intents: seoIntents.length,
  institutions: seoInstitutions.length,
  specialKeywords: seoSpecialKeywords.length,
} as const;
