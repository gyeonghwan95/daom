"use client";

import Image from "next/image";
import { GridPagination } from "@/components/profile/GridPagination";
import { mediaPanelGridOptions, usePaginatedGrid } from "@/hooks/usePaginatedGrid";
import { formatLectureDate, type LawyerLecture } from "@/lib/lawyer-lectures";

type PaginatedLectureGridProps = {
  lectures: LawyerLecture[];
};

export function PaginatedLectureGrid({ lectures }: PaginatedLectureGridProps) {
  const { page, setPage, totalPages, showPagination, visibleItems, gridClassName } =
    usePaginatedGrid(lectures.length, mediaPanelGridOptions);

  return (
    <div>
      <ul className={gridClassName}>
        {lectures.map((lecture, index) => (
          <li
            key={`${lecture.date}-${lecture.title}`}
            className={`${
              index < visibleItems.start || index >= visibleItems.end ? "hidden" : "flex"
            } h-full flex-col overflow-hidden rounded-xl border border-beige-dark bg-white transition-shadow hover:shadow-md hover:shadow-navy/5`}
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark bg-beige/30">
              <Image
                src={lecture.image.src}
                alt={lecture.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
              <time
                dateTime={lecture.date}
                className="text-xs font-semibold tracking-wide text-navy-light md:text-sm"
              >
                {formatLectureDate(lecture.date)}
              </time>
              <h3 className="mt-2 line-clamp-4 flex-1 text-sm font-semibold leading-snug text-navy sm:mt-3 sm:line-clamp-none md:text-base">
                {lecture.title}
              </h3>
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
