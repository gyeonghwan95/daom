/**
 * 정적 export 결과(out/)를 읽어 페이지별 SEO 신호를 추출한다.
 * SEO 회복 감사(scripts/seo-recovery-audit.mjs)와 회귀 테스트(tests/seo-recovery.spec.ts)가 함께 쓴다.
 */
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../../..");
export const OUT = path.join(ROOT, "out");
export const ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";
export const KOREAN_ORIGIN = "https://다옴법무사사무소.kr";

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

const unescapeHtml = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&middot;/g, "·")
    .replace(/&nbsp;/g, " ");

/** out/ 아래 HTML 파일 → 라우트 경로 */
export function listRoutes() {
  const routes = [];
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === "_next" || ent.name.startsWith("__next")) continue;
        walk(full);
      } else if (ent.name.endsWith(".html")) {
        const rel = path.relative(OUT, full).split(path.sep).join("/");
        let route = "/" + rel.replace(/\.html$/, "");
        if (route === "/index") route = "/";
        route = route.replace(/\/index$/, "");
        routes.push({ route, file: full });
      }
    }
  };
  walk(OUT);
  return routes;
}

export function routeToFile(route) {
  const clean = decode(route.split(/[?#]/)[0]).replace(/\/$/, "") || "/";
  if (clean === "/") return path.join(OUT, "index.html");
  const a = path.join(OUT, `${clean.slice(1)}.html`);
  if (fs.existsSync(a)) return a;
  const b = path.join(OUT, clean.slice(1), "index.html");
  if (fs.existsSync(b)) return b;
  return null;
}

const pick = (re, s) => {
  const m = s.match(re);
  return m ? unescapeHtml(m[1]).trim() : "";
};

/** HTML 한 장에서 SEO 신호 추출 */
export function parsePage(html) {
  const head = html.slice(0, html.indexOf("</head>") + 7 || 20000);
  const title = pick(/<title>([^<]*)<\/title>/, head);
  const description = pick(/<meta name="description" content="([^"]*)"/, head);
  const robots = pick(/<meta name="robots" content="([^"]*)"/, head);
  const canonical = pick(/<link rel="canonical" href="([^"]*)"/, head);
  const ogUrl = pick(/<meta property="og:url" content="([^"]*)"/, head);
  const ogDescription = pick(/<meta property="og:description" content="([^"]*)"/, head);
  const body = html.slice(html.indexOf("<body"));
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    unescapeHtml(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim(),
  );
  const jsonld = [];
  const jsonldErrors = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      jsonld.push(JSON.parse(m[1]));
    } catch (e) {
      jsonldErrors.push(String(e.message).slice(0, 120));
    }
  }
  const ldTypes = new Set();
  const collect = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(collect);
    if (node["@type"]) [].concat(node["@type"]).forEach((t) => ldTypes.add(t));
    if (node["@graph"]) collect(node["@graph"]);
  };
  jsonld.forEach(collect);
  const links = [];
  const jsLinks = [];
  for (const m of body.matchAll(/<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const href = unescapeHtml(m[1]);
    const text = unescapeHtml(m[2].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (/^javascript:/i.test(href) || href === "#" || href === "") jsLinks.push(href);
    let internal = null;
    if (href.startsWith("/") && !href.startsWith("//")) internal = href;
    else if (href.startsWith(ORIGIN)) internal = href.slice(ORIGIN.length) || "/";
    else if (href.startsWith(KOREAN_ORIGIN)) internal = href.slice(KOREAN_ORIGIN.length) || "/";
    if (internal) links.push({ href: decode(internal.split("#")[0]) || "/", text });
  }
  const imgs = [...body.matchAll(/<img\b([^>]*)>/g)].map((m) => {
    const alt = m[1].match(/\balt="([^"]*)"/);
    const src = m[1].match(/\bsrc="([^"]*)"/);
    return { alt: alt ? unescapeHtml(alt[1]) : null, src: src ? src[1] : "" };
  });
  const text = unescapeHtml(
    body
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
  const mainStart = body.indexOf("<main");
  const mainEnd = body.lastIndexOf("</main>");
  const mainHtml = mainStart >= 0 && mainEnd > mainStart ? body.slice(mainStart, mainEnd) : body;
  const mainText = unescapeHtml(
    mainHtml
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
  const keywordBadges = (body.match(/aria-label="주요 키워드"/g) || []).length;
  return { title, description, robots, canonical, ogUrl, ogDescription, h1s, jsonld, jsonldErrors, ldTypes: [...ldTypes], links, jsLinks, imgs, text, mainText, keywordBadges };
}

export function readSitemapUrls() {
  const files = [path.join(OUT, "sitemap.xml")];
  const dir = path.join(OUT, "sitemaps");
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith(".xml") && f !== "index.xml") files.push(path.join(dir, f));
  const urls = new Map();
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const xml = fs.readFileSync(f, "utf8");
    if (xml.includes("<sitemapindex")) continue;
    for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
      const loc = m[1].trim();
      if (!urls.has(loc)) urls.set(loc, { loc, lastmod: m[2] || null, files: [] });
      urls.get(loc).files.push(path.basename(f));
    }
  }
  return [...urls.values()];
}

export function readRedirectSources() {
  const f = path.join(OUT, "_redirects");
  if (!fs.existsSync(f)) return [];
  return fs
    .readFileSync(f, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .map((l) => {
      const [from, to, code] = l.trim().split(/\s+/);
      return { from: decode(from), to: decode(to), code: Number(code) || 301 };
    });
}

export function readRobotsDisallow(agent = "Yeti") {
  const f = path.join(OUT, "robots.txt");
  const rules = { "*": [], [agent]: [] };
  let current = null;
  for (const raw of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    const ua = line.match(/^User-Agent:\s*(.+)$/i);
    if (ua) {
      current = ua[1].trim();
      rules[current] ??= [];
      continue;
    }
    const dis = line.match(/^Disallow:\s*(.*)$/i);
    if (dis && current && dis[1]) rules[current].push(dis[1].trim());
  }
  return rules[agent]?.length ? rules[agent] : rules["*"];
}

export const isBlockedByRobots = (route, disallow) => disallow.some((d) => route.startsWith(d));

/** 전체 페이지 스캔 */
export function scanAll() {
  const pages = new Map();
  for (const { route, file } of listRoutes()) {
    const html = fs.readFileSync(file, "utf8");
    pages.set(route, { route, ...parsePage(html) });
  }
  return pages;
}

export const isIndexable = (p) => !/noindex/i.test(p.robots || "");
export const canonicalPath = (c) => {
  if (!c) return null;
  if (c.startsWith(ORIGIN)) return decode(c.slice(ORIGIN.length)) || "/";
  if (c.startsWith(KOREAN_ORIGIN)) return decode(c.slice(KOREAN_ORIGIN.length)) || "/";
  return null;
};
