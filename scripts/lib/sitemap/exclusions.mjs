/** sitemap·IndexNow에서 제외할 redirect·noindex·비공개 경로 */
export const REDIRECT_EXACT = new Set(["/cases", "/press"]);

export const REDIRECT_PREFIXES = ["/cases/", "/press/", "/blog/external/"];

export const NOINDEX_EXACT = new Set(["/search"]);

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
