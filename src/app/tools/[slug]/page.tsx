import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ToolCalculatorView } from "@/components/tools/ToolCalculatorView";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { getAllToolSlugs, getToolBySlug, resolveToolPageData } from "@/lib/tools";
import {
  recommendationFromTool,
  recommendInternalLinks,
} from "@/lib/internal-links/server";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveToolPageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);
  const page = resolveToolPageData(normalized);
  if (!page) notFound();

  const tool = getToolBySlug(normalized);
  const recommendationGroups = tool
    ? recommendInternalLinks(recommendationFromTool(tool))
    : {};

  return (
    <PageContainer>
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />
      <ToolCalculatorView
        page={page}
        slug={normalized}
        recommendationGroups={recommendationGroups}
      />
    </PageContainer>
  );
}
