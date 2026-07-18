import Link from "next/link";
import { directorySections } from "@/lib/b2b/collaboration-registry";

export function CollaborationDirectory() {
  const sections = directorySections();

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`dir-${section.id}`}
          aria-labelledby={`dir-heading-${section.id}`}
        >
          <h3
            id={`dir-heading-${section.id}`}
            className="text-base font-semibold text-navy md:text-lg"
          >
            {section.title}
          </h3>
          <ul className="mt-3 space-y-3">
            {section.links.map((link) => (
              <li key={`${section.id}-${link.href}`}>
                <Link
                  href={link.href}
                  className="block rounded-xl border border-beige-dark bg-white px-4 py-3 no-underline transition-colors hover:bg-beige/40"
                >
                  <span className="block text-sm font-semibold text-navy md:text-[0.9375rem]">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="mt-1 block text-xs leading-relaxed text-navy/65 md:text-sm">
                      {link.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
