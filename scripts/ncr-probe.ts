import { getLocalLandingConfig } from "../src/lib/local-landing/config";
import { resolveKoreanLandingPageData } from "../src/lib/pageData/resolvers";
import { practiceHubDefs } from "../src/lib/local-landing/practice-hubs";

for (const slug of ["부산상속전문법무사", "부산상속포기", "해운대법무사", "부산상속법무사"]) {
  const cfg = getLocalLandingConfig(slug) as Record<string, unknown> | undefined;
  const page = resolveKoreanLandingPageData(slug) as Record<string, unknown> | undefined;
  console.log(`\n== ${slug}`);
  console.log(" pageType:", cfg?.pageType, " practiceHub:", Boolean(practiceHubDefs[slug]));
  console.log(" config keys:", cfg ? Object.keys(cfg).join(",") : "-");
  console.log(" page keys:", page ? Object.keys(page).join(",") : "-");
  console.log(" title:", page?.title, "| h1:", page?.h1);
}
