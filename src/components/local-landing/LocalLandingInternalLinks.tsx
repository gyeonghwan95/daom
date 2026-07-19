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
      {serviceSlug === "inheritance-registration" ? (
        <section
          className="rounded-2xl border border-beige-dark bg-white p-5 shadow-sm"
          aria-label="부산 외 지역 상속부동산"
        >
          <h2 className="text-lg font-bold text-navy">
            부산 외 지역에도 상속부동산이 있나요?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/75">
            다옴법무사사무소는 부산 해운대구에 있으며, 타지역 지점이 있는 것은
            아닙니다. 관할 특례·비대면 절차를 검토해 전국 진행 가능 여부를
            안내합니다.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              {
                href: "/업무사례/전국상속등기법무사",
                label: "전국 상속등기 진행 방법",
              },
              {
                href: "/업무사례/지역별상속등기법무사",
                label: "지역별 상속등기 안내",
              },
              {
                href: "/업무사례/전국상속부동산일괄등기",
                label: "여러 지역 상속부동산 일괄등기",
              },
              {
                href: "/업무사례/전국유증등기법무사",
                label: "전국 유증등기",
              },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-beige/30 px-3 text-sm font-medium text-navy no-underline hover:bg-beige/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="text-sm text-navy/60">
        전국 의뢰·관할 특례 안내는{" "}
        <Link
          href="/업무사례/전국업무사례"
          className="font-medium text-navy-light transition-colors duration-200 hover:text-navy hover:underline"
        >
          전국 업무사례
        </Link>
        {" · "}
        <Link
          href="/전국업무"
          className="font-medium text-navy-light transition-colors duration-200 hover:text-navy hover:underline"
        >
          전국 업무 안내
        </Link>
        와{" "}
        <Link
          href={`/services/${serviceSlug}`}
          className="font-medium text-navy-light transition-colors duration-200 hover:text-navy hover:underline"
        >
          {serviceLabels[serviceSlug] ?? serviceSlug} 업무 상세
        </Link>
        에서도 확인하실 수 있습니다.
      </p>
    </div>
  );
}
