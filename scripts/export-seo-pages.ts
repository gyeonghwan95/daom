import { isCoreHubSlug } from "@/lib/hub";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { getAllPageData } from "@/lib/pageData/registry";
import {
  isIndexablePagePath,
  pathToSitemapUrl,
} from "@/lib/pageData/sitemap";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { normalizeRouteSlug } from "@/lib/seo/slug";

export type SeoPageExport = {
  path: string;
  slug: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  canonical: string;
  ctaTitle: string;
  ctaText: string;
  faqCount: number;
  internalLinkCount: number;
  internalLinks: string[];
  relatedLinks: string[];
  jsonLdCount: number;
  isCoreHub: boolean;
  sitemapUrl: string;
};

function exportSeoPages(): SeoPageExport[] {
  return getAllPageData()
    .filter((page) => isIndexablePagePath(page.path))
    .map((page) => ({
      path: page.path,
      slug: page.slug,
      category: page.category,
      metaTitle: page.metaTitle.trim(),
      metaDescription: page.metaDescription.trim(),
      h1: page.h1.trim(),
      canonical: getCanonicalUrl(page.path),
      ctaTitle: page.ctaTitle.trim(),
      ctaText: page.ctaText.trim(),
      faqCount: page.faqs.length,
      internalLinkCount: page.internalLinks.length,
      internalLinks: page.internalLinks.map((link) => link.href),
      relatedLinks: page.relatedLinks.map((link) => link.href),
      jsonLdCount: buildJsonLdForPageData(page).length,
      isCoreHub: isCoreHubSlug(page.slug),
      sitemapUrl: pathToSitemapUrl(page.path),
    }));
}

const pages = exportSeoPages();

const pathSet = new Set(pages.map((p) => normalizeRouteSlug(p.path)));
if (pathSet.size !== pages.length) {
  throw new Error(
    `[export-seo-pages] duplicate indexable paths in pageData (${pages.length - pathSet.size} duplicates)`,
  );
}

export default {
  ok: true,
  total: pages.length,
  paths: pages.map((p) => p.path),
  pages,
};
