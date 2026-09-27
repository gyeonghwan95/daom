#!/usr/bin/env node
/**
 * NAVER CRITICAL RECOVERY — live crawl/index signal check for target URLs.
 *   node scripts/ncr-live-check.mjs
 * Writes .cache/naver-critical-recovery/live-check.json
 */
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), ".cache", "naver-critical-recovery");
const PUNY = "xn--2j1br1na42lvxja38mk8r.kr";
const TARGETS = ["/부산상속전문법무사", "/부산상속포기", "/해운대법무사"];
const UA = {
  browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  yeti: "Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
};

async function get(url, ua, redirect = "manual") {
  try {
    const res = await fetch(url, { headers: { "User-Agent": ua }, redirect });
    const text = redirect === "manual" && res.status >= 300 && res.status < 400 ? "" : await res.text();
    return {
      status: res.status,
      location: res.headers.get("location") ?? "",
      xRobots: res.headers.get("x-robots-tag") ?? "",
      cfMitigated: res.headers.get("cf-mitigated") ?? "",
      server: res.headers.get("server") ?? "",
      contentType: res.headers.get("content-type") ?? "",
      text,
    };
  } catch (e) {
    return { status: -1, error: String(e) };
  }
}

const pick = (html, re) => (html.match(re)?.[1] ?? "").replace(/&amp;/g, "&");
function parse(html) {
  const bodyStart = html.search(/<body[\s>]/i);
  const h1Pos = html.search(/<h1[\s>]/i);
  return {
    title: pick(html, /<title[^>]*>([^<]*)<\/title>/i),
    description: pick(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/i),
    robots: pick(html, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/i),
    canonical: pick(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i),
    h1Count: (html.match(/<h1[\s>]/gi) || []).length,
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "").trim(),
    challenge: /cf-chl|challenge-platform|Just a moment/i.test(html),
    bytesBeforeH1: h1Pos > 0 && bodyStart > 0 ? h1Pos - bodyStart : null,
  };
}

const results = { checkedAt: new Date().toISOString(), robotsTxt: null, sitemap: {}, targets: [] };
const robots = await get(`https://${PUNY}/robots.txt`, UA.yeti, "follow");
results.robotsTxt = { status: robots.status, text: robots.text?.slice(0, 2000) };

const sm = await get(`https://${PUNY}/sitemap.xml`, UA.yeti, "follow");
const smText = sm.text || "";
for (const t of TARGETS) {
  const enc = encodeURI(t);
  results.sitemap[t] = smText.includes(`${enc}<`) || smText.includes(`${t}<`);
}
const idx = await get(`https://${PUNY}/sitemaps/index.xml`, UA.yeti, "follow");
const tierUrls = [...(idx.text || "").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const tierHits = {};
for (const u of tierUrls) {
  const r = await get(u, UA.yeti, "follow");
  for (const t of TARGETS) {
    const m = (r.text || "").match(new RegExp(`<loc>[^<]*${encodeURI(t).replace(/%/g, "%")}</loc>\\s*<lastmod>([^<]+)</lastmod>`));
    if (m) tierHits[t] = { sitemap: u, lastmod: m[1] };
  }
}
results.tierSitemaps = tierHits;

for (const t of TARGETS) {
  const enc = encodeURI(t);
  const row = { path: t, variants: {} };
  for (const [name, ua] of Object.entries(UA)) {
    const r = await get(`https://${PUNY}${enc}`, ua, "follow");
    row[name] = { status: r.status, xRobots: r.xRobots, cfMitigated: r.cfMitigated, server: r.server, ...(r.text ? parse(r.text) : {}) };
  }
  const variants = {
    trailingSlash: `https://${PUNY}${enc}/`,
    http: `http://${PUNY}${enc}`,
    www: `https://www.${PUNY}${enc}`,
    htmlSuffix: `https://${PUNY}${enc}.html`,
  };
  for (const [name, url] of Object.entries(variants)) {
    const r = await get(url, UA.yeti, "manual");
    row.variants[name] = { status: r.status, location: r.location ? decodeURI(r.location) : "" };
  }
  results.targets.push(row);
  console.log(
    `${t}\tyeti=${row.yeti.status} canon=${decodeURI(row.yeti.canonical || "")} robots=${row.yeti.robots} xrobots=${row.yeti.xRobots || "-"} h1=${row.yeti.h1Count} challenge=${row.yeti.challenge} sitemap=${results.sitemap[t]} tier=${tierHits[t]?.lastmod ?? "-"}`,
  );
  console.log(`   title: ${row.yeti.title}`);
  console.log(`   variants: ${Object.entries(row.variants).map(([k, v]) => `${k}=${v.status}${v.location ? `→${v.location}` : ""}`).join(" | ")}`);
}
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "live-check.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log("robots.txt:", robots.status, (robots.text || "").split("\n").slice(0, 12).join(" / "));
