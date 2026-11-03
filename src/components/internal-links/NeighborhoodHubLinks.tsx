import Link from "next/link";
import { getNeighborhoodLinkSet } from "@/lib/internal-links/neighborhood-links";

/** 같은 구·동 생활권의 동 대표 페이지로 잇는 한 줄 링크(서버 컴포넌트, 경로만으로 결정). */
export function NeighborhoodHubLinks({ path }: { path: string }) {
  if (!path) return null;
  const set = getNeighborhoodLinkSet(path);
  if (!set) return null;

  return (
    <nav aria-label={set.title} className="mt-8 print:hidden">
      <p className="text-sm font-semibold text-navy">{set.title}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {set.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center rounded-full border border-beige-dark bg-white px-4 text-sm font-medium text-navy/85 no-underline transition hover:border-navy/40 hover:bg-cream"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
