import Link from "next/link";

export type RemoteInheritanceProcessProps = {
  /** 유입 페이지 slug — 상담 폼 from 파라미터 */
  fromPage?: string;
  className?: string;
};

const STEPS = [
  "사망일과 상속인 구성 확인",
  "재산·채무 및 희망 업무 확인",
  "준비서류와 비용 구성 안내",
  "위임·원본서류 전달 방식 결정",
  "등기 또는 법원 신청 진행",
  "완료 결과 안내와 서류 반환",
] as const;

/**
 * 비대면 수요가 높은 상속 페이지용.
 * 완전 비대면 보장을 암시하지 않도록 주의 문구를 포함한다.
 */
export function RemoteInheritanceProcess({
  fromPage,
  className = "",
}: RemoteInheritanceProcessProps) {
  const qs = new URLSearchParams();
  qs.set("field", "inheritance-registration");
  if (fromPage) qs.set("from", fromPage);
  const base = `/contact/inquiry?${qs.toString()}`;
  const costHref = `${base}&intent=${encodeURIComponent("준비서류와 비용 확인")}`;
  const situationHref = `${base}&intent=${encodeURIComponent("현재 상황 안내")}`;

  return (
    <section
      id="remote-inheritance"
      className={`rounded-xl border border-beige-dark bg-[var(--surface-muted)] p-5 sm:p-6 ${className}`}
      aria-labelledby="remote-inheritance-title"
    >
      <p className="text-xs font-semibold tracking-wide text-navy/70">
        방문 전 먼저 확인 가능
      </p>
      <h2
        id="remote-inheritance-title"
        className="mt-2 text-lg font-bold text-[var(--text-primary)] sm:text-xl"
      >
        상속인이 여러 지역에 있어도 절차부터 확인할 수 있습니다
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/80 sm:text-base">
        사망일, 상속인 구성, 부동산과 확인된 채무를 전화·카카오톡·네이버 톡톡으로
        먼저 알려주시면 필요한 업무와 준비자료를 확인합니다. 사건에 따라
        가족관계서류, 등기사항증명서, 재산조회 결과 등을 사진·전자파일·우편으로
        전달할 수 있습니다.
      </p>

      <ol className="mt-5 space-y-2">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 text-sm leading-relaxed text-navy/85 sm:text-base"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white"
              aria-hidden
            >
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-lg border border-beige-dark bg-white px-4 py-3 text-sm leading-relaxed text-navy/75">
        원본서류, 본인확인, 해외서류 또는 개별 기관의 요구에 따라 추가 절차가
        필요할 수 있습니다. 모든 사건이 완전 비대면으로 처리된다고 단정하지
        않습니다.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={base}
          className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
        >
          상속 절차 먼저 확인하기
        </Link>
        <Link
          href={costHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
        >
          준비서류와 비용 문의하기
        </Link>
        <Link
          href={situationHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
        >
          현재 상황 남기기
        </Link>
      </div>
    </section>
  );
}
