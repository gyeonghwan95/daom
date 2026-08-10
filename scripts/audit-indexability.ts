/** Champion indexability 개략 검사 (sitemap·published paths) */
import fs from "node:fs";
import path from "node:path";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";

const OUT = path.join(process.cwd(), "reports/seo/indexability.json");
const SITEMAP = path.join(process.cwd(), "public/sitemap.xml");

const CHAMPIONS = [
  "/부산법인법무사",
  "/부산상속포기",
  "/부산상속법무사",
  "/부산법무사",
  "/부산법인등기",
];

function main() {
  const published = new Set(getAllPublishedPaths());
  let sitemapText = "";
  if (fs.existsSync(SITEMAP)) sitemapText = fs.readFileSync(SITEMAP, "utf8");
  // also check sitemap index shards
  const shardDir = path.join(process.cwd(), "public/sitemaps");
  if (fs.existsSync(shardDir)) {
    for (const f of fs.readdirSync(shardDir)) {
      if (f.endsWith(".xml")) {
        sitemapText += fs.readFileSync(path.join(shardDir, f), "utf8");
      }
    }
  }

  const rows = CHAMPIONS.map((p) => {
    const enc = encodeURI(p);
    const inSitemap =
      sitemapText.includes(p) ||
      sitemapText.includes(enc) ||
      sitemapText.includes(p.slice(1));
    return {
      path: p,
      published: published.has(p),
      inSitemap,
      robotsHint: "default allow (no noindex applied in this change set)",
      status: published.has(p) && inSitemap ? "OK" : "CHECK",
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    rows,
    policy: "sitemap URL 삭제 금지. lastmod 무조건 now 금지.",
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote", OUT);
  console.table(rows);
}

main();
