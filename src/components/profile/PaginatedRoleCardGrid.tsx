"use client";

import Image from "next/image";
import { GridPagination } from "@/components/profile/GridPagination";
import { usePaginatedGrid } from "@/hooks/usePaginatedGrid";
import type { ActivityRole } from "@/lib/lawyer-activities";

type PaginatedRoleCardGridProps = {
  roles: ActivityRole[];
};

export function PaginatedRoleCardGrid({ roles }: PaginatedRoleCardGridProps) {
  const { page, setPage, totalPages, showPagination, visibleItems, gridClassName } =
    usePaginatedGrid(roles.length);

  const visibleRoles = roles.slice(visibleItems.start, visibleItems.end);

  return (
    <div>
      <ul className={gridClassName}>
        {visibleRoles.map((role) => (
          <li
            key={`${role.title}-${role.period}`}
            className="overflow-hidden rounded-xl border border-beige-dark bg-white transition-shadow hover:shadow-md hover:shadow-navy/5"
          >
            {role.image ? (
              <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark bg-beige/30">
                <Image
                  src={role.image.src}
                  alt={role.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ) : null}
            <div className="p-4">
              <h3 className="text-sm font-semibold leading-snug text-navy md:text-base">
                {role.title}
              </h3>
              {role.subtitle ? (
                <p className="mt-1.5 text-xs leading-relaxed text-navy/65 md:text-sm">
                  {role.subtitle}
                </p>
              ) : null}
              <p className="mt-1.5 text-xs text-navy/55 md:text-sm">{role.period}</p>
            </div>
          </li>
        ))}
      </ul>

      {showPagination ? (
        <GridPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : null}
    </div>
  );
}
