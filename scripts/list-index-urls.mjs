#!/usr/bin/env node
/**
 * sitemap과 동일 기준으로 색인 제출용 전체 URL 목록 출력
 */
import { getSiteUrl } from "./lib/site-url.mjs";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";

const SITE_URL = getSiteUrl().replace(/\/$/, "");
const paths = getAllPublishedPaths();
const urls = paths.map((p) => (p === "/" ? SITE_URL : `${SITE_URL}${p}`));

console.log(`# Total: ${urls.length} URLs`);
console.log(`# Site: ${SITE_URL}`);
console.log(`# Generated: ${new Date().toISOString()}`);
console.log("");

for (const url of urls) {
  console.log(url);
}
