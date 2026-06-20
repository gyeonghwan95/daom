import type { MetadataRoute } from "next";
import { seoBrand } from "@/lib/seo/brand";
import { siteImages } from "@/lib/site-images";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoBrand.siteName,
    short_name: "다옴법무사",
    description: seoBrand.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#1e3a5f",
    lang: "ko",
    dir: "ltr",
    icons: [
      {
        src: siteImages.logo.src,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
