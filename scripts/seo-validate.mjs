#!/usr/bin/env node
/**
 * SEO 통합 검증: sitemap manifest, robots, RSS, canonical 도메인, Tier 1
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
import { TIER1_REQUIRED } from "./lib/sitemap/tiers.mjs";
import { pathToAbsoluteUrl } from "./lib/sitemap/urls.mjs";
import { parseLocTags } from "./lib/sitemap/xml.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = getSiteUrl().replace(/\/$/, "");
const FORBIDDEN = [/pages\.dev/i, /daom-law\.com/i, /^http:\/\//i];

function fail(message) {
  console.error(`[seo:validate] ERROR: ${message}`);
  process.exit(1);
}

function assertNoForbiddenUrls(content, label) {
  for (const pattern of FORBIDDEN) {
    if (pattern.test(content)) {
      fail(`${label} contains forbidden URL pattern: ${pattern}`);
    }
  }
  const urlLike = [...content.matchAll(/(?:<loc>|<link>|href=")([^"<]+)/g)].map((m) => m[1]);
  for (const url of urlLike) {
    if (/^https?:\/\/www\./i.test(url)) {
      fail(`${label} contains www subdomain in URL: ${url}`);
    }
  }
}

function assertRss() {
  const rssPath = path.join(ROOT, "public/rss.xml");
  if (!fs.existsSync(rssPath)) {
    fail("public/rss.xml not found — run npm run prebuild or generate-rss");
  }

  const xml = fs.readFileSync(rssPath, "utf8");
  assertNoForbiddenUrls(xml, "rss.xml");

  if (!xml.includes(SITE)) {
    fail(`rss.xml must use site URL ${SITE}`);
  }

  const itemBlocks = xml.split("<item>").slice(1);
  for (const block of itemBlocks) {
    const linkMatch = block.match(/<link>([^<]+)<\/link>/);
    if (!linkMatch) continue;
    const link = linkMatch[1];
    if (!link.startsWith(SITE)) {
      fail(`rss.xml item must be on canonical domain: ${link}`);
    }
    if (link.includes("/faq/") || link.includes("/media/")) {
      fail(`rss.xml must not include FAQ/media items: ${link}`);
    }
    if (!link.includes("/blog/") && !link.includes("/services/cases/")) {
      fail(`rss.xml item must be blog or services/cases only: ${link}`);
    }
  }

  const itemCount = (xml.match(/<item>/g) ?? []).length;
  if (itemCount < 1) {
    fail("rss.xml has no items");
  }

  console.log(`[seo:validate] rss.xml OK (${itemCount} items, blog+cases only)`);
}

function assertRobotsSource() {
  const robotsTs = path.join(ROOT, "src/app/robots.ts");
  const text = fs.readFileSync(robotsTs, "utf8");
  if (!text.includes("sitemap.xml")) {
    fail("robots.ts must reference sitemap.xml");
  }
  if (!text.includes("Yeti")) {
    fail("robots.ts must allow Yeti (Naver)");
  }
  console.log(`[seo:validate] robots.ts OK`);
}

function assertSitemapManifest() {
  const manifestPath = path.join(ROOT, "scripts/output/sitemap-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    fail("sitemap-manifest.json missing — run npm run sitemap:generate");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.siteUrl !== SITE) {
    fail(`manifest siteUrl must be ${SITE}`);
  }

  if (manifest.sitemapIndex !== `${SITE}/sitemap.xml`) {
    fail(`manifest sitemapIndex must be ${SITE}/sitemap.xml`);
  }

  const redirectExcluded = (manifest.excluded ?? []).filter((e) => e.reason === "redirect");
  const noindexExcluded = (manifest.excluded ?? []).filter((e) => e.reason === "noindex");

  for (const entry of manifest.entries ?? []) {
    if (!entry.loc.startsWith(SITE)) {
      fail(`sitemap entry domain mismatch: ${entry.loc}`);
    }
    assertNoForbiddenUrls(entry.loc, "sitemap entry");
  }

  for (const required of TIER1_REQUIRED) {
    const loc = pathToAbsoluteUrl(required, SITE);
    const found = manifest.entries.some((e) => e.loc === loc);
    if (!found) {
      fail(`Tier 1 URL missing from manifest: ${required}`);
    }
  }

  const indexPath = path.join(ROOT, "public/sitemap.xml");
  if (!fs.existsSync(indexPath)) {
    fail("public/sitemap.xml missing");
  }

  const indexXml = fs.readFileSync(indexPath, "utf8");
  assertNoForbiddenUrls(indexXml, "sitemap.xml");

  const allLocs = [];
  for (const sub of manifest.subSitemaps ?? []) {
    const subPath = path.join(ROOT, "public/sitemaps", sub.filename);
    if (!fs.existsSync(subPath)) {
      fail(`missing sub-sitemap: public/sitemaps/${sub.filename}`);
    }
    allLocs.push(...parseLocTags(fs.readFileSync(subPath, "utf8")));
  }

  if (allLocs.length !== manifest.totalUrls) {
    fail(`URL count mismatch: files ${allLocs.length}, manifest ${manifest.totalUrls}`);
  }

  console.log(
    `[seo:validate] sitemap manifest OK (${manifest.totalUrls} URLs, excluded redirect=${redirectExcluded.length}, noindex=${noindexExcluded.length})`,
  );
}

function assertCanonicalHelper() {
  const metadataPath = path.join(ROOT, "src/lib/seo/metadata.ts");
  const siteUrlPath = path.join(ROOT, "src/lib/site-url.ts");
  const metadata = fs.readFileSync(metadataPath, "utf8");
  const siteUrl = fs.readFileSync(siteUrlPath, "utf8");

  if (!siteUrl.includes("https://다옴법무사사무소.kr")) {
    fail("site-url.ts must default to https://다옴법무사사무소.kr");
  }
  if (!metadata.includes("siteConfig.url")) {
    fail("metadata.ts must build canonical from siteConfig.url");
  }

  console.log("[seo:validate] canonical helper OK");
}

assertRss();
assertRobotsSource();
assertSitemapManifest();
assertCanonicalHelper();
console.log(`[seo:validate] all checks passed (${SITE})`);
