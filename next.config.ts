import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/**
 * Static export for free static hosting (Cloudflare Pages, Vercel static, etc.).
 * - Build output: `out/`
 * - No Node.js server required in production
 * - To move to Vercel later: keep `output: "export"` and set output dir to `out`
 */
const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withMDX(nextConfig);
