/** Champion inbound/outbound 권한 개략 감사 */
import fs from "node:fs";
import path from "node:path";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";

const MANIFEST = path.join(process.cwd(), "scripts/output/page-manifest.json");
const OUT = path.join(process.cwd(), "reports/seo/internal-link-authority.json");

const CHAMPIONS = [
  "/부산법인법무사",
  "/부산상속포기",
  "/부산상속법무사",
  "/부산법무사",
];

function main() {
  const published = getAllPublishedPaths();
  let inbound: Record<string, number> = Object.fromEntries(CHAMPIONS.map((c) => [c, 0]));

  if (fs.existsSync(MANIFEST)) {
    const raw = JSON.parse(fs.readFileSync(MANIFEST, "utf8")) as unknown;
    const text = JSON.stringify(raw);
    for (const c of CHAMPIONS) {
      const re = new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      inbound[c] = (text.match(re) || []).length;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    publishedCount: published.length,
    championMentionCountsInManifest: inbound,
    policy: "링크 수만 늘리지 않음. 관련 Spoke→Champion 자연 링크.",
    champions: CHAMPIONS,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote", OUT);
}

main();
