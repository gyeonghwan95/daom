import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlossaryTermView } from "@/components/glossary/GlossaryTermView";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getGlossaryTermSlugs,
  resolveGlossaryTermPageData,
} from "@/lib/glossary";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getGlossaryTermSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveGlossaryTermPageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);
  const page = resolveGlossaryTermPageData(normalized);
  if (!page) notFound();

  return (
    <PageContainer>
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />
      <GlossaryTermView page={page} slug={normalized} />
    </PageContainer>
  );
}
