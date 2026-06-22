import Link from "next/link";
import { getAllServiceLinks } from "@/lib/seo/internal-links";

export function HomeServiceAllLinks() {
  const links = getAllServiceLinks();

  return (
    <nav
      aria-label="업무 분야 전체"
      className="mt-8 border-t border-beige-dark pt-8"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-navy-light">
        업무 분야
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center rounded-full border border-beige-dark bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-navy/20 hover:bg-beige/50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
