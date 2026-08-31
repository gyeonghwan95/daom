/**
 * SEO MASTER AUDIT — baseline snapshot + quality gate.
 * Internal QA only. Not a Naver ranking score.
 *
 *   npx --yes tsx scripts/seo-master-audit.ts
 *   npx --yes tsx scripts/seo-master-audit.ts --snapshot-only
 *
 * CRITICAL remaining → exit 1 (SEO_RELEASE_BLOCKED)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import {
  getCanonicalOverridePath,
  isNoIndexPath,
  resolveCanonicalPath,
} from "../src/lib/seo/index-policy";
import {
  HOME_H1,
  HOME_METADATA_DESCRIPTION,
  HOME_METADATA_TITLE,
} from "../src/lib/seo/metadata";
import { lecturePages } from "../src/lib/lectures/content";
import { lectureKeywordUniverse } from "../src/data/lectures/lecture-keyword-to-url-map";
import { BUSAN_DISTRICT_HUBS } from "../src/lib/geo/busan-district-hubs";
import { seoBrand } from "../src/lib/seo/brand";
import { getNapInfo } from "../src/lib/business-info";

const ROOT = process.cwd();
const BASELINE = path.join(ROOT, "seo/baseline");
const FINAL = path.join(ROOT, "seo/final");
const SNAPSHOT_ONLY = process.argv.includes("--snapshot-only");

type Issue = { level: "CRITICAL" | "HIGH" | "INFO"; code: string; message: string };

type PageRow = {
  url: string;
  route_type: string;
  status: string;
  indexable: boolean;
  canonical: string;
  title: string;
  description: string;
  h1: string;
  word_count: number;
  unique_body_word_count: number;
  in_sitemap: boolean;
  incoming_internal_links: number;
  outgoing_internal_links: number;
  primary_keyword: string;
  topic_cluster: "CORE" | "LOCAL" | "LECTURE" | "OTHER";
  body: string;
};

const CORE_OWNERS: Record<string, string> = {
  "부산 법무사": "/",
  "부산 법무사 상담": "/부산법무사상담",
  "부산 법무사 추천": "/부산법무사추천",
  "부산 상속 전문 법무사": "/부산상속법무사",
  "부산 상속 법무사": "/부산상속법무사",
  "부산 상속등기": "/부산상속등기",
  "부산 상속포기": "/부산상속포기",
  "부산 한정승인": "/부산한정승인",
};

const LECTURE_OWNERS: Record<string, string> = {
  "부산 법률 강의": "/법률강의",
  "부산 법률 특강": "/법률강의",
  "부산 강의 문의": "/강의문의",
  "부산 특강 문의": "/강의문의",
  "부산 강연 문의": "/강의문의",
  "부산 출강 문의": "/강의문의",
  "부산 강사 섭외": "/부산법률강사",
  "부산 강사 초빙": "/부산법률강사",
  "부산 외부강사": "/부산법률강사",
  "부산 전세사기 예방교육": "/전세사기예방교육",
  "부산 생활법률 특강": "/법률강의",
  "부산 청년 법률교육": "/청년생활법률특강",
  "부산 창업 법률교육": "/창업법률교육",
};

const LECTURE_PATHS = new Set([
  ...lecturePages.map((p) => `/${p.slug}`),
  "/강의이력",
]);

const DISTRICT_PATHS = new Set(BUSAN_DISTRICT_HUBS.map((h) => h.href));

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function compact(value: string): string {
  return value.replace(/\s+/g, "");
}

function titlePrimary(title: string): string {
  return title.split("|")[0]?.split("｜")[0]?.trim() ?? title.trim();
}

function mkdirp(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeCsv(file: string, header: string[], rows: Array<Array<string | number | boolean>>) {
  const lines = [header.join(","), ...rows.map((row) => row.map(csvCell).join(","))];
  fs.writeFileSync(file, `${lines.join("\n")}\n`, "utf8");
}

function loadJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function clusterFor(url: string, category: string): PageRow["topic_cluster"] {
  if (url === "/" || CORE_OWNERS[Object.keys(CORE_OWNERS).find((k) => CORE_OWNERS[k] === url) ?? ""]) {
    if (Object.values(CORE_OWNERS).includes(url) || url === "/부산법무사" || url === "/부산등기법무사") {
      return "CORE";
    }
  }
  if (LECTURE_PATHS.has(url) || url.startsWith("/강의이력/")) return "LECTURE";
  if (DISTRICT_PATHS.has(url) || category === "local" || /법무사$/.test(url.replace(/^\//, ""))) {
    if (LECTURE_PATHS.has(url)) return "LECTURE";
    if (Object.values(CORE_OWNERS).includes(url) || url === "/부산법무사") return "CORE";
    if (
      url.endsWith("법무사") ||
      url.includes("동법무사") ||
      url.includes("구법무사") ||
      url.includes("군법무사") ||
      category === "local"
    ) {
      return "LOCAL";
    }
  }
  if (category === "local") return "LOCAL";
  return "OTHER";
}

function pageBody(page: {
  intro: string;
  introParagraphs: string[];
  sections: Array<{ title: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
  h1: string;
}): string {
  return [
    page.h1,
    page.intro,
    ...page.introParagraphs,
    ...page.sections.flatMap((s) => [s.title, s.body]),
    ...page.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join("\n");
}

function tokens(text: string): Set<string> {
  return new Set(
    text
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1),
  );
}

function jaccard(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  let inter = 0;
  for (const x of ta) if (tb.has(x)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

const GEO_STRIP =
  /부산광역시|해운대구|해운대|센텀시티|센텀|연제구|연산동|거제동|수영구|광안리|동래구|부산진구|서면|남구|북구|금정구|사상구|사하구|중구|서구|동구|영도구|강서구|기장군|정관|명지|재송동|반여동|우동|좌동/g;

function stripGeo(s: string): string {
  return s.replace(GEO_STRIP, " ").replace(/\s+/g, " ").trim();
}

function stripLecture(s: string): string {
  return s
    .replace(/공공기관|도서관|청년기관|복지|학교|대학|협회|기업|전세사기|생활법률|창업|특강|강의|강사|출강|섭외|초빙/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadSitemapPaths(): Set<string> {
  const manifest = path.join(ROOT, "scripts/output/sitemap-manifest.json");
  if (!fs.existsSync(manifest)) return new Set();
  const data = JSON.parse(fs.readFileSync(manifest, "utf8")) as {
    urls?: Array<{ path?: string; loc?: string }>;
    paths?: string[];
  };
  const set = new Set<string>();
  if (Array.isArray(data.paths)) data.paths.forEach((p) => set.add(p));
  if (Array.isArray(data.urls)) {
    for (const row of data.urls) {
      if (row.path) set.add(row.path);
      else if (row.loc) {
        try {
          const u = new URL(row.loc);
          set.add(decodeURIComponent(u.pathname));
        } catch {
          /* ignore */
        }
      }
    }
  }
  return set;
}

