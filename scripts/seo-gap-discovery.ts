/**
 * SEO Content Gap Discovery — Phase 1~9 artifacts → seo-gap-audit/
 * Run: npx tsx scripts/seo-gap-discovery.ts
 *
 * Does NOT create new URLs. Analysis only (+ quality signal flags).
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import type { PageData } from "../src/lib/pageData/types";
import { getSeoLandingSlugOverlay } from "../src/data/seo/region-service-overlays";
import { buildSeoLandingSpecs } from "../src/lib/seo-landing/combinations";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo-gap-audit");
const LOCAL_OUT = path.join(ROOT, "out");

function csvEscape(v: string | number | boolean | undefined | null): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(file: string, headers: string[], rows: (string | number | boolean)[][]) {
  const lines = [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))];
  fs.writeFileSync(path.join(OUT, file), lines.join("\n") + "\n", "utf8");
}

function resolveHtml(routePath: string): string | null {
  if (routePath === "/") {
    const p = path.join(LOCAL_OUT, "index.html");
    return fs.existsSync(p) ? p : null;
  }
  const slug = routePath.replace(/^\//, "");
  const flat = path.join(LOCAL_OUT, `${slug}.html`);
  if (fs.existsSync(flat)) return flat;
  const nested = path.join(LOCAL_OUT, slug, "index.html");
  if (fs.existsSync(nested)) return nested;
  return null;
}

function extractTag(html: string, tag: string): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
}

function extractMeta(html: string, name: string, attr = "name"): string {
  const re = new RegExp(
    `<meta[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`,
    "i",
  );
  return html.match(re2)?.[1] ?? "";
}

function extractCanonical(html: string): string {
  const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return m?.[1] ?? "";
}

function wordCount(text: string): number {
  return text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
}

function classifyTopic(page: PageData): {
  primaryTopic: string;
  region: string;
  service: string;
  intent: string;
} {
  const blob = `${page.path} ${page.title} ${page.h1} ${page.primaryKeywords.join(" ")}`;
  let primaryTopic = page.category;
  if (/상속|한정승인|포기|유언|대습/.test(blob)) primaryTopic = "inheritance";
  else if (/법인|임원|설립|증자|해산|청산|정관|본점/.test(blob)) primaryTopic = "corporate";
  else if (/부동산|소유권|매매|증여|근저당|전세|보존|등기/.test(blob) && !/법인/.test(blob))
    primaryTopic = "real-estate";
  else if (/회생|파산|면책/.test(blob)) primaryTopic = "insolvency";
  else if (/전세사기|임차|보증금/.test(blob)) primaryTopic = "tenancy";
  else if (/강의|강사|특강|교육/.test(blob)) primaryTopic = "lecture";
  else if (/상담|추천|비용|후기|법무사/.test(blob) && page.category === "core")
    primaryTopic = "brand";
  else if (/지급명령|가압류|공탁|채권|내용증명/.test(blob)) primaryTopic = "civil-debt";
  else if (/개명|후견|가족관계|특별대리|부재자/.test(blob)) primaryTopic = "status";

  const regionMatch = blob.match(
    /(부산|해운대|센텀|수영|동래|부산진|남구|북구|중구|서구|동구|사상|사하|금정|강서|영도|기장|연제|명지|재송|서면)[가-힣]*/,
  );
  const region = regionMatch?.[1] ?? (page.path.includes("부산") ? "부산" : "");

  let service = page.serviceSlug ?? "";
  if (!service) {
    if (primaryTopic === "inheritance") service = "inheritance";
    else if (primaryTopic === "corporate") service = "corporate";
    else if (primaryTopic === "real-estate") service = "real-estate";
  }

  let intent = "informational";
  if (/추천|비교/.test(blob)) intent = "selection";
  else if (/상담|문의/.test(blob)) intent = "consult";
  else if (/비용|수임|보수|가격/.test(blob)) intent = "cost";
  else if (/서류|준비/.test(blob)) intent = "documents";
  else if (/법무사|대행|신청/.test(blob)) intent = "commercial";

  return { primaryTopic, region, service, intent };
}

