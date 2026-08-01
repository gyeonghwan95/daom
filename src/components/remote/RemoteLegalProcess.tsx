import Link from "next/link";

export type RemoteLegalProcessProps = {
  fromPage?: string;
  inquiryField?: string;
  title?: string;
  description?: string;
  className?: string;
};

const STEPS = [
  "전화·카카오톡·네이버 톡톡으로 기본 상황 접수",
  "사진 또는 전자파일로 기초자료 확인",
  "필요한 업무와 준비서류 안내",
  "법무사 보수·세금·공과금 구분 안내",
  "위임장과 원본서류 전달 방식 결정",
  "등기·법원 신청 등 실제 업무 진행",
  "진행 상황과 완료 결과 안내",
  "완료서류 우편 또는 협의한 방식으로 전달",
] as const;

/**
 * 전국·원격 진행 검색 의도 페이지용.
 * 완전 비대면·전화 한 번 해결을 암시하지 않는다.
 */
export function RemoteLegalProcess({
  fromPage,
  inquiryField = "inheritance-registration",
  title = "사무소에 오기 전 전화와 자료로 절차부터 확인할 수 있습니다",
  description = "현재 상황과 준비된 자료를 먼저 보내주시면 필요한 업무, 추가로 준비할 서류, 원본 전달 방법과 비용 확인에 필요한 항목을 안내합니다.",
  className = "",
}: RemoteLegalProcessProps) {
  const qs = new URLSearchParams();
  qs.set("field", inquiryField);
  if (fromPage) qs.set("from", fromPage);
  const base = `/contact/inquiry?${qs.toString()}`;
  const costHref = `${base}&intent=${encodeURIComponent("준비서류와 비용 확인")}&cost=1`;
  const docsHref = `${base}&intent=${encodeURIComponent("현재 가진 자료로 확인")}`;

  return (
    <section
      id="remote-legal-process"
      className={`rounded-xl border border-beige-dark bg-[var(--surface-muted)] p-5 sm:p-6 ${className}`}
      aria-labelledby="remote-legal-process-title"
    >
      <p className="text-xs font-semibold tracking-wide text-navy/70">
        방문 전 진행 가능 여부 확인
      </p>
      <h2
        id="remote-legal-process-title"
        className="mt-2 text-lg font-bold text-[var(--text-primary)] sm:text-xl"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/80 sm:text-base">
        {description}
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
        사건별 본인확인, 인감·서명, 원본서류, 해외서류 또는 기관의 추가 요구에
        따라 방문이나 별도 절차가 필요할 수 있습니다. 모든 사건이 완전 비대면으로
        끝난다고 단정하지 않습니다.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={base}
          className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm sm:min-w-[10rem]"
        >
          방문 없이 가능한지 먼저 확인하기
        </Link>
        <Link
          href={costHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm sm:min-w-[10rem]"
        >
          준비서류와 비용 문의하기
        </Link>
        <Link
          href={docsHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm sm:min-w-[10rem]"
        >
          현재 가진 자료로 확인하기
        </Link>
      </div>
    </section>
  );
}
