import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DiagnosisHubView,
  DiagnosisPageView,
} from "@/components/diagnosis/DiagnosisPageView";
import { PreservationRegistrationPageView } from "@/components/local-landing/PreservationRegistrationPageView";
import { PublicAgencyRegistrationPageView } from "@/components/local-landing/PublicAgencyRegistrationPageView";
import { SelectionHubPageView } from "@/components/local-landing/SelectionHubPageView";
import { SearchIntentPageView } from "@/components/local-landing/SearchIntentPageView";
import { PracticeHubPageView } from "@/components/local-landing/PracticeHubPageView";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import {
  diagnosisTopicPages,
  getRawDiagnosisBySlug,
} from "@/data/diagnosis-registry";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveKoreanLandingPageData } from "@/lib/pageData/resolvers";
import { getLocalLandingConfig } from "@/lib/local-landing/config";
import { practiceHubDefs } from "@/lib/local-landing/practice-hubs";
import { getKoreanSlugStaticParams } from "@/lib/seo/site-routes";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type PageProps = {
  params: Promise<{ landingSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getKoreanSlugStaticParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { landingSlug } = await params;
  const page = resolveKoreanLandingPageData(normalizeRouteSlug(landingSlug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function LocalLandingPage({ params }: PageProps) {
  const { landingSlug } = await params;
  const slug = normalizeRouteSlug(landingSlug);
  const page = resolveKoreanLandingPageData(slug);
  if (!page) notFound();

  const diagnosis = getRawDiagnosisBySlug(slug);

  if (diagnosis?.isHub) {
    return (
      <PageContainer>
        <DiagnosisHubView page={page} topics={diagnosisTopicPages} />
      </PageContainer>
    );
  }

  if (diagnosis) {
    return (
      <PageContainer>
        <DiagnosisPageView page={page} diagnosis={diagnosis} />
      </PageContainer>
    );
  }

  const landingConfig = getLocalLandingConfig(slug);
  if (landingConfig?.pageType === "preservation-registration") {
    return (
      <PageContainer>
        <PreservationRegistrationPageView page={page} />
      </PageContainer>
    );
  }

  if (landingConfig?.pageType === "public-agency-registration") {
    return (
      <PageContainer>
        <PublicAgencyRegistrationPageView page={page} />
      </PageContainer>
    );
  }

  if (landingConfig?.pageType === "selection-hub") {
    return (
      <PageContainer>
        <SelectionHubPageView page={page} />
      </PageContainer>
    );
  }

  if (landingConfig?.pageType === "search-intent") {
    const hub = practiceHubDefs[slug];
    if (hub) {
      return (
        <PageContainer>
          <PracticeHubPageView
            page={page}
            intro={hub.intro}
            cards={hub.cards}
            note={hub.note}
          />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <SearchIntentPageView page={page} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageDataTemplate page={page} />
    </PageContainer>
  );
}
