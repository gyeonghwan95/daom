import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/**
 * Default build: static export → out/ (Cloudflare Pages 등).
 * Server build (admin API): `npm run build:server`
 *
 * Static export에서는 redirects 키 자체를 넣지 않음.
 * (빈 배열을 반환해도 Next가 "redirects will not work with output: export" 경고를 냄)
 * 레거시 URL은 public/_redirects → Cloudflare Pages가 처리.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const serverOnlyRedirects = [
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
] as const;

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  ...(isStaticExport
    ? {
        output: "export" as const,
        // build-static.mjs 가 API 라우트를 임시 제거하므로, typedRoutes/타입체크가
        // 사라진 route 모듈을 찾지 못해 실패할 수 있음. 정적 HTML만 배포하므로 허용.
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
  images: {
    unoptimized: true,
    // next/image quality must be listed here (default is [75] only).
    qualities: [55, 72, 75, 80, 85],
  },
  ...(!isStaticExport
    ? {
        async redirects() {
          return [...serverOnlyRedirects];
        },
      }
    : {}),
};

export default withMDX(nextConfig);
