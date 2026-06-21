import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/**
 * Default build: Node/server (admin API, on-demand 네이버 블로그 갱신).
 * Static export (`npm run build:static`): `out/` — API·관리자 갱신 미포함.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
  async redirects() {
    if (isStaticExport) return [];
    return [
      {
        source: "/cases",
        destination: "/services#cases",
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
    ];
  },
};

export default withMDX(nextConfig);
