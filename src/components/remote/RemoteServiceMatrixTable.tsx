import Link from "next/link";
import {
  REMOTE_SERVICE_MATRIX,
  getRemoteSuitabilityLabel,
  type RemoteSuitability,
} from "@/lib/remote/remote-service-matrix";

const BADGE: Record<RemoteSuitability, string> = {
  A: "bg-emerald-50 text-emerald-900",
  B: "bg-amber-50 text-amber-950",
  C: "bg-slate-100 text-slate-800",
};

/**
 * 원격 진행 적합도 A/B/C — 과장 없이 업무별 수준을 표로 공개.
 * 허브(`/방문없이준비하는법무사업무`) 등에서만 사용.
 */
export function RemoteServiceMatrixTable({
  className = "",
  limit,
}: {
  className?: string;
  /** 미지정 시 전체 */
  limit?: number;
}) {
  const rows =
    typeof limit === "number"
      ? REMOTE_SERVICE_MATRIX.slice(0, limit)
      : REMOTE_SERVICE_MATRIX;

  return (
    <section
      id="remote-service-matrix"
      className={`rounded-xl border border-beige-dark bg-white p-5 sm:p-6 ${className}`}
      aria-labelledby="remote-service-matrix-title"
    >
      <p className="text-xs font-semibold tracking-wide text-navy/70">
        원격 진행 적합도
      </p>
      <h2
        id="remote-service-matrix-title"
        className="mt-2 text-lg font-bold text-[var(--text-primary)] sm:text-xl"
      >
        업무마다 방문 전 확인 범위가 다릅니다
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/80 sm:text-base">
        A는 방문 전 대부분의 확인·준비가 가능한 유형, B는 원격 검토는 가능하나
        추가 확인이 큰 유형, C는 사건별로 방문·본인확인이 필요할 수 있는
        유형입니다. 모든 업무를 “완전 비대면”으로 단정하지 않습니다.
      </p>

      <div className="mt-5 overflow-x-auto rounded-xl border border-beige-dark">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <caption className="sr-only">원격 진행 적합도 업무표</caption>
          <thead className="bg-navy text-white">
            <tr>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                등급
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                업무
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                원격으로 먼저 할 수 있는 것
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                추가 확인
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-beige-dark/80 align-top odd:bg-cream/40"
              >
                <td className="whitespace-nowrap px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[row.suitability]}`}
                    title={getRemoteSuitabilityLabel(row.suitability)}
                  >
                    {row.suitability}
                  </span>
                </td>
                <td className="px-3 py-3 font-semibold text-navy">
                  {row.relatedPaths[0] ? (
                    <Link
                      href={row.relatedPaths[0]}
                      className="underline-offset-2 hover:underline"
                    >
                      {row.label}
                    </Link>
                  ) : (
                    row.label
                  )}
                </td>
                <td className="px-3 py-3 text-navy/80">{row.remoteScope}</td>
                <td className="px-3 py-3 text-navy/70">
                  <ul className="list-disc space-y-1 pl-4">
                    {row.extraChecks.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-navy/60">
        A · {getRemoteSuitabilityLabel("A")} / B ·{" "}
        {getRemoteSuitabilityLabel("B")} / C · {getRemoteSuitabilityLabel("C")}
      </p>
    </section>
  );
}
