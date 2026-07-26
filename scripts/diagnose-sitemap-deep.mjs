import fs from "node:fs";
import path from "node:path";

async function get(url, ua = "daom-diagnose") {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "User-Agent": ua, Accept: "*/*" },
  });
  const headers = Object.fromEntries(
    [...res.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]),
  );
  const body = await res.text();
  return { status: res.status, location: headers.location || null, headers, body };
}

function pickCanonical(html) {
  const m1 = html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (m1) return m1[1];
  const m2 = html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return m2 ? m2[1] : null;
}

const bases = [
  "https://다옴법무사사무소.kr",
  "https://xn--2j1br1na42lvxja38mk8r.kr",
];

const out = { robots: {}, sitemap: {}, pages: [], localOutSample: [] };

for (const b of bases) {
  out.robots[b] = await get(b + "/robots.txt");
  out.sitemap[b] = await get(b + "/sitemap.xml");
}

const pages = [
  "https://다옴법무사사무소.kr/",
  "https://다옴법무사사무소.kr/부산법무사",
  "https://xn--2j1br1na42lvxja38mk8r.kr/부산법무사",
  "https://다옴법무사사무소.kr/sitemaps/tier-1-core.xml",
];

for (const u of pages) {
  for (const ua of [
    "daom-diagnose",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  ]) {
    const r = await get(u, ua);
    out.pages.push({
      url: u,
      ua,
      status: r.status,
      location: r.location,
      contentType: r.headers["content-type"],
      xRobots: r.headers["x-robots-tag"],
      cacheControl: r.headers["cache-control"],
      cfCache: r.headers["cf-cache-status"],
      canonical: r.body.includes("<html") ? pickCanonical(r.body) : null,
      bodyStart: r.body.slice(0, 180).replace(/\s+/g, " "),
    });
  }
}

// local out robots + sample html canonical
const robotsOut = path.join("out", "robots.txt");
out.localRobotsTxt = fs.existsSync(robotsOut)
  ? fs.readFileSync(robotsOut, "utf8")
  : null;

const samples = [
  ["out/index.html", "https://다옴법무사사무소.kr/"],
  ["out/부산법무사.html", "https://다옴법무사사무소.kr/부산법무사"],
  ["out/부산법무사/index.html", "https://다옴법무사사무소.kr/부산법무사"],
];
for (const [file, expected] of samples) {
  if (!fs.existsSync(file)) {
    out.localOutSample.push({ file, exists: false, expected });
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  out.localOutSample.push({
    file,
    exists: true,
    expected,
    canonical: pickCanonical(html),
    robotsMeta: (html.match(/name=["']robots["'][^>]*content=["']([^"']+)/i) || [])[1] || null,
  });
}

// Check if live robots blocks googlebot / sitemaps
for (const [b, r] of Object.entries(out.robots)) {
  const body = r.body || "";
  out.robots[b] = {
    status: r.status,
    contentType: r.headers["content-type"],
    xRobots: r.headers["x-robots-tag"],
    length: body.length,
    hasSitemapDirective: /sitemap:/i.test(body),
    mentionsGooglebot: /googlebot/i.test(body),
    disallowRoot: /disallow:\s*\/\s*$/im.test(body),
    disallowSitemaps: /disallow:.*sitemaps/i.test(body),
    contentSignals: /content-signal/i.test(body),
    preview: body.slice(0, 1500),
    full: body,
  };
}

for (const [b, r] of Object.entries(out.sitemap)) {
  out.sitemap[b] = {
    status: r.status,
    contentType: r.headers["content-type"],
    xRobots: r.headers["x-robots-tag"],
    cacheControl: r.headers["cache-control"],
    cfCache: r.headers["cf-cache-status"],
    isIndex: /<sitemapindex/i.test(r.body),
    locCount: (r.body.match(/<loc>/g) || []).length,
    preview: r.body.slice(0, 400),
  };
}

fs.writeFileSync(
  "scripts/output/sitemap-diagnosis-deep.json",
  JSON.stringify(out, null, 2),
  "utf8",
);
console.log("wrote scripts/output/sitemap-diagnosis-deep.json");
console.log("\nLOCAL robots.txt:\n", out.localRobotsTxt);
console.log("\nLIVE robots (hangul) preview:\n", out.robots[bases[0]].preview);
console.log("\nLIVE robots signals:", {
  contentSignals: out.robots[bases[0]].contentSignals,
  hasSitemap: out.robots[bases[0]].hasSitemapDirective,
  disallowRoot: out.robots[bases[0]].disallowRoot,
  disallowSitemaps: out.robots[bases[0]].disallowSitemaps,
});
console.log("\nLOCAL out samples:", JSON.stringify(out.localOutSample, null, 2));
console.log("\nPAGE probes:", JSON.stringify(out.pages, null, 2));
