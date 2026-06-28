import Link from "next/link";
import { LOCATION_HUB_LINKS } from "@/lib/hub/home-sections";

export function LocationRegionHubLinks() {
  return (
    <nav
      aria-label="부산 지역·동·역세권 법무사"
      className="mt-8 border-t border-beige-dark pt-8"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-navy-light">
        지역·동·역세권 법무사
      </h3>
      <p className="mt-2 text-sm text-navy/70">
        부산 구·군·동·역세권별 법무사 상담 페이지입니다.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {LOCATION_HUB_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
                  className="inline-flex min-h-10 items-center rounded-full border border-beige-dark bg-white px-4 py-2 text-sm font-medium text-navy transition-[color,background-color,border-color] duration-200 hover:border-navy/20 hover:bg-beige/50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
