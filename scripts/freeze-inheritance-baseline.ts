/**
 * 상속 클러스터 베이스라인 동결.
 * 실행: npx --yes tsx scripts/freeze-inheritance-baseline.ts
 *
 * HTTP status는 repository 기준(존재=200 가정)이며,
 * --fetch-production 이면 핵심 URL만 GET으로 확인한다.
 * 검색순위·impressions는 만들지 않는다.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { isNoIndexPath, resolveCanonicalPath } from "../src/lib/seo/index-policy";
import { buildJsonLdForPageData } from "../src/lib/pageData/json-ld";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo/inheritance");

const REQUIRED_PATHS = [
  "/",
  "/상속",
  "/부산상속법무사",
  "/부산상속등기",
  "/부산상속포기",
  "/부산한정승인",
  "/부산특별한정승인",
  "/services/inheritance-registration",
  "/전국상속등기",
  "/부산법무사",
  "/부산법무사상담",
  "/부산법무사추천",
];

const INHERITANCE_RE =
  /상속|한정승인|대습|재산분할|협의분할|미성년상속|해외거주상속|상속채무|사망후|사망 후|부모님사망/;

const INTENT_BY_PATH: Record<string, { primary: string; secondary: string }> = {
  "/": { primary: "부산 법무사", secondary: "office-home" },
  "/상속": { primary: "informational-pillar", secondary: "inheritance-hub" },
  "/부산상속법무사": {
    primary: "부산 상속 법무사",
    secondary: "부산 상속전문 법무사",
  },
  "/부산상속등기": { primary: "부산 상속등기 법무사", secondary: "부산 상속등기" },
  "/부산상속포기": { primary: "부산 상속포기 법무사", secondary: "부산 상속포기" },
  "/부산한정승인": { primary: "부산 한정승인 법무사", secondary: "부산 한정승인" },
  "/부산법무사상담": { primary: "부산 법무사 상담", secondary: "consult" },
  "/부산법무사추천": { primary: "부산 법무사 추천", secondary: "selection" },
  "/전국상속등기": { primary: "nationwide-registry", secondary: "supporting" },
  "/services/inheritance-registration": {
    primary: "service-detail",
    secondary: "supporting",
  },
};

function csvEscape(value: string | number | boolean): string {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function csvRow(cells: Array<string | number | boolean>): string {
  return cells.map(csvEscape).join(",");
}

function fingerprint(parts: string[]): string {
  return crypto.createHash("sha256").update(parts.join("\n")).digest("hex").slice(0, 16);
}

function wordCount(text: string): number {
  return text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
}

function collectOutgoing(page: ReturnType<typeof getAllPageData>[number]) {
  const links: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  const push = (href: string, label: string) => {
    const key = `${href}||${label}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ href, label });
  };
  for (const link of page.internalLinks) push(link.href, link.label);
  for (const link of page.relatedLinks) push(link.href, link.label);
  for (const section of page.sections) {
    for (const link of section.links ?? []) push(link.href, link.label);
  }
  return links;
}

function mainBody(page: ReturnType<typeof getAllPageData>[number]): string {
  return [
    page.intro,
    ...page.introParagraphs,
    ...page.procedures,
    ...page.documents,
    ...page.consultationPoints,
    page.consultationExample.title,
    page.consultationExample.body,
    ...page.sections.map((s) => [s.title, s.body, ...(s.items ?? [])].join(" ")),
    ...page.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join("\n");
}

function isInheritanceRelated(page: ReturnType<typeof getAllPageData>[number]): boolean {
  if (REQUIRED_PATHS.includes(page.path)) return true;
  const hay = `${page.path} ${page.slug} ${page.title} ${page.h1} ${page.intro}`;
  return INHERITANCE_RE.test(hay);
}

function schemaNames(page: ReturnType<typeof getAllPageData>[number]): string {
  try {
    return buildJsonLdForPageData(page)
      .map((row) => String(row["@type"] ?? ""))
      .filter(Boolean)
      .join("|");
  } catch {
    return "";
  }
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const all = getAllPageData();
  const pages = all.filter(isInheritanceRelated);
  const byPath = new Map(all.map((p) => [p.path, p]));

  const incoming = new Map<string, { href: string; label: string; from: string }[]>();
  for (const source of all) {
    for (const link of collectOutgoing(source)) {
      const target = link.href.split("?")[0] ?? link.href;
      if (!incoming.has(target)) incoming.set(target, []);
      incoming.get(target)!.push({
        href: target,
        label: link.label,
        from: source.path,
      });
    }
  }

  const routeRows = ["URL,HTTP status,indexable,robots,canonical,sitemap inclusion,primary intent,secondary intent,content fingerprint"];
  const metaRows = ["URL,title,description,og:title,og:description,H1,main H2,schema"];
  const linkRows = ["URL,incoming internal links,anchor texts,outgoing links"];
  const contentRows = ["URL,first 500 characters,word count,content fingerprint"];

  for (const page of pages.sort((a, b) => a.path.localeCompare(b.path, "ko"))) {
    const indexable = isIndexablePagePath(page.path);
    const robots = isNoIndexPath(page.path) ? "noindex,follow" : "index,follow";
    const canonical = resolveCanonicalPath(page.path);
    const body = mainBody(page);
    const fp = fingerprint([page.path, page.metaTitle, page.h1, body.slice(0, 2000)]);
    const intent = INTENT_BY_PATH[page.path] ?? {
      primary: INHERITANCE_RE.test(page.path) ? "inheritance-supporting" : "other",
      secondary: page.category,
    };
    const inLinks = incoming.get(page.path) ?? [];
    const outLinks = collectOutgoing(page);
    const mainH2 = page.sections[0]?.title ?? "";

    routeRows.push(
      csvRow([
        page.path,
        byPath.has(page.path) ? 200 : 0,
        indexable,
        robots,
        canonical,
        indexable,
        intent.primary,
        intent.secondary,
        fp,
      ]),
    );
    metaRows.push(
      csvRow([
        page.path,
        page.metaTitle || page.title,
        page.metaDescription,
        page.metaTitle || page.title,
        page.metaDescription,
        page.h1,
        mainH2,
        schemaNames(page),
      ]),
    );
    linkRows.push(
      csvRow([
        page.path,
        inLinks.length,
        inLinks
          .slice(0, 40)
          .map((row) => `${row.from}→${row.label}`)
          .join(" | "),
        outLinks.map((row) => `${row.label} (${row.href})`).join(" | "),
      ]),
    );
    contentRows.push(
      csvRow([page.path, body.replace(/\s+/g, " ").slice(0, 500), wordCount(body), fp]),
    );
  }

  fs.writeFileSync(path.join(OUT, "baseline-routes.csv"), `${routeRows.join("\n")}\n`, "utf8");
  fs.writeFileSync(path.join(OUT, "baseline-metadata.csv"), `${metaRows.join("\n")}\n`, "utf8");
  fs.writeFileSync(path.join(OUT, "baseline-links.csv"), `${linkRows.join("\n")}\n`, "utf8");
  fs.writeFileSync(path.join(OUT, "baseline-content.csv"), `${contentRows.join("\n")}\n`, "utf8");

  const missingRequired = REQUIRED_PATHS.filter((p) => !byPath.has(p) && p !== "/부산특별한정승인");
  const special = [...byPath.keys()].filter((p) => p.includes("특별한정승인"));
  const report = {
    generatedAt: new Date().toISOString(),
    inheritancePageCount: pages.length,
    missingRequired,
    specialLimitedAcceptanceOwners: special,
    note: "PERFORMANCE_UNKNOWN — Search Advisor impressions/clicks 없음. HTTP 200은 레지스트리 존재 기준.",
  };
  fs.writeFileSync(path.join(OUT, "baseline-summary.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${pages.length} inheritance-related rows to seo/inheritance/baseline-*.csv`);
  if (missingRequired.length) {
    console.warn("Missing required paths:", missingRequired.join(", "));
  }
  console.log("특별한정승인 owners:", special.join(", ") || "(none)");
}

main();
