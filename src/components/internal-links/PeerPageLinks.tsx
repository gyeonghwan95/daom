import Link from "next/link";
import { getPeerLinkSet } from "@/lib/internal-links/peer-ring";

/** 같은 유형 페이지끼리 연결하는 순환 이웃 링크(서버 컴포넌트, 경로만으로 결정). */
export function PeerPageLinks({ path }: { path: string }) {
  const set = getPeerLinkSet(path);
  if (!set) return null;

  return (
    <section
      className="mt-10 rounded-2xl border border-beige-dark bg-beige/15 p-5 sm:p-6 print:hidden"
      aria-labelledby="peer-links-heading"
    >
      <h2 id="peer-links-heading" className="section-heading">
        {set.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/65">{set.description}</p>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {set.links.map((link) => (
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
    </section>
  );
}
