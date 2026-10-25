import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ResourceGuideView } from "@/components/resources/ResourceGuideView";
import { getResourceGuide, RESOURCE_GUIDES, resourcePath } from "@/data/resources/guides";
import { resourceAssetPaths } from "@/lib/resources/asset-paths";
import { buildSeoTitle, createPageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return RESOURCE_GUIDES.map((g) => ({ slug: g.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getResourceGuide(slug);
  if (!guide) return {};
  return createPageMetadata({
    title: buildSeoTitle(guide.title),
    description: guide.description,
    path: resourcePath(guide.slug),
    ogImage: resourceAssetPaths(guide.slug).og,
    ogImageAlt: guide.h1,
    ogImageWidth: 1200,
    ogImageHeight: 1200,
    openGraphType: "article",
  });
}

export default async function ResourceGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getResourceGuide(slug);
  if (!guide) notFound();
  return (
    <PageContainer>
      <ResourceGuideView guide={guide} />
    </PageContainer>
  );
}
