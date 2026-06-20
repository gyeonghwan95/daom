import type { MetadataRoute } from "next";
import {
  getAllContent,
  getContentMeta,
  getContentSlugs,
} from "@/lib/content/loader";
import { getAllSitePaths } from "@/lib/seo/routes";
import { getAllServiceSlugs } from "@/lib/services-data";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function pathToLastModified(path: string): Date {
  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const meta = getContentMeta("blog", blogMatch[1]);
    if (meta) return new Date(meta.date);
  }

  const caseMatch = path.match(/^\/cases\/(.+)$/);
  if (caseMatch) {
    const meta = getContentMeta("cases", caseMatch[1]);
    if (meta) return new Date(meta.date);
  }

  const faqMatch = path.match(/^\/faq\/(.+)$/);
  if (faqMatch) {
    const meta = getContentMeta("faq", faqMatch[1]);
    if (meta) return new Date(meta.date);
  }

  if (path === "/") return new Date(getAllContent("blog")[0]?.date ?? Date.now());

  return new Date();
}

function pathPriority(path: string): number {
  if (path === "/") return 1;
  if (path.startsWith("/services/")) return 0.9;
  if (path.startsWith("/faq/")) return 0.85;
  if (path.startsWith("/blog/") || path.startsWith("/cases/")) return 0.8;
  if (path === "/contact" || path === "/location") return 0.85;
  return 0.75;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const faqSlugs = getContentSlugs("faq");
  const paths = getAllSitePaths(
    getAllServiceSlugs(),
    getContentSlugs("blog"),
    getContentSlugs("cases"),
    faqSlugs,
  );

  return paths.map((path) => ({
    url: path === "/" ? siteConfig.url : `${siteConfig.url}${path}`,
    lastModified: pathToLastModified(path),
    changeFrequency:
      path === "/"
        ? "weekly"
        : path.startsWith("/blog") || path.startsWith("/faq")
          ? "monthly"
          : "monthly",
    priority: pathPriority(path),
  }));
}
