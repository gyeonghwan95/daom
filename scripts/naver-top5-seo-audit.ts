/**
 * 사이트 전역 네이버 TOP5 SEO 감사.
 * 순위를 추정·보장하지 않는다. SERP 크롤링/캡차 우회 없음.
 *
 * 실행: npx --yes tsx scripts/naver-top5-seo-audit.ts
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { isNoIndexPath, resolveCanonicalPath } from "../src/lib/seo/index-policy";
import { buildJsonLdForPageData } from "../src/lib/pageData/json-ld";
import type { PageData } from "../src/lib/pageData/types";

const ROOT = process.cwd();
const BEFORE = path.join(ROOT, "seo/master/before");
const MASTER = path.join(ROOT, "seo/master");

const SEEDS: { keyword: string; cluster: string }[] = [
  { keyword: "부산 법무사", cluster: "core" },
  { keyword: "부산 법무사 상담", cluster: "core" },
  { keyword: "부산 법무사 추천", cluster: "core" },
  { keyword: "부산 법무사 비용", cluster: "core" },
  { keyword: "부산 법무사 수수료", cluster: "core" },
  { keyword: "부산 법무사 보수", cluster: "core" },
  { keyword: "부산 등기 법무사", cluster: "core" },
  { keyword: "부산 등기전문 법무사", cluster: "core" },
  { keyword: "부산 상속 법무사", cluster: "inheritance" },
  { keyword: "부산 상속전문 법무사", cluster: "inheritance" },
  { keyword: "부산 법무사 상속", cluster: "inheritance" },
  { keyword: "부산 상속등기 법무사", cluster: "inheritance" },
  { keyword: "부산 상속등기", cluster: "inheritance" },
  { keyword: "부산 상속포기 법무사", cluster: "inheritance" },
  { keyword: "부산 상속포기", cluster: "inheritance" },
  { keyword: "부산 한정승인 법무사", cluster: "inheritance" },
  { keyword: "부산 한정승인", cluster: "inheritance" },
  { keyword: "부산 특별한정승인 법무사", cluster: "inheritance" },
  { keyword: "부산 특별한정승인", cluster: "inheritance" },
  { keyword: "부산 상속재산분할 법무사", cluster: "inheritance" },
  { keyword: "부산 상속재산분할협의", cluster: "inheritance" },
  { keyword: "부산 대습상속", cluster: "inheritance" },
  { keyword: "부산 미성년자 상속", cluster: "inheritance" },
  { keyword: "부산 해외 상속인 상속등기", cluster: "inheritance" },
  { keyword: "부산 부동산 법무사", cluster: "real-estate" },
  { keyword: "부산 부동산등기 법무사", cluster: "real-estate" },
  { keyword: "부산 부동산등기", cluster: "real-estate" },
  { keyword: "부산 소유권이전등기 법무사", cluster: "real-estate" },
  { keyword: "부산 아파트 등기 법무사", cluster: "real-estate" },
  { keyword: "부산 매매등기 법무사", cluster: "real-estate" },
  { keyword: "부산 증여등기 법무사", cluster: "real-estate" },
  { keyword: "부산 근저당설정 법무사", cluster: "real-estate" },
  { keyword: "부산 근저당말소 법무사", cluster: "real-estate" },
  { keyword: "부산 전세권설정 법무사", cluster: "real-estate" },
  { keyword: "부산 전세권말소 법무사", cluster: "real-estate" },
  { keyword: "부산 보존등기 법무사", cluster: "real-estate" },
  { keyword: "부산 가등기 법무사", cluster: "real-estate" },
  { keyword: "부산 법인 법무사", cluster: "corporate" },
  { keyword: "부산 법인등기 법무사", cluster: "corporate" },
  { keyword: "부산 법인등기", cluster: "corporate" },
  { keyword: "부산 법인설립 법무사", cluster: "corporate" },
  { keyword: "부산 법인설립등기", cluster: "corporate" },
  { keyword: "부산 임원변경등기 법무사", cluster: "corporate" },
  { keyword: "부산 대표이사 변경등기", cluster: "corporate" },
  { keyword: "부산 본점이전등기", cluster: "corporate" },
  { keyword: "부산 목적변경등기", cluster: "corporate" },
  { keyword: "부산 증자등기", cluster: "corporate" },
  { keyword: "부산 해산등기", cluster: "corporate" },
  { keyword: "부산 청산등기", cluster: "corporate" },
  { keyword: "부산 개인회생 법무사", cluster: "rehab" },
  { keyword: "부산 개인회생", cluster: "rehab" },
  { keyword: "부산 개인파산 법무사", cluster: "rehab" },
  { keyword: "부산 개인파산", cluster: "rehab" },
  { keyword: "부산 회생파산 법무사", cluster: "rehab" },
  { keyword: "부산 파산면책", cluster: "rehab" },
  { keyword: "부산 개인회생 비용", cluster: "rehab" },
  { keyword: "부산 개인파산 비용", cluster: "rehab" },
  { keyword: "부산 지급명령 법무사", cluster: "civil" },
  { keyword: "부산 내용증명 법무사", cluster: "civil" },
  { keyword: "부산 임차권등기명령 법무사", cluster: "civil" },
  { keyword: "부산 가압류 말소 법무사", cluster: "civil" },
  { keyword: "부산 개명 법무사", cluster: "civil" },
  { keyword: "부산 중구 법무사", cluster: "district" },
  { keyword: "부산 서구 법무사", cluster: "district" },
  { keyword: "부산 동구 법무사", cluster: "district" },
  { keyword: "영도구 법무사", cluster: "district" },
  { keyword: "부산진구 법무사", cluster: "district" },
  { keyword: "동래구 법무사", cluster: "district" },
  { keyword: "부산 남구 법무사", cluster: "district" },
  { keyword: "부산 북구 법무사", cluster: "district" },
  { keyword: "해운대구 법무사", cluster: "district" },
  { keyword: "해운대 법무사", cluster: "district" },
  { keyword: "사하구 법무사", cluster: "district" },
  { keyword: "금정구 법무사", cluster: "district" },
  { keyword: "강서구 법무사", cluster: "district" },
  { keyword: "연제구 법무사", cluster: "district" },
  { keyword: "수영구 법무사", cluster: "district" },
  { keyword: "사상구 법무사", cluster: "district" },
  { keyword: "기장군 법무사", cluster: "district" },
  { keyword: "기장 법무사", cluster: "district" },
  { keyword: "센텀 법무사", cluster: "neighborhood" },
  { keyword: "센텀시티 법무사", cluster: "neighborhood" },
  { keyword: "재송동 법무사", cluster: "neighborhood" },
  { keyword: "반여동 법무사", cluster: "neighborhood" },
  { keyword: "우동 법무사", cluster: "neighborhood" },
  { keyword: "좌동 법무사", cluster: "neighborhood" },
  { keyword: "연산동 법무사", cluster: "neighborhood" },
  { keyword: "거제동 법무사", cluster: "neighborhood" },
  { keyword: "광안동 법무사", cluster: "neighborhood" },
  { keyword: "광안리 법무사", cluster: "neighborhood" },
  { keyword: "민락동 법무사", cluster: "neighborhood" },
  { keyword: "망미동 법무사", cluster: "neighborhood" },
  { keyword: "남천동 법무사", cluster: "neighborhood" },
  { keyword: "사직동 법무사", cluster: "neighborhood" },
  { keyword: "온천동 법무사", cluster: "neighborhood" },
  { keyword: "명륜동 법무사", cluster: "neighborhood" },
  { keyword: "서면 법무사", cluster: "neighborhood" },
  { keyword: "부전동 법무사", cluster: "neighborhood" },
  { keyword: "전포동 법무사", cluster: "neighborhood" },
  { keyword: "대연동 법무사", cluster: "neighborhood" },
  { keyword: "용호동 법무사", cluster: "neighborhood" },
  { keyword: "문현동 법무사", cluster: "neighborhood" },
  { keyword: "덕천동 법무사", cluster: "neighborhood" },
  { keyword: "화명동 법무사", cluster: "neighborhood" },
  { keyword: "만덕동 법무사", cluster: "neighborhood" },
  { keyword: "부산 강의 문의", cluster: "lecture" },
];

const EXTRA_OWNERS: Record<string, string> = {
  "부산 법무사 비용": "/부산법무사비용",
  "부산 법무사 수수료": "/부산법무사비용",
  "부산 법무사 보수": "/부산법무사비용",
  "부산 등기전문 법무사": "/부산등기법무사",
  "부산 특별한정승인": "/특별한정승인",
  "부산 특별한정승인 법무사": "/특별한정승인",
  "부산 상속재산분할 법무사": "/부산상속재산분할법무사",
  "부산 상속재산분할협의": "/부산상속재산분할법무사",
  "부산 대습상속": "/대습상속등기",
  "부산 미성년자 상속": "/미성년상속인",
  "부산 해외 상속인 상속등기": "/해외거주상속인",
  "부산 부동산등기": "/부산부동산등기",
  "부산 소유권이전등기 법무사": "/부산소유권이전등기",
  "부산 아파트 등기 법무사": "/부산부동산등기",
  "부산 매매등기 법무사": "/부산소유권이전등기",
  "부산 증여등기 법무사": "/부산증여등기",
  "부산 근저당설정 법무사": "/부산근저당설정등기",
  "부산 근저당말소 법무사": "/부산근저당말소등기",
  "부산 전세권설정 법무사": "/부산전세권설정등기",
  "부산 전세권말소 법무사": "/부산전세권말소등기",
  "부산 보존등기 법무사": "/부산신축건물보존등기",
  "부산 가등기 법무사": "/부산가등기",
  "부산 법인등기 법무사": "/부산법인등기",
  "부산 법인등기": "/부산법인등기",
  "부산 법인설립 법무사": "/부산법인설립등기",
  "부산 법인설립등기": "/부산법인설립등기",
  "부산 임원변경등기 법무사": "/부산임원변경등기",
  "부산 대표이사 변경등기": "/부산임원변경등기",
  "부산 본점이전등기": "/부산본점이전등기",
  "부산 목적변경등기": "/부산사업목적변경등기",
  "부산 증자등기": "/부산유상증자등기",
  "부산 해산등기": "/부산법인해산청산등기",
  "부산 청산등기": "/부산법인해산청산등기",
  "부산 개인회생": "/부산개인회생",
  "부산 개인파산 법무사": "/부산개인파산법무사",
  "부산 개인파산": "/부산개인파산",
  "부산 회생파산 법무사": "/개인회생파산",
  "부산 파산면책": "/부산개인파산",
  "부산 개인회생 비용": "/개인회생비용",
  "부산 개인파산 비용": "/개인파산비용",
  "부산 지급명령 법무사": "/부산지방법원지급명령",
  "부산 내용증명 법무사": "/내용증명작성준비",
  "부산 임차권등기명령 법무사": "/부산임차권등기명령",
  "부산 가압류 말소 법무사": "/부산가압류말소등기",
  "부산 개명 법무사": "/부산개명허가",
  "해운대구 법무사": "/해운대법무사",
  "만덕동 법무사": "/북구법무사",
  "부산 특별한정승인 법무사": "/특별한정승인",
  "부산 부동산등기": "/부산부동산등기",
  "부산 매매등기 법무사": "/부산소유권이전등기",
  "부산 등기전문 법무사": "/부산등기법무사",
  "부산 법무사 수수료": "/부산법무사비용",
  "부산 법무사 보수": "/부산법무사비용",
};

const CLUSTER_SIMILARITY: string[][] = [
  ["/", "/부산법무사", "/부산법무사상담", "/부산법무사추천", "/부산법무사비용"],
  ["/상속", "/부산상속법무사", "/부산상속등기", "/부산상속포기", "/부산한정승인", "/전국상속등기", "/services/inheritance-registration"],
  ["/부산법인법무사", "/부산법인등기", "/법인등기", "/services/corporate-registration"],
  ["/부산개인회생", "/부산개인회생법무사", "/개인회생파산", "/services/personal-rehabilitation"],
  ["/부산부동산등기", "/부산소유권이전등기", "/부산증여등기", "/부산근저당말소등기"],
];

function csvEscape(value: string | number | boolean): string {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}
function csvRow(cells: Array<string | number | boolean>): string {
  return cells.map(csvEscape).join(",");
}
function compact(s: string): string {
  return s.replace(/\s+/g, "");
}
function fingerprint(parts: string[]): string {
  return crypto.createHash("sha256").update(parts.join("\n")).digest("hex").slice(0, 16);
}
function wordCount(text: string): number {
  return text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
}
function titlePrimary(title: string): string {
  return title.split("|")[0]?.split("｜")[0]?.trim() ?? title.trim();
}

function outgoing(page: PageData) {
  const links: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  const push = (href: string, label: string) => {
    const key = `${href.split("?")[0]}||${label}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ href: href.split("?")[0] ?? href, label });
  };
  for (const link of page.internalLinks) push(link.href, link.label);
  for (const link of page.relatedLinks) push(link.href, link.label);
  for (const section of page.sections) {
    for (const link of section.links ?? []) push(link.href, link.label);
  }
  return links;
}

function mainBody(page: PageData): string {
  return [
    page.intro,
    ...page.introParagraphs,
    ...page.sections.map((s) => [s.title, s.body, ...(s.items ?? [])].join(" ")),
    ...page.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join("\n");
}

function clusterOf(path: string): string {
  if (path === "/") return "core-home";
  if (/상속|한정승인|대습/.test(path)) return "inheritance";
  if (/법인|설립|임원|본점|목적|증자|해산|청산/.test(path)) return "corporate";
  if (/회생|파산/.test(path)) return "rehab";
  if (/부동산|소유권|증여|근저당|전세|보존|가등기|매매/.test(path)) return "real-estate";
  if (/법무사$/.test(path) && /구|동|센텀|서면|해운대|기장/.test(path)) return "local";
  if (/강의|강사|특강/.test(path)) return "lecture";
  return pageCategoryFallback(path);
}
function pageCategoryFallback(path: string): string {
  if (path.startsWith("/services/")) return "service";
  if (path.startsWith("/glossary")) return "glossary";
  return "other";
}

function slugGuess(keyword: string): string {
  return `/${keyword.replace(/\s+/g, "")}`;
}

type MapFile = {
  queries?: Record<string, { owner?: string; aliasOf?: string }>;
  owners?: Record<string, string>;
};

function loadExistingOwners(): Record<string, string> {
  const out: Record<string, string> = { ...EXTRA_OWNERS };
  const files = [
    path.join(ROOT, "seo/keyword-map.json"),
    path.join(ROOT, "seo/final/keyword-owner-map.json"),
    path.join(ROOT, "seo/inheritance/keyword-owner-map.json"),
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as MapFile;
    if (data.queries) {
      for (const [q, row] of Object.entries(data.queries)) {
        const alias = row.aliasOf ? data.queries[row.aliasOf]?.owner : undefined;
        out[q] = alias || row.owner || out[q];
      }
    }
    if (data.owners) Object.assign(out, data.owners);
  }
  return out;
}

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
}
function jaccard(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function scorePage(page: PageData, query: string): number {
  const hay = `${page.metaTitle}\n${page.h1}\n${page.intro}\n${page.introParagraphs.slice(0, 2).join(" ")}`;
  const qc = compact(query);
  let n = 0;
  if (compact(hay).includes(qc)) n += 80;
  if (compact(page.metaTitle).includes(qc) || compact(titlePrimary(page.metaTitle)).includes(qc)) n += 40;
  if (compact(page.h1).includes(qc)) n += 30;
  const slug = compact(page.path.replace(/^\//, ""));
  if (slug && qc.includes(slug)) n += 20;
  for (const token of query.split(/\s+/).filter((t) => t.length > 1)) {
    n += Math.min(hay.split(token).length - 1, 8) * 3;
  }
  if (page.path === "/" && query === "부산 법무사") n += 80;
  return n;
}

function writeCsv(file: string, rows: string[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${rows.join("\n")}\n`, "utf8");
}

function main() {
  fs.mkdirSync(BEFORE, { recursive: true });
  fs.mkdirSync(MASTER, { recursive: true });

  const all = getAllPageData();
  const byPath = new Map(all.map((p) => [p.path, p]));
  const indexable = all.filter((p) => isIndexablePagePath(p.path));

  const incoming = new Map<string, { from: string; label: string }[]>();
  for (const source of all) {
    for (const link of outgoing(source)) {
      if (!incoming.has(link.href)) incoming.set(link.href, []);
      incoming.get(link.href)!.push({ from: source.path, label: link.label });
    }
  }

  const routeRows = ["url,status,canonical,robots,sitemap,primary_query,secondary_queries,topic_cluster"];
  const metaRows = ["url,title,description,H1"];
  const headingRows = ["url,H1,main_H2"];
  const linkRows = ["url,incoming_links,incoming_anchor_texts,outgoing_links"];
  const indexRows = ["url,indexable,robots,canonical,sitemap"];
  const fpRows = ["url,first_500,main_body_word_count,fingerprint"];
  const schemaRows = ["url,schema"];

  for (const page of all.sort((a, b) => a.path.localeCompare(b.path, "ko"))) {
    const indexableFlag = isIndexablePagePath(page.path);
    const robots = isNoIndexPath(page.path) ? "noindex,follow" : "index,follow";
    const canonical = resolveCanonicalPath(page.path);
    const body = mainBody(page);
    const fp = fingerprint([page.path, page.metaTitle, page.h1, body.slice(0, 2500)]);
    const inLinks = incoming.get(page.path) ?? [];
    const out = outgoing(page);
    let schema = "";
    try {
      schema = buildJsonLdForPageData(page)
        .map((row) => String(row["@type"] ?? ""))
        .filter(Boolean)
        .join("|");
    } catch {
      schema = "";
    }
    const h2 = page.sections
      .map((s) => s.title)
      .filter(Boolean)
      .slice(0, 8)
      .join(" | ");

    routeRows.push(
      csvRow([
        page.path,
        200,
        canonical,
        robots,
        indexableFlag,
        page.primaryKeywords[0] ?? titlePrimary(page.metaTitle),
        page.primaryKeywords.slice(1, 6).join("|"),
        clusterOf(page.path),
      ]),
    );
    metaRows.push(csvRow([page.path, page.metaTitle || page.title, page.metaDescription, page.h1]));
    headingRows.push(csvRow([page.path, page.h1, h2]));
    linkRows.push(
      csvRow([
        page.path,
        inLinks.length,
        inLinks
          .slice(0, 20)
          .map((r) => `${r.from}→${r.label}`)
          .join(" | "),
        out
          .slice(0, 20)
          .map((r) => `${r.label} (${r.href})`)
          .join(" | "),
      ]),
    );
    indexRows.push(csvRow([page.path, indexableFlag, robots, canonical, indexableFlag]));
    fpRows.push(csvRow([page.path, body.replace(/\s+/g, " ").slice(0, 500), wordCount(body), fp]));
    schemaRows.push(csvRow([page.path, schema]));
  }

  writeCsv(path.join(BEFORE, "routes.csv"), routeRows);
  writeCsv(path.join(BEFORE, "metadata.csv"), metaRows);
  writeCsv(path.join(BEFORE, "headings.csv"), headingRows);
  writeCsv(path.join(BEFORE, "internal-links.csv"), linkRows);
  writeCsv(path.join(BEFORE, "indexability.csv"), indexRows);
  writeCsv(path.join(BEFORE, "content-fingerprint.csv"), fpRows);
  writeCsv(path.join(BEFORE, "schema.csv"), schemaRows);

  const existingOwners = loadExistingOwners();
  const universe = new Map<string, { keyword: string; cluster: string; source: string }>();
  for (const seed of SEEDS) universe.set(seed.keyword, { ...seed, source: "seed" });
  for (const q of Object.keys(existingOwners)) {
    if (!universe.has(q)) universe.set(q, { keyword: q, cluster: "mapped", source: "keyword-map" });
  }
  for (const page of indexable) {
    const fromTitle = titlePrimary(page.metaTitle || page.title);
    if (fromTitle.includes("법무사") || fromTitle.includes("등기") || fromTitle.includes("상속")) {
      if (!universe.has(fromTitle)) {
        universe.set(fromTitle, { keyword: fromTitle, cluster: clusterOf(page.path), source: "title" });
      }
    }
  }

  const ownerMap: Record<string, { owner: string; cluster: string; source: string; resolved: boolean }> = {};
  const collisions: string[] = [];

  for (const item of universe.values()) {
    let owner = existingOwners[item.keyword] ?? "";
    if (!owner) {
      const guess = slugGuess(item.keyword);
      if (byPath.has(guess) && isIndexablePagePath(guess)) owner = guess;
    }
    if (!owner) {
      const ranked = indexable
        .map((p) => ({ path: p.path, score: scorePage(p, item.keyword) }))
        .sort((a, b) => b.score - a.score);
      if ((ranked[0]?.score ?? 0) >= 80) owner = ranked[0]!.path;
    }
    const resolved = Boolean(owner && byPath.has(owner));
    if (owner && isNoIndexPath(owner)) {
      collisions.push(`${item.keyword} owner ${owner} is noindex`);
    }
    ownerMap[item.keyword] = {
      owner: resolved ? owner : "",
      cluster: item.cluster,
      source: item.source,
      resolved,
    };
  }

  const ownerToQueries = new Map<string, string[]>();
  for (const [q, row] of Object.entries(ownerMap)) {
    if (!row.owner) continue;
    if (!ownerToQueries.has(row.owner)) ownerToQueries.set(row.owner, []);
    ownerToQueries.get(row.owner)!.push(q);
  }

  const cannibalRows = ["query_a,query_b,owner_a,owner_b,reason"];
  const semanticGroups = [
    ["부산 상속 법무사", "부산 상속전문 법무사", "부산 법무사 상속"],
    ["해운대 법무사", "해운대구 법무사", "부산 해운대 법무사"],
    ["센텀 법무사", "센텀시티 법무사"],
    ["기장 법무사", "기장군 법무사", "부산 기장군 법무사"],
    ["부산 법인 법무사", "부산 법인등기 법무사"],
    ["부산 법무사 비용", "부산 법무사 수수료", "부산 법무사 보수"],
  ];
  for (const group of semanticGroups) {
    const owners = [...new Set(group.map((q) => ownerMap[q]?.owner).filter(Boolean))];
    if (owners.length > 1) {
      cannibalRows.push(csvRow([group[0]!, group[1] ?? "", owners[0]!, owners[1]!, "semantic-group-multiple-owners"]));
    }
  }

  const titleOwners = new Map<string, string[]>();
  for (const page of indexable) {
    const key = compact(titlePrimary(page.metaTitle || page.title));
    if (!key || key.length < 6) continue;
    if (!titleOwners.has(key)) titleOwners.set(key, []);
    titleOwners.get(key)!.push(page.path);
  }
  for (const [title, urls] of titleOwners) {
    const unique = [...new Set(urls)];
    if (unique.length > 1) {
      cannibalRows.push(csvRow([title, "", unique[0]!, unique[1]!, `duplicate-title:${unique.length}`]));
    }
  }

  const obsRows = [
    "keyword,cluster,expected_owner,naver_pc_rank,naver_mobile_rank,top5_pc,top5_mobile,observed_date,observation_method,confidence,competitor_urls,notes,status",
  ];
  const statusRows = ["keyword,cluster,owner,status,internal_rank1,internal_score,gap_score,priority"];
  const top5Gap = ["keyword,owner,status,intent_match,owner_clarity,uniqueness_note,internal_authority,priority"];
  const intentTop: string[] = ["query,rank,url,score,expected_owner,pass"];

  const candidatePool = indexable.filter((p) => {
    const c = clusterOf(p.path);
    return (
      p.path === "/" ||
      c !== "other" ||
      /법무사|등기|상속|회생|파산|상담|추천|비용/.test(p.path)
    );
  });

  for (const seed of SEEDS) {
    const owner = ownerMap[seed.keyword]?.owner ?? "";
    const ranked = candidatePool
      .map((p) => ({ path: p.path, score: scorePage(p, seed.keyword) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    const top = ranked[0];
    const pass = Boolean(owner && top?.path === owner);
    ranked.forEach((row, i) => {
      intentTop.push(csvRow([seed.keyword, i + 1, row.path, row.score, owner, pass]));
    });
    const inCount = owner ? (incoming.get(owner)?.length ?? 0) : 0;
    const intentMatch = pass ? 15 : top && owner ? 8 : 0;
    const ownerClarity = owner && !isNoIndexPath(owner) ? 15 : 0;
    const authority = Math.min(10, Math.round(inCount / 40));
    const tech = owner && byPath.has(owner) && isIndexablePagePath(owner) ? 10 : 0;
    const gap = intentMatch + ownerClarity + authority + tech + 5 + 5;
    obsRows.push(
      csvRow([
        seed.keyword,
        seed.cluster,
        owner,
        "",
        "",
        "",
        "",
        "2026-09-03",
        "no-serp-crawl",
        "none",
        "",
        "네이버 SERP 자동수집 없음. 순위를 추정하지 않음.",
        "SERP_UNVERIFIED",
      ]),
    );
    const money = /상담|비용|수수료|신청|등기|말소|설정|포기|한정승인|설립|변경|회생|파산|법무사/.test(seed.keyword);
    const priority = !pass ? 1 : money ? 2 : 3;
    statusRows.push(csvRow([seed.keyword, seed.cluster, owner, "SERP_UNVERIFIED", top?.path ?? "", top?.score ?? 0, gap, priority]));
    top5Gap.push(
      csvRow([
        seed.keyword,
        owner,
        "SERP_UNVERIFIED",
        pass ? "internal-owner-1" : "internal-owner-mismatch-or-weak",
        ownerClarity,
        "",
        inCount,
        money && !pass ? "P1-internal" : "observe",
      ]),
    );
  }

  const qualityFlags: string[] = ["url,issue"];
  for (const page of all) {
    const blob = mainBody(page);
    if (blob.includes("부산 부산")) qualityFlags.push(csvRow([page.path, "부산 부산"]));
    if (blob.includes("톡톡톡톡")) qualityFlags.push(csvRow([page.path, "톡톡톡톡"]));
    if (/검색어에/.test(blob)) qualityFlags.push(csvRow([page.path, "검색어에"]));
    if (/로 검색한 경우/.test(blob)) qualityFlags.push(csvRow([page.path, "로 검색한 경우"]));
    if (/검색어 연결/.test(blob)) qualityFlags.push(csvRow([page.path, "검색어 연결"]));
  }

  const simRows = ["page_a,page_b,raw_similarity"];
  for (const group of CLUSTER_SIMILARITY) {
    const blobs = group.map((p) => {
      const page = byPath.get(p);
      return { path: p, body: page ? mainBody(page) : "" };
    });
    for (let i = 0; i < blobs.length; i += 1) {
      for (let j = i + 1; j < blobs.length; j += 1) {
        simRows.push(csvRow([blobs[i]!.path, blobs[j]!.path, jaccard(blobs[i]!.body, blobs[j]!.body).toFixed(4)]));
      }
    }
  }

  const regressionRows = ["url,title,h1,canonical,robots,incoming,fingerprint"];
  const protectedPaths = [
    "/",
    "/부산법무사상담",
    "/부산법무사추천",
    "/부산법무사비용",
    "/부산상속법무사",
    "/부산상속등기",
    "/부산상속포기",
    "/부산한정승인",
    "/부산등기법무사",
    "/부산법인법무사",
    "/부산법인등기",
    "/부산개인회생법무사",
    "/연제구법무사",
    "/센텀법무사",
    "/해운대법무사",
    "/강의문의",
  ];
  for (const p of protectedPaths) {
    const page = byPath.get(p);
    if (!page) {
      regressionRows.push(csvRow([p, "MISSING", "", "", "", 0, ""]));
      continue;
    }
    regressionRows.push(
      csvRow([
        p,
        page.metaTitle,
        page.h1,
        resolveCanonicalPath(p),
        isNoIndexPath(p) ? "noindex" : "index",
        incoming.get(p)?.length ?? 0,
        fingerprint([p, page.metaTitle, page.h1]),
      ]),
    );
  }

  writeCsv(path.join(MASTER, "naver-top5-observation.csv"), obsRows);
  writeCsv(path.join(MASTER, "keyword-status.csv"), statusRows);
  writeCsv(path.join(MASTER, "top5-gap.csv"), top5Gap);
  writeCsv(path.join(MASTER, "cannibalization.csv"), cannibalRows);
  writeCsv(path.join(MASTER, "content-similarity.csv"), simRows);
  writeCsv(path.join(MASTER, "regression.csv"), regressionRows);
  writeCsv(path.join(MASTER, "quality-flags.csv"), qualityFlags);
  writeCsv(path.join(MASTER, "internal-intent-top5.csv"), ["query,rank,url,score,expected_owner,pass", ...intentTop.slice(1)]);

  fs.writeFileSync(
    path.join(MASTER, "keyword-owner-map.json"),
    JSON.stringify(
      {
        updated: "2026-09-03",
        note: "SERP_UNVERIFIED. PRIMARY owner는 indexable URL 하나. 순위를 만들지 않음.",
        owners: Object.fromEntries(
          Object.entries(ownerMap)
            .filter(([, v]) => v.owner)
            .map(([k, v]) => [k, v.owner]),
        ),
        unresolved: Object.entries(ownerMap)
          .filter(([, v]) => !v.owner)
          .map(([k]) => k),
        warnings: collisions,
      },
      null,
      2,
    ),
    "utf8",
  );

  const tracker = [
    "keyword,owner,baseline_pc_rank,baseline_mobile_rank,baseline_impressions,baseline_clicks,baseline_ctr,day14,day30,day60,day90,notes",
  ];
  for (const seed of SEEDS) {
    tracker.push(csvRow([seed.keyword, ownerMap[seed.keyword]?.owner ?? "", "", "", "", "", "", "", "", "", "", "PERFORMANCE_UNKNOWN"]));
  }
  writeCsv(path.join(MASTER, "naver-ranking-tracker.csv"), tracker);

  const manualRank = [
    "keyword,pc_rank,mobile_rank,observed_date,owner_url_shown",
    ...SEEDS.map((s) => csvRow([s.keyword, "", "", "", ownerMap[s.keyword]?.owner ?? ""])),
  ];
  writeCsv(path.join(ROOT, "seo/manual-rank-input.csv"), manualRank);

  const intentFails = intentTop.filter((row) => row.endsWith(",false")).length;
  const intentPass = intentTop.filter((row) => row.endsWith(",true")).length;
  const unresolvedOwners = Object.entries(ownerMap).filter(([, v]) => !v.owner).map(([k]) => k);
  const releaseBlocked = unresolvedOwners.length > 0;
  const releaseStatus = releaseBlocked
    ? "SEO_RELEASE_BLOCKED"
    : qualityFlags.length > 5 || intentFails > 0
      ? "SEO_RELEASE_READY_WITH_WARNINGS"
      : "SEO_RELEASE_READY";

  const summary = {
    generatedAt: new Date().toISOString(),
    pageCount: all.length,
    indexable: indexable.length,
    universeSize: universe.size,
    seedCount: SEEDS.length,
    serpStatus: "SERP_UNVERIFIED",
    searchAdvisor: "PERFORMANCE_UNKNOWN",
    cannibalizationRows: cannibalRows.length - 1,
    qualityFlags: qualityFlags.length - 1,
    unresolvedOwners,
    internalIntentPass: intentPass,
    internalIntentFail: intentFails,
    releaseStatus,
    kvSeoSeparation: "public HTML static; Functions /api/* only",
  };
  fs.writeFileSync(path.join(MASTER, "audit-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main();
