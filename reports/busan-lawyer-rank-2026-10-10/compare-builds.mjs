#!/usr/bin/env node
/**
 * GOOD(worktree out/) vs DEPLOY(현재 out/) 정적 HTML 비교.
 *   node compare-builds.mjs <goodOutDir> <deployOutDir>
 * 결과: compare.json (전체 route 정책·메타 차이 + 일반 의도 페이지 상세)
 */
import fs from "node:fs";
import path from "node:path";
import { parsePage, canonicalPath } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const [, , goodDir, depDir] = process.argv;
const FOCUS = ["/", "/부산법무사", "/부산법무사추천", "/부산법무사상담", "/부산법무사무소", "/about", "/office", "/location", "/services"];

function listRoutes(OUT) {
  const routes = new Map();
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) { if (!ent.name.startsWith("_next")) walk(full); }
      else if (ent.name.endsWith(".html")) {
        let r = "/" + path.relative(OUT, full).split(path.sep).join("/").replace(/\.html$/, "");
        if (r === "/index") r = "/";
        r = r.replace(/\/index$/, "");
        routes.set(r, full);
      }
    }
  };
  walk(OUT);
  return routes;
}
function sitemap(OUT) {
  const m = new Map();
  const files = [path.join(OUT, "sitemap.xml"), ...(fs.existsSync(path.join(OUT, "sitemaps")) ? fs.readdirSync(path.join(OUT, "sitemaps")).map((f) => path.join(OUT, "sitemaps", f)) : [])];
  for (const f of files) {
    if (!f.endsWith(".xml") || !fs.existsSync(f)) continue;
    const x = fs.readFileSync(f, "utf8");
    if (x.includes("<sitemapindex")) continue;
    for (const mm of x.matchAll(/<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) m.set(canonicalPath(mm[1].trim()), mm[2] || null);
  }
  return m;
}
const G = listRoutes(goodDir), D = listRoutes(depDir);
const SG = sitemap(goodDir), SD = sitemap(depDir);
const res = { counts: {}, removedRoutes: [], addedRoutes: [], robotsChanged: [], canonicalChanged: [], sitemapRemoved: [], sitemapAdded: [], titleChanged: 0, focus: {} };
for (const r of G.keys()) if (!D.has(r)) res.removedRoutes.push(r);
for (const r of D.keys()) if (!G.has(r)) res.addedRoutes.push(r);
for (const [r, gf] of G) {
  if (!D.has(r)) continue;
  const g = parsePage(fs.readFileSync(gf, "utf8")), d = parsePage(fs.readFileSync(D.get(r), "utf8"));
  if (g.robots !== d.robots) res.robotsChanged.push({ r, before: g.robots, after: d.robots });
  if (canonicalPath(g.canonical) !== canonicalPath(d.canonical)) res.canonicalChanged.push({ r, before: canonicalPath(g.canonical), after: canonicalPath(d.canonical) });
  if (g.title !== d.title) res.titleChanged++;
  if (FOCUS.includes(r)) {
    const links = (p) => [...new Set(p.links.map((l) => l.href))];
    const gl = links(g), dl = links(d);
    const cnt = (t, k) => t.split(k).length - 1;
    res.focus[r] = {
      title: [g.title, d.title], description: [g.description, d.description], h1: [g.h1s, d.h1s],
      robots: [g.robots, d.robots], canonical: [canonicalPath(g.canonical), canonicalPath(d.canonical)],
      mainLen: [g.mainText.length, d.mainText.length],
      busanLawyerCount: [cnt(g.mainText, "부산 법무사"), cnt(d.mainText, "부산 법무사")],
      ldTypes: [g.ldTypes, d.ldTypes],
      links: [gl.length, dl.length], linksLost: gl.filter((h) => !dl.includes(h)), linksGained: dl.filter((h) => !gl.includes(h)),
      sitemap: [SG.has(r) ? SG.get(r) ?? "no-lastmod" : "absent", SD.has(r) ? SD.get(r) ?? "no-lastmod" : "absent"],
      mainHead: [g.mainText.slice(0, 400), d.mainText.slice(0, 400)],
    };
  }
}
for (const r of SG.keys()) if (!SD.has(r)) res.sitemapRemoved.push(r);
for (const r of SD.keys()) if (!SG.has(r)) res.sitemapAdded.push(r);
res.counts = { good: G.size, deploy: D.size, removed: res.removedRoutes.length, added: res.addedRoutes.length, robotsChanged: res.robotsChanged.length, canonicalChanged: res.canonicalChanged.length, sitemapRemoved: res.sitemapRemoved.length, sitemapAdded: res.sitemapAdded.length, titleChanged: res.titleChanged };
fs.writeFileSync(path.join(DIR, "compare.json"), JSON.stringify(res, null, 1));
console.log(JSON.stringify(res.counts));
for (const [r, f] of Object.entries(res.focus)) {
  const ch = ["title", "description", "h1", "robots", "canonical"].filter((k) => JSON.stringify(f[k][0]) !== JSON.stringify(f[k][1]));
  console.log(r, "| changed:", ch.join(",") || "-", "| mainLen", f.mainLen.join("→"), "| '부산 법무사'", f.busanLawyerCount.join("→"), "| links", f.links.join("→"), `-${f.linksLost.length}/+${f.linksGained.length}`, "| sitemap", f.sitemap.join("→"));
}
