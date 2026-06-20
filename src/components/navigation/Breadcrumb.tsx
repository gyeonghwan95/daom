import Link from "next/link";
import type { BreadcrumbItem } from "@/types/breadcrumb";

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-6 md:mb-8">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-navy/60 md:text-base">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-navy/40" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center hover:text-navy"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="inline-flex min-h-10 items-center font-medium text-navy"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
