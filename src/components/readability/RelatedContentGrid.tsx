import Link from "next/link";

export type RelatedContentLink = {
  href: string;
  label: string;
  description?: string;
};

type RelatedContentGridProps = {
  links: RelatedContentLink[];
  columns?: 1 | 2;
  /** list: 구분선 링크 목록(기본) / cards: 2열 간결 카드 */
  variant?: "list" | "cards";
};

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function LinkBody({
  label,
  description,
}: {
  label: string;
  description?: string;
}) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block">{label}</span>
      {description ? (
        <span className="readability-link-card__meta">{description}</span>
      ) : null}
    </span>
  );
}

export function RelatedContentGrid({
  links,
  columns = 2,
  variant = "list",
}: RelatedContentGridProps) {
  if (links.length === 0) return null;

  if (variant === "cards") {
    const gridClass =
      columns === 1 ? "grid gap-2" : "grid gap-2 sm:grid-cols-2";
    return (
      <ul className={gridClass}>
        {links.map((link) => (
          <li key={link.href}>
            {isExternalHref(link.href) ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="readability-link-card rounded-lg border border-beige-dark bg-white px-4"
              >
                <LinkBody label={link.label} description={link.description} />
                <span className="readability-link-card__arrow" aria-hidden>
                  →
                </span>
              </a>
            ) : (
              <Link
                href={link.href}
                className="readability-link-card rounded-lg border border-beige-dark bg-white px-4"
              >
                <LinkBody label={link.label} description={link.description} />
                <span className="readability-link-card__arrow" aria-hidden>
                  →
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="readability-link-list">
      {links.map((link) => (
        <li key={link.href}>
          {isExternalHref(link.href) ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="readability-link-card"
            >
              <LinkBody label={link.label} description={link.description} />
              <span className="readability-link-card__arrow" aria-hidden>
                →
              </span>
            </a>
          ) : (
            <Link href={link.href} className="readability-link-card">
              <LinkBody label={link.label} description={link.description} />
              <span className="readability-link-card__arrow" aria-hidden>
                →
              </span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
