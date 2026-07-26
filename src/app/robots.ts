import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

/**
 * robots.txt — Googlebot·Yeti 등 검색로봇 크롤 허용, 비공개·redirect 경로만 제한
 * sitemap: public/sitemap.xml (Tier 인덱스, prebuild 생성)
 * Sitemap URL 호스트는 getSiteUrl()(punycode)로 canonical·sitemap loc과 통일한다.
 */
export default function robots(): MetadataRoute.Robots {
  const sitemap = `${getSiteUrl()}/sitemap.xml`;

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
