import type { LectureHistoryEntry } from "@/lib/lectures/types";
import { groupLectureHistoryByYear } from "@/lib/lectures/history-helpers";
import { LectureHistoryCard } from "./LectureHistoryCard";

type LectureHistoryTimelineProps = {
  items: LectureHistoryEntry[];
};

export function LectureHistoryTimeline({ items }: LectureHistoryTimelineProps) {
  const groups = groupLectureHistoryByYear(items);

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.yearLabel} aria-labelledby={`year-${group.yearLabel}`}>
          <h3
            id={`year-${group.yearLabel}`}
            className="mb-4 text-lg font-semibold text-navy"
          >
            {group.yearLabel}
            <span className="ml-2 text-sm font-normal text-navy/55">
              {group.items.length}건
            </span>
          </h3>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.items.map((entry) => (
              <li key={entry.id}>
                <LectureHistoryCard entry={entry} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
