import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedLectureHistory,
  getLectureHistoryByIds,
  getRecentLectureHistory,
} from "@/data/lectures/history";
import {
  LECTURE_INSTITUTION_TYPE_LABELS,
  type LectureHistoryEntry,
} from "@/lib/lectures/types";

type VerifiedLectureHistoryProps = {
  title?: string;
  description?: string;
  /** history id 목록 — 없으면 featured + recent */
  historyIds?: string[];
  limit?: number;
  showImages?: boolean;
};

function formatDate(entry: LectureHistoryEntry): string {
  if (entry.date) return entry.date;
  if (entry.year) return String(entry.year);
  return "일정 확인됨";
}

function HistoryCard({
  entry,
  showImages,
}: {
  entry: LectureHistoryEntry;
  showImages: boolean;
}) {
  const image = entry.images?.[0] ?? (entry.imageSrc
    ? { src: entry.imageSrc, alt: entry.title }
    : null);
  const href = `/강의이력/${entry.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-beige-dark bg-white">
      {showImages && image ? (
        <div className="relative aspect-[16/10] w-full bg-beige/40">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 33vw"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-navy/55">
          {formatDate(entry)}
          {" · "}
          {LECTURE_INSTITUTION_TYPE_LABELS[entry.institutionType] ??
            entry.institutionType}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug text-navy">
          <Link href={href} className="underline-offset-2 hover:underline">
            {entry.shortTitle ?? entry.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-navy/70">{entry.institution}</p>
        {entry.audience ? (
          <p className="mt-1 text-xs text-navy/55">대상: {entry.audience}</p>
        ) : null}
        {entry.durationLabel || entry.durationMinutes ? (
          <p className="mt-0.5 text-xs text-navy/55">
            시간:{" "}
            {entry.durationLabel ??
              (entry.durationMinutes
                ? `${entry.durationMinutes}분`
                : undefined)}
          </p>
        ) : null}
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy/75">
          {entry.summary}
        </p>
        {entry.topics.length ? (
          <p className="mt-2 text-xs text-navy/55">
            주제: {entry.topics.slice(0, 3).join(" · ")}
          </p>
        ) : null}
        <Link
          href={href}
          className="mt-3 text-sm font-medium text-navy underline-offset-2 hover:underline"
        >
          출강 사례 자세히 보기
        </Link>
      </div>
    </article>
  );
}

/**
 * 검증된 출강 이력만 표시. 미확인 만족도·재초청 문구는 넣지 않습니다.
 */
export function VerifiedLectureHistory({
  title = "확인된 출강 이력",
  description = "날짜·기관·주제가 프로젝트 자료로 확인된 강의만 모아 두었습니다.",
  historyIds,
  limit = 6,
  showImages = true,
}: VerifiedLectureHistoryProps) {
  const fromIds = historyIds?.length
    ? getLectureHistoryByIds(historyIds)
    : [];
  const items =
    fromIds.length > 0
      ? fromIds.slice(0, limit)
      : [
          ...getFeaturedLectureHistory(),
          ...getRecentLectureHistory(limit),
        ]
          .filter(
            (item, index, arr) =>
              arr.findIndex((other) => other.id === item.id) === index,
          )
          .filter((item) => item.verified)
          .slice(0, limit);

  if (!items.length) return null;

  return (
    <section className="verified-lecture-history space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-navy md:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-navy/65">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((entry) => (
          <HistoryCard
            key={entry.id}
            entry={entry}
            showImages={showImages}
          />
        ))}
      </div>
      <p className="text-sm text-navy/65">
        전체 목록은{" "}
        <Link
          href="/강의이력"
          className="font-medium text-navy underline-offset-2 hover:underline"
        >
          강의 이력
        </Link>
        에서 확인할 수 있습니다.
      </p>
    </section>
  );
}
