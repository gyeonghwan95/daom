const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";
const IDN = "https://다옴법무사사무소.kr";
const UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  return { status: r.status, body: await r.text(), ct: r.headers.get("content-type") };
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function parseCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return null;
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

const [rp, ri] = await Promise.all([get(`${SITE}/robots.txt`), get(`${IDN}/robots.txt`)]);
console.log("=== robots.txt (punycode) ===\n" + rp.body);
console.log("=== robots.txt (idn) ===\n" + ri.body);
console.log("robots identical:", rp.body === ri.body);

const [sp, si] = await Promise.all([get(`${SITE}/sitemap.xml`), get(`${IDN}/sitemap.xml`)]);
console.log("\nsitemap index identical:", sp.body === si.body);
const pl = locs(sp.body);
console.log("child sitemap locs:", pl.length);
console.log("first child:", pl[0]);

// Compare one child sitemap live vs public/
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const childUrl = pl[0];
const liveChild = await get(childUrl);
const localChild = readFileSync("public/sitemaps/tier-1-core.xml", "utf8");
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
console.log("\ntier-1-core live bytes:", liveChild.body.length, "hash:", hash(liveChild.body));
console.log("tier-1-core local bytes:", localChild.length, "hash:", hash(localChild));
console.log("tier-1-core identical:", liveChild.body === localChild);

const samples = [
  `${SITE}/`,
  `${SITE}/about`,
  `${SITE}/services`,
  `${SITE}/contact`,
  `${IDN}/`,
  `${IDN}/about`,
];
console.log("\n=== Page samples (Googlebot GET) ===");
for (const u of samples) {
  const r = await get(u);
  const can = parseCanonical(r.body);
  const robots = [...r.body.matchAll(/<meta[^>]+name=["']robots["'][^>]*>/gi)].map((m) => m[0]);
  console.log(`\n${u}`);
  console.log(`  status=${r.status} ct=${r.ct}`);
  console.log(`  canonical=${can}`);
  console.log(`  robots=${robots.length ? robots.join(" ") : "(none)"}`);
}

// GSC property scope check: are all sitemap URLs under both properties?
const allUrls = [];
for (const child of pl) {
  const c = await get(child);
  allUrls.push(...locs(c.body));
}
const punyHost = new URL(SITE).host;
const idnHost = new URL(IDN).host;
const wrongHost = allUrls.filter((u) => {
  const h = new URL(u).host;
  return h !== punyHost;
});
console.log(`\nTotal URLs: ${allUrls.length}`);
console.log(`Non-punycode hosts in sitemap: ${wrongHost.length}`);
if (wrongHost.length) console.log("Examples:", wrongHost.slice(0, 5));
