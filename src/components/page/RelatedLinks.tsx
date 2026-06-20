import Link from "next/link";
import type { RelatedLink } from "@/types/content";

type RelatedLinksProps = {
  title?: string;
  links: RelatedLink[];
};

export function RelatedLinks({
  title = "관련 안내",
  links,
}: RelatedLinksProps) {
  return (
    <section>
      <h2 className="section-heading">{title}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="card-surface flex min-h-12 items-center px-4 py-3 text-base text-navy/80 transition-colors hover:border-navy/20 hover:bg-beige/50 md:px-5 md:py-4"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
