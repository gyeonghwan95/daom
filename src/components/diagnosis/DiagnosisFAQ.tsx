import { FAQAccordion } from "@/components/sections/FAQAccordion";
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
    <section
      id="faq"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      aria-labelledby="diagnosis-faq-heading"
    >
      <h2 id="diagnosis-faq-heading" className="section-heading">
        {title}
      </h2>
      <div className="mt-4">
        <FAQAccordion items={items} />
      </div>
    </section>
  );
}