function outHtmlExists(route: string): boolean {
  const outDir = path.join(ROOT, "out");
  if (!fs.existsSync(outDir)) return false;
  if (route === "/") return fs.existsSync(path.join(outDir, "index.html"));
  const slug = route.replace(/^\//, "");
  const encoded = slug.split("/").map((s) => encodeURIComponent(s)).join("/");
  return [
    path.join(outDir, `${slug}.html`),
    path.join(outDir, `${encoded}.html`),
    path.join(outDir, slug, "index.html"),
  ].some((f) => fs.existsSync(f));
}

function readOutHtml(route: string): string | null {
  const outDir = path.join(ROOT, "out");
  if (!fs.existsSync(outDir)) return null;
  if (route === "/") {
    const f = path.join(outDir, "index.html");
    return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
  }
  const slug = route.replace(/^\//, "");
  const encoded = slug.split("/").map((s) => encodeURIComponent(s)).join("/");
  const candidates = [
    path.join(outDir, `${slug}.html`),
    path.join(outDir, `${encoded}.html`),
    path.join(outDir, slug, "index.html"),
  ];
  const hit = candidates.find((f) => fs.existsSync(f));
  return hit ? fs.readFileSync(hit, "utf8") : null;
}

function countH1(html: string): number {
  return (html.match(/<h1\b/gi) ?? []).length;
}

function collectPages(): PageRow[] {
  const sitemap = loadSitemapPaths();
  const pages: PageRow[] = [
    {
      url: "/",
      route_type: "home",
      status: "200",
      indexable: true,
      canonical: "/",
      title: HOME_METADATA_TITLE,
      description: HOME_METADATA_DESCRIPTION,
      h1: HOME_H1,
      word_count: HOME_METADATA_DESCRIPTION.length,
      unique_body_word_count: tokens(HOME_METADATA_DESCRIPTION).size,
      in_sitemap: sitemap.has("/") || sitemap.size === 0,
      incoming_internal_links: 0,
      outgoing_internal_links: 0,
      primary_keyword: "부산 법무사",
      topic_cluster: "CORE",
      body: `${HOME_H1}\n${HOME_METADATA_DESCRIPTION}`,
    },
  ];

  for (const page of getAllPageData()) {
    if (page.path === "/") continue;
    const body = pageBody(page);
    const indexable = isIndexablePagePath(page.path) && !isNoIndexPath(page.path);
    const cluster = clusterFor(page.path, page.category);
    pages.push({
      url: page.path,
      route_type: page.category,
      status: "200",
      indexable,
      canonical: resolveCanonicalPath(page.path),
      title: page.metaTitle || page.title,
      description: page.metaDescription,
      h1: page.h1,
      word_count: body.replace(/\s+/g, "").length,
      unique_body_word_count: tokens(body).size,
      in_sitemap: sitemap.has(page.path),
      incoming_internal_links: 0,
      outgoing_internal_links: page.internalLinks.length + page.relatedLinks.length,
      primary_keyword: page.primaryKeywords[0] ?? "",
      topic_cluster: cluster,
      body,
    });
  }

  const inbound = new Map<string, number>();
  for (const page of getAllPageData()) {
    for (const link of [...page.internalLinks, ...page.relatedLinks]) {
      const href = link.href.split("#")[0];
      inbound.set(href, (inbound.get(href) ?? 0) + 1);
    }
  }
  for (const row of pages) {
    row.incoming_internal_links = inbound.get(row.url) ?? 0;
  }
  return pages;
}

function matchOwnerPrefix(text: string, query: string): boolean {
  const primary = compact(titlePrimary(text));
  const q = compact(query);
  if (!primary.startsWith(q)) return false;
  const rest = primary.slice(q.length);
  if (rest.length === 0) return true;
  return (
    /^(안윤정|다옴법무사사무소|법무사)/.test(rest) ||
    /^[·,，、|｜—\-–]/.test(rest)
  );
}

function queryAliases(query: string): string[] {
  const aliases = new Set([query]);
  const stripped = query.replace(/\s*전문\s*/g, " ").replace(/\s+/g, " ").trim();
  if (stripped) aliases.add(stripped);
  return [...aliases];
}

function relevanceOne(query: string, row: PageRow): number {
  const q = compact(query);
  let score = 0;
  if (matchOwnerPrefix(row.title, query)) score += 100;
  if (matchOwnerPrefix(row.h1, query)) score += 50;
  if (compact(row.h1).includes(q)) score += 20;
  if (compact(row.body.slice(0, 400)).includes(q)) score += 15;
  if (compact(row.primary_keyword) === q) score += 40;
  if (compact(row.url).includes(q.replace(/법무사$/, ""))) score += 10;
  return score;
}

function relevance(query: string, row: PageRow): number {
  return Math.max(...queryAliases(query).map((q) => relevanceOne(q, row)));
}

function gitSnapshot(): string {
  const cmds = [
    ["status", "--short"],
    ["log", "-12", "--oneline"],
    ["rev-parse", "--abbrev-ref", "HEAD"],
  ];
  return cmds
    .map(([cmd, ...args]) => {
      const r = spawnSync("git", [cmd, ...args], { cwd: ROOT, encoding: "utf8" });
      return `$ git ${cmd} ${args.join(" ")}\n${r.stdout || r.stderr || ""}`;
    })
    .join("\n");
}

function findAdvisorFiles(): string[] {
  const hits: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        if (name === "node_modules" || name === ".git" || name === "out") continue;
        walk(full);
      } else if (
        /naver-(searchadvisor|performance|exposure|click)/i.test(name) &&
        /\.(csv|json)$/i.test(name)
      ) {
        hits.push(path.relative(ROOT, full));
      }
    }
  };
  walk(path.join(ROOT, "seo"));
  walk(path.join(ROOT, "reports/seo"));
  return hits;
}

