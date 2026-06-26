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

function assertNapConsistency() {
  const officeFile = path.join(ROOT, "src/lib/office-location.ts");
  const businessFile = path.join(ROOT, "src/lib/business-info.ts");
  const brandFile = path.join(ROOT, "src/lib/seo/brand.ts");
  const homeContentFile = path.join(ROOT, "src/lib/home-content.ts");

  const office = fs.readFileSync(officeFile, "utf8");
  const business = fs.readFileSync(businessFile, "utf8");
  const brand = fs.readFileSync(brandFile, "utf8");
  const homeContent = fs.readFileSync(homeContentFile, "utf8");

  const addressMatch = office.match(
    /fullAddress:\s*"([^"]+)"/,
  );
  const fullAddress = addressMatch?.[1];
  if (!fullAddress) {
    fail("office-location.ts must define fullAddress");
  }

  if (homeContent.includes(fullAddress)) {
    fail(
      "home-content.ts must not duplicate full address — use getNapInfo() in components",
    );
  }

  if (!business.includes("officeLocation.fullAddress")) {
    fail("business-info.ts must source address from officeLocation.fullAddress");
  }

  const latMatch = office.match(/lat:\s*([\d.]+)/);
  const lngMatch = office.match(/lng:\s*([\d.]+)/);
  const brandLat = brand.match(/latitude:\s*([\d.]+)/)?.[1];
  const brandLng = brand.match(/longitude:\s*([\d.]+)/)?.[1];

  if (latMatch?.[1] !== brandLat || lngMatch?.[1] !== brandLng) {
    fail(
      "seo/brand.ts geo must match officeCoordinates in office-location.ts",
    );
  }

  const phone = "070-4172-8056";
  if (!business.includes(phone) && !business.includes("getContactInfo")) {
    fail("business-info.ts must source phone from getContactInfo()");
  }

  console.log(`[validate-seo] NAP consistency OK (${fullAddress}, ${phone})`);
}

function assertLocalLandingPages() {
  const configFile = path.join(ROOT, "src/lib/local-landing/config.ts");
  const expansionFile = path.join(
    ROOT,
    "src/lib/local-landing/expansion/config-expansion.ts",
  );
  const hubFile = path.join(ROOT, "src/lib/topic-hubs/config.ts");

  const config = fs.readFileSync(configFile, "utf8");
  const expansion = fs.existsSync(expansionFile)
    ? fs.readFileSync(expansionFile, "utf8")
    : "";
  const hubs = fs.existsSync(hubFile) ? fs.readFileSync(hubFile, "utf8") : "";

  const slugCount =
    (config.match(/slug:\s*"/g) ?? []).length +
    (expansion.match(/slug:\s*"/g) ?? []).length;
  const hubCount = (hubs.match(/slug:\s*"/g) ?? []).length;

  if (slugCount < 105) {
    fail(`local landing pages: expected at least 105, found ${slugCount}`);
  }

  if (hubCount < 10) {
    fail(`topic hub pages: expected at least 10, found ${hubCount}`);
  }

  console.log(
    `[validate-seo] local landing pages OK (${slugCount} configured, ${hubCount} topic hubs)`,
  );
}

assertRss();
assertSitemapSources();
assertNapConsistency();
assertLocalLandingPages();
