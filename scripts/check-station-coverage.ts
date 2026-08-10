/** Phase1 station 이름이 빌드 산출물/소스에 존재하는지 개략 검사 */
import fs from "node:fs";
import path from "node:path";
import { getPhase1Stations } from "../src/data/geo/busan-rail-stations";
import { stationSectionContents } from "../src/data/seo/station-section-content";

const ROOT = process.cwd();
const contentFile = path.join(
  ROOT,
  "src/data/seo/station-section-content.ts",
);
const text = fs.readFileSync(contentFile, "utf8");
const phase1 = getPhase1Stations();
const missing: string[] = [];
for (const st of phase1) {
  const content = stationSectionContents[st.id];
  if (!content) {
    missing.push(`${st.name}: no content`);
    continue;
  }
  if (!text.includes(st.name) && !content.intro.includes(st.normalizedName)) {
    missing.push(`${st.name}: name not in content module`);
  }
  // legal entity link check
  const blob = [content.intro, content.localContext, ...content.serviceLinks.map((l) => l.label)].join(
    " ",
  );
  if (!/(법무사|등기|상속|법인|부동산|회생|지급명령|법원)/.test(blob)) {
    missing.push(`${st.name}: no legal entity link`);
  }
}
console.log("phase1", phase1.length, "issues", missing.length);
if (missing.length) {
  console.log(missing);
  process.exitCode = 1;
}
