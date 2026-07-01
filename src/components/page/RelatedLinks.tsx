import {
  ContentSection,
  RelatedContentGrid,
} from "@/components/readability";
import type { RelatedLink } from "@/types/content";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

type RelatedLinksProps = {
  title?: string;
  links: RelatedLink[];
};

export function RelatedLinks({
  title = "관련 안내",
  links,
}: RelatedLinksProps) {
  return (
    <ContentSection id="related" title={title}>
      <RelatedContentGrid links={links} />
    </ContentSection>
  );
}

export { isExternalHref };
