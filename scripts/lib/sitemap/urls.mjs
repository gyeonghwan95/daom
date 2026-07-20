import { getSiteUrl } from "../site-url.mjs";

const FORBIDDEN_HOST_PATTERNS = [
  /pages\.dev/i,
  /daom-law\.com/i,
  /^http:/i,
  /\/\/www\./i,
];

/** path → sitemap/canonical 절대 URL (path 세그먼트 percent-encode) */
export function pathToAbsoluteUrl(routePath, siteUrl = getSiteUrl().replace(/\/$/, "")) {
  if (routePath === "/") return siteUrl;
  const segments = routePath.split("/").filter(Boolean);
  const encoded = segments.map((segment) => encodeURIComponent(segment)).join("/");
  return `${siteUrl}/${encoded}`;
}

export function decodeUrlPath(url, siteUrl = getSiteUrl().replace(/\/$/, "")) {
  if (url === siteUrl || url === `${siteUrl}/`) return "/";
  const relative = url.startsWith(siteUrl) ? url.slice(siteUrl.length) : url;
  const decoded = relative
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
  return `/${decoded}`;
}

export function normalizeRoutePath(routePath) {
  if (!routePath || routePath === "/") return "/";
  if (routePath.includes("?") || routePath.includes("#")) {
    throw new Error(`invalid sitemap path (query/hash): ${routePath}`);
  }
  const normalized = routePath.startsWith("/") ? routePath : `/${routePath}`;
  return normalized.replace(/\/+$/, "") || "/";
}

export function assertCanonicalSiteUrl(url) {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  if (!url.startsWith(siteUrl)) {
    throw new Error(`domain mismatch: expected ${siteUrl}, got ${url}`);
  }
  for (const pattern of FORBIDDEN_HOST_PATTERNS) {
    if (pattern.test(url)) {
      throw new Error(`forbidden host in URL: ${url}`);
    }
  }
}
