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
    // 정적 export라 Next 이미지 서버가 없다. scripts/optimize-images.mjs가 빌드 전에
    // public/_img/ 에 폭별 WebP를 만들고, 로더가 srcset에서 그 파일을 고른다.
    // 폭 단계는 scripts/optimize-images.mjs VARIANT_WIDTHS와 같아야 한다.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [256, 384],
    // next/image quality must be listed here (default is [75] only).
    qualities: [55, 72, 75, 80, 85],
  },
  // 개발 서버·build:server(Turbopack)용 — 아래 webpack 설정과 같은 일을 한다(브라우저에서만 빈 모듈).
  turbopack: {
    resolveAlias: {
      "@/data/seo/page-og-thumbnails": {
        browser: "./src/data/seo/page-og-thumbnails.client.ts",
      },
    },
  },
  webpack(config, { isServer, webpack }) {
    // 페이지별 1:1 썸네일 맵(src/data/seo/page-og-thumbnails.ts)은 서버 렌더링에서만 쓴다.
    // 공용 SEO 모듈을 거쳐 클라이언트 번들에 실리지 않도록 브라우저 빌드에서는 빈 모듈로 바꾼다.
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /[\/]page-og-thumbnails$/,
          (resource: { request: string }) => {
            resource.request = resource.request.replace(/page-og-thumbnails$/, "page-og-thumbnails.client");
          },
        ),
      );
    }
    return config;
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
