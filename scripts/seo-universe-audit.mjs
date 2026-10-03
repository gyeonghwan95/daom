#!/usr/bin/env node
/**
 * Static-export SEO audit over out/*.html (run after `npm run build`).
 *
 *   node scripts/seo-universe-audit.mjs --label before   # baseline snapshot
 *   node scripts/seo-universe-audit.mjs --label after    # compare with baseline
 *
 * Writes seo-full-audit/01-06 CSVs, route-snapshot-<label>.txt, metrics-<label>.json.
 * Exit 1 when a regression versus the "before" metrics is detected
 * (removed route, new parse error, new duplicate title/description, etc.).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const AUDIT = path.join(ROOT, "seo-full-audit");
const OWNERSHIP = path.join(ROOT, "seo-service-universe", "07-query-url-ownership.csv");
const SITEMAP_DIR = path.join(ROOT, "public");

const argv = process.argv.slice(2);
const label = argv.includes("--label") ? argv[argv.indexOf("--label") + 1] : "current";
const SKIP_PREFIXES = ["/_next", "/admin", "/_not-found", "/404", "/generated"];

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

function routeOf(file) {
  let rel = path.relative(OUT, file).split(path.sep).join("/").replace(/\.html$/, "");
  if (rel === "index") return "/";
  if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length);
  return `/${rel}`;
}

function normPath(p) {
  let s = String(p).split("#")[0].split("?")[0];
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripTags = (h) =>
  decodeEntities(
    h
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decodeEntities(m[1]) : null;
};

function sitemapPaths() {
  const set = new Set();
  const files = [path.join(SITEMAP_DIR, "sitemap.xml")];
  const sub = path.join(SITEMAP_DIR, "sitemaps");
  if (fs.existsSync(sub)) for (const f of fs.readdirSync(sub)) if (f.endsWith(".xml")) files.push(path.join(sub, f));
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const xml = fs.readFileSync(f, "utf8");
    if (xml.includes("<sitemapindex")) continue;
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        set.add(normPath(new URL(m[1].trim()).pathname));
      } catch {
        /* ignore */
      }
    }
  }
  return set;
}

const BUSAN_GU = ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"];
const OTHER_REGIONS = ["울산", "경남", "경북", "대구", "김해", "창원", "양산", "포항", "경주", "거제", "통영", "제주", "광주", "서울", "경기", "강원", "구미", "경산", "영덕", "울진"];
const PLACE_SUFFIX = /([가-힣]{1,4}(동|역|읍|면|산단|센텀|지원|등기국|등기소|등기과))/;

const FAMILY_RULES = [
  ["SHIP", /선박/],
  ["INHERIT_RENOUNCE", /상속포기|한정승인|숙려기간/],
  ["INHERIT", /상속|유증|유언|사망|장례|고인|대습|재상속|유류분/],
  ["GIFT", /증여/],
  ["TRANSFER", /소유권이전|매매|잔금|매수인|입주|분양권|지분이전|명의변경|공동명의/],
  ["MORTGAGE", /근저당|담보|저당/],
  ["LEASE_RIGHT", /전세권|임차권|확정일자|전세|임대/],
  ["CANCEL", /말소/],
  ["BUILDING", /보존|신축|멸실|건물|건축|집합건물|대지권|오피스텔|상가/],
  ["GROUP_REG", /집단등기|재개발|재건축|보상등기|분양등기|시행사|건설사/],
  ["TRUST", /신탁/],
  ["CORP_SETUP", /법인설립|설립등기|1인법인|법인전환|유한회사|협동조합설립/],
  ["CORP_CHANGE", /임원|대표이사|본점|상호|목적변경|지점|정관|의사록/],
  ["CORP_CAPITAL", /증자|감자|출자/],
  ["CORP_DISSOLVE", /해산|청산|휴면|계속등기/],
  ["NONPROFIT", /사단법인|재단법인|비영리|공익법인|사회복지법인|학교법인|의료법인|종교|협회/],
  ["CORP_GENERAL", /법인|기업|스타트업|창업/],
  ["REHAB", /회생/],
  ["BANKRUPT", /파산|면책/],
  ["DEPOSIT", /공탁/],
  ["CIVIL_DOCS", /지급명령|소액|민사소송|채권|내용증명|재산명시|압류|추심/],
  ["PROVISIONAL", /가압류|가처분/],
  ["GUARDIAN", /후견|특별대리인|부재자|재산관리인/],
  ["FAMILY_REG", /개명|가족관계|성본|실종/],
  ["AUCTION", /경매|공매|낙찰/],
  ["PROVISIONAL_REG", /가등기|예고등기|환매/],
  ["LAND", /토지|지상권|분필|합필|임야|농지/],
  ["REG_GENERAL", /등기|부동산/],
  ["LECTURE", /강의|강사|특강|교육/],
  ["OFFICE", /법무사|상담|비용|보수|수임료/],
];

