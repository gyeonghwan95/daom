import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompiledContent, getContentSlugs } from "@/lib/content/loader";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveBlogPageData } from "@/lib/pageData/resolvers";
import { buildArticleSchema } from "@/lib/seo/json-ld";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { recommendationFromContentMeta } from "@/lib/internal-links";
import { getBlogPostImage } from "@/lib/site-images";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getContentSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveBlogPageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);
  const page = resolveBlogPageData(normalized);
  const post = await getCompiledContent("blog", normalized);
  if (!page || !post) notFound();

  const { meta, content } = post;

  return (
    <PageContainer>
      <JsonLd data={buildArticleSchema(meta, getBlogPostImage(meta.slug).src)} />
      <PageDataTemplate
        page={page}
        recommendationSource={recommendationFromContentMeta(meta, "blog")}
      >
        {content}
      </PageDataTemplate>
    </PageContainer>
  );
}
