import Link from "next/link";
import type { FaqItem } from "@/lib/faq-data";
import type { ServiceFaq } from "@/types/service";

type FaqInput = (FaqItem | ServiceFaq) & { href?: string; slug?: string };

type FAQAccordionProps = {
  items: FaqInput[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="faq-accordion">
      {items.map((faq) => (
        <details key={faq.question} className="faq-accordion__item group">
          <summary className="faq-accordion__summary">
            <span className="min-w-0 flex-1 text-left">{faq.question}</span>
            <span className="faq-accordion__icon" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="faq-accordion__body">
            <p>{faq.answer}</p>
            {"href" in faq && faq.href ? (
              <Link
                href={faq.href}
                className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-navy underline-offset-4 hover:underline"
              >
                자세히 보기 →
              </Link>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
