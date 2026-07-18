import type { MetadataRoute } from "next";
import {
  getContentMeta,
  getAllContent,
} from "@/lib/content/loader";
import { CORE_HUB_SLUGS } from "@/lib/hub/registry";
import { getLocalLandingConfig } from "@/lib/local-landing/config";
import { getCaseRegionBySlug } from "@/lib/case-regions";
import { getAllPageData } from "@/lib/pageData/registry";
import type { PageData } from "@/lib/pageData/types";
import { getPressArticle } from "@/lib/press-articles";
import { siteConfig } from "@/lib/site";

/** 색인 대상 path (레거시 리다이렉트·noindex 제외) */
export function isIndexablePagePath(path: string): boolean {
  if (path.startsWith("/cases/")) return false;
  if (path === "/press" || path.startsWith("/press/")) return false;
  if (path.startsWith("/blog/external/")) return false;
  if (path.startsWith("/업무사례/")) {
    const slug = decodeURIComponent(path.slice("/업무사례/".length));
    if (slug === "지역별" || slug === "업무별") return true;
    const entry = getCaseRegionBySlug(slug);
    if (entry) {
      if (!entry.indexable) return false;
      if (entry.canonicalSlug && entry.canonicalSlug !== entry.slug) return false;
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

function pathToLastModified(page: PageData): Date {
  const { path } = page;

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
    return new Date(getAllContent("blog")[0]?.date ?? Date.now());
  }

  return new Date();
}

function pathChangeFrequency(
  page: PageData,
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (page.path === "/") return "weekly";
  if (page.category === "blog" || page.category === "faq") return "monthly";
  if (page.category === "media" || page.category === "external") return "yearly";
  return "monthly";
}

/** sitemap priority 규칙 */
export function getSitemapPriority(page: PageData): number {
  if (page.path === "/") return 1;

  if (
    CORE_HUB_SLUGS.has(page.slug) ||
    page.category === "pillar" ||
    page.category === "diagnosis" ||
    page.category === "situation" ||
    page.category === "tool" ||
    page.category === "glossary" ||
    page.path === "/services" ||
    page.path === "/situations" ||
    page.path === "/tools" ||
    page.path === "/glossary" ||
    page.path === "/cases" ||
    page.path === "/업무사례" ||
    page.path === "/업무사례/지역별" ||
    page.path === "/busan-legal-map"
  ) {
    return 0.9;
  }

  if (
    page.category === "local" ||
    page.category === "court" ||
    page.category === "businessDistrict" ||
    page.category === "realEstate" ||
    (page.category === "service" && !page.path.includes("/cases/"))
  ) {
    return 0.8;
  }

  if (page.category === "cost") {
    return 0.75;
  }

  const config = getLocalLandingConfig(page.slug);
  if (config?.pageType === "conversion") {
    return 0.75;
  }

  if (
    page.category === "blog" ||
    page.category === "case" ||
    page.category === "faq" ||
    page.category === "media"
  ) {
    return 0.7;
  }

  if (
    ["/contact", "/contact/inquiry", "/location", "/about", "/office"].includes(page.path)
  ) {
    return 0.85;
  }

  return 0.75;
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const pages = getIndexablePageData();

  return pages.map((page) => ({
    url: pathToSitemapUrl(page.path),
    lastModified: pathToLastModified(page),
    changeFrequency: pathChangeFrequency(page),
    priority: getSitemapPriority(page),
  }));
}

export const EXPECTED_SITEMAP_URL_COUNT = (): number =>
  getIndexablePagePaths().length;
