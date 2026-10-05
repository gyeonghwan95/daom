/**
 * SEO 회복 감사 — out/(정적 export) 기준 전체 페이지 기술·콘텐츠 신호 점검.
 * 결과: scripts/output/seo-recovery-audit.json, reports/seo-recovery/page-scores.csv
 * 사용: npm run build 후 `node scripts/seo-recovery-audit.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import {
  ROOT,
  ORIGIN,
  KOREAN_ORIGIN,
  scanAll,
  readSitemapUrls,
  readRedirectSources,
  readRobotsDisallow,
  isBlockedByRobots,
  isIndexable,
  canonicalPath,
  routeToFile,
} from "./lib/seo-recovery/scan-out.mjs";
import { FACT_RULES, FACT_MENTION_RULES, SCOPE_RULES, findRuleHits, isViolation } from "./lib/seo-recovery/content-rules.mjs";

const pages = scanAll();
const sitemap = readSitemapUrls();
const redirects = readRedirectSources();
const disallow = readRobotsDisallow("Yeti");
const protectedUrls = JSON.parse(fs.readFileSync(path.join(ROOT, "seo/protected-urls.json"), "utf8")).urls;

const redirectFrom = new Set(redirects.filter((r) => !r.from.includes("*")).map((r) => r.from));
const redirectPrefixes = redirects.filter((r) => r.from.endsWith("/*")).map((r) => r.from.slice(0, -1));
const isRedirect = (p) => redirectFrom.has(p) || redirectPrefixes.some((x) => p.startsWith(x));
const isSystemPath = (p) => /^\/(admin|api)(\/|$)/.test(p) || p.startsWith("/_next/") || /\.(xml|txt|json|png|jpg|jpeg|webp|svg|ico|pdf|rss)$/i.test(p);

const all = [...pages.values()];
const indexable = all.filter(isIndexable);

// ---- canonical
const canon = { missing: [], nonSelf: [], http: [], koreanHost: [], query: [], trailingSlash: [], ogMismatch: [] };
for (const p of indexable) {
  if (!p.canonical) {
    canon.missing.push(p.route);
    continue;
  }
  if (p.canonical.startsWith("http://")) canon.http.push(p.route);
  if (p.canonical.startsWith(KOREAN_ORIGIN)) canon.koreanHost.push(p.route);
  if (p.canonical.includes("?")) canon.query.push(p.route);
  const cp = canonicalPath(p.canonical);
  if (cp && cp !== "/" && cp.endsWith("/")) canon.trailingSlash.push(p.route);
  if (cp !== p.route) canon.nonSelf.push({ route: p.route, canonical: cp ?? p.canonical });
  if (p.ogUrl && p.ogUrl !== p.canonical) canon.ogMismatch.push({ route: p.route, ogUrl: p.ogUrl, canonical: p.canonical });
}

// ---- sitemap
const sm = { total: sitemap.length, notFound: [], noindex: [], redirect: [], nonSelfCanonical: [], blocked: [], nonAsciiHost: [], dupAcrossFiles: [] };
const sitemapPaths = new Set();
for (const u of sitemap) {
  if (!u.loc.startsWith(ORIGIN)) sm.nonAsciiHost.push(u.loc);
  const p = canonicalPath(u.loc) ?? u.loc;
  sitemapPaths.add(p);
  if (u.files.length > 1) sm.dupAcrossFiles.push({ path: p, files: u.files });
  const page = pages.get(p);
  if (!page) {
    sm.notFound.push(p);
    continue;
  }
  if (!isIndexable(page)) sm.noindex.push(p);
  if (isRedirect(p)) sm.redirect.push(p);
  const cp = canonicalPath(page.canonical);
  if (cp && cp !== p) sm.nonSelfCanonical.push({ path: p, canonical: cp });
  if (isBlockedByRobots(p, disallow)) sm.blocked.push(p);
}
const indexableSelf = indexable.filter((p) => canonicalPath(p.canonical) === p.route);
const missingFromSitemap = indexableSelf.filter((p) => !sitemapPaths.has(p.route)).map((p) => p.route);

// ---- robots
const robotsBlockedIndexable = indexable.filter((p) => isBlockedByRobots(p.route, disallow)).map((p) => p.route);

// ---- duplicates
const groupBy = (arr, key) => {
  const m = new Map();
  for (const p of arr) {
    const k = key(p);
    if (!k) continue;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(p.route);
  }
  return [...m.entries()].filter(([, v]) => v.length > 1).map(([k, v]) => ({ value: k, routes: v }));
};
const dupTitles = groupBy(indexableSelf, (p) => p.title);
const dupDescriptions = groupBy(indexableSelf, (p) => p.description);
const dupH1 = groupBy(indexableSelf, (p) => p.h1s[0]);

// ---- H1
const h1Issues = indexable.filter((p) => p.h1s.length !== 1).map((p) => ({ route: p.route, count: p.h1s.length }));

// ---- JSON-LD
const jsonldErrors = all.filter((p) => p.jsonldErrors.length).map((p) => ({ route: p.route, errors: p.jsonldErrors }));
const faqWithoutVisible = indexable
  .filter((p) => p.ldTypes.includes("FAQPage"))
  .filter((p) => {
    const faq = [];
    const walk = (n) => {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) return n.forEach(walk);
      if (n["@type"] === "FAQPage") faq.push(n);
      if (n["@graph"]) walk(n["@graph"]);
    };
    p.jsonld.forEach(walk);
    const q = faq.flatMap((f) => f.mainEntity || []).map((e) => e.name).filter(Boolean);
    return q.length && !q.some((name) => p.text.includes(name));
  })
  .map((p) => p.route);
const fakeTrust = indexable
  .filter((p) => p.ldTypes.some((t) => ["AggregateRating", "Review"].includes(t)))
  .map((p) => p.route);

// ---- 내부링크
const inbound = new Map();
const broken = new Map();
let jsLinkPages = [];
for (const p of all) {
  if (p.jsLinks.length) jsLinkPages.push({ route: p.route, count: p.jsLinks.length });
  for (const l of p.links) {
    const target = l.href.split("?")[0].replace(/\/$/, "") || "/";
    if (isSystemPath(target)) continue;
    if (pages.has(target)) {
      if (target !== p.route) {
        if (!inbound.has(target)) inbound.set(target, new Set());
        inbound.get(target).add(p.route);
      }
    } else if (!isRedirect(target) && !routeToFile(target)) {
      if (!broken.has(target)) broken.set(target, new Set());
      broken.get(target).add(p.route);
    }
  }
}
const isolated = indexableSelf.filter((p) => !inbound.get(p.route)?.size).map((p) => p.route);
const brokenLinks = [...broken.entries()].map(([target, from]) => ({ target, fromCount: from.size, sample: [...from].slice(0, 3) }));

// ---- 이미지 alt
const altStats = { missing: 0, empty: 0, total: 0, repeated: new Map() };
for (const p of indexable) {
  for (const img of p.imgs) {
    altStats.total++;
    if (img.alt === null) altStats.missing++;
    else if (img.alt === "") altStats.empty++;
    else altStats.repeated.set(img.alt, (altStats.repeated.get(img.alt) || 0) + 1);
  }
}
const topAlts = [...altStats.repeated.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
const keywordAlts = [...altStats.repeated.entries()].filter(([a]) => /부산\s*법무사/.test(a)).sort((a, b) => b[1] - a[1]).slice(0, 15);

// ---- 키워드 반복
const KW = ["부산 법무사", "부산 상속등기", "부산 법무사 추천", "부산 법무사 상담", "부산 상속 법무사"];
const stuffing = [];
for (const p of indexable) {
  const counts = Object.fromEntries(KW.map((k) => [k, (p.mainText.match(new RegExp(k, "g")) || []).length]));
  const words = p.mainText.split(" ").length || 1;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (counts["부산 법무사"] >= 12 || total / words > 0.02) stuffing.push({ route: p.route, words, ...counts });
}
stuffing.sort((a, b) => b["부산 법무사"] - a["부산 법무사"]);

// ---- 화면에 노출되는 키워드 배지·SEO 내부 용어
const keywordBadgePages = indexable.filter((p) => p.keywordBadges > 0).map((p) => p.route);
const JARGON = /(검색 의도|검색 유입|검색해 들어오신|검색해 문의하셨습니다|검색어만 보고|검색 키워드만으로|키워드만 보고|Champion|대표 URL|canonical|전용 랜딩)/g;
const jargonPages = [];
for (const p of indexable) {
  const hits = [...p.mainText.matchAll(JARGON)].map((m) => m[0]);
  if (hits.length) jargonPages.push({ route: p.route, count: hits.length, terms: [...new Set(hits)] });
}

// ---- 법률 사실·업무범위 문구
const factHits = [];
const factMentions = [];
const scopeHits = [];
for (const p of all) {
  for (const h of findRuleHits(p.mainText, FACT_RULES)) factHits.push({ route: p.route, ...h });
  for (const h of findRuleHits(p.mainText, FACT_MENTION_RULES)) factMentions.push({ route: p.route, ...h });
  for (const h of findRuleHits(p.mainText, SCOPE_RULES)) scopeHits.push({ route: p.route, ...h });
}

// ---- 유사도 (THIN/DUPLICATE 후보) — 본문 5-gram minhash
const K = 64;
const seeds = Array.from({ length: K }, (_, i) => (i + 1) * 0x9e3779b1);
const hash = (s, seed) => {
  let h = seed >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  return h;
};
const sigs = new Map();
for (const p of indexableSelf) {
  const toks = p.mainText.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (toks.length < 30) continue;
  const sig = new Uint32Array(K).fill(0xffffffff);
  for (let i = 0; i + 5 <= toks.length; i++) {
    const sh = toks.slice(i, i + 5).join(" ");
    for (let k = 0; k < K; k++) {
      const v = hash(sh, seeds[k]);
      if (v < sig[k]) sig[k] = v;
    }
  }
  sigs.set(p.route, sig);
}
const simPairs = [];
const entries = [...sigs.entries()];
for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const a = entries[i][1];
    const b = entries[j][1];
    let same = 0;
    for (let k = 0; k < K; k++) if (a[k] === b[k]) same++;
    if (same / K >= 0.6) simPairs.push({ a: entries[i][0], b: entries[j][0], sim: +(same / K).toFixed(2) });
  }
}
simPairs.sort((x, y) => y.sim - x.sim);
const maxSim = new Map();
for (const s of simPairs) {
  maxSim.set(s.a, Math.max(maxSim.get(s.a) || 0, s.sim));
  maxSim.set(s.b, Math.max(maxSim.get(s.b) || 0, s.sim));
}

// ---- 분류 + 페이지 점수
const CORE = new Set([
  "/", "/부산법무사", "/부산법무사추천", "/부산법무사상담", "/상속등기", "/부산상속등기", "/전국상속등기",
  "/상속등기비용", "/tools/inheritance-registration-cost", "/상속포기", "/상속포기비용", "/services/inheritance-renunciation",
  "/한정승인", "/한정승인비용", "/services/qualified-acceptance", "/부동산등기", "/부동산등기비용", "/소유권이전등기비용",
  "/법인등기", "/법인설립등기비용", "/법인등기비용", "/개인회생", "/개인회생비용", "/개인파산", "/개인파산비용",
  "/부산부동산등기", "/부산법인등기", "/부산개인회생",
]);
const classify = (p) => {
  if (CORE.has(p.route) || protectedUrls[p.route] === "P0") return "CORE";
  if (p.route.startsWith("/tools") || p.route.includes("자가진단")) return "UTILITY";
  if ((maxSim.get(p.route) || 0) >= 0.8 || p.mainText.split(" ").length < 250) return "THIN/DUPLICATE 후보";
  return "SUPPORT";
};
/** 본문에서 25자 이상 문장이 두 번 이상 반복되는 횟수 */
const repeatedSentences = (text) => {
  const seen = new Map();
  for (const s of text.split(/(?<=[.?!])\s+/)) {
    const t = s.trim();
    if (t.length < 25) continue;
    seen.set(t, (seen.get(t) || 0) + 1);
  }
  return [...seen.values()].filter((n) => n > 1).length;
};
const badgeSet = new Set(keywordBadgePages);
const jargonSet = new Set(jargonPages.map((j) => j.route));
const stuffingSet = new Set(stuffing.map((s) => s.route));
const factSet = new Set(factHits.filter(isViolation).map((h) => h.route));
const dupTitleSet = new Set(dupTitles.flatMap((d) => d.routes));
const dupDescSet = new Set(dupDescriptions.flatMap((d) => d.routes));
const rows = [];
for (const p of indexable) {
  const cp = canonicalPath(p.canonical);
  const tech = [
    true,
    isIndexable(p),
    cp === p.route,
    sitemapPaths.has(p.route),
    !isBlockedByRobots(p.route, disallow),
    p.ldTypes.length > 0 && p.jsonldErrors.length === 0,
  ];
  const content = [
    !!p.title && !dupTitleSet.has(p.route),
    !!p.description && !dupDescSet.has(p.route),
    p.h1s.length === 1,
    (maxSim.get(p.route) || 0) < 0.8,
    p.mainText.split(" ").length >= 250,
    (inbound.get(p.route)?.size || 0) > 0,
    p.imgs.every((i) => i.alt !== null),
    repeatedSentences(p.mainText) <= 1,
    !badgeSet.has(p.route) && !stuffingSet.has(p.route),
    !jargonSet.has(p.route),
    !!p.h1s[0] && p.h1s[0] !== p.title,
  ];
  const trust = [
    /안윤정/.test(p.text),
    /법무사/.test(p.text),
    /센텀|해운대/.test(p.text),
    /\d{2,3}-\d{3,4}-\d{4}/.test(p.text),
    /개인정보처리방침/.test(p.text),
    !factSet.has(p.route),
  ];
  const score = (arr) => `${arr.filter(Boolean).length}/${arr.length}`;
  rows.push({
    route: p.route,
    class: classify(p),
    protected: protectedUrls[p.route] || "",
    technical: score(tech),
    content: score(content),
    trust: score(trust),
    words: p.mainText.split(" ").length,
    repeated: repeatedSentences(p.mainText),
    inbound: inbound.get(p.route)?.size || 0,
    maxSim: maxSim.get(p.route) || 0,
    title: p.title,
  });
}
const classCounts = rows.reduce((m, r) => ((m[r.class] = (m[r.class] || 0) + 1), m), {});

