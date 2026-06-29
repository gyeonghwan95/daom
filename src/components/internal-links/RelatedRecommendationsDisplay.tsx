import Link from "next/link";
import {
  hasRecommendationGroups,
  RECOMMENDATION_GROUP_LABELS,
  RECOMMENDATION_GROUP_ORDER,
  type RecommendationGroups,
} from "@/lib/internal-links";

type RelatedRecommendationsDisplayProps = {
  groups: RecommendationGroups;
  title?: string;
  className?: string;
};

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-navy sm:text-base">{title}</h3>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="interactive-surface card-surface flex min-h-11 items-center px-4 py-3 text-sm font-medium text-navy/85 hover:bg-beige/40"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedRecommendationsDisplay({
  groups,
  title = "함께 보면 좋은 글",
  className = "",
}: RelatedRecommendationsDisplayProps) {
  if (!hasRecommendationGroups(groups)) return null;

  return (
    <section
      id="related-recommendations"
      className={`section-anchor scroll-mt-[calc(var(--header-height)+1rem)] rounded-2xl border border-beige-dark bg-beige/15 p-5 sm:p-6 ${className}`.trim()}
      aria-labelledby="related-recommendations-heading"
    >
      <h2 id="related-recommendations-heading" className="section-heading">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/65">
        같은 주제·업무 분야·지역 기준으로 연결된 안내입니다.
      </p>

      <div className="mt-5 space-y-6">
        {RECOMMENDATION_GROUP_ORDER.map((key) => {
          const links = groups[key];
          if (!links?.length) return null;
          return (
            <LinkGroup
              key={key}
              title={RECOMMENDATION_GROUP_LABELS[key]}
              links={links}
            />
          );
        })}
      </div>
    </section>
  );
}
