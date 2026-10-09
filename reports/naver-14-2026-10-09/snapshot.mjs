#!/usr/bin/env node
/**
 * out/ 전체 공개 route의 메타·정책·본문 해시 기준표를 저장하고, 두 기준표를 비교한다.
 *   node reports/seo-recovery-2026-10-09/snapshot.mjs save baseline
 *   node reports/seo-recovery-2026-10-09/snapshot.mjs save after
 *   node reports/seo-recovery-2026-10-09/snapshot.mjs diff baseline after
 * 콘솔에는 건수·경로만 출력하고 상세는 JSON 파일에 남긴다.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  scanAll,
  readSitemapUrls,
  readRobotsDisallow,
  isBlockedByRobots,
  canonicalPath,
} from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 12);
const [, , cmd, a, b] = process.argv;

if (cmd === "save") {
  const pages = scanAll();
  const sitemap = new Set(readSitemapUrls().map((u) => canonicalPath(u.loc)));
  const disallow = readRobotsDisallow("Yeti");
  const rows = {};
  for (const p of pages.values()) {
    rows[p.route] = {
      title: p.title,
      h1: p.h1s,
      description: p.description,
      canonical: canonicalPath(p.canonical),
      robots: p.robots,
      inSitemap: sitemap.has(p.route),
      robotsBlocked: isBlockedByRobots(p.route, disallow),
      mainHash: hash(p.mainText),
      mainLen: p.mainText.length,
      links: [...new Set(p.links.map((l) => l.href))].length,
      linkHrefs: [...new Set(p.links.map((l) => l.href))].sort(),
      telLinks: (p.text.match(/tel:/g) || []).length,
      ldTypes: p.ldTypes,
      jsonldErrors: p.jsonldErrors.length,
    };
  }
  const file = path.join(DIR, `${a}.json`);
  fs.writeFileSync(file, JSON.stringify(rows));
  console.log(`saved ${Object.keys(rows).length} routes -> ${path.relative(process.cwd(), file)}`);
} else if (cmd === "diff") {
  const A = JSON.parse(fs.readFileSync(path.join(DIR, `${a}.json`), "utf8"));
  const B = JSON.parse(fs.readFileSync(path.join(DIR, `${b}.json`), "utf8"));
  const out = { removed: [], added: [], policy: [], title: [], h1: [], description: [], main: [], links: [] };
  for (const r of Object.keys(A)) {
    const x = A[r];
    const y = B[r];
    if (!y) { out.removed.push(r); continue; }
    if (x.canonical !== y.canonical || x.robots !== y.robots || x.inSitemap !== y.inSitemap || x.robotsBlocked !== y.robotsBlocked)
      out.policy.push({ r, before: [x.canonical, x.robots, x.inSitemap, x.robotsBlocked], after: [y.canonical, y.robots, y.inSitemap, y.robotsBlocked] });
    if (x.title !== y.title) out.title.push({ r, before: x.title, after: y.title });
    if (JSON.stringify(x.h1) !== JSON.stringify(y.h1)) out.h1.push({ r, before: x.h1, after: y.h1 });
    if (x.description !== y.description) out.description.push({ r, before: x.description, after: y.description });
    if (x.mainHash !== y.mainHash) out.main.push({ r, beforeLen: x.mainLen, afterLen: y.mainLen });
    const lost = x.linkHrefs.filter((h) => !y.linkHrefs.includes(h));
    const gained = y.linkHrefs.filter((h) => !x.linkHrefs.includes(h));
    if (lost.length || gained.length) out.links.push({ r, lost, gained });
  }
  for (const r of Object.keys(B)) if (!A[r]) out.added.push(r);
  fs.writeFileSync(path.join(DIR, `diff-${a}-${b}.json`), JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out)) console.log(`${k}: ${v.length}`);
  console.log(`main-changed routes: ${out.main.map((m) => m.r).slice(0, 60).join(" ")}`);
} else {
  console.error("usage: save <name> | diff <a> <b>");
  process.exit(1);
}