// ---- 대표 URL 존재 여부
const REP = {
  BRAND: ["/"],
  LOCAL_CORE: ["/부산법무사", "/부산법무사추천", "/부산법무사상담"],
  INHERITANCE: ["/상속등기", "/부산상속등기", "/전국상속등기"],
  INHERITANCE_COST: ["/상속등기비용", "/tools/inheritance-registration-cost"],
  RENUNCIATION: ["/상속포기", "/상속포기비용", "/services/inheritance-renunciation"],
  QUALIFIED_ACCEPTANCE: ["/한정승인", "/한정승인비용", "/services/qualified-acceptance"],
  REAL_ESTATE: ["/부동산등기", "/부동산등기비용", "/소유권이전등기비용"],
  CORPORATE: ["/법인등기", "/법인설립등기비용"],
  REHABILITATION: ["/개인회생", "/개인회생비용", "/개인파산", "/개인파산비용"],
};
const repStatus = Object.fromEntries(
  Object.entries(REP).map(([k, list]) => [
    k,
    list.map((r) => {
      const p = pages.get(r);
      return {
        route: r,
        exists: !!p,
        redirect: isRedirect(r),
        indexable: p ? isIndexable(p) : null,
        canonical: p ? canonicalPath(p.canonical) : null,
        inSitemap: sitemapPaths.has(r),
        title: p?.title ?? null,
        h1: p?.h1s ?? null,
        inbound: inbound.get(r)?.size || 0,
      };
    }),
  ]),
);

