import Link from "next/link";
import type { RelatedLink } from "@/types/content";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

type RelatedLinksProps = {
  title?: string;
  links: RelatedLink[];
};

export function RelatedLinks({
  title = "관련 안내",
  links,
}: RelatedLinksProps) {
  const linkClassName =
    "interactive-surface card-surface flex min-h-12 items-center px-4 py-3 text-base text-navy/80 hover:bg-beige/50 md:px-5 md:py-4";

  return (
    <section
      id="related"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
    >
      <h2 className="section-heading">{title}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            {isExternalHref(link.href) ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
