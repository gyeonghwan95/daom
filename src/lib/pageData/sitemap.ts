import {
  getContentMeta,
  getAllContent,
} from "@/lib/content/loader";
import { getCaseRegionBySlug } from "@/lib/case-regions";
import { getAllPageData } from "@/lib/pageData/registry";
import type { PageData } from "@/lib/pageData/types";
import { getPressArticle } from "@/lib/press-articles";
import { siteConfig } from "@/lib/site";

/** 색인 대상 path (레거시 리다이렉트·noindex 제외) — sitemap manifest 생성과 동일 기준 */
export function isIndexablePagePath(path: string): boolean {
  if (path.startsWith("/cases/")) return false;
  if (path === "/press" || path.startsWith("/press/")) return false;
  if (path.startsWith("/blog/external/")) return false;
  if (path === "/search") return false;
  if (path === "/cases" || path === "/press") return false;
  if (path.startsWith("/admin") || path.startsWith("/api/")) return false;
  if (path.startsWith("/업무사례/")) {
    const slug = decodeURIComponent(path.slice("/업무사례/".length));
    if (slug === "지역별" || slug === "업무별") return true;
    const entry = getCaseRegionBySlug(slug);
    if (entry) {
      if (!entry.indexable) return false;
      if (entry.canonicalSlug && entry.canonicalSlug !== entry.slug) return false;
      return true;
    }
  }
  return true;
}

export function getIndexablePageData(): PageData[] {
  return getAllPageData().filter((page) => isIndexablePagePath(page.path));
}

export function getIndexablePagePaths(): string[] {
  return getIndexablePageData().map((page) => page.path);
}

/** sitemap <loc> — 한글 path 세그먼트 퍼센트 인코딩 */
export function pathToSitemapUrl(path: string): string {
  if (path === "/") {
    return siteConfig.url;
  }

  const segments = path.split("/").filter(Boolean);
  const encoded = segments
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${siteConfig.url}/${encoded}`;
}

export function decodeSitemapUrl(url: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (url === base || url === `${base}/`) return "/";

  const relative = url.startsWith(base) ? url.slice(base.length) : url;
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

/** 콘텐츠 날짜 기반 lastmod (알 수 없으면 undefined) */
export function pathToLastModified(path: string): Date | undefined {
  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const meta = getContentMeta("blog", blogMatch[1]);
    if (meta) return new Date(meta.date);
  }

  const pressMatch = path.match(/^\/media\/(.+)$/);
  if (pressMatch) {
    const article = getPressArticle(pressMatch[1]);
    if (article) return new Date(article.publishedAt);
  }

  const caseMatch = path.match(/^\/services\/cases\/(.+)$/);
  if (caseMatch) {
    const meta = getContentMeta("cases", caseMatch[1]);
    if (meta) return new Date(meta.date);
  }

  const faqMatch = path.match(/^\/faq\/(.+)$/);
  if (faqMatch) {
    const meta = getContentMeta("faq", faqMatch[1]);
    if (meta) return new Date(meta.date);
  }

  if (path === "/") {
    const latest = getAllContent("blog")[0]?.date;
    if (latest) return new Date(latest);
  }

  return undefined;
}

export const EXPECTED_SITEMAP_URL_COUNT = (): number =>
  getIndexablePagePaths().length;
