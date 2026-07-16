import Link from "next/link";
import type { LectureHistoryEntry } from "@/lib/lectures/types";
import type { LectureTrackRecordSummary } from "@/lib/lectures/history-helpers";
import { LectureHistoryGrid } from "./LectureHistoryGrid";
import { LectureTrackRecordSummaryView } from "./LectureTrackRecordSummary";

type FeaturedLectureHistoryProps = {
  summary: LectureTrackRecordSummary;
  featured: LectureHistoryEntry[];
  recent: LectureHistoryEntry[];
};

export function FeaturedLectureHistory({
  summary,
  featured,
  recent,
}: FeaturedLectureHistoryProps) {
  return (
    <div className="space-y-6">
      <LectureTrackRecordSummaryView summary={summary} compact />
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-navy md:text-xl">
              대표 강의 이력
            </h2>
            <p className="mt-1 text-sm text-navy/70">
              기관명과 주제가 확인된 출강 사례입니다.
            </p>
          </div>
          <Link
            href="/강의이력"
            className="text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            전체 이력 보기
          </Link>
        </div>
        <LectureHistoryGrid items={featured.slice(0, 3)} />
      </section>
      {recent.length ? (
        <p className="text-sm text-navy/65">
          최근 확인된 강의는{" "}
          <Link
            href="/강의이력"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            강의 이력
          </Link>
          에서 더 볼 수 있습니다.
        </p>
      ) : null}
    </div>
  );
}
