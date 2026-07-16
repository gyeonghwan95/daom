import Link from "next/link";
import { LectureHistoryFilter } from "@/components/lectures/history/LectureHistoryFilter";
import { LectureTrackRecordSummaryView } from "@/components/lectures/history/LectureTrackRecordSummary";
import { getVerifiedLectureHistory } from "@/data/lectures/history";
import { buildLectureTrackRecordSummary } from "@/lib/lectures/history-helpers";

const FIELD_SUMMARY = [
  "생활법률 강의",
  "전세사기 예방교육",
  "청년 법률교육",
  "디지털 법률교육",
  "창업·기업 법률교육",
  "학교 진로특강",
  "공공기관·복지기관 맞춤형 특강",
];

export function LectureHistoryHubView() {
  const items = getVerifiedLectureHistory();
  const summary = buildLectureTrackRecordSummary(items);

  return (
    <div className="space-y-10 md:space-y-12">
      <section className="rounded-2xl border border-beige-dark bg-white p-5 md:p-8">
        <p className="text-sm font-medium text-navy/60">Speaker track record</p>
        <h2 className="mt-2 text-xl font-bold text-navy md:text-2xl">
          현장에서 이어가는 생활법률 교육
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
          법률 용어를 나열하기보다, 실제 생활에서 어떤 부분을 확인하고 어떻게
          예방할 수 있는지 사례 중심으로 설명합니다. 아래 이력은 프로젝트에
          확인된 기관·일정·사진만 포함합니다.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {FIELD_SUMMARY.map((label) => (
            <li
              key={label}
              className="rounded-lg border border-beige-dark bg-cream px-3 py-1.5 text-xs font-medium text-navy"
            >
              {label}
            </li>
          ))}
        </ul>
      </section>

      <LectureTrackRecordSummaryView summary={summary} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-navy md:text-xl">
          연도·주제별 강의 이력
        </h2>
        <LectureHistoryFilter items={items} />
      </section>

      <section className="rounded-2xl border border-beige-dark bg-cream/40 p-5 md:p-6">
        <h2 className="text-lg font-semibold text-navy">강사 소개·문의</h2>
        <p className="mt-2 text-sm text-navy/70">
          강사 자격·교육 경력과 기관 맞춤 문의는 아래 페이지에서 확인할 수
          있습니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/강사소개"
            className="inline-flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-4 text-sm font-medium text-navy no-underline hover:bg-beige"
          >
            강사 소개
          </Link>
          <Link
            href="/법률강의"
            className="inline-flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-4 text-sm font-medium text-navy no-underline hover:bg-beige"
          >
            주요 강의 주제
          </Link>
          <Link
            href="/강의문의"
            className="inline-flex min-h-11 items-center rounded-lg bg-navy px-4 text-sm font-medium text-white no-underline hover:bg-navy-light"
          >
            강의 문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
