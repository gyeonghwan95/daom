import type { LectureHistoryEntry } from "@/lib/lectures/types";
import { LectureHistoryCard } from "./LectureHistoryCard";

type LectureHistoryGridProps = {
  items: LectureHistoryEntry[];
  compact?: boolean;
};

export function LectureHistoryGrid({
  items,
  compact = false,
}: LectureHistoryGridProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-beige-dark bg-cream/40 px-4 py-8 text-center text-sm text-navy/65">
        조건에 맞는 확인된 강의 이력이 없습니다. 검색어나 필터를 바꿔 보세요.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((entry) => (
        <li key={entry.id}>
          <LectureHistoryCard entry={entry} compact={compact} />
        </li>
      ))}
    </ul>
  );
}
