import Link from "next/link";
import { getSpecialistLinkSet } from "@/lib/internal-links/specialist-links";

/** 같은 분야의 전문 법무사 안내 페이지로 잇는 한 줄 링크(서버 컴포넌트, 경로만으로 결정). */
export function SpecialistGuideLinks({ path }: { path: string }) {
  if (!path) return null;
  const set = getSpecialistLinkSet(path);
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
