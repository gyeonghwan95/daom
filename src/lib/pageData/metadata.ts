import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import type { PageData } from "./types";

export function pageDataToMetadata(page: PageData): Metadata {
  return createPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: page.primaryKeywords,
    ogImage: page.ogImage,
    openGraphType: page.openGraphType ?? "website",
  });
}
