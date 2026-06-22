import { RelatedLinks } from "@/components/page/RelatedLinks";
import {
  getLocalLandingLinksForService,
  getServiceCrossLinks,
  serviceHubLinks,
} from "@/lib/seo/internal-links";

type ServiceInternalLinksProps = {
  currentSlug: string;
};

export function ServiceInternalLinks({ currentSlug }: ServiceInternalLinksProps) {
  const localLinks = getLocalLandingLinksForService(currentSlug);

  return (
    <div className="space-y-8">
      {localLinks.length > 0 ? (
        <RelatedLinks title="지역별 안내" links={localLinks} />
      ) : null}
      <RelatedLinks
        title="관련 업무"
        links={getServiceCrossLinks(currentSlug)}
      />
      <RelatedLinks title="사무소 안내" links={serviceHubLinks} />
    </div>
  );
}
