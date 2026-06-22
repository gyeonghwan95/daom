import { RelatedLinks } from "@/components/page/RelatedLinks";
import {
  getServiceCrossLinks,
  serviceHubLinks,
} from "@/lib/seo/internal-links";

type ServiceInternalLinksProps = {
  currentSlug: string;
};

export function ServiceInternalLinks({ currentSlug }: ServiceInternalLinksProps) {
  return (
    <div className="space-y-8">
      <RelatedLinks
        title="관련 업무"
        links={getServiceCrossLinks(currentSlug)}
      />
      <RelatedLinks title="사무소 안내" links={serviceHubLinks} />
    </div>
  );
}
