import { RelatedLinks } from "@/components/page/RelatedLinks";
import type { PageRelatedLink } from "@/lib/pageData/types";

type DiagnosisRelatedLinksProps = {
  links: PageRelatedLink[];
  title?: string;
};

export function DiagnosisRelatedLinks({
  links,
  title = "관련 페이지",
}: DiagnosisRelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="diagnosis-related-heading">
      <h2 id="diagnosis-related-heading" className="sr-only">
        {title}
      </h2>
      <RelatedLinks title={title} links={links} />
    </section>
  );
}