const result = {
  generatedAt: new Date().toISOString(),
  totals: { pages: all.length, indexable: indexable.length, noindex: all.length - indexable.length, indexableSelfCanonical: indexableSelf.length },
  noindexRoutes: all.filter((p) => !isIndexable(p)).map((p) => p.route),
  robotsDisallow: disallow,
  robotsBlockedIndexable,
  canonical: canon,
  sitemap: { ...sm, missingFromSitemap },
  redirects,
  duplicates: { titles: dupTitles, descriptions: dupDescriptions, h1: dupH1 },
  h1Issues,
  jsonld: { errors: jsonldErrors, faqWithoutVisible, fakeTrust },
  links: { broken: brokenLinks, jsLinkPages, isolated },
  images: { total: altStats.total, missing: altStats.missing, empty: altStats.empty, topAlts, keywordAlts },
  stuffing,
  keywordBadgePages,
  jargonPages,
  factHits,
  factMentions: factMentions.filter(isViolation),
  scopeHits,
  similarity: { pairs: simPairs.slice(0, 300), pairCount: simPairs.length },
  classCounts,
  repStatus,
};
fs.mkdirSync(path.join(ROOT, "scripts/output"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "scripts/output/seo-recovery-audit.json"), JSON.stringify(result, null, 1));
fs.mkdirSync(path.join(ROOT, "reports/seo-recovery"), { recursive: true });
const csv = ["route,class,protected,technical,content,trust,words,repeated,inbound,maxSim,title"]
  .concat(rows.map((r) => [r.route, r.class, r.protected, r.technical, r.content, r.trust, r.words, r.repeated, r.inbound, r.maxSim, `"${r.title.replace(/"/g, '""')}"`].join(",")))
  .join("\n");
