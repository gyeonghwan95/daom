import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveServicePageData } from "@/lib/pageData/resolvers";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { getAllServiceSlugs } from "@/lib/services-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveServicePageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = resolveServicePageData(normalizeRouteSlug(slug));
  if (!page) notFound();

  return (
    <PageContainer>
      <PageDataTemplate page={page} />
    </PageContainer>
  );
}
