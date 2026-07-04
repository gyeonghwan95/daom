import { ContentSection, RelatedContentGrid } from "@/components/readability";
import type { PageRelatedLink } from "@/lib/pageData/types";

type RelatedServiceLinksProps = {
  links: PageRelatedLink[];
  serviceName: string;
};

export function RelatedServiceLinks({
  links,
  serviceName,
}: RelatedServiceLinksProps) {
  if (links.length === 0) return null;

  return (
    <ContentSection id="conversion-related" title="관련 업무 바로가기">
      <p className="body-text mb-4 max-w-3xl text-navy/70">
        {serviceName}와 함께 검토되는 업무·안내 페이지입니다.
      </p>
      <RelatedContentGrid links={links} />
    </ContentSection>
  );
}
