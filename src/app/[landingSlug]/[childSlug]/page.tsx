import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { LectureHistoryDetailView } from "@/components/lectures/history/LectureHistoryDetailView";
import {
  getAllLectureHistorySlugs,
  getLectureHistoryBySlug,
} from "@/data/lectures/history";
import { buildLectureHistoryDetailPageData } from "@/lib/lectures/history-page-data";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ landingSlug: string; childSlug: string }>;
};

export const dynamicParams = false;

/** `/강의이력/[slug]` — 한글 물리 폴더 대신 dynamic segment 사용 */
export function generateStaticParams() {
  return getAllLectureHistorySlugs().map((slug) => ({
    landingSlug: "강의이력",
    childSlug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { landingSlug, childSlug } = await params;
  if (normalizeRouteSlug(landingSlug) !== "강의이력") return {};
  const entry = getLectureHistoryBySlug(normalizeRouteSlug(childSlug));
  if (!entry) return {};
  return pageDataToMetadata(buildLectureHistoryDetailPageData(entry));
}

export default async function LectureHistoryChildPage({ params }: Props) {
  const { landingSlug, childSlug } = await params;
  if (normalizeRouteSlug(landingSlug) !== "강의이력") notFound();

  const entry = getLectureHistoryBySlug(normalizeRouteSlug(childSlug));
  if (!entry) notFound();

  const page = buildLectureHistoryDetailPageData(entry);

  return (
    <PageContainer>
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />
      <article>
        <LectureHistoryDetailView entry={entry} />
      </article>
    </PageContainer>
  );
}
