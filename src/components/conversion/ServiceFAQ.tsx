import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { ContentSection } from "@/components/readability";
import type { PageFaqItem } from "@/lib/pageData/types";

type ServiceFAQProps = {
  items: PageFaqItem[];
  title?: string;
};

export function ServiceFAQ({
  items,
  title = "상담 전 자주 묻는 질문",
}: ServiceFAQProps) {
  if (items.length === 0) return null;

  return (
    <ContentSection id="conversion-faq" title={title}>
      <FAQAccordion items={items} />
    </ContentSection>
  );
}
