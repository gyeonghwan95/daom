/**
 * Busan local SEO inventory, scoring, owner map.
 * Internal quality scores — not Naver algorithm scores.
 *
 * Usage: npx --yes tsx scripts/local-seo-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import {
  getCanonicalOverridePath,
  isNoIndexPath,
} from "../src/lib/seo/index-policy";
import { localLandingConfigs } from "../src/lib/local-landing/config";
import { REGION_HUB_IDENTITIES } from "../src/lib/local-landing/region-hub-identity";
import { busanDistricts } from "../src/lib/busan-legal-map/config";

const ROOT = process.cwd();
const SEO = path.join(ROOT, "seo");

const DISTRICT_HUBS = [
  { keyword: "중구 법무사", slug: "중구법무사" },
  { keyword: "서구 법무사", slug: "서구법무사" },
  { keyword: "동구 법무사", slug: "동구법무사" },
  { keyword: "영도구 법무사", slug: "영도구법무사" },
  { keyword: "부산진구 법무사", slug: "부산진구법무사" },
  { keyword: "동래구 법무사", slug: "동래구법무사" },
  { keyword: "남구 법무사", slug: "남구법무사" },
  { keyword: "북구 법무사", slug: "북구법무사" },
  { keyword: "해운대 법무사", slug: "해운대법무사" },
  { keyword: "사하구 법무사", slug: "사하구법무사" },
  { keyword: "금정구 법무사", slug: "금정구법무사" },
  { keyword: "강서구 법무사", slug: "강서구법무사" },
  { keyword: "연제구 법무사", slug: "연제구법무사" },
  { keyword: "수영구 법무사", slug: "수영구법무사" },
  { keyword: "사상구 법무사", slug: "사상구법무사" },
  { keyword: "기장군 법무사", slug: "기장군법무사" },
] as const;

const REGION_KEY_PARENT: Record<string, string> = {
  busan: "부산광역시",
  haeundae: "해운대구",
  centum: "해운대구",
  jaesong: "해운대구",
  banyeo: "해운대구",
  yeonje: "연제구",
  suyeong: "수영구",
  gwanganri: "수영구",
  dongnae: "동래구",
  busanjin: "부산진구",
  namgu: "남구",
  munhyeon: "남구",
  buk: "북구",
  geumjeong: "금정구",
  sasang: "사상구",
  saha: "사하구",
  junggu: "중구",
  seogu: "서구",
  donggu: "동구",
  yeongdo: "영도구",
  gangseo: "강서구",
  myeongji: "강서구",
  gijang: "기장군",
  jeonggwan: "기장군",
};

type KeywordMapFile = {
  queries: Record<string, { owner: string; intent?: string; aliasOf?: string }>;
};

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function pageBody(page: {
  intro: string;
  introParagraphs: string[];
  sections: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  h1: string;
}): string {
  return [
    page.h1,
    page.intro,
    ...page.introParagraphs,
    ...page.sections.map((section) => `${section.title}\n${section.body}`),
    ...page.faqs.map((faq) => `${faq.question} ${faq.answer}`),
  ].join("\n");
}

function classifyRegionType(slug: string, label: string): string {
  if (slug === "부산법무사") return "CITY";
  if (slug.includes("역법무사")) return "STATION";
  if (slug === "기장군법무사" || slug.endsWith("군법무사")) return "COUNTY";
  if (
    slug === "해운대법무사" ||
    slug.endsWith("구법무사") ||
    DISTRICT_HUBS.some((row) => row.slug === slug)
  ) {
    return "DISTRICT";
  }
  if (
    ["센텀법무사", "서면법무사", "광안리법무사"].includes(slug)
  ) {
    return "BUSINESS_DISTRICT";
  }
  if (slug.includes("동법무사") || slug.includes("읍법무사")) return "DONG";
  if (["오시리아법무사", "명지법무사"].includes(slug)) return "LANDMARK";
  if (label) return "NEIGHBORHOOD";
  return "NEIGHBORHOOD";
}

function uniqueWords(text: string): number {
  const tokens = text
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
  return new Set(tokens).size;
}

function scorePage(input: {
  path: string;
  slug: string;
  title: string;
  h1: string;
  description: string;
  body: string;
  linkCount: number;
  indexable: boolean;
  hasIdentity: boolean;
  titlesUnique: boolean;
  descriptionsUnique: boolean;
}): { total: number; action: string; breakdown: Record<string, number> } {
  const officeMentioned =
    input.body.includes("센텀") &&
    (input.body.includes("해운대") || input.body.includes("다옴"));
  const fakeOffice =
    /연제구에 있|수영구에 있|동래구에 있는 다옴|부산진구에 있/.test(input.body);
  const intent = Math.min(
    20,
    (input.title.includes("법무사") ? 8 : 0) +
      (input.h1.trim().length > 0 ? 6 : 0) +
      (officeMentioned && !fakeOffice ? 6 : 0),
  );
  const unique =
    (input.hasIdentity ? 12 : 6) +
    (input.body.length > 800 ? 5 : 2) +
    (input.titlesUnique ? 3 : 0);
  const localInfo = Math.min(
    15,
    (input.body.includes("관할") ? 5 : 0) +
      (input.body.includes("등기") ? 4 : 0) +
      (/\p{L}동|센텀|서면|광안/u.test(input.body) ? 4 : 0) +
      (input.body.includes("상담") ? 2 : 0),
  );
  const technical =
    (input.indexable ? 5 : 2) +
    (input.h1 ? 5 : 0) +
    (input.description.length >= 40 ? 5 : 2);
  const linking = Math.min(10, Math.max(0, input.linkCount >= 5 ? 8 : input.linkCount) + (input.linkCount <= 12 ? 2 : 0));
  const trust = Math.min(
    10,
    (input.body.includes("안윤정") ? 4 : 0) +
      (input.body.includes("다옴법무사사무소") ? 3 : 0) +
      (officeMentioned ? 3 : 0),
  );
  const ctr =
    (input.titlesUnique ? 3 : 0) + (input.descriptionsUnique ? 2 : 0);
  const ux = input.body.includes("상담") ? 5 : 2;
  const breakdown = {
    intent,
    unique: Math.min(20, unique),
    localInfo,
    technical,
    linking,
    trust,
    ctr,
    ux,
  };
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const action = total >= 85 ? "PRESERVE" : total >= 70 ? "IMPROVE" : "REWRITE";
  return { total, action, breakdown };
}

function main() {
  const map = JSON.parse(
    fs.readFileSync(path.join(SEO, "keyword-map.json"), "utf8"),
  ) as KeywordMapFile;
  const pages = getAllPageData();
  const byPath = new Map(pages.map((page) => [page.path, page]));

  const titleCounts = new Map<string, number>();
  const descCounts = new Map<string, number>();
  for (const page of pages) {
    titleCounts.set(page.metaTitle, (titleCounts.get(page.metaTitle) ?? 0) + 1);
    descCounts.set(
      page.metaDescription,
      (descCounts.get(page.metaDescription) ?? 0) + 1,
    );
  }

  const inbound = new Map<string, number>();
  for (const page of pages) {
    for (const link of [...page.internalLinks, ...page.relatedLinks]) {
      inbound.set(link.href, (inbound.get(link.href) ?? 0) + 1);
    }
  }

  const localConfigs = localLandingConfigs.filter(
    (config) =>
      config.pageType === "region-hub" ||
      config.pageType === "neighborhood-hub" ||
      /법무사$/.test(config.slug),
  );

  const inventoryRows: string[] = [
    [
      "keyword",
      "region_type",
      "parent_region",
      "target_url",
      "current_title",
      "current_h1",
      "indexable",
      "canonical",
      "in_sitemap",
      "internal_links_in",
      "internal_links_out",
      "word_count",
      "unique_word_count",
      "similarity_group",
      "priority",
      "status",
    ].join(","),
  ];

  const ownerMap: Record<string, string> = {};
  const scoreRows: string[] = [
    [
      "path",
      "score",
      "action",
      "intent",
      "unique",
      "local_info",
      "technical",
      "linking",
      "trust",
      "ctr",
      "ux",
      "performance",
    ].join(","),
  ];

  const seenKeywords = new Set<string>();

  function pushKeyword(
    keyword: string,
    slug: string,
    regionType: string,
    parent: string,
    priority: string,
  ) {
    if (seenKeywords.has(keyword)) return;
    seenKeywords.add(keyword);
    const url = `/${slug}`;
    const page = byPath.get(url);
    const mapOwner = map.queries[keyword]?.aliasOf
      ? map.queries[map.queries[keyword].aliasOf ?? ""]?.owner ??
        map.queries[keyword].owner
      : map.queries[keyword]?.owner ?? url;
    ownerMap[keyword] = mapOwner;
    const body = page ? pageBody(page) : "";
    const words = body.split(/\s+/).filter(Boolean).length;
    const indexable = page ? isIndexablePagePath(page.path) : false;
    const canonical = page
      ? (getCanonicalOverridePath(page.path) ?? page.path)
      : "";
    const status = !page
      ? "MISSING_URL"
      : !indexable
        ? "NOINDEX_KEEP_URL"
        : REGION_HUB_IDENTITIES[slug]
          ? "KEEP_INDEX"
          : "IMPROVE_INDEX";
    inventoryRows.push(
      [
        csvCell(keyword),
        regionType,
        csvCell(parent),
        url,
        csvCell(page?.metaTitle ?? ""),
        csvCell(page?.h1 ?? ""),
        indexable,
        canonical,
        indexable,
        inbound.get(url) ?? 0,
        page ? page.internalLinks.length : 0,
        words,
        uniqueWords(body),
        regionType,
        priority,
        status,
      ].join(","),
    );
  }

  for (const hub of DISTRICT_HUBS) {
    const config = localConfigs.find((row) => row.slug === hub.slug);
    pushKeyword(
      hub.keyword,
      hub.slug,
      hub.slug === "기장군법무사" ? "COUNTY" : "DISTRICT",
      "부산광역시",
      hub.slug === "연제구법무사" ? "HIGH" : "DISTRICT",
    );
    if (config) {
      for (const extra of [`부산 ${hub.keyword}`]) {
        if (extra !== hub.keyword) {
          ownerMap[extra] = `/${hub.slug}`;
        }
      }
    }
  }

  for (const config of localConfigs) {
    if (config.slug === "부산법무사") {
      pushKeyword("부산 법무사", config.slug, "CITY", "부산광역시", "CITY");
      continue;
    }
    if (DISTRICT_HUBS.some((row) => row.slug === config.slug)) continue;
    const keyword = `${config.regionLabel} 법무사`;
    pushKeyword(
      keyword,
      config.slug,
      classifyRegionType(config.slug, config.regionLabel),
      REGION_KEY_PARENT[config.regionKey] ?? "부산광역시",
      config.pageType === "neighborhood-hub" ? "DONG" : "LOCAL",
    );
  }

  for (const [query, row] of Object.entries(map.queries)) {
    if (row.intent !== "local" && !query.endsWith("법무사")) continue;
    if (seenKeywords.has(query)) continue;
    const owner = row.aliasOf ? map.queries[row.aliasOf]?.owner ?? row.owner : row.owner;
    const slug = owner.replace(/^\//, "");
    pushKeyword(
      query,
      slug,
      classifyRegionType(slug, query.replace(/\s*법무사$/, "")),
      REGION_KEY_PARENT[
        localConfigs.find((config) => config.slug === slug)?.regionKey ?? ""
      ] ?? "부산광역시",
      "MAPPED",
    );
  }

  const hubPages = pages.filter((page) => {
    const slug = page.slug;
    if (page.path !== `/${slug}`) return false;
    return (
      DISTRICT_HUBS.some((row) => row.slug === slug) ||
      localConfigs.some(
        (config) =>
          config.slug === slug &&
          (config.pageType === "region-hub" ||
            config.pageType === "neighborhood-hub"),
      )
    );
  });

  for (const page of hubPages) {
    const scored = scorePage({
      path: page.path,
      slug: page.slug,
      title: page.metaTitle,
      h1: page.h1,
      description: page.metaDescription,
      body: pageBody(page),
      linkCount: page.internalLinks.length,
      indexable: isIndexablePagePath(page.path),
      hasIdentity: Boolean(REGION_HUB_IDENTITIES[page.slug]),
      titlesUnique: (titleCounts.get(page.metaTitle) ?? 0) <= 1,
      descriptionsUnique: (descCounts.get(page.metaDescription) ?? 0) <= 1,
    });
    scoreRows.push(
      [
        page.path,
        scored.total,
        scored.action,
        scored.breakdown.intent,
        scored.breakdown.unique,
        scored.breakdown.localInfo,
        scored.breakdown.technical,
        scored.breakdown.linking,
        scored.breakdown.trust,
        scored.breakdown.ctr,
        scored.breakdown.ux,
        "SEARCH PERFORMANCE UNKNOWN",
      ].join(","),
    );
  }

  fs.mkdirSync(SEO, { recursive: true });
  fs.writeFileSync(
    path.join(SEO, "local-keyword-inventory.csv"),
    `${inventoryRows.join("\n")}\n`,
    "utf8",
  );
  fs.writeFileSync(
    path.join(SEO, "local-keyword-map.json"),
    `${JSON.stringify(
      {
        updated: "2026-08-31",
        note: "한 PRIMARY keyword는 owner URL 하나. alias는 keyword-map.json 참고.",
        owners: ownerMap,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  fs.writeFileSync(
    path.join(SEO, "local-page-score.csv"),
    `${scoreRows.join("\n")}\n`,
    "utf8",
  );

  const missingDistricts = DISTRICT_HUBS.filter(
    (hub) => !byPath.has(`/${hub.slug}`),
  );
  const ownerCollisions = new Map<string, string[]>();
  for (const [keyword, owner] of Object.entries(ownerMap)) {
    const canonicalKeyword =
      map.queries[keyword]?.aliasOf ?? keyword;
    if (canonicalKeyword !== keyword) continue;
    const list = ownerCollisions.get(owner) ?? [];
    list.push(keyword);
    ownerCollisions.set(owner, list);
  }

  console.log("=== Local SEO audit ===");
  console.log(`keywords: ${seenKeywords.size}`);
  console.log(`hub pages scored: ${hubPages.length}`);
  console.log(`16 district hubs missing: ${missingDistricts.length}`);
  for (const missing of missingDistricts) {
    console.error(`MISSING district hub: /${missing.slug}`);
  }
  console.log(
    `district cards on legal map: ${busanDistricts.length} (expect 16)`,
  );
  console.log("Search Advisor: SEARCH PERFORMANCE UNKNOWN (no csv in repo)");
  if (missingDistricts.length) process.exit(1);
  console.log("OK — inventory written to seo/");
}

main();
