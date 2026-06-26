#!/usr/bin/env node
/**
 * sitemap과 동일 기준으로 색인 제출용 전체 URL 목록 출력
 */
import fs from "node:fs";
import path from "node:path";
import { getSiteUrl } from "./lib/site-url.mjs";

const ROOT = process.cwd();
const SITE_URL = getSiteUrl().replace(/\/$/, "");

const staticRoutes = [
  "/",
  "/about",
  "/office",
  "/services",
  "/blog",
  "/reviews",
  "/faq",
  "/media",
  "/contact",
  "/location",
];

const serviceSlugs = [
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "real-estate-registration",
  "ownership-transfer",
  "corporate-registration",
  "company-establishment",
  "director-change",
  "personal-rehabilitation",
  "bankruptcy",
];

const pressSlugs = [
  "busan-ilbo-bar-association-64th-general-assembly",
  "kukje-sinmun-bar-association-64th-general-assembly",
  "beopryul-sinmun-bar-association-64th-general-assembly",
];

function readSlugsFromDir(dir, exclude = ["_template"]) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") && !exclude.some((e) => f.startsWith(e)))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readLandingSlugs() {
  const config = fs.readFileSync(
    path.join(ROOT, "src/lib/local-landing/config.ts"),
    "utf8",
  );
  const expansion = fs.readFileSync(
    path.join(ROOT, "src/lib/local-landing/expansion/config-expansion.ts"),
    "utf8",
  );
  const slugs = [
    ...(config.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(expansion.match(/slug:\s*"([^"]+)"/g) ?? []),
  ].map((m) => m.replace(/slug:\s*"/, "").replace(/"$/, ""));
  return [...new Set(slugs)];
}

function readNaverBlogExternalPaths() {
  const jsonPath = path.join(ROOT, "public/data/naver-blog-posts.json");
  if (!fs.existsSync(jsonPath)) return [];
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  return (data.items ?? [])
    .map((item) => {
      const match = item.link?.match(/\/(\d+)(?:\?|$)/);
      return match ? `/blog/external/${match[1]}` : null;
    })
    .filter(Boolean);
}

function readTopicHubSlugs() {
  const hubFile = path.join(ROOT, "src/lib/topic-hubs/config.ts");
  if (!fs.existsSync(hubFile)) return [];
  const hubs = fs.readFileSync(hubFile, "utf8");
  return [...new Set((hubs.match(/slug:\s*"([^"]+)"/g) ?? []).map((m) =>
    m.replace(/slug:\s*"/, "").replace(/"$/, ""),
  ))];
}

const blogSlugs = readSlugsFromDir("src/content/blog");
const caseSlugs = readSlugsFromDir("src/content/cases");
const faqSlugs = readSlugsFromDir("src/content/faq");
const landingSlugs = readLandingSlugs();
const topicHubSlugs = readTopicHubSlugs();
const naverBlogPaths = readNaverBlogExternalPaths();

const paths = [
  ...staticRoutes,
  ...landingSlugs.map((slug) => `/${slug}`),
  ...topicHubSlugs.map((slug) => `/${slug}`),
  ...serviceSlugs.map((slug) => `/services/${slug}`),
  ...blogSlugs.map((slug) => `/blog/${slug}`),
  ...caseSlugs.map((slug) => `/services/cases/${slug}`),
  ...faqSlugs.map((slug) => `/faq/${slug}`),
  ...pressSlugs.map((slug) => `/media/${slug}`),
  ...naverBlogPaths,
];

const urls = paths.map((p) => (p === "/" ? SITE_URL : `${SITE_URL}${p}`));

console.log(`# Total: ${urls.length} URLs`);
console.log(`# Site: ${SITE_URL}`);
console.log(`# Generated: ${new Date().toISOString()}`);
console.log("");

for (const url of urls) {
  console.log(url);
}
