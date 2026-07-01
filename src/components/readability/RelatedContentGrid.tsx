import Link from "next/link";

export type RelatedContentLink = {
  href: string;
  label: string;
};

type RelatedContentGridProps = {
  links: RelatedContentLink[];
  columns?: 1 | 2;
};

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function RelatedContentGrid({
  links,
  columns = 2,
}: RelatedContentGridProps) {
  if (links.length === 0) return null;

  const gridClass =
    columns === 1
      ? "grid gap-3"
      : "grid gap-3 sm:grid-cols-2";

  return (
    <ul className={gridClass}>
      {links.map((link) => (
        <li key={link.href}>
          {isExternalHref(link.href) ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="readability-link-card"
            >
              <span>{link.label}</span>
              <span className="readability-link-card__arrow" aria-hidden>
                →
              </span>
            </a>
          ) : (
            <Link href={link.href} className="readability-link-card">
              <span>{link.label}</span>
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
