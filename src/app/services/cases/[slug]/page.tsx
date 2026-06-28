import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompiledContent, getContentSlugs } from "@/lib/content/loader";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
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
  const item = await getCompiledContent("cases", normalized);
  if (!page || !item) notFound();

  const { meta, content } = item;

  return (
    <PageContainer>
      <JsonLd data={buildArticleSchema(meta, getCaseImage(meta.slug).src)} />
      <PageDataTemplate page={page}>{content}</PageDataTemplate>
    </PageContainer>
  );
}
