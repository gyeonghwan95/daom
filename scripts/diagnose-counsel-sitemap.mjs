import fs from "node:fs";
import { getIndexablePaths } from "./lib/indexable-paths.mjs";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";
import { getExclusionReason } from "./lib/sitemap/exclusions.mjs";

const target = "/부산법률상담";
const indexable = getIndexablePaths();
const published = getAllPublishedPaths();

console.log("in indexable", indexable.includes(target));
console.log("in published", published.includes(target));
console.log("exclusion", getExclusionReason(target));
console.log(
  "indexable hits",
  indexable.filter((p) => p.includes("법률상담") || p.includes("기업법률")),
);
console.log(
  "published hits",
  published.filter((p) => p.includes("법률상담") || p.includes("기업법률")),
);

const m = JSON.parse(fs.readFileSync("scripts/output/sitemap-manifest.json", "utf8"));
console.log(
  "excluded hits",
  (m.excluded || []).filter(
    (e) => e.path.includes("법률상담") || e.path.includes("기업법률자문"),
  ),
);
console.log(
  "manifest entry",
  (m.entries || []).find((e) => e.path.includes("법률상담")),
);

const raw = fs.readFileSync("public/sitemaps/tier-1-core.xml", "utf8");
const firstLoc = raw.match(/<loc>([^<]+)<\/loc>/)[1];
console.log("raw first loc", firstLoc);
console.log("raw has hangul host chars", /다옴/.test(firstLoc));
console.log("raw has xn--", firstLoc.includes("xn--"));

// Compare canonical host form from live homepage vs sitemap raw host form
console.log("sitemap host literal form:", firstLoc.split("/")[2]);
