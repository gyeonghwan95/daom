/**
 * Sitemap indexing diagnosis (read-only). No code/sitemap mutations.
 * Usage: node scripts/diagnose-sitemap-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
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

const LIVE_BASES = [
  "https://다옴법무사사무소.kr",
  "https://xn--2j1br1na42lvxja38mk8r.kr",
  "https://www.다옴법무사사무소.kr",
  "http://다옴법무사사무소.kr",
];

function extractLocs(raw) {
  return [...raw.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function analyzeXml(raw, label) {
  const isIndex = /<sitemapindex[\s>]/i.test(raw);
  const isUrlset = /<urlset[\s>]/i.test(raw);
  const locs = extractLocs(raw);
  const openUrl = (raw.match(/<url>/g) || []).length;
  const closeUrl = (raw.match(/<\/url>/g) || []).length;
  const relative = locs.filter((u) => !/^https?:\/\//i.test(u));
  const http = locs.filter((u) => /^http:\/\//i.test(u));
  const www = locs.filter((u) => /:\/\/www\./i.test(u));
  const trailing = locs.filter(
    (u) =>
      /\/$/.test(u) &&
      !/\.xml\/?$/.test(u) &&
      !/^https?:\/\/[^/]+\/?$/.test(u),
  );
  const seen = new Map();
  for (const u of locs) seen.set(u, (seen.get(u) || 0) + 1);
  const uniqueDupes = [...seen.entries()].filter(([, n]) => n > 1).map(([u, n]) => ({ u, n }));

  // lastmod samples
  const lastmods = [...raw.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim());
  const lastmodUnique = [...new Set(lastmods)];

  return {
    label,
    bytes: Buffer.byteLength(raw, "utf8"),
    root: isIndex ? "sitemapindex" : isUrlset ? "urlset" : "UNKNOWN",
    locCount: locs.length,
    urlOpen: openUrl,
    urlClose: closeUrl,
    urlTagMatch: openUrl === closeUrl,
    relative,
    http,
    www,
    trailingCount: trailing.length,
    trailingSample: trailing.slice(0, 10),
    uniqueDupes: uniqueDupes.slice(0, 20),
    dupeCount: uniqueDupes.length,
    lastmodUnique: lastmodUnique.slice(0, 10),
    lastmodCount: lastmods.length,
    sampleLocs: locs.slice(0, 5),
    locs,
  };
}

function analyzeFile(filePath, label) {
  if (!fs.existsSync(filePath)) return { label, exists: false };
  const raw = fs.readFileSync(filePath, "utf8");
  return { exists: true, ...analyzeXml(raw, label), filePath };
}

async function fetchText(url, { method = "GET", redirect = "manual" } = {}) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method,
      redirect,
      headers: {
        "User-Agent": "daom-sitemap-diagnose/1.0",
        Accept: "application/xml,text/xml,*/*",
      },
    });
    const headers = {};
    for (const [k, v] of res.headers.entries()) headers[k.toLowerCase()] = v;
    let body = "";
    if (method !== "HEAD") {
      body = await res.text();
    }
    return {
      url,
      ok: res.ok,
      status: res.status,
      redirected: res.redirected,
      location: headers.location || null,
      headers: {
        "content-type": headers["content-type"] || null,
        "x-robots-tag": headers["x-robots-tag"] || null,
        "cache-control": headers["cache-control"] || null,
        "cf-cache-status": headers["cf-cache-status"] || null,
        age: headers.age || null,
        etag: headers.etag || null,
        "last-modified": headers["last-modified"] || null,
        "content-length": headers["content-length"] || null,
      },
      ms: Date.now() - started,
      body,
    };
  } catch (err) {
    return {
      url,
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
      ms: Date.now() - started,
      body: "",
      headers: {},
    };
  }
}

function pathFromLoc(loc, siteHostHints) {
  try {
    const u = new URL(loc);
    return u.pathname + u.search;
  } catch {
    return loc;
  }
}

