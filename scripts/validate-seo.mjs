#!/usr/bin/env node
/**
 * sitemap·rss 기본 검증 (prebuild)
 */
import fs from "node:fs";
import path from "node:path";
import { getSiteUrl } from "./lib/site-url.mjs";

const ROOT = process.cwd();
const SITE_URL = getSiteUrl().replace(/\/$/, "");
const RSS_PATH = path.join(ROOT, "public/rss.xml");

const FORBIDDEN_LINK_PATTERNS = [
  /blog\.naver\.com/i,
  /daom-law\.com/i,
  /pages\.dev/i,
];

function fail(message) {
  console.error(`[validate-seo] ${message}`);
  process.exit(1);
}

function assertRss() {
  if (!fs.existsSync(RSS_PATH)) {
    fail("public/rss.xml not found — run scripts/generate-rss.mjs");
  }

  const xml = fs.readFileSync(RSS_PATH, "utf8");

  if (!xml.includes(SITE_URL)) {
    fail(`rss.xml must use site URL ${SITE_URL}`);
  }

  const itemLinks = [...xml.matchAll(/<link>([^<]+)<\/link>/g)]
    .map((match) => match[1])
    .filter((link) => link.includes("/blog/") || link.includes("/faq/"));

  for (const link of itemLinks) {
    if (!link.startsWith(SITE_URL)) {
      fail(`rss.xml item link must be internal: ${link}`);
    }
    for (const pattern of FORBIDDEN_LINK_PATTERNS) {
      if (pattern.test(link)) {
        fail(`rss.xml contains disallowed URL: ${link}`);
      }
    }
  }

  const enclosures = [...xml.matchAll(/<enclosure\b[^>]*>/g)];
  for (const tag of enclosures) {
    if (!/length="\d+"/.test(tag[0])) {
      fail(`rss.xml enclosure missing length: ${tag[0]}`);
    }
  }

  const itemCount = (xml.match(/<item>/g) ?? []).length;
  if (itemCount < 1) {
    fail("rss.xml has no items");
  }

  console.log(`[validate-seo] rss.xml OK (${itemCount} items, ${SITE_URL})`);
}

function assertSitemapSources() {
  const routesFile = path.join(ROOT, "src/lib/seo/routes.ts");
  const sitemapFile = path.join(ROOT, "src/app/sitemap.ts");

  if (!fs.existsSync(routesFile) || !fs.existsSync(sitemapFile)) {
    fail("sitemap source files missing");
  }

  const robotsFile = path.join(ROOT, "src/app/robots.ts");
  const robots = fs.readFileSync(robotsFile, "utf8");

  if (!robots.includes("sitemap.xml")) {
    fail("robots.ts must reference sitemap.xml");
  }

  console.log(`[validate-seo] sitemap.ts + robots.ts OK (${SITE_URL}/sitemap.xml)`);
}

assertRss();
assertSitemapSources();
