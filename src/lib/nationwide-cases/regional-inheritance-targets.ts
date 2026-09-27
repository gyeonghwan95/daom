import { changwonInheritanceSpec } from "@/lib/regional-inheritance/changwon";
import { daeguInheritanceSpec } from "@/lib/regional-inheritance/daegu";
import { geojeInheritanceSpec } from "@/lib/regional-inheritance/geoje";
import { gimhaeInheritanceSpec } from "@/lib/regional-inheritance/gimhae";
import type { RegionalInheritanceTarget } from "@/lib/regional-inheritance/types";
import { yangsanInheritanceSpec } from "@/lib/regional-inheritance/yangsan";

/**
 * REGIONAL SEO Batch A — 기존 대표 URL 5개 개선(신규 URL 없음).
 * 이 파일의 slug만 전용 레이아웃·메타데이터를 받고, 나머지 지역 페이지는 기존 템플릿 그대로.
 * slug 리터럴은 sitemap lastmod 계산에도 쓰이므로 대상이 아닌 slug를 적지 않는다.
 */
const REGIONAL_INHERITANCE_TARGETS: readonly RegionalInheritanceTarget[] = [
  { slug: "양산상속등기법무사", path: "/업무사례/양산상속등기법무사", ...yangsanInheritanceSpec },
  { slug: "창원상속등기법무사", path: "/업무사례/창원상속등기법무사", ...changwonInheritanceSpec },
  { slug: "김해상속등기법무사", path: "/업무사례/김해상속등기법무사", ...gimhaeInheritanceSpec },
  { slug: "대구상속등기법무사", path: "/업무사례/대구상속등기법무사", ...daeguInheritanceSpec },
  { slug: "거제상속등기법무사", path: "/업무사례/거제상속등기법무사", ...geojeInheritanceSpec },
];

const targetBySlug = new Map(REGIONAL_INHERITANCE_TARGETS.map((t) => [t.slug, t] as const));

export function getRegionalInheritanceTarget(slug: string): RegionalInheritanceTarget | undefined {
  return targetBySlug.get(slug);
}

export function getRegionalInheritanceTargets(): readonly RegionalInheritanceTarget[] {
  return REGIONAL_INHERITANCE_TARGETS;
}
