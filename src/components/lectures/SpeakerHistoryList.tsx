import Link from "next/link";
import { getSpeakerHistoryLines } from "@/lib/lectures/speaker-media";

type SpeakerHistoryListProps = {
  limit?: number;
  title?: string;
  showMoreLink?: boolean;
};

/** 제목 — 기관 형태의 간단한 출강 이력 목록 */
export function SpeakerHistoryList({
  limit,
  title = "주요 출강 이력",
  showMoreLink = true,
}: SpeakerHistoryListProps) {
  const lines = getSpeakerHistoryLines();
  const items = typeof limit === "number" ? lines.slice(0, limit) : lines;
  if (items.length === 0) return null;

  return (
    <section className="space-y-3 rounded-2xl border border-beige-dark bg-cream/30 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-base font-semibold text-navy md:text-lg">{title}</h2>
        {showMoreLink ? (
          <Link
            href="/강의이력"
            className="text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            전체 보기
          </Link>
        ) : null}
      </div>
      <ul className="divide-y divide-beige-dark/80 overflow-hidden rounded-xl border border-beige-dark bg-white">
        {items.map((line) => (
          <li key={line.id}>
            {line.href ? (
              <Link
                href={line.href}
                className="flex flex-col gap-0.5 px-3 py-2.5 no-underline hover:bg-cream/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
              >
                <span className="text-sm font-medium text-navy">{line.title}</span>
                <span className="shrink-0 text-xs text-navy/60">
                  {line.institution}
                </span>
              </Link>
            ) : (
              <div className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                <span className="text-sm font-medium text-navy">{line.title}</span>
                <span className="shrink-0 text-xs text-navy/60">
                  {line.institution}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
