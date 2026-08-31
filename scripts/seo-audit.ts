/**
 * 전체 SEO 품질 감사. 가능하면 build output(out/)도 검사한다.
 * Usage: npx --yes tsx scripts/seo-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import { HOME_H1, HOME_METADATA_TITLE } from "../src/lib/seo/metadata";

const ROOT = process.cwd();
const REPORT = path.join(ROOT, "reports/seo/audit-latest.json");

type PageRow = {
  path: string;
  title: string;
  description: string;
  h1: string;
  indexable: boolean;
};

function collectPages(): PageRow[] {
  const rows: PageRow[] = [
    {
      path: "/",
      title: HOME_METADATA_TITLE,
      description: "",
      h1: HOME_H1,
      indexable: true,
    },
  ];
  const seen = new Set(["/"]);
  for (const page of getAllPageData()) {
    if (seen.has(page.path)) continue;
    seen.add(page.path);
    rows.push({
      path: page.path,
      title: page.metaTitle || page.title,
      description: page.metaDescription,
      h1: page.h1,
      indexable: isIndexablePagePath(page.path) && !isNoIndexPath(page.path),
    });
  }
  return rows;
}

function duplicates(values: string[], paths: string[]) {
  const map = new Map<string, string[]>();
  values.forEach((value, i) => {
    const key = value.trim();
    if (!key) return;
    const list = map.get(key) ?? [];
    list.push(paths[i]);
    map.set(key, list);
  });
  return [...map.entries()].filter(([, list]) => list.length > 1);
}

function resolveOutHtml(outDir: string, route: string): string | null {
  if (route === "/") {
    const index = path.join(outDir, "index.html");
    return fs.existsSync(index) ? index : null;
  }
  const slug = route.replace(/^\//, "");
  const encoded = slug.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  const candidates = [
    path.join(outDir, `${slug}.html`),
    path.join(outDir, `${encoded}.html`),
    path.join(outDir, slug, "index.html"),
    path.join(outDir, encoded, "index.html"),
  ];
  return candidates.find((file) => fs.existsSync(file)) ?? null;
}

function scanBuiltHtml() {
  const outDir = path.join(ROOT, "out");
  if (!fs.existsSync(outDir)) {
    return { available: false as const };
  }

  const priority = [
    "/",
    "/부산법무사",
    "/부산법무사상담",
    "/부산법무사추천",
    "/부산상속법무사",
    "/부산상속등기",
    "/부산상속포기",
    "/부산한정승인",
  ];

  const results: Record<
    string,
    { h1: number; canonical: string | null; robots: string | null; title: string | null }
  > = {};
  for (const route of priority) {
    const file = resolveOutHtml(outDir, route);
    if (!file) {
      results[route] = { h1: 0, canonical: null, robots: null, title: null };
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    const h1 = (html.match(/<h1\b/gi) ?? []).length;
    const canonical =
      html.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1] ??
      html.match(/href="([^"]+)"\s+rel="canonical"/i)?.[1] ??
      null;
    const robots =
      html.match(/name="robots"\s+content="([^"]+)"/i)?.[1] ??
      html.match(/content="([^"]+)"\s+name="robots"/i)?.[1] ??
      null;
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? null;
    results[route] = { h1, canonical, robots, title };
  }
  const noindexPriority = [
    "/부산상속전문법무사",
    "/부산상속등기전문법무사",
    "/부산한정승인전문법무사",
    "/부산상속포기전문법무사",
  ];

  const noindexResults: Record<
    string,
    { robots: string | null; canonical: string | null; title: string | null }
  > = {};
  for (const route of noindexPriority) {
    const file = resolveOutHtml(outDir, route);
    if (!file) {
      noindexResults[route] = { robots: null, canonical: null, title: null };
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    const canonical =
      html.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1] ??
      html.match(/href="([^"]+)"\s+rel="canonical"/i)?.[1] ??
      null;
    const robots =
      html.match(/name="robots"\s+content="([^"]+)"/i)?.[1] ??
      html.match(/content="([^"]+)"\s+name="robots"/i)?.[1] ??
      null;
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? null;
    noindexResults[route] = { robots, canonical, title };
  }
  return { available: true as const, results, noindexResults };
}

function sitemapCount() {
  const sitemap = path.join(ROOT, "public/sitemap.xml");
  if (!fs.existsSync(sitemap)) return 0;
  return (fs.readFileSync(sitemap, "utf8").match(/<loc>/g) ?? []).length;
}

function main() {
  const pages = collectPages();
  const indexable = pages.filter((page) => page.indexable);
  const noindex = pages.filter((page) => !page.indexable);

  const titleDup = duplicates(
    indexable.map((page) => page.title),
    indexable.map((page) => page.path),
  );
  const h1Dup = duplicates(
    indexable.map((page) => page.h1),
    indexable.map((page) => page.path),
  );
  const descDup = duplicates(
    indexable.map((page) => page.description),
    indexable.map((page) => page.path),
  );

  const built = scanBuiltHtml();
  const report = {
    generated: new Date().toISOString(),
    totals: {
      pages: pages.length,
      indexable: indexable.length,
      noindex: noindex.length,
      sitemap: sitemapCount(),
    },
    duplicates: {
      title: titleDup.length,
      h1: h1Dup.length,
      description: descDup.length,
    },
    built,
  };

  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));

  console.log("=== SEO audit ===");
  console.log(JSON.stringify(report.totals, null, 2));
  console.log(`duplicate titles: ${titleDup.length}`);
  if (titleDup.length) {
    for (const [title, paths] of titleDup.slice(0, 8)) {
      console.log(`  title "${title}" → ${paths.join(", ")}`);
    }
  }
  console.log(`duplicate H1: ${h1Dup.length}`);
  if (h1Dup.length) {
    for (const [h1, paths] of h1Dup.slice(0, 8)) {
      console.log(`  H1 "${h1}" → ${paths.join(", ")}`);
    }
  }
  console.log(`duplicate descriptions: ${descDup.length}`);
  if (built.available) {
    console.log("built HTML:", built.results);
    if (built.noindexResults) {
      console.log("noindex bridges:", built.noindexResults);
    }
  } else {
    console.log("built HTML: out/ not found (run after build)");
  }
  console.log(`wrote ${path.relative(ROOT, REPORT)}`);

  const builtErrors: string[] = [];
  if (built.available) {
    for (const [route, row] of Object.entries(built.results)) {
      if (row.h1 !== 1) builtErrors.push(`${route}: H1 count ${row.h1}`);
      if (!row.title) builtErrors.push(`${route}: missing title`);
      if (!row.canonical) builtErrors.push(`${route}: missing canonical`);
    }
    for (const [route, row] of Object.entries(built.noindexResults ?? {})) {
      if (!row.robots?.includes("noindex")) {
        builtErrors.push(`${route}: expected noindex, got ${row.robots}`);
      }
      if (!row.canonical) {
        builtErrors.push(`${route}: missing canonical`);
      }
    }
  }
  if (builtErrors.length) {
    for (const error of builtErrors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
}

main();