function familyOf(route, title) {
  const s = `${route} ${title}`;
  for (const [fam, re] of FAMILY_RULES) if (re.test(s)) return fam;
  return "OTHER";
}

function regionOf(route, title) {
  const s = `${route} ${title}`;
  const gu = BUSAN_GU.find((g) => route.includes(g));
  if (gu) return { scope: "BUSAN_GU", region: gu };
  const other = OTHER_REGIONS.find((r) => route.includes(r));
  if (other) return { scope: "OTHER_REGION", region: other };
  const place = route.slice(1).match(PLACE_SUFFIX);
  if (place && !/등기소법무사$/.test(place[1])) return { scope: "BUSAN_PLACE", region: place[1] };
  if (s.includes("부산")) return { scope: "BUSAN", region: "부산" };
  if (/전국/.test(s)) return { scope: "NATIONWIDE", region: "전국" };
  return { scope: "NONE", region: "" };
}

const csvCell = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (file, header, rows) => {
  const body = [header.join(","), ...rows.map((r) => header.map((h) => csvCell(r[h])).join(","))].join("\n");
  fs.writeFileSync(file, "\uFEFF" + body + "\n", "utf8");
};

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...data] = rows.filter((r) => r.some((x) => x !== ""));
  return (data || []).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

function main() {
  if (!fs.existsSync(OUT)) {
    console.error("out/ not found. Run `npm run build` first.");
    process.exit(1);
  }
  fs.mkdirSync(AUDIT, { recursive: true });
  const files = walk(OUT);
  const sitemap = sitemapPaths();
  const pages = [];
  const routeSet = new Set();

  for (const file of files) {
    const route = routeOf(file);
    if (SKIP_PREFIXES.some((p) => route === p || route.startsWith(`${p}/`))) continue;
    routeSet.add(route);
    const html = fs.readFileSync(file, "utf8");
    const head = html.slice(0, html.indexOf("</head>") + 7 || 20000);
    const title = decodeEntities((head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "").trim();
    const descTag = (head.match(/<meta[^>]*name="description"[^>]*>/) || [])[0] || "";
    const description = descTag ? attr(descTag, "content") || "" : "";
    const canonTag = (head.match(/<link[^>]*rel="canonical"[^>]*>/) || [])[0] || "";
    const canonical = canonTag ? attr(canonTag, "href") || "" : "";
    const robotsTag = (head.match(/<meta[^>]*name="robots"[^>]*>/) || [])[0] || "";
    const robots = robotsTag ? attr(robotsTag, "content") || "" : "";
    const noindex = /noindex/i.test(robots);
    let canonicalPath = "";
    try {
      canonicalPath = canonical ? normPath(new URL(canonical).pathname) : "";
    } catch {
      canonicalPath = "INVALID";
    }

    const mainStart = html.indexOf("<main");
    const mainEnd = html.indexOf("</main>");
    const footerIdx = html.indexOf("<footer");
    const mainHtml = mainStart >= 0 && mainEnd > mainStart ? html.slice(mainStart, mainEnd) : "";
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => stripTags(m[1]));
    const h2s = [...mainHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => stripTags(m[1]));
    const mainText = stripTags(mainHtml);
    const h1Idx = mainHtml.indexOf("<h1");
    const beforeH1 = h1Idx > 0 ? stripTags(mainHtml.slice(0, h1Idx)) : "";
    const afterH1 = h1Idx > 0 ? stripTags(mainHtml.slice(h1Idx)) : mainText;

    const jsonLdBlocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    const ldTypes = new Set();
    let ldErrors = 0;
    const fakeSchema = [];
    for (const b of jsonLdBlocks) {
      try {
        const data = JSON.parse(b[1]);
        const visit = (n) => {
          if (!n || typeof n !== "object") return;
          if (Array.isArray(n)) return n.forEach(visit);
          if (n["@type"]) [].concat(n["@type"]).forEach((t) => ldTypes.add(t));
          for (const k of ["aggregateRating", "review", "reviewCount", "ratingValue"]) if (k in n) fakeSchema.push(k);
          Object.values(n).forEach(visit);
        };
        visit(data);
      } catch {
        ldErrors++;
      }
    }

    const links = [];
    for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const href = decodeEntities(m[1]);
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const inMain = mainStart >= 0 && m.index > mainStart && m.index < mainEnd;
      links.push({ to: normPath(href), anchor: stripTags(m[2]).slice(0, 80), inMain });
    }

    const imgs = [...mainHtml.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
    const imgNoAlt = imgs.filter((t) => !/\salt=/.test(t)).length;
    const imgEmptyAlt = imgs.filter((t) => /\salt=""/.test(t)).length;

    const doubleRegion = (`${title} ${h1s.join(" ")} ${description}`.match(/(부산|울산|서울|경남)\s*\1/g) || []).length;
    const pathLeakRe = /`\/[가-힣][^`\s]*`|\(\/[가-힣][^)\s]*\)/g;
    const rawPathLeak = (mainText.match(pathLeakRe) || []).length;
    const descPathLeak = pathLeakRe.test(`${title} ${description}`);
    const first200 = afterH1.slice(0, 200);
    const reg = regionOf(route, title);
    pages.push({
      route,
      file: path.relative(ROOT, file).split(path.sep).join("/"),
      title,
      description,
      canonical,
      canonicalPath,
      robots,
      noindex,
      inSitemap: sitemap.has(route),
      h1s,
      h2s,
      mainChars: mainText.length,
      first200,
      firstHash: createHash("md5").update(afterH1.slice(0, 400)).digest("hex").slice(0, 12),
      ldCount: jsonLdBlocks.length,
      ldTypes: [...ldTypes],
      ldErrors,
      fakeSchema,
      links,
      imgCount: imgs.length,
      imgNoAlt,
      imgEmptyAlt,
      footerBeforeMain: footerIdx >= 0 && mainStart >= 0 && footerIdx < mainStart,
      loadingBeforeH1: /로딩|불러오는 중|Loading/i.test(beforeH1),
      doubleRegion,
      rawPathLeak,
      descPathLeak,
      family: familyOf(route, title),
      regionScope: reg.scope,
      region: reg.region,
    });
  }

  const indexable = pages.filter((p) => !p.noindex && (p.canonicalPath === p.route || !p.canonicalPath));
  const inboundMain = new Map();
  const inboundAll = new Map();
  const anchorsByTarget = new Map();
  const broken = [];
  for (const p of pages) {
    for (const l of p.links) {
      if (l.to === p.route) continue;
      inboundAll.set(l.to, (inboundAll.get(l.to) || 0) + 1);
      if (l.inMain) {
        inboundMain.set(l.to, (inboundMain.get(l.to) || 0) + 1);
        if (!anchorsByTarget.has(l.to)) anchorsByTarget.set(l.to, new Map());
        const am = anchorsByTarget.get(l.to);
        am.set(l.anchor, (am.get(l.anchor) || 0) + 1);
      }
      const isAsset = /\.[a-z0-9]{2,5}$/i.test(l.to) || l.to.startsWith("/_img") || l.to.startsWith("/images") || l.to.startsWith("/image/");
      if (!isAsset && !routeSet.has(l.to) && !l.to.startsWith("/api")) broken.push({ from: p.route, to: l.to, anchor: l.anchor });
    }
  }

  const dupMap = (key) => {
    const m = new Map();
    for (const p of indexable) {
      const k = key(p);
      if (!k) continue;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(p.route);
    }
    return [...m.entries()].filter(([, v]) => v.length > 1);
  };
  const dupTitles = dupMap((p) => p.title);
  const dupDesc = dupMap((p) => p.description);
  const dupH1 = dupMap((p) => p.h1s[0] || "");
  const dupFirst = dupMap((p) => (p.mainChars > 600 ? p.firstHash : ""));
  const dupTitleSet = new Set(dupTitles.flatMap(([, v]) => v));
  const dupDescSet = new Set(dupDesc.flatMap(([, v]) => v));
  const dupFirstSet = new Set(dupFirst.flatMap(([, v]) => v));

  const orphans = indexable.filter((p) => p.route !== "/" && p.inSitemap && !inboundMain.get(p.route));
  const sitemapMissingHtml = [...sitemap].filter((s) => !routeSet.has(s));
  const sitemapNoindex = pages.filter((p) => p.inSitemap && p.noindex).map((p) => p.route);
  const sitemapNonCanonical = pages.filter((p) => p.inSitemap && p.canonicalPath && p.canonicalPath !== p.route).map((p) => p.route);

  // query ownership registry
  const ownership = readCsv(OWNERSHIP);
  const ownerConflicts = [];
  const byQuery = new Map();
  for (const r of ownership) {
    const q = (r.QUERY || "").trim();
    if (!q) continue;
    if (!byQuery.has(q)) byQuery.set(q, new Set());
    if (r.PRIMARY_URL) byQuery.get(q).add(normPath(r.PRIMARY_URL));
    if (r.PRIMARY_URL && !routeSet.has(normPath(r.PRIMARY_URL))) ownerConflicts.push({ query: q, issue: "OWNER_ROUTE_MISSING", url: r.PRIMARY_URL });
  }
  for (const [q, set] of byQuery) if (set.size > 1) ownerConflicts.push({ query: q, issue: "MULTIPLE_OWNERS", url: [...set].join(" | ") });

  // route preservation
  const snapFile = (l) => path.join(AUDIT, `route-snapshot-${l}.txt`);
  const routesSorted = [...routeSet].sort();
  fs.writeFileSync(snapFile(label), routesSorted.join("\n") + "\n", "utf8");
  let removedRoutes = [];
  let addedRoutes = [];
  if (label !== "before" && fs.existsSync(snapFile("before"))) {
    const before = fs.readFileSync(snapFile("before"), "utf8").split(/\r?\n/).filter(Boolean);
    const bs = new Set(before);
    removedRoutes = before.filter((r) => !routeSet.has(r));
    addedRoutes = routesSorted.filter((r) => !bs.has(r));
  }

  // CSV outputs
  writeCsv(
    path.join(AUDIT, "01-current-routes.csv"),
    ["ROUTE", "FILE", "IN_SITEMAP", "ROBOTS", "INDEXABLE", "CANONICAL_SELF", "INBOUND_MAIN", "INBOUND_ALL"],
    pages.map((p) => ({
      ROUTE: p.route,
      FILE: p.file,
      IN_SITEMAP: p.inSitemap,
      ROBOTS: p.robots,
      INDEXABLE: !p.noindex,
      CANONICAL_SELF: p.canonicalPath === p.route,
      INBOUND_MAIN: inboundMain.get(p.route) || 0,
      INBOUND_ALL: inboundAll.get(p.route) || 0,
    })),
  );
  writeCsv(
    path.join(AUDIT, "02-current-metadata.csv"),
    ["ROUTE", "TITLE", "TITLE_LEN", "DESCRIPTION", "DESC_LEN", "CANONICAL", "H1_COUNT", "H1", "JSONLD_COUNT", "JSONLD_TYPES", "JSONLD_ERRORS", "DUP_TITLE", "DUP_DESC"],
    pages.map((p) => ({
      ROUTE: p.route,
      TITLE: p.title,
      TITLE_LEN: p.title.length,
      DESCRIPTION: p.description,
      DESC_LEN: p.description.length,
      CANONICAL: p.canonical,
      H1_COUNT: p.h1s.length,
      H1: p.h1s.join(" / "),
      JSONLD_COUNT: p.ldCount,
      JSONLD_TYPES: p.ldTypes.join(" "),
      JSONLD_ERRORS: p.ldErrors,
      DUP_TITLE: dupTitleSet.has(p.route),
      DUP_DESC: dupDescSet.has(p.route),
    })),
  );
  writeCsv(
    path.join(AUDIT, "03-current-content-map.csv"),
    ["ROUTE", "FAMILY", "MAIN_CHARS", "H2_COUNT", "H2_FIRST8", "FIRST_200", "DUP_OPENING", "IMG", "IMG_NO_ALT", "IMG_EMPTY_ALT", "FOOTER_BEFORE_MAIN", "LOADING_BEFORE_H1", "DOUBLE_REGION"],
    pages.map((p) => ({
      ROUTE: p.route,
      FAMILY: p.family,
      MAIN_CHARS: p.mainChars,
      H2_COUNT: p.h2s.length,
      H2_FIRST8: p.h2s.slice(0, 8).join(" | "),
      FIRST_200: p.first200,
      DUP_OPENING: dupFirstSet.has(p.route),
      IMG: p.imgCount,
      IMG_NO_ALT: p.imgNoAlt,
      IMG_EMPTY_ALT: p.imgEmptyAlt,
      FOOTER_BEFORE_MAIN: p.footerBeforeMain,
      LOADING_BEFORE_H1: p.loadingBeforeH1,
      DOUBLE_REGION: p.doubleRegion,
    })),
  );
  const linkRows = [...routeSet].map((r) => {
    const am = anchorsByTarget.get(r) || new Map();
    const top = [...am.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {
      TARGET: r,
      INBOUND_MAIN: inboundMain.get(r) || 0,
      INBOUND_ALL: inboundAll.get(r) || 0,
      DISTINCT_ANCHORS: am.size,
      TOP_ANCHORS: top.map(([a, c]) => `${a} (${c})`).join(" | "),
      BROKEN_FROM: "",
    };
  });
  for (const b of broken) linkRows.push({ TARGET: b.to, INBOUND_MAIN: "", INBOUND_ALL: "", DISTINCT_ANCHORS: "", TOP_ANCHORS: b.anchor, BROKEN_FROM: b.from });
  writeCsv(path.join(AUDIT, "04-internal-links.csv"), ["TARGET", "INBOUND_MAIN", "INBOUND_ALL", "DISTINCT_ANCHORS", "TOP_ANCHORS", "BROKEN_FROM"], linkRows);
  writeCsv(
    path.join(AUDIT, "05-current-regional-pages.csv"),
    ["ROUTE", "REGION_SCOPE", "REGION", "FAMILY", "TITLE", "MAIN_CHARS", "INDEXABLE"],
    pages
      .filter((p) => p.regionScope !== "NONE")
      .map((p) => ({ ROUTE: p.route, REGION_SCOPE: p.regionScope, REGION: p.region, FAMILY: p.family, TITLE: p.title, MAIN_CHARS: p.mainChars, INDEXABLE: !p.noindex })),
  );
  writeCsv(
    path.join(AUDIT, "06-current-service-pages.csv"),
    ["FAMILY", "ROUTE", "REGION_SCOPE", "TITLE", "H1", "MAIN_CHARS", "INBOUND_MAIN", "INDEXABLE"],
    pages
      .slice()
      .sort((a, b) => a.family.localeCompare(b.family) || a.route.localeCompare(b.route))
      .map((p) => ({
        FAMILY: p.family,
        ROUTE: p.route,
        REGION_SCOPE: p.regionScope,
        TITLE: p.title,
        H1: p.h1s[0] || "",
        MAIN_CHARS: p.mainChars,
        INBOUND_MAIN: inboundMain.get(p.route) || 0,
        INDEXABLE: !p.noindex,
      })),
  );

  const metrics = {
    generatedAt: new Date().toISOString(),
    label,
    htmlRoutes: pages.length,
    indexable: indexable.length,
    sitemapUrls: sitemap.size,
    h1NotOne: indexable.filter((p) => p.h1s.length !== 1).length,
    missingTitle: indexable.filter((p) => !p.title).length,
    missingDescription: indexable.filter((p) => !p.description).length,
    missingCanonical: indexable.filter((p) => !p.canonical).length,
    duplicateTitleGroups: dupTitles.length,
    duplicateDescriptionGroups: dupDesc.length,
    duplicateH1Groups: dupH1.length,
    duplicateOpeningGroups: dupFirst.length,
    jsonLdParseErrors: pages.reduce((a, p) => a + p.ldErrors, 0),
    fakeSchemaPages: pages.filter((p) => p.fakeSchema.length).length,
    brokenInternalLinks: broken.length,
    brokenDistinctTargets: new Set(broken.map((b) => b.to)).size,
    orphansNoMainInbound: orphans.length,
    sitemapMissingHtml: sitemapMissingHtml.length,
    sitemapNoindex: sitemapNoindex.length,
    sitemapNonCanonical: sitemapNonCanonical.length,
    imgNoAlt: pages.reduce((a, p) => a + p.imgNoAlt, 0),
    footerBeforeMain: pages.filter((p) => p.footerBeforeMain).length,
    loadingBeforeH1: pages.filter((p) => p.loadingBeforeH1).length,
    doubleRegion: pages.filter((p) => p.doubleRegion).length,
    rawPathLeakPages: pages.filter((p) => p.rawPathLeak).length,
    descPathLeakPages: pages.filter((p) => p.descPathLeak).length,
    ownershipQueries: byQuery.size,
    ownershipConflicts: ownerConflicts.length,
    removedRoutes: removedRoutes.length,
    addedRoutes: addedRoutes.length,
  };
  const details = {
    duplicateTitles: dupTitles.slice(0, 50),
    duplicateDescriptions: dupDesc.slice(0, 50),
    duplicateH1: dupH1.slice(0, 50),
    duplicateOpenings: dupFirst.slice(0, 50),
    brokenSample: broken.slice(0, 100),
    orphans: orphans.map((p) => p.route),
    sitemapMissingHtml,
    sitemapNoindex,
    sitemapNonCanonical,
    h1NotOne: indexable.filter((p) => p.h1s.length !== 1).map((p) => `${p.route} (${p.h1s.length})`),
    fakeSchema: pages.filter((p) => p.fakeSchema.length).map((p) => `${p.route}: ${[...new Set(p.fakeSchema)].join(",")}`),
    doubleRegion: pages.filter((p) => p.doubleRegion).map((p) => p.route),
    rawPathLeak: pages.filter((p) => p.rawPathLeak).map((p) => `${p.route} (${p.rawPathLeak})`),
    descPathLeak: pages.filter((p) => p.descPathLeak).map((p) => p.route),
    ownerConflicts,
    removedRoutes,
    addedRoutes,
  };
  fs.writeFileSync(path.join(AUDIT, `metrics-${label}.json`), JSON.stringify({ metrics, details }, null, 2) + "\n", "utf8");

  const failures = [];
  if (removedRoutes.length) failures.push(`removed routes: ${removedRoutes.length}`);
  if (ownerConflicts.length) failures.push(`query ownership conflicts: ${ownerConflicts.length}`);
  if (sitemapMissingHtml.length) failures.push(`sitemap URLs without HTML: ${sitemapMissingHtml.length}`);
  const baselines = (label === "before" ? [] : label === "after" ? ["before"] : ["before", "after"])
    .map((l) => path.join(AUDIT, `metrics-${l}.json`))
    .filter((f) => fs.existsSync(f))
    .map((f) => JSON.parse(fs.readFileSync(f, "utf8")).metrics);
  if (baselines.length) {
    const b = {};
    for (const m of baselines) for (const [k, v] of Object.entries(m)) if (typeof v === "number") b[k] = b[k] === undefined ? v : Math.min(b[k], v);
    for (const k of ["h1NotOne", "duplicateTitleGroups", "duplicateDescriptionGroups", "duplicateOpeningGroups", "jsonLdParseErrors", "fakeSchemaPages", "brokenInternalLinks", "orphansNoMainInbound", "sitemapNoindex", "footerBeforeMain", "loadingBeforeH1", "doubleRegion", "imgNoAlt", "rawPathLeakPages", "descPathLeakPages"]) {
      if (b[k] !== undefined && metrics[k] > b[k]) failures.push(`${k} regressed ${b[k]} -> ${metrics[k]}`);
    }
  }
  console.log(JSON.stringify(metrics, null, 2));
  if (failures.length) {
    console.error(`SEO audit FAIL:\n- ${failures.join("\n- ")}`);
    process.exit(1);
  }
  console.log("SEO audit OK");
}

main();
