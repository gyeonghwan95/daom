// 운영 사이트 핵심 페이지·사이트맵 점검(GET, 동시 4, 15초). 결과: live-pages.json, live-sitemap.json
import fs from "node:fs";
const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";
const OUT = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const get = async (url, redirect = "manual") => {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000);
  try { const r = await fetch(url, { redirect, signal: ctl.signal, headers: { "user-agent": UA } }); const body = await r.text(); return { status: r.status, headers: Object.fromEntries(r.headers), body }; }
  catch (e) { return { status: 0, error: String(e.message), headers: {}, body: "" }; } finally { clearTimeout(t); }
};
const pool = async (items, fn, n = 4) => { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; };
const norm = (u) => { try { const x = new URL(u, SITE); return decodeURI(x.pathname).normalize("NFC").replace(/(.)\/$/, "$1"); } catch { return u; } };

// 사이트맵
const idx = await get(SITE + "/sitemap.xml", "follow");
const subs = [...idx.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const isIndex = /<sitemapindex/.test(idx.body);
const smUrls = new Map();
const smFiles = [];
for (const s of isIndex ? subs : []) {
  const r = await get(s, "follow");
  const locs = [...r.body.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)];
  smFiles.push({ file: s, status: r.status, type: r.headers["content-type"], count: locs.length });
  for (const m of locs) smUrls.set(norm(m[1]), m[2] || "");
}
if (!isIndex) for (const m of idx.body.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) smUrls.set(norm(m[1]), m[2] || "");
const lastmodDist = {}; for (const v of smUrls.values()) { const d = (v || "none").slice(0, 10); lastmodDist[d] = (lastmodDist[d] || 0) + 1; }
fs.writeFileSync(OUT + "live-sitemap.json", JSON.stringify({ indexStatus: idx.status, indexType: idx.headers["content-type"], isIndex, files: smFiles, total: smUrls.size, lastmodDist, urls: [...smUrls] }, null, 1));
console.log("sitemap", idx.status, isIndex ? "index" : "urlset", "files", smFiles.length, "urls", smUrls.size, "lastmod days", Object.keys(lastmodDist).length);

const paths = process.argv.slice(2);
const res = await pool(paths, async (p) => {
  const url = SITE + encodeURI(p);
  const chain = []; let cur = url, r;
  for (let i = 0; i < 5; i++) { r = await get(cur); chain.push(r.status); if (r.status >= 300 && r.status < 400 && r.headers.location) cur = new URL(r.headers.location, cur).href; else break; }
  const h = r.body;
  const head = (h.match(/<head[\s\S]*?<\/head>/) || [""])[0];
  const robots = (head.match(/<meta[^>]+name="robots"[^>]*content="([^"]+)"/) || [])[1] || "";
  const canon = (head.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/) || [])[1] || "";
  const main = ((h.match(/<main[\s\S]*<\/main>/) || [""])[0]).replace(/<script[\s\S]*?<\/script>/g, "");
  const text = main.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const h1 = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const links = new Set([...main.matchAll(/<a[^>]+href="(\/[^"#?]*)"/g)].map((m) => norm(m[1])));
  return { path: p, chain, final: decodeURI(new URL(cur).pathname), type: r.headers["content-type"], xrobots: r.headers["x-robots-tag"] || "", metaRobots: robots, canonical: canon ? norm(canon) : "", selfCanonical: canon ? norm(canon) === norm(p) : null, inSitemap: smUrls.has(norm(p)), h1, mainChars: text.length, mainLinks: links.size, loadingText: /불러오는 중|목록 준비 중|Loading/.test(text), buildId: (h.match(/"buildId":"([^"]+)"/) || h.match(/\/_next\/static\/([^/]+)\/_buildManifest/) || [])[1] || "" };
});
fs.writeFileSync(OUT + "live-pages.json", JSON.stringify(res, null, 1));
for (const x of res) console.log([x.path, x.chain.join(">"), (x.type || "").split(";")[0], x.xrobots || "-", x.metaRobots || "-", x.selfCanonical === null ? "nocanon" : x.selfCanonical ? "self" : "→" + x.canonical, x.inSitemap ? "SM" : "noSM", "h1:" + x.h1.length, "chars:" + x.mainChars, "links:" + x.mainLinks, x.loadingText ? "LOADING" : ""].join(" | "));