function main() {
  mkdirp(BASELINE);
  mkdirp(FINAL);
  mkdirp(path.join(ROOT, "tests/seo"));
  mkdirp(path.join(ROOT, "docs"));
  mkdirp(path.join(ROOT, "reports/seo"));

  const frozenMarker = path.join(BASELINE, ".frozen");
  const baselineFrozen = fs.existsSync(frozenMarker);
  const snapshotDir = baselineFrozen ? path.join(FINAL, "current-snapshot") : BASELINE;
  mkdirp(snapshotDir);
  if (!baselineFrozen) {
    fs.writeFileSync(path.join(BASELINE, "git-snapshot.txt"), gitSnapshot(), "utf8");
    fs.writeFileSync(frozenMarker, `${new Date().toISOString()}\n`, "utf8");
  } else {
    fs.writeFileSync(path.join(snapshotDir, "git-snapshot.txt"), gitSnapshot(), "utf8");
  }

  const keywordMap = loadJson<{
    queries: Record<string, { owner: string; aliasOf?: string; intent?: string }>;
  }>(path.join(ROOT, "seo/keyword-map.json"), { queries: {} });
  const localMap = loadJson<{ owners: Record<string, string> }>(
    path.join(ROOT, "seo/local-keyword-map.json"),
    { owners: {} },
  );

  const pages = collectPages();
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const indexable = pages.filter((p) => p.indexable);

  writeCsv(
    path.join(snapshotDir, "routes.csv"),
    ["url", "route_type", "topic_cluster", "indexable", "canonical", "in_sitemap"],
    pages.map((p) => [p.url, p.route_type, p.topic_cluster, p.indexable, p.canonical, p.in_sitemap]),
  );
  writeCsv(
    path.join(snapshotDir, "metadata.csv"),
    ["url", "title", "description", "h1", "primary_keyword", "word_count"],
    pages.map((p) => [p.url, p.title, p.description, p.h1, p.primary_keyword, p.word_count]),
  );
  writeCsv(
    path.join(snapshotDir, "indexability.csv"),
    ["url", "indexable", "noindex", "canonical", "in_sitemap", "out_html"],
    pages.map((p) => [
      p.url,
      p.indexable,
      isNoIndexPath(p.url),
      p.canonical,
      p.in_sitemap,
      outHtmlExists(p.url),
    ]),
  );
  writeCsv(
    path.join(snapshotDir, "internal-links.csv"),
    ["url", "incoming_internal_links", "outgoing_internal_links"],
    pages.map((p) => [p.url, p.incoming_internal_links, p.outgoing_internal_links]),
  );
  writeCsv(
    path.join(snapshotDir, "sitemap.csv"),
    ["url", "in_sitemap", "indexable"],
    pages.map((p) => [p.url, p.in_sitemap, p.indexable]),
  );
  writeCsv(
    path.join(BASELINE, "schema.csv"),
    ["url", "note"],
    [
      ["/", "LocalBusiness+Person via GlobalJsonLd / home"],
      ["/office", "LocalBusiness on office page (same NAP, not a fake branch)"],
      ["lecture/*", "WebPage + BreadcrumbList; FAQ only when visible"],
    ],
  );

  if (SNAPSHOT_ONLY) {
    console.log(`baseline pages: ${pages.length}`);
    return;
  }

  const issues: Issue[] = [];
  const advisorFiles = findAdvisorFiles();

  const ownerByQuery = new Map<string, string>();
  const addOwner = (query: string, owner: string, source: string) => {
    const prev = ownerByQuery.get(query);
    if (prev && prev !== owner) {
      issues.push({
        level: "CRITICAL",
        code: "OWNER_COLLISION",
        message: `${query}: ${prev} vs ${owner} (${source})`,
      });
    } else {
      ownerByQuery.set(query, owner);
    }
  };

  for (const [q, row] of Object.entries(keywordMap.queries)) {
    const owner = row.aliasOf ? keywordMap.queries[row.aliasOf]?.owner ?? row.owner : row.owner;
    addOwner(q, owner, "keyword-map");
  }
  for (const [q, owner] of Object.entries(localMap.owners)) {
    addOwner(q, owner, "local-map");
  }
  for (const [q, owner] of Object.entries(CORE_OWNERS)) addOwner(q, owner, "core-spec");
  for (const [q, owner] of Object.entries(LECTURE_OWNERS)) addOwner(q, owner, "lecture-spec");
  for (const row of lectureKeywordUniverse) {
    if (row.cluster === "skip-wide") continue;
    addOwner(row.keyword, row.owner_url, "lecture-universe");
  }

  const claimed = new Map<string, string[]>();
  const queries = [...ownerByQuery.keys()].sort((a, b) => compact(b).length - compact(a).length);
  for (const page of indexable) {
    let matched: string | null = null;
    for (const q of queries) {
      if (matchOwnerPrefix(page.title, q) || matchOwnerPrefix(page.h1, q)) {
        matched = q;
        break;
      }
    }
    if (!matched) continue;
    const owner = ownerByQuery.get(matched)!;
    const canonicalQ = keywordMap.queries[matched]?.aliasOf ?? matched;
    const list = claimed.get(canonicalQ) ?? [];
    if (!list.includes(page.url)) list.push(page.url);
    claimed.set(canonicalQ, list);
    if (page.url !== owner) {
      issues.push({
        level: "CRITICAL",
        code: "PRIMARY_COLLISION",
        message: `${matched}: ${page.url} claims PRIMARY (owner=${owner})`,
      });
    }
  }

  const crossSilo: Array<{ url: string; cluster: string; forbidden: string; where: string }> = [];
  for (const page of indexable) {
    const hay = `${page.title}\n${page.h1}`;
    if (page.topic_cluster === "LOCAL" || page.topic_cluster === "LECTURE") {
      if (matchOwnerPrefix(hay, "부산 법무사") && page.url !== "/") {
        crossSilo.push({ url: page.url, cluster: page.topic_cluster, forbidden: "부산 법무사", where: "title/H1" });
      }
      if (matchOwnerPrefix(hay, "부산 법무사 추천") && page.url !== "/부산법무사추천") {
        crossSilo.push({ url: page.url, cluster: page.topic_cluster, forbidden: "부산 법무사 추천", where: "title/H1" });
      }
      if (matchOwnerPrefix(hay, "부산 법무사 상담") && page.url !== "/부산법무사상담") {
        crossSilo.push({ url: page.url, cluster: page.topic_cluster, forbidden: "부산 법무사 상담", where: "title/H1" });
      }
    }
    if (page.topic_cluster === "CORE" || page.url === "/") {
      if (matchOwnerPrefix(hay, "부산 강의 문의") || matchOwnerPrefix(hay, "부산 강사 섭외")) {
        crossSilo.push({ url: page.url, cluster: page.topic_cluster, forbidden: "lecture intent", where: "title/H1" });
      }
    }
    if (page.url === "/" && /강의|특강|강사 섭외/.test(page.title + page.h1)) {
      crossSilo.push({ url: "/", cluster: "CORE", forbidden: "lecture in HOME title/H1", where: "title/H1" });
    }
  }
  for (const row of crossSilo) {
    issues.push({
      level: "CRITICAL",
      code: "CROSS_SILO",
      message: `${row.url} [${row.cluster}] PRIMARY-like ${row.forbidden} in ${row.where}`,
    });
  }

  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  const h1Missing: string[] = [];
  for (const page of indexable) {
    if (!page.title.trim()) {
      issues.push({ level: "CRITICAL", code: "MISSING_TITLE", message: page.url });
    }
    if (!page.h1.trim()) {
      h1Missing.push(page.url);
      issues.push({ level: "CRITICAL", code: "MISSING_H1", message: page.url });
    }
    const t = page.title.trim();
    titleMap.set(t, [...(titleMap.get(t) ?? []), page.url]);
    const d = page.description.trim();
    if (d) descMap.set(d, [...(descMap.get(d) ?? []), page.url]);
  }
  let dupTitle = 0;
  for (const [title, urls] of titleMap) {
    if (urls.length > 1) {
      dupTitle += urls.length - 1;
      issues.push({
        level: "CRITICAL",
        code: "DUP_TITLE",
        message: `"${title.slice(0, 80)}" ×${urls.length}: ${urls.slice(0, 4).join(" ")}`,
      });
    }
  }
  let dupDesc = 0;
  for (const [desc, urls] of descMap) {
    if (urls.length > 1) {
      dupDesc += urls.length - 1;
      issues.push({
        level: "HIGH",
        code: "DUP_DESC",
        message: `description ×${urls.length}: ${urls.slice(0, 4).join(" ")}`,
      });
    }
  }

  const similarityRows: Array<[string, string, string, number]> = [];
  const comparePair = (a: PageRow, b: PageRow, mode: string, fn: (s: string) => string) => {
    const score = jaccard(fn(a.body), fn(b.body));
    if (score >= 0.45) {
      similarityRows.push([a.url, b.url, mode, Number(score.toFixed(3))]);
      if (score >= 0.75) {
        issues.push({
          level: "CRITICAL",
          code: "SIMILARITY",
          message: `${mode} ${score.toFixed(2)} ${a.url} ↔ ${b.url}`,
        });
      } else if (score >= 0.6) {
        issues.push({
          level: "HIGH",
          code: "SIMILARITY",
          message: `${mode} ${score.toFixed(2)} ${a.url} ↔ ${b.url}`,
        });
      }
    }
  };

  const coreSet = indexable.filter((p) => p.topic_cluster === "CORE");
  const lectureSet = indexable.filter((p) => p.topic_cluster === "LECTURE" && !p.url.startsWith("/강의이력/"));
  const localHubs = indexable.filter((p) => DISTRICT_PATHS.has(p.url));
  for (let i = 0; i < coreSet.length; i++) {
    for (let j = i + 1; j < coreSet.length; j++) comparePair(coreSet[i], coreSet[j], "core-raw", (s) => s);
  }
  for (let i = 0; i < lectureSet.length; i++) {
    for (let j = i + 1; j < lectureSet.length; j++) {
      comparePair(lectureSet[i], lectureSet[j], "lecture-norm", stripLecture);
    }
  }
  for (let i = 0; i < localHubs.length; i++) {
    for (let j = i + 1; j < localHubs.length; j++) {
      comparePair(localHubs[i], localHubs[j], "local-norm", stripGeo);
    }
  }
  const home = byUrl.get("/")!;
  for (const hub of localHubs) comparePair(home, hub, "cross-home-local", stripGeo);
  for (const lec of lectureSet.filter((p) =>
    ["/법률강의", "/강의문의", "/부산법률강사"].includes(p.url),
  )) {
    comparePair(home, lec, "cross-home-lecture", (s) => s);
  }

  const importantOwners = [
    ...new Set([
      ...Object.values(CORE_OWNERS),
      ...Object.values(LECTURE_OWNERS),
      ...BUSAN_DISTRICT_HUBS.map((h) => h.href),
      "/부산법무사",
    ]),
  ];
  for (const url of importantOwners) {
    const row = byUrl.get(url);
    if (!row) {
      issues.push({ level: "CRITICAL", code: "MISSING_OWNER", message: url });
      continue;
    }
    if (!row.indexable) {
      issues.push({ level: "CRITICAL", code: "OWNER_NOINDEX", message: url });
    }
    if (url !== "/" && row.incoming_internal_links === 0) {
      issues.push({ level: "CRITICAL", code: "ORPHAN_OWNER", message: url });
    }
    const override = getCanonicalOverridePath(url);
    if (override && override !== url) {
      issues.push({
        level: "CRITICAL",
        code: "CANONICAL",
        message: `${url} canonical→${override}`,
      });
    }
    if (row.indexable && !row.in_sitemap && loadSitemapPaths().size > 0) {
      issues.push({ level: "CRITICAL", code: "SITEMAP_MISS", message: url });
    }
    if (!row.indexable && row.in_sitemap) {
      issues.push({ level: "CRITICAL", code: "SITEMAP_NOINDEX", message: url });
    }
  }

  const htmlOwners = importantOwners.filter((u) =>
    ["/", "/부산법무사", "/부산법무사상담", "/부산법무사추천", "/법률강의", "/강의문의", "/부산법률강사", "/연제구법무사"].includes(u),
  );
  if (fs.existsSync(path.join(ROOT, "out"))) {
    for (const url of htmlOwners) {
      const html = readOutHtml(url);
      if (!html) {
        issues.push({ level: "CRITICAL", code: "OUT_404", message: url });
        continue;
      }
      const n = countH1(html);
      if (n !== 1) {
        issues.push({
          level: n === 0 ? "CRITICAL" : "CRITICAL",
          code: n === 0 ? "HTML_MISSING_H1" : "HTML_MULTI_H1",
          message: `${url} h1 count=${n}`,
        });
      }
      if (!/<link[^>]+rel=["']canonical["']/i.test(html)) {
        issues.push({ level: "HIGH", code: "HTML_CANONICAL", message: `${url} no canonical in HTML` });
      }
      const row = byUrl.get(url);
      if (row && !html.includes(row.h1.slice(0, 12))) {
        issues.push({
          level: "HIGH",
          code: "SSR_H1",
          message: `${url} H1 not found in prerendered HTML`,
        });
      }
    }
  }

  const nap = getNapInfo();
  if (!nap.address.includes("센텀") && !nap.address.includes("해운대")) {
    issues.push({ level: "CRITICAL", code: "NAP", message: "office address missing Haeundae/Centum" });
  }

  const robotsSrc = fs.readFileSync(path.join(ROOT, "src/app/robots.ts"), "utf8");
  if (/disallow:\s*[\"']\/_next/i.test(robotsSrc)) {
    issues.push({ level: "CRITICAL", code: "ROBOTS", message: "robots blocks /_next" });
  }
  if (!robotsSrc.includes("Yeti")) {
    issues.push({ level: "HIGH", code: "ROBOTS", message: "Yeti user-agent rule missing" });
  }

  const indexnow = fs.readFileSync(path.join(ROOT, "scripts/submit-indexnow.mjs"), "utf8");
  if (/색인 성공|indexed successfully/i.test(indexnow)) {
    issues.push({
      level: "CRITICAL",
      code: "INDEXNOW",
      message: "IndexNow success treated as index success",
    });
  }

  const intentCases = [
    { query: "부산 법무사", expectedOwner: "/" },
    { query: "부산 법무사 상담", expectedOwner: "/부산법무사상담" },
    { query: "부산 법무사 추천", expectedOwner: "/부산법무사추천" },
    { query: "부산 상속 전문 법무사", expectedOwner: "/부산상속법무사" },
    { query: "부산 상속등기", expectedOwner: "/부산상속등기" },
    { query: "부산 상속포기", expectedOwner: "/부산상속포기" },
    { query: "부산 한정승인", expectedOwner: "/부산한정승인" },
    { query: "연제구 법무사", expectedOwner: "/연제구법무사" },
    { query: "수영구 법무사", expectedOwner: "/수영구법무사" },
    { query: "해운대 법무사", expectedOwner: "/해운대법무사" },
    { query: "부산 강의 문의", expectedOwner: "/강의문의" },
    { query: "부산 강사 섭외", expectedOwner: "/부산법률강사" },
    { query: "부산 법률 강의", expectedOwner: "/법률강의" },
    { query: "부산 전세사기 예방교육", expectedOwner: "/전세사기예방교육" },
  ];
  const simResults: Array<{
    query: string;
    expectedOwner: string;
    top: Array<{ url: string; score: number }>;
  }> = [];
  for (const test of intentCases) {
    const ranked = indexable
      .map((p) => ({ url: p.url, score: relevance(test.query, p) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    simResults.push({ query: test.query, expectedOwner: test.expectedOwner, top: ranked });
    const best = ranked[0];
    if (!best || best.url !== test.expectedOwner) {
      issues.push({
        level: "HIGH",
        code: "INTENT_SIM",
        message: `${test.query} expected ${test.expectedOwner} got ${best?.url ?? "none"} (${best?.score ?? 0})`,
      });
    }
  }

  const coreKw = Object.entries(CORE_OWNERS).map(([keyword, owner_url]) => [
    keyword,
    "CORE",
    owner_url,
  ]);
  const localKw = Object.entries(localMap.owners).map(([keyword, owner_url]) => [
    keyword,
    "LOCAL",
    owner_url,
  ]);
  const lectureKw = lectureKeywordUniverse.map((r) => [r.keyword, r.cluster, r.owner_url]);

  writeCsv(path.join(FINAL, "core-keywords.csv"), ["keyword", "cluster", "owner_url"], coreKw);
  writeCsv(path.join(FINAL, "local-keywords.csv"), ["keyword", "cluster", "owner_url"], localKw);
  writeCsv(
    path.join(FINAL, "lecture-keywords.csv"),
    ["keyword", "cluster", "owner_url"],
    lectureKw,
  );
  writeCsv(
    path.join(FINAL, "keyword-owner-collisions.csv"),
    ["keyword", "urls"],
    [...claimed.entries()]
      .filter(([, urls]) => urls.length > 1)
      .map(([k, urls]) => [k, urls.join(" ")]),
  );
  writeCsv(
    path.join(FINAL, "cross-silo-conflicts.csv"),
    ["url", "cluster", "forbidden", "where"],
    crossSilo.map((r) => [r.url, r.cluster, r.forbidden, r.where]),
  );
  writeCsv(
    path.join(FINAL, "sitewide-similarity.csv"),
    ["a", "b", "mode", "score"],
    similarityRows,
  );
  writeCsv(path.join(FINAL, "anchor-owner-conflicts.csv"), ["anchor", "expected", "actual", "source"], []);

  fs.writeFileSync(
    path.join(FINAL, "keyword-owner-map.json"),
    `${JSON.stringify({ updated: new Date().toISOString().slice(0, 10), owners: Object.fromEntries(ownerByQuery) }, null, 2)}\n`,
    "utf8",
  );

  fs.writeFileSync(
    path.join(ROOT, "tests/seo/search-intent-cases.json"),
    `${JSON.stringify({ note: "/강의 and /부산강사초빙 do not exist — actual owners used.", cases: intentCases }, null, 2)}\n`,
    "utf8",
  );

  const trackerHeader = [
    "cluster",
    "keyword",
    "owner_url",
    "baseline_impressions",
    "baseline_clicks",
    "baseline_ctr",
    "day30_impressions",
    "day30_clicks",
    "day30_ctr",
    "day60_impressions",
    "day60_clicks",
    "day60_ctr",
    "day90_impressions",
    "day90_clicks",
    "day90_ctr",
    "notes",
  ];
  writeCsv(
    path.join(ROOT, "seo/naver-master-tracker.csv"),
    trackerHeader,
    [
      ...Object.entries(CORE_OWNERS).map(([k, u]) => [
        "CORE",
        k,
        u,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        advisorFiles.length ? "advisor file present" : "SEARCH PERFORMANCE UNKNOWN",
      ]),
      ...Object.entries(LECTURE_OWNERS).map(([k, u]) => [
        "LECTURE",
        k,
        u,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "SEARCH PERFORMANCE UNKNOWN",
      ]),
    ],
  );

  const critical = issues.filter((i) => i.level === "CRITICAL");
  const high = issues.filter((i) => i.level === "HIGH");
  const status =
    critical.length > 0
      ? "SEO_RELEASE_BLOCKED"
      : high.length > 0
        ? "SEO_RELEASE_READY_WITH_WARNINGS"
        : "SEO_RELEASE_READY";

  const qa = {
    technical: critical.some((i) => ["ROBOTS", "CANONICAL", "SITEMAP_NOINDEX", "OUT_404"].includes(i.code))
      ? 10
      : 18,
    intent: critical.some((i) => i.code === "PRIMARY_COLLISION") ? 8 : 19,
    unique: critical.some((i) => i.code === "SIMILARITY") ? 8 : high.some((i) => i.code === "SIMILARITY") ? 14 : 18,
    architecture: critical.some((i) => i.code === "ORPHAN_OWNER" || i.code === "CROSS_SILO") ? 8 : 14,
    trust: 9,
    depth: 8,
    ux: 4,
  };
  const qaTotal = Object.values(qa).reduce((a, b) => a + b, 0);

  const reportJson = {
    status,
    internalQaScore: qaTotal,
    note: "Internal SEO QA Score — not a Naver score.",
    counts: {
      pages: pages.length,
      indexable: indexable.length,
      critical: critical.length,
      high: high.length,
      dupTitle,
      dupDesc,
      advisorFiles,
      searchAdvisor: advisorFiles.length ? "PRESENT" : "UNKNOWN",
    },
    clusters: {
      CORE: indexable.filter((p) => p.topic_cluster === "CORE").length,
      LOCAL: indexable.filter((p) => p.topic_cluster === "LOCAL").length,
      LECTURE: indexable.filter((p) => p.topic_cluster === "LECTURE").length,
    },
    intentSimulation: simResults,
    issues: issues.slice(0, 80),
  };
  fs.writeFileSync(
    path.join(ROOT, "reports/seo/master-audit.json"),
    `${JSON.stringify(reportJson, null, 2)}\n`,
    "utf8",
  );

  const coreUrlSet = new Set<string>([...Object.values(CORE_OWNERS), "/"]);
  const localOwnerLines = Object.entries(localMap.owners)
    .filter(([k, u]) => !CORE_OWNERS[k] && !coreUrlSet.has(u) && k !== "부산법무사")
    .sort((a, b) => a[1].localeCompare(b[1], "ko") || a[0].localeCompare(b[0], "ko"))
    .map(([k, u]) => `- ${k} → \`${u}\``);

  const keywordMd = `# SEO keyword ownership (final)

실제 존재하는 URL만 owner로 적습니다. \`/강의\`·\`/부산강사초빙\`은 없습니다.

Search Advisor 실측이 없으면 순위를 기입하지 않습니다.

## CORE

${Object.entries(CORE_OWNERS)
  .map(([k, u]) => `- ${k} → \`${u}\``)
  .join("\n")}

- 부산에서 법무사를 찾는 기준 → \`/부산법무사\` (INFORMATIONAL, HOME과 분리)

## LOCAL (구·군)

${BUSAN_DISTRICT_HUBS.map((h) => `- ${h.label} → \`${h.href}\``).join("\n")}

## LOCAL (생활권·동·역 등 전수)

${localOwnerLines.join("\n")}

전체 alias 목록: \`seo/final/local-keywords.csv\`

## LECTURE

${Object.entries(LECTURE_OWNERS)
  .map(([k, u]) => `- ${k} → \`${u}\``)
  .join("\n")}
