import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/**
 * Default build: static export → out/ (Cloudflare Pages 등).
 * Server build (admin API): `npm run build:server`
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
    // next/image quality must be listed here (default is [75] only).
    qualities: [55, 72, 75, 80, 85],
  },
  async redirects() {
    if (isStaticExport) return [];
    return [
      {
        source: "/cases",
        destination: "/업무사례",
        permanent: true,
      },
      {
        source: "/cases/:slug",
        destination: "/services/cases/:slug",
        permanent: true,
      },
      {
        source: "/press",
        destination: "/media#press",
        permanent: true,
      },
      {
        source: "/press/:slug",
        destination: "/media/:slug",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/개인정보처리방침",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/개인정보처리방침",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/이용약관",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/이용약관",
        permanent: true,
      },
      {
        source: "/terms-of-use",
        destination: "/이용약관",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
