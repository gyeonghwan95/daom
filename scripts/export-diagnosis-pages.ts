import { allDiagnoses } from "@/data/diagnosis-registry";
import { buildPageDataFromDiagnosis } from "@/lib/diagnosis/builder";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { pathToSitemapUrl } from "@/lib/pageData/sitemap";
import { getCanonicalUrl } from "@/lib/seo/metadata";

export type DiagnosisPageExport = {
  slug: string;
  path: string;
  isHub: boolean;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  questionCount: number;
  outcomeCount: number;
  ctaTitle: string;
  ctaText: string;
  relatedLinkCount: number;
  relatedLinks: string[];
  faqCount: number;
  canonical: string;
  sitemapUrl: string;
  jsonLdCount: number;
  hasOgImage: boolean;
};

function exportDiagnosisPages(): DiagnosisPageExport[] {
  return allDiagnoses.map((diagnosis) => {
    const path = `/${diagnosis.slug}`;
    const pageData = buildPageDataFromDiagnosis(diagnosis);

    return {
      slug: diagnosis.slug,
      path,
      isHub: Boolean(diagnosis.isHub),
      h1: diagnosis.h1.trim(),
      metaTitle: diagnosis.metaTitle.trim(),
      metaDescription: diagnosis.metaDescription.trim(),
      questionCount: diagnosis.questions.length,
      outcomeCount: diagnosis.outcomes.length,
      ctaTitle: diagnosis.ctaTitle.trim(),
      ctaText: diagnosis.ctaText.trim(),
      relatedLinkCount: diagnosis.relatedLinks.length,
      relatedLinks: diagnosis.relatedLinks.map((link) => link.href),
      faqCount: diagnosis.faqs.length,
      canonical: getCanonicalUrl(path),
      sitemapUrl: pathToSitemapUrl(path),
      jsonLdCount: buildJsonLdForPageData(pageData).length,
      hasOgImage: Boolean(pageData.ogImage),
    };
  });
}

const diagnoses = exportDiagnosisPages();

export default {
  ok: true,
  total: diagnoses.length,
  slugs: diagnoses.map((item) => item.slug),
  paths: diagnoses.map((item) => item.path),
  diagnoses,
};