`;
  fs.writeFileSync(path.join(ROOT, "docs/SEO_KEYWORD_OWNERSHIP_FINAL.md"), keywordMd, "utf8");

  const beforeAfter = `# SEO master BEFORE / AFTER

Frozen baseline: \`seo/baseline/*\` (수정 전)
Current snapshot: \`seo/final/current-snapshot/*\`
Advisor: ${advisorFiles.length ? advisorFiles.join(", ") : "없음 (UNKNOWN — 숫자 창작 없음)"}

BEFORE는 복구 작업 직전 1차 감사입니다. AFTER는 이번 수정 후 Internal SEO QA입니다. 네이버 순위가 아닙니다.

| metric | BEFORE | AFTER |
|---|---|---|
| status | SEO_RELEASE_BLOCKED | ${status} |
| indexable URL | 1666 (HOME 이중 집계 포함 1804 rows) | ${indexable.length} |
| CORE / LOCAL / LECTURE pages | 9 / 1170 / 44 | ${reportJson.clusters.CORE} / ${reportJson.clusters.LOCAL} / ${reportJson.clusters.LECTURE} |
| PRIMARY collision CRITICAL | 0 | ${issues.filter((i) => i.code === "PRIMARY_COLLISION").length} |
| CROSS-SILO CRITICAL | 0 | ${issues.filter((i) => i.code === "CROSS_SILO").length} |
| duplicate title | 3 (HOME×2, /contact=/contact/inquiry, /부산파산=/부산개인파산) | ${dupTitle} |
| duplicate description | 3 (동일 쌍) | ${dupDesc} |
| INTENT_SIM HIGH | 2 (부산 상속 전문 법무사, 부산 상속등기) | ${issues.filter((i) => i.code === "INTENT_SIM").length} |
| critical similarity | 0 | ${issues.filter((i) => i.code === "SIMILARITY" && i.level === "CRITICAL").length} |
| orphan owners | 0 | ${issues.filter((i) => i.code === "ORPHAN_OWNER").length} |
| Internal QA Score | 90 / 100 | ${qaTotal} / 100 (not a Naver score) |

보호한 변경: HOME·/부산상속등기·/부산개인파산·/부산상속법무사 title/H1/canonical/index 유지. 신규 URL 없음. noindex/redirect 없음.
`;
  fs.writeFileSync(path.join(ROOT, "docs/SEO_MASTER_BEFORE_AFTER.md"), beforeAfter, "utf8");

  const checklist = `# 네이버 배포 후 확인 (담당자)

코드가 순위를 보장하지 않습니다. Search Advisor에서 직접 확인하세요.

1. 서치어드바이저 사이트 등록·소유 확인
2. https://다옴법무사사무소.kr/robots.txt — Yeti 허용, /admin·/api 만 제한
3. https://다옴법무사사무소.kr/sitemap.xml 수집
4. 핵심 owner 색인: \`/\` \`/부산법무사상담\` \`/부산법무사추천\` \`/부산상속법무사\` \`/연제구법무사\` \`/법률강의\` \`/강의문의\` \`/부산법률강사\`
5. 검색결과 title/description이 위 owner와 맞는지 수동 확인
6. export를 \`seo/naver-searchadvisor.csv\`로 저장 후 tracker(\`seo/naver-master-tracker.csv\`) 30/60/90일 비교
7. IndexNow는 **변경된 URL만** (\`npm run indexnow\`). 성공 응답 ≠ 색인 성공
8. 네이버에서 「부산 법무사」「연제구 법무사」「부산 강의 문의」「부산 강사 섭외」 결과를 직접 확인
`;
  fs.writeFileSync(path.join(ROOT, "docs/NAVER_POST_DEPLOYMENT_CHECK.md"), checklist, "utf8");

  console.log(`=== SEO MASTER AUDIT ===`);
  console.log(`status: ${status}`);
  console.log(`Internal QA Score: ${qaTotal} (not a Naver score)`);
  console.log(`pages=${pages.length} indexable=${indexable.length}`);
  console.log(`CRITICAL=${critical.length} HIGH=${high.length}`);
  console.log(`advisor: ${advisorFiles.length ? advisorFiles.join(",") : "UNKNOWN"}`);
  for (const issue of critical.slice(0, 20)) console.error(`[CRITICAL] ${issue.code} ${issue.message}`);
  for (const issue of high.slice(0, 15)) console.warn(`[HIGH] ${issue.code} ${issue.message}`);

  if (critical.length) process.exitCode = 1;
}

main();
