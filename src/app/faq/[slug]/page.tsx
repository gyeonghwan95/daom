import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompiledContent, getContentSlugs } from "@/lib/content/loader";
import { faqs } from "@/lib/faq-data";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveFaqPageData } from "@/lib/pageData/resolvers";
import { buildSingleFaqSchema } from "@/lib/seo/json-ld";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getContentSlugs("faq").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveFaqPageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);
  const page = resolveFaqPageData(normalized);
  const item = await getCompiledContent("faq", normalized);
  if (!page || !item) notFound();

  const { meta, content } = item;
  const faqEntry = faqs.find((f) => f.slug === normalized);

  return (
    <PageContainer>
      <JsonLd
        data={buildSingleFaqSchema(
          faqEntry ?? {
            question: meta.title,
            answer: meta.description,
            slug: normalized,
            href: meta.href,
          },
        )}
      />
      <PageDataTemplate page={page}>{content}</PageDataTemplate>
    </PageContainer>
  );
}
