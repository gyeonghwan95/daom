import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const POLICY_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../seo/index-policy.json",
);

function loadNoindexPaths() {
  const paths = new Set(["/search"]);
  try {
    const policy = JSON.parse(fs.readFileSync(POLICY_PATH, "utf8"));
    for (const item of policy.noindex ?? []) paths.add(item);
  } catch {
    // policy 파일이 없으면 /search만 유지
  }
  return paths;
}

/** sitemap·IndexNow에서 제외할 redirect·noindex·비공개 경로 */
export const REDIRECT_EXACT = new Set(["/cases", "/press"]);

export const REDIRECT_PREFIXES = ["/cases/", "/press/", "/blog/external/"];

export const NOINDEX_EXACT = loadNoindexPaths();

export const BLOCKED_PREFIXES = ["/admin", "/api/"];

export function getExclusionReason(routePath) {
  if (routePath.includes("?") || routePath.includes("#")) {
    return "query-or-hash-url";
  }
  if (NOINDEX_EXACT.has(routePath)) return "noindex";
  if (REDIRECT_EXACT.has(routePath)) return "redirect";
  for (const prefix of REDIRECT_PREFIXES) {
    if (routePath.startsWith(prefix)) return "redirect";
  }
  for (const prefix of BLOCKED_PREFIXES) {
    if (routePath === prefix || routePath.startsWith(`${prefix}/`) || routePath.startsWith(prefix)) {
      return "blocked-path";
    }
  }
  return null;
}

export function isSitemapEligible(routePath) {
  return getExclusionReason(routePath) === null;
}
