import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { CaseDetailView } from "@/components/cases/CaseDetailView";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCaseRecord } from "@/lib/cases";
import { getContentMeta, getContentSlugs } from "@/lib/content/loader";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { resolveCasePageData } from "@/lib/pageData/resolvers";
import { buildArticleSchema } from "@/lib/seo/json-ld";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { getCaseImage } from "@/lib/site-images";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getContentSlugs("cases").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveCasePageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);
  const page = resolveCasePageData(normalized);
  const record = getCaseRecord(normalized);
  const meta = getContentMeta("cases", normalized);
  if (!page || !record || !meta) notFound();

  const faqLinks = record.relatedFaqs
    .map((faqSlug) => {
      const meta = getContentMeta("faq", faqSlug);
      if (!meta) return null;
      return { href: meta.href, label: meta.title };
    })
    .filter((link): link is { href: string; label: string } => link !== null);

  return (
    <PageContainer>
      <JsonLd data={buildArticleSchema(meta, getCaseImage(record.slug).src)} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />
      <CaseDetailView page={page} record={record} faqLinks={faqLinks} />
    </PageContainer>
  );
}