fs.writeFileSync(path.join(ROOT, "reports/seo-recovery/page-scores.csv"), "\uFEFF" + csv);

console.log(
  JSON.stringify(
    {
      totals: result.totals,
      canonical: Object.fromEntries(Object.entries(canon).map(([k, v]) => [k, v.length])),
      sitemap: { total: sm.total, notFound: sm.notFound.length, noindex: sm.noindex.length, redirect: sm.redirect.length, nonSelfCanonical: sm.nonSelfCanonical.length, blocked: sm.blocked.length, nonAsciiHost: sm.nonAsciiHost.length, missingFromSitemap: missingFromSitemap.length },
      robotsBlockedIndexable: robotsBlockedIndexable.length,
      dupTitles: dupTitles.length,
      dupDescriptions: dupDescriptions.length,
      dupH1: dupH1.length,
      h1Issues: h1Issues.length,
      jsonldErrors: jsonldErrors.length,
      faqWithoutVisible: faqWithoutVisible.length,
      fakeTrust: fakeTrust.length,
      brokenLinks: brokenLinks.length,
      jsLinkPages: jsLinkPages.length,
      isolated: isolated.length,
      images: { total: altStats.total, missing: altStats.missing, empty: altStats.empty },
      stuffing: stuffing.length,
      keywordBadgePages: keywordBadgePages.length,
      jargonPages: jargonPages.length,
      factHits: factHits.length,
      factViolations: factHits.filter(isViolation).length,
      scopeHits: scopeHits.length,
      scopeViolations: scopeHits.filter(isViolation).length,
      simPairs: simPairs.length,
      classCounts,
    },
    null,
    1,
  ),
);
