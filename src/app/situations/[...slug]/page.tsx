import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SituationCategoryHubView } from "@/components/situations/SituationCategoryHubView";
import { SituationPageView } from "@/components/situations/SituationPageView";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import {
  getAllSituationCategorySlugs,
  getAllSituationSlugs,
  getSituationCategoryBySlug,
  resolveSituationCategoryHubPageData,
  resolveSituationPageData,
} from "@/lib/situations";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const detailParams = getAllSituationSlugs().map((slug) => ({
    slug: [slug],
  }));

  const categoryParams = getAllSituationCategorySlugs().map((categorySlug) => ({
    slug: ["분류", categorySlug],
  }));

  return [...detailParams, ...categoryParams];
}

function normalizeSegments(raw: string[]): string[] {
  return raw.map((segment) => normalizeRouteSlug(segment));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: segments } = await params;
  const normalized = normalizeSegments(segments);

  if (normalized.length === 2 && normalized[0] === "분류") {
    const page = resolveSituationCategoryHubPageData(normalized[1]);
    if (!page) return {};
    return pageDataToMetadata(page);
  }

  if (normalized.length === 1) {
    const page = resolveSituationPageData(normalized[0]);
    if (!page) return {};
    return pageDataToMetadata(page);
  }

  return {};
}

export default async function SituationCatchAllPage({ params }: Props) {
  const { slug: segments } = await params;
  const normalized = normalizeSegments(segments);

  if (normalized.length === 2 && normalized[0] === "분류") {
    const category = getSituationCategoryBySlug(normalized[1]);
    const page = resolveSituationCategoryHubPageData(normalized[1]);
    if (!category || !page) notFound();

    return (
      <PageContainer>
        <SituationCategoryHubView page={page} categoryId={category.id} />
      </PageContainer>
    );
  }

  if (normalized.length === 1) {
    const situationSlug = normalized[0];
    const page = resolveSituationPageData(situationSlug);
    if (!page) notFound();

    return (
      <PageContainer>
        <SituationPageView page={page} slug={situationSlug} />
      </PageContainer>
    );
  }

  notFound();
}
