import {
  getPublishedSoutheastDefs,
  getUnpublishedSoutheastDefs,
  getAllSoutheastDefs,
  SOUTHEAST_RESERVED_SLUGS,
  scoreSoutheastLanding,
} from "../src/lib/southeast-cases";
import { getPublishedNationwideCaseSlugs } from "../src/lib/nationwide-cases";
import { getPublishedGyeongnamSlugs } from "../src/lib/gyeongnam-cases";

const pub = getPublishedSoutheastDefs();
const unpub = getUnpublishedSoutheastDefs();
const all = getAllSoutheastDefs();
const nw = new Set(getPublishedNationwideCaseSlugs());
const gn = new Set(getPublishedGyeongnamSlugs());
const collisions = pub.filter(
  (d) =>
    nw.has(d.slug) || gn.has(d.slug) || SOUTHEAST_RESERVED_SLUGS.has(d.slug),
);
const gunwiInGb = all.filter(
  (d) =>
    d.regionGroup === "경북" && /군위/.test(d.slug + d.regionName + d.h1),
);
const byGroup: Record<string, number> = { 울산: 0, 대구: 0, 경북: 0 };
for (const d of pub) byGroup[d.regionGroup] = (byGroup[d.regionGroup] ?? 0) + 1;
const scores = pub.map((d) => ({
  slug: d.slug,
  score: scoreSoutheastLanding(d, all).total,
  title: d.seoTitle,
  h1: d.h1,
  group: d.regionGroup,
  pageType: d.pageType,
}));
const low = scores.filter((s) => s.score < 80);
const titles = new Map<string, string[]>();
for (const d of pub) {
  const list = titles.get(d.seoTitle) ?? [];
  list.push(d.slug);
  titles.set(d.seoTitle, list);
}
const dupTitles = [...titles.entries()].filter(([, v]) => v.length > 1);

import { writeFileSync } from "node:fs";

const report = {
  totalAll: all.length,
  published: pub.length,
  unpublishedCount: unpub.length,
  byGroup,
  collisions: collisions.map((c) => c.slug),
  gunwiInGb: gunwiInGb.map((g) => g.slug),
  low,
  dupTitles,
  unpublished: unpub,
  publishedList: scores,
  failDetails: unpub.map((u) => {
    const def = all.find((d) => d.slug === u.slug)!;
    return { ...u, breakdown: scoreSoutheastLanding(def, all), publishedFlag: def.published };
  }),
};
writeFileSync(
  "scripts/southeast-report.json",
  JSON.stringify(report, null, 2),
  "utf8",
);
console.log(
  `published=${report.published} unpub=${report.unpublishedCount} collisions=${report.collisions.length} low=${report.low.length}`,
);
console.log(JSON.stringify(report.byGroup));
for (const f of report.failDetails) {
  if (f.publishedFlag) {
    console.log("FAIL", f.slug, f.score, JSON.stringify(f.breakdown));
  }
}