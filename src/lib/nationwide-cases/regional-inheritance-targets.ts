import { changwonInheritanceSpec } from "@/lib/regional-inheritance/changwon";
import { daeguInheritanceSpec } from "@/lib/regional-inheritance/daegu";
import { geojeInheritanceSpec } from "@/lib/regional-inheritance/geoje";
import { gimhaeInheritanceSpec } from "@/lib/regional-inheritance/gimhae";
import { gumiInheritanceSpec } from "@/lib/regional-inheritance/gumi";
import { gyeongjuInheritanceSpec } from "@/lib/regional-inheritance/gyeongju";
import { jinjuInheritanceSpec } from "@/lib/regional-inheritance/jinju";
import { miryangInheritanceSpec } from "@/lib/regional-inheritance/miryang";
import { tongyeongInheritanceSpec } from "@/lib/regional-inheritance/tongyeong";
import type { RegionalInheritanceTarget } from "@/lib/regional-inheritance/types";
import { yangsanInheritanceSpec } from "@/lib/regional-inheritance/yangsan";

/**
 * REGIONAL SEO Batch A·B — 기존 대표 URL 개선(신규 URL 없음).
 * 이 파일의 slug만 전용 레이아웃·메타데이터를 받고, 나머지 지역 페이지는 기존 템플릿 그대로.
 * slug 리터럴은 sitemap lastmod 계산에도 쓰이므로 대상이 아닌 slug를 적지 않는다.
 */
const REGIONAL_INHERITANCE_TARGETS: readonly RegionalInheritanceTarget[] = [
  { slug: "양산상속등기법무사", path: "/업무사례/양산상속등기법무사", ...yangsanInheritanceSpec },
  { slug: "창원상속등기법무사", path: "/업무사례/창원상속등기법무사", ...changwonInheritanceSpec },
  { slug: "김해상속등기법무사", path: "/업무사례/김해상속등기법무사", ...gimhaeInheritanceSpec },
  { slug: "대구상속등기법무사", path: "/업무사례/대구상속등기법무사", ...daeguInheritanceSpec },
  { slug: "거제상속등기법무사", path: "/업무사례/거제상속등기법무사", ...geojeInheritanceSpec },
  { slug: "경주상속등기법무사", path: "/업무사례/경주상속등기법무사", ...gyeongjuInheritanceSpec },
  { slug: "진주상속등기법무사", path: "/업무사례/진주상속등기법무사", ...jinjuInheritanceSpec },
  { slug: "구미상속등기법무사", path: "/업무사례/구미상속등기법무사", ...gumiInheritanceSpec },
  { slug: "통영상속등기법무사", path: "/업무사례/통영상속등기법무사", ...tongyeongInheritanceSpec },
  { slug: "밀양상속등기법무사", path: "/업무사례/밀양상속등기법무사", ...miryangInheritanceSpec },
];

const targetBySlug = new Map(REGIONAL_INHERITANCE_TARGETS.map((t) => [t.slug, t] as const));

export function getRegionalInheritanceTarget(slug: string): RegionalInheritanceTarget | undefined {
  return targetBySlug.get(slug);
}

export function getRegionalInheritanceTargets(): readonly RegionalInheritanceTarget[] {
  return REGIONAL_INHERITANCE_TARGETS;
}
