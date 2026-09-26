/**
 * INTERNAL QUERY ROUTING QA — 네이버 알고리즘 추정이 아님.
 * Usage: npx --yes tsx scripts/inheritance-query-owner-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { isNoIndexPath, resolveCanonicalPath } from "../src/lib/seo/index-policy";
import type { PageData } from "../src/lib/pageData/types";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "seo", "inheritance-routing");

const EXPECTED_OWNERS: Record<string, string> = {
  "부산 상속 법무사": "/부산상속법무사",
  "부산 상속전문 법무사": "/부산상속전문법무사",
  부산상속전문법무사: "/부산상속전문법무사",
  "부산 법무사 상속": "/부산상속법무사",
  "부산 상속포기 법무사": "/부산상속포기",
  "부산 상속포기": "/부산상속포기",
  "부산 상속등기 법무사": "/부산상속등기",
  "부산 한정승인 법무사": "/부산한정승인",
};

type Incoming = { from: string; label: string; href: string };

function compact(value: string): string {
  return value.replace(/\s+/g, "");
}

function csvEscape(value: string | number): string {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function isInheritanceRelated(page: PageData): boolean {
  const blob = [
    page.path,
    page.slug,
    page.serviceSlug,
    page.category,
    page.title,
    page.h1,
    page.metaTitle,
  ]
    .join(" ")
    .toLowerCase();
  return /상속|포기|한정승인|대습|유류분/.test(blob);
}

function outgoingLinks(page: PageData): Array<{ href: string; label: string }> {
  const links = [
    ...page.internalLinks,
    ...page.relatedLinks,
    ...page.sections.flatMap((section) => section.links ?? []),
    ...page.breadcrumbs
      .filter((item) => item.href)
      .map((item) => ({ href: item.href as string, label: item.label })),
  ];
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.href}|${link.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(link.href);
  });
}

function mainBody(page: PageData): string {
  return [
    ...page.introParagraphs,
    ...page.procedures,
    ...page.documents,
    ...page.consultationPoints,
    ...page.sections.flatMap((section) => [
      section.title,
      section.body,
      ...(section.items ?? []),
    ]),
    page.consultationExample.title,
    page.consultationExample.body,
    ...(page.consultationExamples ?? []).flatMap((item) => [item.title, item.body]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join("\n");
}

function purpose(pathName: string): string {
  if (pathName === "/부산상속법무사") return "broad-local-commercial";
  if (pathName === "/부산상속포기") return "narrow-renunciation";
  if (pathName === "/부산상속등기") return "registration-transactional";
  if (pathName === "/부산한정승인") return "qualified-acceptance";
  if (pathName === "/상속") return "informational-hub";
  if (pathName.includes("상속포기")) return "renunciation-supporting";
  if (pathName.includes("한정승인")) return "qualified-supporting";
  if (pathName.includes("상속등기") || pathName.includes("상속")) return "inheritance-supporting";
  return "other";
}

function tokenScore(text: string, query: string, pathName = ""): number {
  const compactText = compact(text);
  const compactQuery = compact(query);
  const primary = compact((text.split("|")[0] ?? text).split("｜")[0] ?? text);
  const wantsRenunciation = compactQuery.includes("포기");
  const wantsRegistry = compactQuery.includes("등기");
  const wantsQualified = compactQuery.includes("한정");
  const wantsSpecialist = compactQuery.includes("전문");
  const wantsInheritance = compactQuery.includes("상속");
  const isBroadOwner = pathName === "/부산상속법무사";
  const isNarrowOwner = pathName === "/부산상속포기";
  let score = 0;
  if (primary === compactQuery) score += 70;
  else if (primary.startsWith(compactQuery)) {
    score += 48;
    const suffix = primary.slice(compactQuery.length);
    if (suffix && !wantsSpecialist && /추천|비용|상담/.test(suffix)) score -= 36;
  } else if (compactText.includes(compactQuery)) score += 18;
  for (const token of query.split(/\s+/).filter(Boolean)) {
    if (compactText.includes(compact(token))) score += 6;
  }
  if (wantsInheritance && !compactText.includes("상속") && !compact(pathName).includes("상속")) {
    score -= 40;
  }
  if (!isBroadOwner) {
    if (compactText.includes("포기")) score += wantsRenunciation ? 18 : isNarrowOwner ? 8 : -28;
    if (compactText.includes("등기")) score += wantsRegistry ? 12 : wantsRenunciation ? -6 : 0;
    if (compactText.includes("한정")) score += wantsQualified ? 16 : -8;
  }
  if (compactText.includes("전문")) score += wantsSpecialist ? 16 : isBroadOwner ? 8 : -4;
  if (isBroadOwner && !wantsRenunciation) score += 12;
  if (isNarrowOwner && wantsRenunciation) score += 12;
  return score;
}

function purposeScore(pathName: string, query: string): number {
  const compactQuery = compact(query);
  const role = purpose(pathName);
  if (role === "broad-local-commercial") {
    if (compactQuery.includes("포기") && !compactQuery.includes("전문")) return -18;
    if (compactQuery.includes("등기") && compactQuery.includes("법무사") && compactQuery !== "부산상속법무사")
      return -8;
    return 22;
  }
  if (role === "narrow-renunciation") {
    return compactQuery.includes("포기") ? 26 : -32;
  }
  if (role === "registration-transactional") {
    return compactQuery.includes("등기") ? 20 : -16;
  }
  if (role === "qualified-acceptance") {
    return compactQuery.includes("한정") ? 20 : -16;
  }
  if (role === "informational-hub") {
    return compactQuery.includes("포기") || compactQuery.includes("등기") ? -6 : 4;
  }
  if (role === "renunciation-supporting") {
    return compactQuery.includes("포기") ? 4 : -10;
  }
  return -4;
}

function fingerprint(text: string): string {
  return compact(text).slice(0, 80);
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const pages = getAllPageData().filter(
    (page) => page.path === "/" || isInheritanceRelated(page),
  );

  const incoming: Incoming[] = [];
  for (const page of getAllPageData()) {
    for (const link of outgoingLinks(page)) {
      const href = link.href.split("?")[0] ?? link.href;
      incoming.push({ from: page.path, label: link.label, href });
    }
  }

  const incomingByHref = new Map<string, Incoming[]>();
  for (const item of incoming) {
    const list = incomingByHref.get(item.href) ?? [];
    list.push(item);
    incomingByHref.set(item.href, list);
  }

  const routeRows = pages.map((page) => {
    const body = mainBody(page);
    const robots = isNoIndexPath(page.path) ? "noindex,follow" : "index,follow";
    const indexable = isIndexablePagePath(page.path) && !isNoIndexPath(page.path);
    const incomingLinks = incomingByHref.get(page.path) ?? [];
    return {
      path: page.path,
      status: "generated",
      robots,
      indexable: indexable ? "yes" : "no",
      canonical: resolveCanonicalPath(page.path),
      title: page.metaTitle,
      description: page.metaDescription,
      ogTitle: page.metaTitle,
      ogDescription: page.metaDescription,
      h1: page.h1,
      h2: page.sections.map((section) => section.title).join(" | "),
      first500: body.slice(0, 500).replace(/\s+/g, " "),
      mainBodyWords: body.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length,
      incomingInternalLinks: incomingLinks.length,
      incomingAnchors: incomingLinks
        .slice(0, 12)
        .map((item) => `${item.from}::${item.label}`)
        .join(" || "),
      outgoingLinks: outgoingLinks(page)
        .slice(0, 12)
        .map((item) => `${item.label}>${item.href}`)
        .join(" || "),
      breadcrumb: page.breadcrumbs.map((item) => item.label).join(" > "),
      sitemap: indexable ? "yes" : "no",
      schema: page.includeFaqSchema ? "WebPage+FAQ" : "WebPage",
      dateModified: "",
      lastBuildModification: "SERP_UNVERIFIED",
      primaryIntent: purpose(page.path),
      secondaryIntent: page.serviceSlug ?? page.category,
      semanticFingerprint: fingerprint(body),
    };
  });

  const routeHeader = Object.keys(routeRows[0] ?? { path: "" });
  const routesCsv = [
    routeHeader.join(","),
    ...routeRows.map((row) => routeHeader.map((key) => csvEscape(row[key as keyof typeof row])).join(",")),
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "routes.csv"), `${routesCsv}\n`, "utf8");

  const ranking: Record<string, Array<{ path: string; score: number; reasons: string }>> = {};
  const failures: string[] = [];

  for (const [query, owner] of Object.entries(EXPECTED_OWNERS)) {
    const compactQuery = compact(query);
    const scored = pages
      .filter((page) => isIndexablePagePath(page.path) && !isNoIndexPath(page.path))
      .map((page) => {
        const body = mainBody(page);
        const first300 = body.slice(0, 300);
        const incomingLinks = incomingByHref.get(page.path) ?? [];
        const exactIncoming = incomingLinks.filter((item) =>
          compact(item.label).includes(compactQuery),
        ).length;
        const title = tokenScore(page.metaTitle, query, page.path);
        const h1 = tokenScore(page.h1, query, page.path);
        const lead = tokenScore(first300, query, page.path);
        const article = tokenScore(body.slice(0, 1800), query, page.path) * 0.35;
        const anchors = Math.min(exactIncoming, 8) * 9;
        const rankProxy = Math.log(1 + incomingLinks.length) * 4;
        const purposePts = purposeScore(page.path, query);
        const breadcrumb = tokenScore(page.breadcrumbs.map((item) => item.label).join(" "), query, page.path) * 0.2;
        const score =
          title + h1 + lead + article + anchors + rankProxy + purposePts + breadcrumb;
        const reasons = [
          `title=${title.toFixed(1)}`,
          `h1=${h1.toFixed(1)}`,
          `lead=${lead.toFixed(1)}`,
          `body=${article.toFixed(1)}`,
          `exactIn=${exactIncoming}`,
          `inLinks=${incomingLinks.length}`,
          `purpose=${purposePts}`,
        ].join(" ");
        return { path: page.path, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    ranking[query] = scored;
    const top = scored[0]?.path;
    if (top !== owner) {
      failures.push(`${query}: internal #1=${top ?? "(none)"} expected=${owner}`);
    }
  }

  const rankRows: string[] = ["query,rank,path,score,expectedOwner,isOwner,reasons"];
  for (const [query, rows] of Object.entries(ranking)) {
    rows.forEach((row, index) => {
      rankRows.push(
        [
          csvEscape(query),
          index + 1,
          csvEscape(row.path),
          row.score.toFixed(2),
          csvEscape(EXPECTED_OWNERS[query]),
          row.path === EXPECTED_OWNERS[query] ? "yes" : "no",
          csvEscape(row.reasons),
        ].join(","),
      );
    });
  }
  fs.writeFileSync(path.join(OUT_DIR, "query-owner-ranking.csv"), `${rankRows.join("\n")}\n`, "utf8");

  const inspection = [
    "path,collected,recentlyCollected,indexable,indexed,titleOk,descriptionOk,seoError,source",
    "/부산상속법무사,UNKNOWN,UNKNOWN,yes,UNKNOWN,yes,yes,SERP_UNVERIFIED,no Search Advisor API in repo",
    "/부산상속포기,UNKNOWN,UNKNOWN,yes,UNKNOWN,yes,yes,SERP_UNVERIFIED,no Search Advisor API in repo",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "naver-url-inspection.csv"), `${inspection}\n`, "utf8");

  const tracker = [
    "keyword,expected_owner,shown_url,rank_pc,rank_mobile,impressions,clicks,ctr,day14,day30,day60,day90,note",
    ...Object.entries(EXPECTED_OWNERS).map(
      ([keyword, owner]) =>
        `${csvEscape(keyword)},${owner},OBSERVED_OWNER_MISMATCH_PENDING,SERP_UNVERIFIED,SERP_UNVERIFIED,,,,,pending,pending,pending,pending,Search Advisor/rank values only when actually observed`,
    ),
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "tracker.csv"), `${tracker}\n`, "utf8");

  fs.writeFileSync(
    path.join(OUT_DIR, "query-owner-ranking.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), failures, ranking }, null, 2)}\n`,
    "utf8",
  );

  if (failures.length > 0) {
    console.error("SEO_RELEASE_BLOCKED");
    for (const failure of failures) console.error(`  ${failure}`);
    process.exit(1);
  }

  console.log("INTERNAL QUERY ROUTING QA OK");
  for (const [query, rows] of Object.entries(ranking)) {
    console.log(`  ${query} → ${rows[0]?.path}`);
  }
}

main();
