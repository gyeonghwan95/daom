import type { SeoIntentEntity } from "./types";

export const BUSAN_CITY_ID = "busan";

/** 엔티티 정의 시 타입 추론·일관성 유지 */
export function seoEntity(entity: SeoIntentEntity): SeoIntentEntity {
  return entity;
}
