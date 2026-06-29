import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SituationPageView } from "@/components/situations/SituationPageView";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import {
  getAllSituationSlugs,
  resolveSituationPageData,
} from "@/lib/situations";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSituationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveSituationPageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function SituationDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);
  const page = resolveSituationPageData(normalized);
  if (!page) notFound();

  return (
    <PageContainer>
      <SituationPageView page={page} slug={normalized} />
    </PageContainer>
  );
}
