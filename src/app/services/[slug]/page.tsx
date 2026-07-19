import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { NationwideServiceNotice } from "@/components/nationwide/NationwideServiceNotice";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveServicePageData } from "@/lib/pageData/resolvers";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { getAllServiceSlugs, getServiceBySlug } from "@/lib/services-data";
import { recommendationFromService } from "@/lib/internal-links";

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
  const normalized = normalizeRouteSlug(slug);
  const page = resolveServicePageData(normalized);
  const service = getServiceBySlug(normalized);
  if (!page || !service) notFound();

  const nationwideType =
    normalized === "inheritance-registration"
      ? ("jurisdiction-exception" as const)
      : normalized === "corporate-registration" ||
          normalized === "company-establishment" ||
          normalized === "director-change"
        ? ("remote-accept" as const)
        : normalized === "inheritance-renunciation" ||
            normalized === "qualified-acceptance"
          ? ("remote-accept" as const)
          : null;

  return (
    <PageContainer>
      <PageDataTemplate
        page={page}
        recommendationSource={recommendationFromService(service)}
        heroAddon={
          nationwideType ? (
            <NationwideServiceNotice type={nationwideType} />
          ) : null
        }
      />
    </PageContainer>
  );
}
