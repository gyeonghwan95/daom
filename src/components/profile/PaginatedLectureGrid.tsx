"use client";

import Image from "next/image";
import { GridPagination } from "@/components/profile/GridPagination";
import { usePaginatedGrid } from "@/hooks/usePaginatedGrid";
import { formatLectureDate, type LawyerLecture } from "@/lib/lawyer-lectures";

type PaginatedLectureGridProps = {
  lectures: LawyerLecture[];
};

export function PaginatedLectureGrid({ lectures }: PaginatedLectureGridProps) {
  const { page, setPage, totalPages, showPagination, visibleItems, gridClassName } =
    usePaginatedGrid(lectures.length);

  const visibleLectures = lectures.slice(visibleItems.start, visibleItems.end);

  return (
    <div>
      <ul className={gridClassName}>
        {visibleLectures.map((lecture) => (
          <li
            key={`${lecture.date}-${lecture.title}`}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-beige-dark bg-white transition-shadow hover:shadow-md hover:shadow-navy/5"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark bg-beige/30">
              <Image
                src={lecture.image.src}
                alt={lecture.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-4 md:p-5">
              <time
                dateTime={lecture.date}
                className="text-xs font-semibold tracking-wide text-navy-light md:text-sm"
              >
                {formatLectureDate(lecture.date)}
              </time>
              <h3 className="mt-3 flex-1 text-sm font-semibold leading-snug text-navy md:text-base">
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
