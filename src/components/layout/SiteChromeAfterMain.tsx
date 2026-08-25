import { Footer } from "@/components/layout/Footer";
import { PublicOnly } from "@/components/layout/PublicOnly";
import { InflowIntentRail } from "@/components/seo/InflowIntentRail";
import { SpeculationRules } from "@/components/seo/SpeculationRules";

/**
 * Footer·유입 레일을 layout의 children 형제가 아니라 page 트리(본문 뒤)에 둔다.
 * layout에서 Footer가 children Suspense hole 뒤에 있으면 정적 HTML에
 * Footer NAP이 Main/H1보다 먼저 출력된다.
 */
export function SiteChromeAfterMain() {
  return (
    <PublicOnly>
      <InflowIntentRail />
      <Footer />
      <SpeculationRules />
    </PublicOnly>
  );
}
