import type { MetadataRoute } from "next";
import {
  getAllContent,
  getContentMeta,
  getContentSlugs,
} from "@/lib/content/loader";
import { getPressArticleSlugs, getPressArticle } from "@/lib/press-articles";
import {
  getNaverBlogExternalPath,
} from "@/lib/naver-blog/urls";
import {
  getNaverBlogExternalPostIds,
  getNaverBlogPostByPostId,
} from "@/lib/naver-blog/urls.server";
import { getAllLocalLandingSlugs } from "@/lib/local-landing";
import { getAllSitePaths } from "@/lib/seo/routes";
import { getAllServiceSlugs } from "@/lib/services-data";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function pathToLastModified(path: string): Date {
  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const blogSlug = blogMatch[1];
    if (blogSlug.startsWith("external/")) {
      const postId = blogSlug.replace(/^external\//, "");
      const post = getNaverBlogPostByPostId(postId);
      if (post) return new Date(post.pubDate);
    }
    const meta = getContentMeta("blog", blogSlug);
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

  if (path === "/") return new Date(getAllContent("blog")[0]?.date ?? Date.now());

  return new Date();
}

function pathPriority(path: string): number {
  if (path === "/") return 1;
  const localPaths = new Set(getAllLocalLandingSlugs().map((slug) => `/${slug}`));
  if (localPaths.has(path)) return 0.88;
  if (path.startsWith("/services/")) return 0.9;
  if (path.startsWith("/faq/")) return 0.85;
  if (path.startsWith("/blog/") || path.startsWith("/services/cases/") || path.startsWith("/media/")) return 0.8;
  if (path === "/contact" || path === "/location") return 0.85;
  return 0.75;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const faqSlugs = getContentSlugs("faq");
  const naverBlogPaths = getNaverBlogExternalPostIds().map((postId) =>
    getNaverBlogExternalPath(postId),
  );
  const paths = [
    ...getAllSitePaths(
      getAllServiceSlugs(),
      getContentSlugs("blog"),
      getContentSlugs("cases"),
      faqSlugs,
      getPressArticleSlugs(),
      getAllLocalLandingSlugs(),
    ),
    ...naverBlogPaths,
  ];

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
