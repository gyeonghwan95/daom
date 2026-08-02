import Link from "next/link";
import {
  getFeaturedTrackRecordActivities,
  trackRecordCommittees,
  type TrackRecordActivity,
} from "@/lib/lawyer-track-record";

const KIND_CLASS: Record<TrackRecordActivity["kind"], string> = {
  강의: "bg-navy/10 text-navy",
  상담: "bg-emerald-50 text-emerald-900",
  자문: "bg-sky-50 text-sky-900",
  협력: "bg-amber-50 text-amber-950",
  언론: "bg-violet-50 text-violet-950",
  학술: "bg-slate-100 text-slate-800",
  기타: "bg-beige text-navy/80",
};

/**
 * /about — PDF 프로필과 동일한 위원회·강의 실적 표로 신뢰를 강화합니다.
 */
export function LawyerTrackRecordTables({
  activityLimit = 14,
}: {
  activityLimit?: number;
}) {
  const activities = getFeaturedTrackRecordActivities(activityLimit);

  return (
    <section
      id="track-record"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] space-y-10"
      aria-labelledby="track-record-heading"
    >
      <div>
        <p className="text-sm font-medium text-navy/60">Verified track record</p>
        <h2 id="track-record-heading" className="section-heading mt-1">
          위원회·강의 실적
        </h2>
        <p className="body-text mt-3 max-w-3xl text-[0.9375rem] md:text-base">
          공식 프로필에 기재한 위원회 참여와 최근 강의·공익 활동을 일자·기관별로
          정리했습니다. 상세 강의 페이지·현장 사진은{" "}
          <Link
            href="/강의이력"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            강의 이력
          </Link>
          에서도 확인하실 수 있습니다.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-navy md:text-xl">위원회 참여현황</h3>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-beige-dark bg-white shadow-sm">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm md:text-base">
            <caption className="sr-only">
              안윤정 법무사 위원회 참여현황
            </caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  기간
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  기관·역할
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {trackRecordCommittees.map((row) => (
                <tr
                  key={`${row.organization}-${row.period}`}
                  className="border-t border-beige-dark/80 odd:bg-cream/40"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-navy/85">
                    {row.period}
                  </td>
                  <td className="px-4 py-3 text-navy/90">
                    <span className="font-semibold text-navy">
                      {row.organization}
                    </span>
                    <span className="mt-0.5 block text-sm text-navy/70">
                      {row.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.status === "활동중"
                          ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                          : "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-lg font-bold text-navy md:text-xl">
            강의 및 기타 활동
          </h3>
          <Link
            href="/강의이력"
            className="text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            전체 강의 이력 보기
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-beige-dark bg-white shadow-sm">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm md:text-base">
            <caption className="sr-only">
              안윤정 법무사 강의 및 기타 활동
            </caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  일자
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  구분
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  내용
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  기관
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((row) => (
                <tr
                  key={`${row.date}-${row.title}`}
                  className="border-t border-beige-dark/80 odd:bg-cream/40 align-top"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-navy/85">
                    {row.date}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${KIND_CLASS[row.kind]}`}
                    >
                      {row.kind}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-navy/75">{row.organization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-navy/60">
          최근 {activities.length}건을 표시합니다. 시민도서관·청년기관 연속 특강과
          공익 상담 이력은{" "}
          <Link
            href="/강의이력"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            강의 이력
          </Link>
          ·
          <Link
            href="/media"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            언론·활동
          </Link>
          에서 이어서 확인하실 수 있습니다.
        </p>
      </div>
    </section>
  );
}
