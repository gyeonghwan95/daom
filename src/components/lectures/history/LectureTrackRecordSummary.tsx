import Link from "next/link";
import type { LectureTrackRecordSummary } from "@/lib/lectures/history-helpers";

type LectureTrackRecordSummaryProps = {
  summary: LectureTrackRecordSummary;
  compact?: boolean;
};

export function LectureTrackRecordSummaryView({
  summary,
  compact = false,
}: LectureTrackRecordSummaryProps) {
  const items = [
    {
      label: "확인된 강의",
      value: `${summary.lectureCount}회`,
    },
    {
      label: "출강 기관",
      value: `${summary.institutionCount}곳`,
    },
    {
      label: "대상 유형",
      value: `${summary.audienceTypeCount}종`,
    },
    {
      label: "활동 지역",
      value: `${summary.cityCount}곳`,
    },
  ];

  return (
    <section
      aria-label="강의 이력 요약"
      className="rounded-2xl border border-beige-dark bg-cream/40 p-5 md:p-6"
    >
      {!compact ? (
        <>
          <h2 className="text-lg font-semibold text-navy">확인된 강의 이력 요약</h2>
          <p className="mt-2 text-sm text-navy/70">
            확인된 데이터만 집계합니다. 수강 인원·만족도는 추정하지 않습니다.
          </p>
        </>
      ) : null}
      <ul
        className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${compact ? "" : "mt-4"}`}
      >
        {items.map((item) => (
          <li
            key={item.label}
            className="rounded-xl border border-beige-dark bg-white px-4 py-3"
          >
            <p className="text-xs text-navy/55">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-navy">{item.value}</p>
          </li>
        ))}
      </ul>
      {!compact ? (
        <>
          <p className="mt-4 text-sm text-navy/75">
            {summary.institutionTypeLabels.slice(0, 6).join(" · ")}
            {summary.institutionTypeLabels.length > 6 ? " 등" : ""} 기관과{" "}
            {summary.categoryLabels.slice(0, 5).join(" · ")} 주제를 중심으로
            진행했습니다.
          </p>
          <p className="mt-4">
            <Link
              href="/강의문의"
              className="text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              기관 맞춤 강의 문의하기
            </Link>
          </p>
        </>
      ) : null}
    </section>
  );
}
