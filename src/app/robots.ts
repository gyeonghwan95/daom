import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/**
 * robots.txt — Googlebot·Yeti 등 검색로봇 크롤 허용, 비공개·redirect 경로만 제한
 * sitemap: public/sitemap.xml (Tier 인덱스, prebuild 생성)
 */
export default function robots(): MetadataRoute.Robots {
  const sitemap = `${siteConfig.url}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/search", "/blog/external/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/search", "/blog/external/"],
      },
      {
        userAgent: "Yeti",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/search", "/blog/external/"],
      },
    ],
    sitemap,
  };
}
