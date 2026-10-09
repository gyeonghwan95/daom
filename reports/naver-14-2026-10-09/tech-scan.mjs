#!/usr/bin/env node
/** out/ 전체: head 태그 중복, canonical 절대 URL, 이중 인코딩 href, 존재하지 않는 내부 링크. 결과 tech-scan.json */
import fs from "node:fs";
import path from "node:path";
import { listRoutes, routeToFile, readRedirectSources } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const routes = listRoutes();
const known = new Set(routes.map((r) => r.route));
const redirects = readRedirectSources();
const redirectFrom = new Set(redirects.map((r) => r.from));
const res = { headDup: [], canonicalNotAbsolute: [], doubleEncoded: new Set(), brokenLinks: {} };
for (const { route, file } of routes) {
  const html = fs.readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const c = (re) => (head.match(re) || []).length;
  const n = { title: c(/<title>/g), canonical: c(/rel="canonical"/g), description: c(/name="description"/g), robots: c(/name="robots"/g) };
  if (n.title > 1 || n.canonical > 1 || n.description > 1 || n.robots > 1) res.headDup.push({ route, ...n });
  const can = head.match(/rel="canonical" href="([^"]*)"/);
  if (can && !/^https:\/\//.test(can[1])) res.canonicalNotAbsolute.push({ route, href: can[1] });
  const body = html.slice(html.indexOf("<body"));
  for (const m of body.matchAll(/<a\b[^>]*?href="(\/[^"#?]*)/g)) {
    const raw = m[1];
    if (/%25[0-9A-F]{2}/i.test(raw)) res.doubleEncoded.add(`${route} -> ${raw}`);
    let p;
    try { p = decodeURIComponent(raw); } catch { p = raw; }
    p = p.replace(/\/$/, "") || "/";
    if (/^\/(_next|api|admin)\b|\.[a-z0-9]{2,5}$/i.test(p)) continue;
    if (known.has(p) || redirectFrom.has(p) || routeToFile(p)) continue;
    (res.brokenLinks[p] ??= []).push(route);
  }
}
const broken = Object.entries(res.brokenLinks).map(([href, from]) => ({ href, count: from.length, from: [...new Set(from)].slice(0, 5) })).sort((a, b) => b.count - a.count);
fs.writeFileSync(path.join(DIR, "tech-scan.json"), JSON.stringify({ ...res, doubleEncoded: [...res.doubleEncoded], brokenLinks: broken }, null, 1));
console.log(`routes=${routes.length} headDup=${res.headDup.length} canonicalNotAbsolute=${res.canonicalNotAbsolute.length} doubleEncoded=${res.doubleEncoded.size} brokenTargets=${broken.length}`);
for (const b of broken.slice(0, 15)) console.log(" broken", b.href, b.count, b.from.join(" "));
