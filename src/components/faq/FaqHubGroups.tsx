import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { FAQ_HUB_GROUPS } from "@/lib/hub/home-sections";
import type { FaqItem } from "@/lib/faq-data";

type FaqHubGroupsProps = {
  items: FaqItem[];
};

export function FaqHubGroups({ items }: FaqHubGroupsProps) {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const used = new Set<string>();

  const grouped = FAQ_HUB_GROUPS.map((group) => ({
    ...group,
    faqs: group.slugs
      .map((slug) => bySlug.get(slug))
      .filter((item): item is FaqItem => Boolean(item))
      .map((item) => {
        used.add(item.slug);
        return item;
      }),
  }));

  const rest = items.filter((item) => !used.has(item.slug));

  return (
    <div className="space-y-10">
      {grouped.map((group) =>
        group.faqs.length > 0 ? (
          <section
            key={group.title}
            id={`faq-${group.title}`}
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
          >
            <h2 className="section-heading">{group.title}</h2>
            <div className="mt-4">
              <FAQAccordion items={group.faqs} />
            </div>
          </section>
        ) : null,
      )}

      {rest.length > 0 ? (
        <section
          id="faq-other"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">기타 질문</h2>
          <div className="mt-4">
            <FAQAccordion items={rest} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