function findOutFile(routePath) {
  // static export may produce out/foo.html or out/foo/index.html
  const clean = routePath.replace(/\/$/, "") || "";
  const candidates = [
    path.join(ROOT, "out", clean.slice(1), "index.html"),
    path.join(ROOT, "out", `${clean.slice(1)}.html`),
    path.join(ROOT, "out", "index.html"),
  ];
  if (clean === "" || clean === "/") {
    return fs.existsSync(path.join(ROOT, "out", "index.html"))
      ? path.join(ROOT, "out", "index.html")
      : null;
  }
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function extractCanonical(html) {
  const m =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return m ? m[1] : null;
}

function extractRobotsMeta(html) {
  const m = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

async function main() {
  const report = {
    generatedAt: new Date().toISOString(),
    local: {},
    live: {},
    mismatches: [],
    badIncludes: [],
    critical: [],
    notes: [],
  };

  // --- Local public ---
  report.local.publicIndex = analyzeFile(
    path.join(ROOT, "public", "sitemap.xml"),
    "public/sitemap.xml",
  );
  report.local.publicTiers = {};
  for (const t of TIERS) {
    report.local.publicTiers[t] = analyzeFile(
      path.join(ROOT, "public", "sitemaps", t),
      `public/sitemaps/${t}`,
    );
  }

  // --- Local out ---
  report.local.outExists = fs.existsSync(path.join(ROOT, "out"));
  report.local.outIndex = analyzeFile(path.join(ROOT, "out", "sitemap.xml"), "out/sitemap.xml");
  report.local.outTiers = {};
  report.local.outMissingTiers = [];
  for (const t of TIERS) {
    const p = path.join(ROOT, "out", "sitemaps", t);
    const a = analyzeFile(p, `out/sitemaps/${t}`);
    report.local.outTiers[t] = a;
    if (!a.exists) report.local.outMissingTiers.push(t);
  }
  report.local.outRobots = fs.existsSync(path.join(ROOT, "out", "robots.txt"))
    ? fs.readFileSync(path.join(ROOT, "out", "robots.txt"), "utf8")
    : null;

  // Aggregate local URL stats
  const allLocalLocs = [];
  for (const t of TIERS) {
    const a = report.local.publicTiers[t];
    if (a.exists && a.root === "urlset") allLocalLocs.push(...a.locs);
  }
  const localSeen = new Map();
  for (const u of allLocalLocs) localSeen.set(u, (localSeen.get(u) || 0) + 1);
  report.local.totalUrls = allLocalLocs.length;
  report.local.crossTierDupes = [...localSeen.entries()]
    .filter(([, n]) => n > 1)
    .map(([u, n]) => ({ u, n }));

  // Sample local canonical checks against out HTML (up to 40 URLs across tiers)
  const sampleForCanonical = [];
  for (const t of TIERS) {
    const a = report.local.publicTiers[t];
    if (!a.exists || !a.locs) continue;
    sampleForCanonical.push(...a.locs.slice(0, 5));
  }
  // always check home + a few known
  sampleForCanonical.unshift("https://다옴법무사사무소.kr/");
  const uniqueSample = [...new Set(sampleForCanonical)].slice(0, 50);

  report.local.canonicalChecks = [];
  for (const loc of uniqueSample) {
    const routePath = pathFromLoc(loc);
    const file = findOutFile(routePath);
    if (!file) {
      report.local.canonicalChecks.push({
        loc,
        routePath,
        outFile: null,
        issue: "missing-out-html",
      });
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    const canonical = extractCanonical(html);
    const robotsMeta = extractRobotsMeta(html);
    const issues = [];
    if (!canonical) issues.push("no-canonical");
    else if (canonical !== loc) issues.push("canonical-mismatch");
    if (robotsMeta && /noindex/i.test(robotsMeta)) issues.push("noindex-meta");
    report.local.canonicalChecks.push({
      loc,
      routePath,
      outFile: path.relative(ROOT, file),
      canonical,
      robotsMeta,
      issues,
    });
  }

  // --- Live fetches ---
  const primaryLive = LIVE_BASES[0];
  const punyLive = LIVE_BASES[1];

  report.live.baseProbes = {};
  for (const base of LIVE_BASES) {
    report.live.baseProbes[base] = await fetchText(base + "/", { redirect: "manual" });
  }

  report.live.sitemapIndex = {};
  for (const base of [primaryLive, punyLive]) {
    const r = await fetchText(base + "/sitemap.xml", { redirect: "manual" });
    report.live.sitemapIndex[base] = {
      status: r.status,
      location: r.location,
      headers: r.headers,
      ms: r.ms,
      error: r.error || null,
      analysis: r.body ? analyzeXml(r.body, base + "/sitemap.xml") : null,
      bodyPreview: r.body ? r.body.slice(0, 400) : "",
    };
  }

  report.live.tiers = {};
  for (const t of TIERS) {
    const url = `${primaryLive}/sitemaps/${t}`;
    const r = await fetchText(url, { redirect: "manual" });
    report.live.tiers[t] = {
      url,
      status: r.status,
      location: r.location,
      headers: r.headers,
      ms: r.ms,
      error: r.error || null,
      analysis: r.body && r.status === 200 ? analyzeXml(r.body, t) : null,
      bodyPreview: r.body ? r.body.slice(0, 200) : "",
    };
  }

  // robots live
  report.live.robots = {};
  for (const base of [primaryLive, punyLive]) {
    const r = await fetchText(base + "/robots.txt", { redirect: "manual" });
    report.live.robots[base] = {
      status: r.status,
      location: r.location,
      headers: r.headers,
      body: r.body,
    };
  }

  // Live page probe sample from live sitemap URLs
  const liveUrls = [];
  for (const t of TIERS) {
    const a = report.live.tiers[t]?.analysis;
    if (a?.locs) liveUrls.push(...a.locs.slice(0, 3));
  }
  report.live.pageProbes = [];
  for (const loc of [...new Set(liveUrls)].slice(0, 24)) {
    const r = await fetchText(loc, { redirect: "manual" });
    let final = r;
    let hop = 0;
    const chain = [{ status: r.status, location: r.location, url: loc }];
    // follow up to 3 redirects manually to see final
    let current = r;
    let currentUrl = loc;
    while (
      hop < 3 &&
      current.location &&
      [301, 302, 303, 307, 308].includes(current.status)
    ) {
      hop += 1;
      const nextUrl = current.location.startsWith("http")
        ? current.location
        : new URL(current.location, currentUrl).toString();
      current = await fetchText(nextUrl, { redirect: "manual" });
      currentUrl = nextUrl;
      chain.push({ status: current.status, location: current.location, url: nextUrl });
    }
    // if 200, get body for canonical
    let pageBody = current.body;
    if (current.status === 200 && !pageBody) {
      const full = await fetchText(currentUrl, { redirect: "follow" });
      pageBody = full.body;
      current = { ...current, ...full, status: full.status };
    }
    const canonical = pageBody ? extractCanonical(pageBody) : null;
    const robotsMeta = pageBody ? extractRobotsMeta(pageBody) : null;
    const issues = [];
    if (chain[0].status !== 200) issues.push(`status-${chain[0].status}`);
    if (chain.length > 1) issues.push("redirects");
    if (canonical && canonical !== loc) issues.push("canonical-mismatch");
    if (robotsMeta && /noindex/i.test(robotsMeta)) issues.push("noindex");
    report.live.pageProbes.push({
      loc,
      chain,
      finalStatus: current.status,
      canonical,
      robotsMeta,
      issues,
      headers: current.headers,
    });
  }

  // Compare local vs live counts
  report.compare = { tierCounts: {} };
  for (const t of TIERS) {
    report.compare.tierCounts[t] = {
      localPublic: report.local.publicTiers[t]?.locCount ?? null,
      localOut: report.local.outTiers[t]?.locCount ?? null,
      live: report.live.tiers[t]?.analysis?.locCount ?? null,
      liveStatus: report.live.tiers[t]?.status ?? null,
      liveContentType: report.live.tiers[t]?.headers?.["content-type"] ?? null,
      liveRoot: report.live.tiers[t]?.analysis?.root ?? null,
    };
  }

  // lastmod index check: does index lastmod equal max of tier or always today?
  report.local.indexLastmods = (report.local.publicIndex.locs || []).length
    ? null
    : null;
  if (report.local.publicIndex.exists) {
    const raw = fs.readFileSync(report.local.publicIndex.filePath, "utf8");
    const blocks = [...raw.matchAll(/<sitemap>[\s\S]*?<\/sitemap>/g)].map((m) => m[0]);
    report.local.indexEntries = blocks.map((b) => ({
      loc: (b.match(/<loc>([^<]+)<\/loc>/) || [])[1],
      lastmod: (b.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1],
    }));
  }

  // Manifest lastmod policy from generator source (already known) — note only
  report.notes.push(
    "generate-sitemaps.mjs uses maxLastmod(tierEntries) for index lastmod, not Date.now() per build.",
  );

  // Write report
  const outPath = path.join(ROOT, "scripts", "output", "sitemap-diagnosis.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${outPath}`);

  // Compact console summary
  console.log("\n=== LOCAL INDEX ===");
  console.log(report.local.publicIndex.root, "locs", report.local.publicIndex.locCount);
  console.log("\n=== LOCAL TIER COUNTS ===");
  for (const t of TIERS) {
    const a = report.local.publicTiers[t];
    console.log(
      t,
      a.exists ? `${a.root} ${a.locCount}` : "MISSING",
      "out:",
      report.local.outTiers[t]?.exists ? report.local.outTiers[t].locCount : "MISSING",
    );
  }
  console.log("\n=== LIVE TIER STATUS ===");
  for (const t of TIERS) {
    const L = report.live.tiers[t];
    console.log(
      t,
      "status",
      L.status,
      "ct",
      L.headers?.["content-type"],
      "root",
      L.analysis?.root,
      "urls",
      L.analysis?.locCount,
    );
  }
  console.log("\n=== LIVE BASE PROBES ===");
  for (const [b, r] of Object.entries(report.live.baseProbes)) {
    console.log(b, r.status, r.location, r.headers?.["content-type"]);
  }
  console.log("\n=== LIVE ROBOTS (primary) ===");
  console.log(report.live.robots[primaryLive]?.status);
  console.log(report.live.robots[primaryLive]?.body?.slice(0, 500));

  const badCanon = report.local.canonicalChecks.filter((c) => c.issues?.length);
  console.log("\n=== LOCAL CANONICAL ISSUES ===", badCanon.length);
  for (const c of badCanon.slice(0, 20)) {
    console.log(c.loc, "->", c.canonical, c.issues);
  }
  const liveBad = report.live.pageProbes.filter((p) => p.issues.length);
  console.log("\n=== LIVE PAGE ISSUES ===", liveBad.length);
  for (const p of liveBad.slice(0, 20)) {
    console.log(p.loc, p.issues, "final", p.finalStatus, "canon", p.canonical);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
