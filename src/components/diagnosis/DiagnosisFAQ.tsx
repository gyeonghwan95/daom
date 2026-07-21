import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { ContentSection } from "@/components/readability/ContentSection";
import type { PageFaqItem } from "@/lib/pageData/types";

type DiagnosisFAQProps = {
  items: PageFaqItem[];
  title?: string;
};

export function DiagnosisFAQ({
  items,
  title = "자주 묻는 질문",
}: DiagnosisFAQProps) {
  if (items.length === 0) return null;

  return (
    <ContentSection id="faq" title={title}>
      <FAQAccordion items={items} />
    </ContentSection>
  );
}
