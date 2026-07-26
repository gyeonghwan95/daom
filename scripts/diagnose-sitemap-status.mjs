import fs from "node:fs";
import path from "node:path";

const TIERS = [
  "tier-1-core.xml",
  "tier-2-hubs.xml",
  "tier-3-tools.xml",
  "tier-4-regions.xml",
  "tier-5-local.xml",
  "tier-6-keywords.xml",
  "tier-7-blog.xml",
  "tier-8-media.xml",
];

function locsFrom(file) {
  const raw = fs.readFileSync(file, "utf8");
  return [...raw.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function hostForm(url) {
  try {
    const u = new URL(url);
    return {
      host: u.host,
      isPuny: u.host.startsWith("xn--"),
      isHangul: /[가-힣]/.test(u.host),
      pathname: u.pathname,
    };
  } catch {
    return { host: "?", isPuny: false, isHangul: false, pathname: "?" };
  }
}

function normalizeComparable(url) {
  // Compare by pathname + search only (ignore host unicode form)
  try {
    const u = new URL(url);
    let p = u.pathname;
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return decodeURIComponent(p) + u.search;
  } catch {
    return url;
  }
}

const byTier = {};
const all = [];
for (const t of TIERS) {
  const locs = locsFrom(path.join("public/sitemaps", t));
  byTier[t] = locs;
  for (const loc of locs) all.push({ tier: t, loc });
}

// cross-tier duplicates by normalized path
const pathMap = new Map();
for (const { tier, loc } of all) {
  const key = normalizeComparable(loc);
  if (!pathMap.has(key)) pathMap.set(key, []);
  pathMap.get(key).push({ tier, loc });
}
const crossDupes = [...pathMap.entries()].filter(([, arr]) => arr.length > 1);

// host form stats
let hangulHost = 0;
let punyHost = 0;
let otherHost = 0;
for (const { loc } of all) {
  const h = hostForm(loc);
  if (h.isHangul) hangulHost += 1;
  else if (h.isPuny) punyHost += 1;
  else otherHost += 1;
}

// home variants
const homes = all.filter((x) => normalizeComparable(x.loc) === "/");

// check 부산법률상담
const counsel = all.filter((x) => normalizeComparable(x.loc).includes("부산법률상담"));

// live: fetch sitemap index lastmods + check counsel in live tier-6/1
async function liveHas(pathNeedle) {
  const results = [];
  for (const t of TIERS) {
    const res = await fetch(`https://다옴법무사사무소.kr/sitemaps/${t}`);
    const body = await res.text();
    if (body.includes(pathNeedle) || body.includes(encodeURIComponent(pathNeedle))) {
      results.push(t);
    }
  }
  return results;
}

const counselLiveTiers = await liveHas("부산법률상담");

// sample random 30 live HEAD/GET status (no redirect follow)
const sample = [];
const step = Math.max(1, Math.floor(all.length / 30));
for (let i = 0; i < all.length && sample.length < 30; i += step) {
  sample.push(all[i].loc);
}
const liveStatuses = [];
for (const loc of sample) {
  const res = await fetch(loc, {
    method: "GET",
    redirect: "manual",
    headers: { "User-Agent": "daom-sitemap-status/1.0" },
  });
  const headers = Object.fromEntries([...res.headers.entries()]);
  let canonical = null;
  let robots = null;
  if (res.status === 200) {
    const html = await res.text();
    canonical = (html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i) || [])[1] || null;
    robots = (html.match(/name=["']robots["'][^>]*content=["']([^"']+)/i) || [])[1] || null;
  }
  const pathOnly = normalizeComparable(loc);
  const canonPath = canonical ? normalizeComparable(canonical) : null;
  liveStatuses.push({
    loc,
    status: res.status,
    location: headers.location || null,
    pathOnly,
    canonPath,
    pathMatch: canonPath === pathOnly,
    hostSitemap: hostForm(loc).host,
    hostCanon: canonical ? hostForm(canonical).host : null,
    robots,
    noindex: robots ? /noindex/i.test(robots) : false,
  });
}

// excluded summary from manifest
const manifest = JSON.parse(fs.readFileSync("scripts/output/sitemap-manifest.json", "utf8"));
const excludedByReason = {};
for (const e of manifest.excluded || []) {
  excludedByReason[e.reason] = (excludedByReason[e.reason] || 0) + 1;
}

// check if any excluded redirect/noindex path accidentally still in sitemap
const excludedPaths = new Set((manifest.excluded || []).map((e) => e.path));
const wronglyIncluded = all.filter((x) => excludedPaths.has(normalizeComparable(x.loc)));

const report = {
  totals: {
    urls: all.length,
    hangulHost,
    punyHost,
    otherHost,
    crossTierDupePaths: crossDupes.length,
  },
  countsByTier: Object.fromEntries(
    Object.entries(byTier).map(([t, locs]) => [t, locs.length]),
  ),
  homes,
  counselInLocalSitemap: counsel,
  counselLiveTiers,
  crossDupesSample: crossDupes.slice(0, 20).map(([p, arr]) => ({ path: p, occurrences: arr })),
  liveStatusSummary: {
    sampleSize: liveStatuses.length,
    statusCounts: liveStatuses.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {}),
    pathMismatch: liveStatuses.filter((r) => r.status === 200 && !r.pathMatch),
    noindexInSample: liveStatuses.filter((r) => r.noindex),
    redirects: liveStatuses.filter((r) => [301, 302, 307, 308].includes(r.status)),
    notFound: liveStatuses.filter((r) => r.status === 404),
  },
  liveStatuses,
  excludedByReason,
  wronglyIncluded,
  indexLastmods: (() => {
    const raw = fs.readFileSync("public/sitemap.xml", "utf8");
    return [...raw.matchAll(/<sitemap>[\s\S]*?<\/sitemap>/g)].map((m) => {
      const loc = (m[0].match(/<loc>([^<]+)/) || [])[1];
      const lastmod = (m[0].match(/<lastmod>([^<]+)/) || [])[1];
      return { loc, lastmod };
    });
  })(),
};

fs.writeFileSync(
  "scripts/output/sitemap-diagnosis-status.json",
  JSON.stringify(report, null, 2),
  "utf8",
);

console.log(JSON.stringify({
  totals: report.totals,
  countsByTier: report.countsByTier,
  counselLocal: report.counselInLocalSitemap.length,
  counselLiveTiers: report.counselLiveTiers,
  crossDupes: report.totals.crossTierDupePaths,
  liveSummary: report.liveStatusSummary.statusCounts,
  pathMismatchCount: report.liveStatusSummary.pathMismatch.length,
  noindexCount: report.liveStatusSummary.noindexInSample.length,
  redirectCount: report.liveStatusSummary.redirects.length,
  notFoundCount: report.liveStatusSummary.notFound.length,
  wronglyIncluded: report.wronglyIncluded.length,
  excludedByReason: report.excludedByReason,
  pathMismatchSample: report.liveStatusSummary.pathMismatch.slice(0, 5),
  hostMismatchAlways: report.liveStatuses.every(
    (r) => r.hostSitemap !== r.hostCanon && r.status === 200,
  ),
}, null, 2));
