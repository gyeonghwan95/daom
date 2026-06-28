import { allSeoIntentEntities } from "./registry";
import type { SeoIntentEntity } from "./types";

export class SeoIntentDbValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SeoIntentDbValidationError";
  }
}

function fail(message: string): never {
  throw new SeoIntentDbValidationError(message);
}

/**
 * SEO 검색 의도 DB 무결성 검증
 * - slug·id 중복 금지
 * - parentRegion·relatedRegions·relatedServices 참조 유효성
 */
export function validateSeoIntentDatabase(
  entities: SeoIntentEntity[] = allSeoIntentEntities,
): void {
  const slugMap = new Map<string, SeoIntentEntity>();
  const idMap = new Map<string, SeoIntentEntity>();
  const idSet = new Set(entities.map((e) => e.id));

  for (const entity of entities) {
    if (!entity.id?.trim()) {
      fail("entity id is required");
    }
    if (!entity.slug?.trim()) {
      fail(`entity id="${entity.id}" slug is required`);
    }
    if (!entity.name?.trim()) {
      fail(`entity id="${entity.id}" name is required`);
    }
    if (entity.priority < 1 || entity.priority > 100) {
      fail(
        `entity id="${entity.id}" priority must be 1–100 (got ${entity.priority})`,
      );
    }

    if (idMap.has(entity.id)) {
      fail(
        `duplicate id: "${entity.id}" (${entity.name} vs ${idMap.get(entity.id)!.name})`,
      );
    }
    idMap.set(entity.id, entity);

    if (slugMap.has(entity.slug)) {
      fail(
        `duplicate slug: "${entity.slug}" (id ${entity.id} vs ${slugMap.get(entity.slug)!.id})`,
      );
    }
    slugMap.set(entity.slug, entity);

    if (entity.parentRegion && !idSet.has(entity.parentRegion)) {
      fail(
        `entity id="${entity.id}" parentRegion "${entity.parentRegion}" not found`,
      );
    }

    for (const regionId of entity.relatedRegions) {
      if (!idSet.has(regionId)) {
        fail(
          `entity id="${entity.id}" relatedRegions "${regionId}" not found`,
        );
      }
    }

    for (const serviceId of entity.relatedServices) {
      if (!idSet.has(serviceId)) {
        fail(
          `entity id="${entity.id}" relatedServices "${serviceId}" not found`,
        );
      }
    }
  }
}