function findPaths(pages: PageData[], needles: string[]): string[] {
  const hits: string[] = [];
  for (const p of pages) {
    const blob = `${p.path} ${p.title} ${p.h1} ${p.metaTitle} ${p.primaryKeywords.join(" ")}`;
    if (needles.some((n) => blob.includes(n))) hits.push(p.path);
  }
  return [...new Set(hits)];
}

type CoverageLevel = "STRONG" | "PARTIAL" | "WEAK" | "NO";

type GapDecision =
  | "COVERED"
  | "UNDER-OPTIMIZED"
  | "CANNIBALIZED"
  | "TRUE GAP"
  | "OUT OF SCOPE"
  | "WATCHLIST";

function decideGap(
  query: string,
  paths: string[],
  scopeOk: boolean,
): { decision: GapDecision; currentUrl: string; notes: string } {
  if (!scopeOk) {
    return { decision: "OUT OF SCOPE", currentUrl: "", notes: "법무사 범위·사이트 성격 외" };
  }
  if (paths.length >= 3) {
    return {
      decision: "CANNIBALIZED",
      currentUrl: paths[0]!,
      notes: `경쟁 URL ${paths.length}개: ${paths.slice(0, 5).join(" ")}`,
    };
  }
  if (paths.length === 1) {
    return {
      decision: "UNDER-OPTIMIZED",
      currentUrl: paths[0]!,
      notes: "대표 후보 1개 — 강화 검토",
    };
  }
  if (paths.length === 2) {
    return {
      decision: "CANNIBALIZED",
      currentUrl: paths[0]!,
      notes: `2개 경쟁: ${paths.join(" ")} — ownership 정리`,
    };
  }
  // no path — true gap or watchlist for weak evidence
  const weakEvidence = /미국 시민권|일본인|에코델타|지식산업센터|스타트업/.test(query);
  if (weakEvidence) {
    return {
      decision: "WATCHLIST",
      currentUrl: "",
      notes: "SEARCH VOLUME: UNKNOWN — 수요 근거 약함",
    };
  }
  return {
    decision: "TRUE GAP",
    currentUrl: "",
    notes: "적합한 기존 URL 미발견 — 신규 검토 가능(7조건 재검증)",
  };
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const pages = getAllPageData();
  const indexable = pages.filter((p) => isIndexablePagePath(p.path));
  const byPath = new Map(pages.map((p) => [p.path, p]));

  // ——— Phase 1 inventory ———
  const invRows: (string | number | boolean)[][] = [];
  for (const p of pages) {
    const c = classifyTopic(p);
    const h2 = p.sections.map((s) => s.title).join(" | ");
    invRows.push([
      p.path,
      p.category,
      p.metaTitle || p.title,
      p.metaDescription,
      p.h1,
      h2.slice(0, 400),
      c.primaryTopic,
      c.region,
      c.service,
      c.intent,
      isIndexablePagePath(p.path),
      "", // canonical filled in crawl when available
      isIndexablePagePath(p.path),
    ]);
  }
  writeCsv(
    "01-all-routes.csv",
    [
      "URL",
      "TYPE",
      "TITLE",
      "DESCRIPTION",
      "H1",
      "H2",
      "PRIMARY_TOPIC",
      "REGION",
      "SERVICE",
      "INTENT",
      "INDEXABLE",
      "CANONICAL",
      "SITEMAP",
    ],
    invRows,
  );
  fs.writeFileSync(
    path.join(OUT, "01-all-routes-summary.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: pages.length,
        indexable: indexable.length,
        byCategory: Object.fromEntries(
          [...new Set(pages.map((p) => p.category))].map((c) => [
            c,
            pages.filter((p) => p.category === c).length,
          ]),
        ),
      },
      null,
      2,
    ),
    "utf8",
  );

  // ——— Phase 2 crawl out/ ———
  const crawlTargets = [
    ...indexable.map((p) => p.path),
  ];
  const crawlRows: (string | number | boolean)[][] = [];
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  let crawled = 0;
  let missingHtml = 0;
  const qualityFlags: string[] = [];

  for (const route of crawlTargets) {
    const file = resolveHtml(route);
    if (!file) {
      missingHtml += 1;
      continue;
    }
    crawled += 1;
    const html = fs.readFileSync(file, "utf8");
    const title = extractTag(html, "title");
    const desc = extractMeta(html, "description");
    const og = extractMeta(html, "og:title", "property");
    const h1 = extractTag(html, "h1");
    const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    );
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const first300 = text.slice(0, 300);
    const canonical = extractCanonical(html);
    const robots = extractMeta(html, "robots");
    const h1Count = (html.match(/<h1\b/gi) || []).length;

    if (title) {
      const list = titleMap.get(title) ?? [];
      list.push(route);
      titleMap.set(title, list);
    }
    if (desc) {
      const list = descMap.get(desc) ?? [];
      list.push(route);
      descMap.set(desc, list);
    }

    // quality signals
    if (/부산\s*부산|해운대\s*해운대|법무사\s*법무사\s*법무사/.test(text)) {
      qualityFlags.push(`${route}\tdouble-token`);
    }
    if (h1Count !== 1) qualityFlags.push(`${route}\th1-count=${h1Count}`);
    const h2Dup = h2s.filter((h, i) => h2s.indexOf(h) !== i);
    if (h2Dup.length) qualityFlags.push(`${route}\tduplicate-h2:${h2Dup[0]}`);

    crawlRows.push([
      route,
      200,
      title,
      desc,
      og,
      h1,
      h2s.slice(0, 8).join(" | "),
      first300,
      wordCount(text),
      canonical,
      robots,
      h1Count,
      (html.match(/application\/ld\+json/gi) || []).length,
    ]);
  }
  writeCsv(
    "01b-production-crawl-local-out.csv",
    [
      "URL",
      "HTTP",
      "TITLE",
      "DESCRIPTION",
      "OG_TITLE",
      "H1",
      "H2",
      "FIRST_300",
      "WORD_COUNT",
      "CANONICAL",
      "ROBOTS",
      "H1_COUNT",
      "JSONLD_BLOCKS",
    ],
    crawlRows,
  );

  // ——— Phase 3 duplicates ———
  const simRows: (string | number | boolean)[][] = [];
  for (const [title, urls] of titleMap) {
    if (urls.length > 1) {
      simRows.push(["title-dup", title.slice(0, 120), urls.length, urls.slice(0, 8).join(" ")]);
    }
  }
  for (const [desc, urls] of descMap) {
    if (urls.length > 1 && desc.length > 20) {
      simRows.push(["desc-dup", desc.slice(0, 120), urls.length, urls.slice(0, 8).join(" ")]);
    }
  }
  for (const flag of qualityFlags.slice(0, 200)) {
    const [url, reason] = flag.split("\t");
    simRows.push(["quality", reason ?? "", 1, url ?? ""]);
  }

  // generator: region-service without slug overlay
  const specs = buildSeoLandingSpecs();
  let thinGenerator = 0;
  for (const s of specs) {
    if (s.type !== "region-service" && s.type !== "service-intent") continue;
    if (getSeoLandingSlugOverlay(s.slug)) continue;
    thinGenerator += 1;
  }
  simRows.push([
    "generator-thin",
    "region-service/service-intent without hand overlay",
    thinGenerator,
    "see seo-landing combinations",
  ]);
  writeCsv(
    "04-content-similarity.csv",
    ["SIGNAL", "VALUE", "COUNT", "URLS"],
    simRows,
  );

  // ——— Phase 5 coverage map ———
  const clusters: Array<{
    cluster: string;
    queries: string[];
  }> = [
    {
      cluster: "A.BRAND",
      queries: [
        "부산 법무사",
        "부산 법무사 추천",
        "부산 법무사 상담",
        "부산 법무사 비용",
        "부산 법무사 후기",
        "부산 법무사 사무소",
        "부산 법무사 방문",
        "부산 법무사 근처",
      ],
    },
    {
      cluster: "B.INHERITANCE",
      queries: [
        "부산 상속",
        "부산 상속등기",
        "부산 상속포기",
        "부산 한정승인",
        "상속재산분할",
        "대습상속",
        "유언",
        "해외상속인",
        "미성년상속",
        "상속재산관리인",
        "유언검인",
      ],
    },
    {
      cluster: "C.REAL_ESTATE",
      queries: [
        "소유권이전",
        "매매등기",
        "증여등기",
        "보존등기",
        "근저당",
        "전세권",
        "가등기",
        "신탁등기",
        "지분이전등기",
        "외국인 부동산등기",
      ],
    },
    {
      cluster: "D.CORPORATE",
      queries: [
        "법인설립",
        "임원변경",
        "본점이전",
        "목적변경",
        "증자",
        "감자",
        "해산",
        "청산",
        "지점설치",
        "상호변경",
        "법인등기 과태료",
      ],
    },
    {
      cluster: "E.CIVIL_DEBT",
      queries: [
        "지급명령",
        "내용증명",
        "가압류",
        "채권압류",
        "추심명령",
        "재산명시",
        "공탁",
        "변제공탁",
      ],
    },
    {
      cluster: "F.STATUS",
      queries: [
        "개명",
        "성년후견",
        "한정후견",
        "가족관계등록",
        "특별대리인",
        "부재자재산관리인",
      ],
    },
    {
      cluster: "G.INSOLVENCY",
      queries: ["개인회생", "개인파산", "면책"],
    },
    {
      cluster: "H.TENANCY",
      queries: ["전세사기", "보증금 미반환", "임차권등기명령", "전세권"],
    },
    {
      cluster: "I.SPECIAL_REG",
      queries: ["선박등기", "공장 등기", "창고 등기", "집합건물", "재개발 등기", "재건축 등기"],
    },
    {
      cluster: "J.B2B",
      queries: ["복대리", "집단등기", "공인중개사", "촉탁등기", "공공기관 등기", "법률강의"],
    },
  ];

  const coverageRows: (string | number | boolean)[][] = [];
  for (const c of clusters) {
    for (const q of c.queries) {
      const hits = findPaths(pages, q.split(/\s+/).filter(Boolean).concat([q.replace(/\s/g, "")]));
      // refine: prefer includes full meaningful token
      const refined = findPaths(pages, [q.replace(/\s/g, ""), ...q.split(/\s+/).filter((t) => t.length > 1)]);
      const urls = refined.length ? refined : hits;
      let level: CoverageLevel = "NO";
      if (urls.length >= 3) level = "STRONG";
      else if (urls.length === 2) level = "PARTIAL";
      else if (urls.length === 1) level = "WEAK";
      // brand champions known strong
      if (c.cluster === "A.BRAND" && /법무사$|추천|상담|비용/.test(q) && urls.length >= 1)
        level = urls.length >= 1 ? "STRONG" : level;
      if (c.cluster === "B.INHERITANCE" && /상속등기|상속포기|한정승인/.test(q) && urls.length >= 1)
        level = "STRONG";
      if (c.cluster === "G.INSOLVENCY" && urls.length >= 1) level = "STRONG";
      coverageRows.push([c.cluster, q, level, urls.length, urls.slice(0, 6).join(" ")]);
    }
  }
  writeCsv(
    "03-coverage-map.csv",
    ["CLUSTER", "QUERY", "COVERAGE", "HIT_COUNT", "URLS"],
    coverageRows,
  );

  // ——— Phase 6–9 keyword universe + true gap ———
  const universe: Array<{
    query: string;
    cluster: string;
    intent: string;
    scopeOk: boolean;
  }> = [];

  const add = (query: string, cluster: string, intent: string, scopeOk = true) => {
    universe.push({ query, cluster, intent, scopeOk });
  };

  // Brand
  for (const q of [
    "부산 법무사",
    "부산 법무사 추천",
    "부산 법무사 상담",
    "부산 법무사 비용",
    "부산 법무사 수임료",
    "부산 법무사 후기",
    "해운대 법무사",
    "센텀 법무사",
  ])
    add(q, "A.BRAND", "commercial");

  // Inheritance specials
  for (const q of [
    "부산 상속재산관리인",
    "부산 상속인 없는 경우",
    "부산 유언검인",
    "부산 유언증서 검인",
    "부산 미성년자 상속재산분할",
    "부산 해외상속인",
    "부산 재외국민 상속",
    "부산 미국 시민권자 상속",
    "부산 일본 거주 상속인",
    "부산 특별대리인 상속",
  ])
    add(q, "B.INHERITANCE", "commercial");

  // RE special
  for (const q of [
    "부산 가등기 법무사",
    "부산 가등기 말소",
    "부산 신탁등기 법무사",
    "부산 공동담보등기",
    "부산 지분이전등기",
    "부산 재산분할등기",
    "부산 이혼 부동산 명의변경",
    "부산 외국인 부동산등기",
    "부산 재외국민 부동산등기",
    "부산 상가 소유권이전",
    "부산 공장 등기",
    "부산 창고 등기",
    "부산 오피스 매매등기",
    "부산 토지 등기",
  ])
    add(q, "C.REAL_ESTATE", "commercial");

  // Corporate special
  for (const q of [
    "부산 법인 감자등기",
    "부산 법인 해산등기",
    "부산 법인 청산종결등기",
    "부산 지점 설치등기",
    "부산 지점 폐지등기",
    "부산 상호변경등기",
    "부산 자본금 증자",
    "부산 주식회사 임원임기",
    "부산 법인등기 과태료",
    "부산 사내이사 변경",
    "부산 1인법인 설립",
    "부산 유한회사 설립",
    "부산 법인전환 등기",
    "부산 스타트업 법인설립",
  ])
    add(q, "D.CORPORATE", "commercial");

  // Civil debt
  for (const q of [
    "부산 가압류 법무사",
    "부산 채권가압류",
    "부산 부동산가압류",
    "부산 채권압류 법무사",
    "부산 채권압류 추심명령",
    "부산 추심명령",
    "부산 통장압류",
    "부산 급여압류",
    "부산 재산명시",
    "부산 재산조회",
    "부산 지급명령 법무사",
    "부산 내용증명 법무사",
    "부산 공탁 법무사",
    "부산 변제공탁",
  ])
    add(q, "E.CIVIL_DEBT", "commercial");

  // Status
  for (const q of [
    "부산 개명 법무사",
    "부산 개명신청",
    "부산 성년후견 법무사",
    "부산 성년후견 신청",
    "부산 한정후견",
    "부산 가족관계등록 정정",
    "부산 특별대리인 선임",
    "부산 부재자재산관리인",
  ])
    add(q, "F.STATUS", "commercial");

  // Maritime / industry
  for (const q of [
    "부산 선박등기 법무사",
    "부산 선박 소유권이전",
    "부산 선박 근저당",
    "부산 해운회사 법인등기",
    "부산 물류회사 법인설립",
  ])
    add(q, "I.SPECIAL_REG", "commercial");

  // B2B
  for (const q of [
    "부산 촉탁등기",
    "부산 집단등기 법무사",
    "부산 법무사 복대리",
    "부산 공인중개사 협력 법무사",
    "부산 재개발 법무사",
    "부산 정비사업 법무사",
    "부산 공공기관 법무사",
  ])
    add(q, "J.B2B", "commercial");

  // Problem-axis expansions (meaningful, not typo variants)
  for (const q of [
    "부모님 사망 후 해야 할 일",
    "상속 빚이 많을 때",
    "빌려준 돈 안 갚을 때",
    "집주인 보증금 안 줄 때",
    "회사 임원 임기 지났을 때",
    "법인등기 과태료 나왔을 때",
    "가압류와 지급명령 차이",
    "개명 허가 가능성",
  ])
    add(q, "PROBLEM", "informational");

  // Fill to ≥100 more mid-tail without typo spam
  const districts = ["해운대", "수영", "동래", "사상", "강서", "남구", "부산진"];
  const services = ["상속등기", "부동산등기", "법인등기", "상속포기"];
  for (const d of districts) {
    for (const s of services) {
      add(`${d} ${s}`, "LOCAL_X_SERVICE", "commercial");
    }
  }

  const uniRows: (string | number | boolean)[][] = [];
  const gapRows: (string | number | boolean)[][] = [];
  const upgradeRows: (string | number | boolean)[][] = [];
  const newPageRows: (string | number | boolean)[][] = [];
  const newArticleRows: (string | number | boolean)[][] = [];
  const cannibalRows: (string | number | boolean)[][] = [];

  const seenQ = new Set<string>();
  for (const item of universe) {
    if (seenQ.has(item.query)) continue;
    seenQ.add(item.query);

    const tokens = [
      item.query.replace(/\s/g, ""),
      ...item.query.split(/\s+/).filter((t) => t.length > 1 && t !== "부산"),
    ];
    const paths = findPaths(pages, tokens);
    const { decision, currentUrl, notes } = decideGap(item.query, paths, item.scopeOk);

    // refine COVERED for exact known champions
    let finalDecision = decision;
    if (
      item.query === "부산 법무사" ||
      item.query === "부산 법무사 추천" ||
      item.query === "부산 법무사 상담"
    ) {
      finalDecision = "COVERED";
    }
    if (/수임료|가격|보수$/.test(item.query) && paths.some((p) => p.includes("비용"))) {
      finalDecision = "COVERED";
      // same intent as 비용
    }

    uniRows.push([
      item.query,
      item.cluster,
      item.intent,
      "UNKNOWN",
      paths.slice(0, 5).join(" "),
      finalDecision,
      "SERP: not auto-fetched; inventory match only",
    ]);

    gapRows.push([
      item.query,
      item.cluster,
      item.intent,
      3,
      currentUrl || paths[0] || "",
      paths.length ? (paths.length >= 2 ? "PARTIAL" : "WEAK") : "NO",
      finalDecision === "TRUE GAP",
      finalDecision === "TRUE GAP"
        ? "NEW_PAGE_CANDIDATE"
        : finalDecision === "UNDER-OPTIMIZED"
          ? "UPGRADE"
          : finalDecision === "CANNIBALIZED"
            ? "MERGE_INTENT"
            : finalDecision === "WATCHLIST"
              ? "WATCHLIST"
              : "KEEP",
      "",
      "",
      finalDecision === "TRUE GAP" ? "P2" : finalDecision === "UNDER-OPTIMIZED" ? "P1" : "P3",
      notes,
    ]);

    if (finalDecision === "UNDER-OPTIMIZED" && currentUrl) {
      upgradeRows.push([item.query, currentUrl, "Add unique H2/FAQ/situation nav", "P1", notes]);
    }
    if (finalDecision === "CANNIBALIZED") {
      cannibalRows.push([item.query, paths[0] || "", paths.slice(1, 4).join(" "), "KEEP_PRIMARY", notes]);
    }
    if (finalDecision === "TRUE GAP") {
      const isArticle = /차이|가능성|때$|후 해야/.test(item.query);
      if (isArticle) {
        newArticleRows.push([item.query, item.cluster, "ARTICLE", "", "P2", notes]);
      } else {
        newPageRows.push([item.query, item.cluster, "SERVICE_PAGE", "", "", "P2", notes]);
      }
    }
  }

  writeCsv(
    "02-keyword-universe.csv",
    ["QUERY", "CLUSTER", "INTENT", "SEARCH_VOLUME", "MATCHED_URLS", "DECISION", "EVIDENCE"],
    uniRows,
  );
  writeCsv(
    "06-true-gaps.csv",
    [
      "QUERY",
      "CLUSTER",
      "INTENT",
      "BUSAN_RELEVANCE",
      "CURRENT_URL",
      "CURRENT_COVERAGE",
      "TRUE_GAP",
      "ACTION",
      "PROPOSED_URL",
      "PARENT_HUB",
      "PRIORITY",
      "EVIDENCE",
    ],
    gapRows,
  );
  writeCsv(
    "07-upgrade-existing.csv",
    ["QUERY", "URL", "UPGRADE_HINT", "PRIORITY", "NOTES"],
    upgradeRows,
  );
  writeCsv(
    "08-new-pages.csv",
    ["QUERY", "CLUSTER", "TYPE", "PROPOSED_URL", "PARENT_HUB", "PRIORITY", "NOTES"],
    newPageRows,
  );
  writeCsv(
    "09-new-articles.csv",
    ["QUERY", "CLUSTER", "TYPE", "PARENT_HUB", "PRIORITY", "NOTES"],
    newArticleRows,
  );
  writeCsv(
    "05-cannibalization.csv",
    ["QUERY", "PRIMARY", "COMPETING", "ACTION", "NOTES"],
    cannibalRows,
  );

  // URL preservation baseline
  writeCsv(
    "11-url-preservation.csv",
    ["METRIC", "VALUE"],
    [
      ["existing_url_changed", 0],
      ["existing_url_deleted", 0],
      ["existing_url_redirect", 0],
      ["inventory_total", pages.length],
      ["inventory_indexable", indexable.length],
      ["local_out_crawled", crawled],
      ["local_out_missing_html", missingHtml],
      ["title_duplicate_groups", [...titleMap.values()].filter((u) => u.length > 1).length],
      ["desc_duplicate_groups", [...descMap.values()].filter((u) => u.length > 1).length],
      ["generator_thin_without_overlay", thinGenerator],
      ["true_gap_candidates", newPageRows.length + newArticleRows.length],
      ["upgrade_candidates", upgradeRows.length],
    ],
  );

  // Internal link sample from page data
  const linkRows: (string | number | boolean)[][] = [];
  for (const p of indexable.slice(0, 400)) {
    for (const l of p.internalLinks.slice(0, 12)) {
      linkRows.push([p.path, l.href, l.label, byPath.has(l.href)]);
    }
  }
  writeCsv(
    "10-internal-link-map.csv",
    ["FROM", "TO", "ANCHOR", "TARGET_EXISTS"],
    linkRows,
  );

  fs.writeFileSync(
    path.join(OUT, "00-phase-status.md"),
    `# SEO Gap Discovery — Phase status

Generated: ${new Date().toISOString()}

## Inventory
- Total pages: ${pages.length}
- Indexable: ${indexable.length}
- Local out crawled: ${crawled}
- Missing HTML in out/: ${missingHtml}

## Signals
- Title duplicate groups: ${[...titleMap.values()].filter((u) => u.length > 1).length}
- Description duplicate groups: ${[...descMap.values()].filter((u) => u.length > 1).length}
- Generator thin (no hand overlay): ${thinGenerator}
- Keyword universe size: ${uniRows.length}
- TRUE GAP page candidates: ${newPageRows.length}
- TRUE GAP article candidates: ${newArticleRows.length}
- Upgrade candidates: ${upgradeRows.length}

## SERP
NAVER SERP auto-fetch: **not performed** (CAPTCHA / ToS). SEARCH_VOLUME: UNKNOWN.

## Next
Manual editorial review of \`06-true-gaps.csv\` / \`08-new-pages.csv\` → Wave 1 ≤10 only after 7-condition gate.
`,
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        out: OUT,
        total: pages.length,
        indexable: indexable.length,
        crawled,
        trueGapPages: newPageRows.length,
        trueGapArticles: newArticleRows.length,
        upgrades: upgradeRows.length,
        thinGenerator,
      },
      null,
      2,
    ),
  );
}

main();
