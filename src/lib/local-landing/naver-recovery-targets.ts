import { getSeoIntentOwnerByPath, type SeoIntentOwner } from "@/data/seoIntentOwners";
import { haeundaeRecoverySpec } from "@/lib/naver-recovery/haeundae";
import { renunciationRecoverySpec } from "@/lib/naver-recovery/renunciation";
import { specialistRecoverySpec } from "@/lib/naver-recovery/specialist";
import type { NaverRecoverySpec } from "@/lib/naver-recovery/types";
import { normalizeRouteSlug } from "@/lib/seo/slug";

/**
 * NAVER CRITICAL RECOVERY 대상 3개 URL 전용 스펙.
 * 이 파일의 slug만 전용 레이아웃·메타데이터를 받는다. 다른 URL은 기존 템플릿 그대로.
 */
const NAVER_RECOVERY_SPECS: readonly NaverRecoverySpec[] = [
  { slug: "부산상속전문법무사", path: "/부산상속전문법무사", ...specialistRecoverySpec },
  { slug: "부산상속포기", path: "/부산상속포기", ...renunciationRecoverySpec },
  { slug: "해운대법무사", path: "/해운대법무사", ...haeundaeRecoverySpec },
];

const specBySlug = new Map(NAVER_RECOVERY_SPECS.map((spec) => [spec.slug, spec] as const));

export type NaverRecoveryTarget = {
  spec: NaverRecoverySpec;
  owner: SeoIntentOwner;
};

export function getNaverRecoveryTarget(slugOrPath: string): NaverRecoveryTarget | undefined {
  const slug = normalizeRouteSlug(slugOrPath.replace(/^\//, ""));
  const spec = specBySlug.get(slug);
  if (!spec) return undefined;
  const owner = getSeoIntentOwnerByPath(spec.path);
  if (!owner) return undefined;
  return { spec, owner };
}
