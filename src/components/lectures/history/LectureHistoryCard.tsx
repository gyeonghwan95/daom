import Image from "next/image";
import Link from "next/link";
import type { LectureHistoryEntry } from "@/lib/lectures/types";
import {
  getLectureHistoryAudienceLabel,
  getLectureHistoryDisplayDate,
  getLectureHistoryPrimaryImage,
  normalizeInstitutionType,
} from "@/lib/lectures/history-helpers";
import { LECTURE_INSTITUTION_TYPE_LABELS } from "@/lib/lectures/types";

type LectureHistoryCardProps = {
  entry: LectureHistoryEntry;
  compact?: boolean;
};

export function LectureHistoryCard({
  entry,
  compact = false,
}: LectureHistoryCardProps) {
  const image = getLectureHistoryPrimaryImage(entry);
  const typeLabel =
    LECTURE_INSTITUTION_TYPE_LABELS[
      normalizeInstitutionType(entry.institutionType)
    ];
  const tags = entry.lectureCategory.slice(0, 3);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-beige-dark bg-white">
      {image ? (
        <div className="relative aspect-[4/3] bg-beige">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-cream px-4 text-center text-sm text-navy/60">
          {typeLabel}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-navy/55">
          <time
            dateTime={
              entry.date && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
                ? entry.date
                : entry.year
                  ? String(entry.year)
                  : undefined
            }
          >
            {getLectureHistoryDisplayDate(entry)}
          </time>
          {" · "}
          {entry.city}
        </p>
        <p className="text-xs font-medium text-navy/70">{entry.institution}</p>
        <h3 className="text-base font-semibold text-navy">
          {entry.shortTitle ?? entry.title}
        </h3>
        {!compact ? (
          <p className="text-sm text-navy/65">
            {getLectureHistoryAudienceLabel(entry)}
            {entry.durationLabel ? ` · ${entry.durationLabel}` : ""}
            {` · ${entry.format}`}
          </p>
        ) : null}
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded border border-beige-dark bg-cream px-1.5 py-0.5 text-[11px] text-navy/70"
            >
              #{tag.replace(/\s+/g, "")}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <Link
            href={`/강의이력/${entry.slug}`}
            className="inline-flex min-h-10 items-center rounded-lg bg-navy px-3 text-xs font-medium text-white no-underline hover:bg-navy-light"
          >
            이력 자세히 보기
          </Link>
          {entry.blogUrl ? (
            <a
              href={entry.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-lg border border-beige-dark px-3 text-xs font-medium text-navy no-underline hover:bg-beige"
            >
              네이버 블로그 원문
              <span className="sr-only"> (새 창)</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
