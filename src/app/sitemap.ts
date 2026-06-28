import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/pageData/sitemap";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
