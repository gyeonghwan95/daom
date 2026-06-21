import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxArticleLayout } from "@/components/content/MdxArticleLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompiledContent, getContentSlugs } from "@/lib/content/loader";
import { createPageMetadata } from "@/lib/metadata";
import { resolveContentSeoTitle } from "@/lib/seo/metadata";
import { buildArticleSchema } from "@/lib/seo/json-ld";
import { getCaseImage } from "@/lib/site-images";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getContentSlugs("cases").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCompiledContent("cases", slug);
  if (!item) return {};

  const { meta } = item;
  return createPageMetadata({
    title: resolveContentSeoTitle(meta.title, meta.seoTitle),
    description: meta.seoDescription ?? meta.description,
    path: `/services/cases/${meta.slug}`,
    keywords: [...meta.tags, meta.category, "부산 법무사"],
    ogImage: getCaseImage(meta.slug).src,
    openGraphType: "article",
    publishedTime: meta.date,
    authors: [meta.author],
  });
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCompiledContent("cases", slug);
  if (!item) notFound();

  const { meta, content } = item;
  const image = getCaseImage(meta.slug).src;

  return (
    <MdxArticleLayout
      meta={meta}
      listLabel="업무안내"
      listHref="/services#cases"
    >
      <JsonLd data={buildArticleSchema(meta, image)} />
      {content}
    </MdxArticleLayout>
  );
}
