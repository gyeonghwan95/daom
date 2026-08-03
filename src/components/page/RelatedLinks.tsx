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
  id?: string;
  linkLabelClassName?: string;
};

export function RelatedLinks({
  title = "관련 안내",
  links,
  id = "related",
  linkLabelClassName,
}: RelatedLinksProps) {
  return (
    <ContentSection id={id} title={title}>
      <RelatedContentGrid
        links={links}
        labelClassName={linkLabelClassName}
      />
    </ContentSection>
  );
}

export { isExternalHref };
