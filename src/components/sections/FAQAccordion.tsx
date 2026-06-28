import Link from "next/link";
import type { FaqItem } from "@/lib/faq-data";
import type { ServiceFaq } from "@/types/service";

type FaqInput = (FaqItem | ServiceFaq) & { href?: string; slug?: string };

type FAQAccordionProps = {
  items: FaqInput[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((faq) => (
        <details
          key={faq.question}
          className="group card-surface overflow-hidden"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-navy transition-colors duration-200 hover:bg-beige/40 marker:content-none md:px-6 md:text-lg [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span
              className="shrink-0 text-navy/50 group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div className="border-t border-beige-dark px-5 py-4 text-base leading-relaxed text-navy/80 md:px-6">
            <p>{faq.answer}</p>
            {"href" in faq && faq.href && (
              <Link
                href={faq.href}
                className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-navy-light underline-offset-4 transition-colors duration-200 hover:text-navy hover:underline"
              >
                자세히 보기 →
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
