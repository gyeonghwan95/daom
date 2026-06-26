import Link from "next/link";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { serviceLabels } from "@/lib/local-landing/districts";
import {
  getConversionLandingLinks,
  getCourtRegistryLinks,
  getLocalLandingLinksForRegion,
  getLocalServiceCrossLinks,
  getRegionHubLinks,
  getRelatedLinksByPageType,
  getTopicHubLinksForLanding,
  serviceHubLinks,
} from "@/lib/seo/internal-links";
import type { LocalLandingPageType } from "@/types/local-landing";

type LocalLandingInternalLinksProps = {
  currentSlug: string;
  regionKey: string;
  serviceSlug: string;
  regionLabel: string;
  pageType: LocalLandingPageType;
  relatedServiceLinks: { href: string; label: string }[];
  relatedRegionLinks: { href: string; label: string }[];
};

export function LocalLandingInternalLinks({
  currentSlug,
  regionKey,
  serviceSlug,
  regionLabel,
  pageType,
  relatedServiceLinks,
  relatedRegionLinks,
}: LocalLandingInternalLinksProps) {
  const serviceLinks =
    relatedServiceLinks.length > 0
      ? relatedServiceLinks
      : getRelatedLinksByPageType(pageType, currentSlug);

  const regionLinks =
    relatedRegionLinks.length > 0
      ? relatedRegionLinks
      : pageType === "region-hub"
        ? getLocalServiceCrossLinks(regionKey, currentSlug)
        : getLocalLandingLinksForRegion(regionLabel, currentSlug);

  return (
    <div className="space-y-8">
      {getTopicHubLinksForLanding(serviceSlug).length > 0 ? (
        <RelatedLinks
          title="업무 종합 허브"
          links={getTopicHubLinksForLanding(serviceSlug)}
        />
      ) : null}
      <RelatedLinks title="관련 업무 보기" links={serviceLinks} />
      <RelatedLinks
        title="관련 지역 안내"
        links={
          pageType === "region-hub"
            ? getRegionHubLinks(currentSlug)
            : regionLinks
        }
      />
      {pageType !== "conversion" ? (
        <RelatedLinks
          title="비용·서류 안내"
          links={getConversionLandingLinks(currentSlug).slice(0, 5)}
        />
      ) : null}
      {pageType !== "court-registry" ? (
        <RelatedLinks
          title="법원·등기소 안내"
          links={getCourtRegistryLinks(currentSlug)}
        />
      ) : null}
      <RelatedLinks title="사무소 안내" links={serviceHubLinks} />
      <p className="text-sm text-navy/60">
        전국 업무 안내는{" "}
        <Link href={`/services/${serviceSlug}`} className="font-medium text-navy-light hover:underline">
          {serviceLabels[serviceSlug] ?? serviceSlug} 업무 상세
        </Link>
        에서도 확인하실 수 있습니다.
      </p>
    </div>
  );
}
