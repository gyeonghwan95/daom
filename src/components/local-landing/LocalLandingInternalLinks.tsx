import Link from "next/link";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { serviceLabels } from "@/lib/local-landing/districts";
import {
  getLocalLandingLinksForRegion,
  getLocalServiceCrossLinks,
  serviceHubLinks,
} from "@/lib/seo/internal-links";

type LocalLandingInternalLinksProps = {
  currentSlug: string;
  regionKey: string;
  serviceSlug: string;
  regionLabel: string;
};

export function LocalLandingInternalLinks({
  currentSlug,
  regionKey,
  serviceSlug,
  regionLabel,
}: LocalLandingInternalLinksProps) {
  return (
    <div className="space-y-8">
      <RelatedLinks
        title={`${regionLabel} 관련 등기·상속 안내`}
        links={getLocalServiceCrossLinks(regionKey, currentSlug)}
      />
      <RelatedLinks
        title={`${regionLabel} 관련 안내`}
        links={getLocalLandingLinksForRegion(regionLabel, currentSlug)}
      />
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
