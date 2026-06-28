import Link from "next/link";
import { getMainLandingHubLinks } from "@/lib/seo/internal-links";

export function HomeLandingHubLinks() {
  const links = getMainLandingHubLinks();

  return (
    <nav
      aria-label="지역·업무 랜딩 안내"
      className="mt-8 border-t border-beige-dark pt-8"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-navy-light">
        지역·업무 랜딩
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
