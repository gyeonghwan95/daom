import Link from "next/link";

export type RegionalRemoteInheritanceProps = {
  /** 예: 통영·거제, 울주군, 기장군 */
  regionLabel: string;
  /** 상담 폼 region 파라미터 */
  inquiryRegion?: string;
  /** 유입 페이지 slug */
  fromPage?: string;
  /** 상속등기 | 상속포기 등 */
  inquiryField?: string;
  /** 제목 커스텀 (미지정 시 지역명 포함 기본문) */
  title?: string;
  /** 설명 커스텀 */
  description?: string;
  className?: string;
};

const STEPS = [
  "사망일과 피상속인 주소 확인",
  "상속인 수와 가족관계 확인",
  "부동산·재산·채무 확인",
  "필요한 업무와 비용 구성 안내",
  "원본서류·위임서류 전달 방식 결정",
  "등기 또는 법원 신청 진행",
  "결과와 완료서류 안내",
] as const;

/**
 * 지역 상속 페이지용 비대면 안내.
 * 지역명만 바꾼 복제 문구가 되지 않도록 regionLabel·custom copy를 받는다.
 * 완전 비대면·전국 무조건 가능을 단정하지 않는다.
 */
export function RegionalRemoteInheritance({
  regionLabel,
  inquiryRegion,
  fromPage,
  inquiryField = "inheritance-registration",
  title,
  description,
  className = "",
}: RegionalRemoteInheritanceProps) {
  const qs = new URLSearchParams();
  qs.set("field", inquiryField);
  if (fromPage) qs.set("from", fromPage);
  if (inquiryRegion) qs.set("region", inquiryRegion);
  const base = `/contact/inquiry?${qs.toString()}`;
  const costHref = `${base}&intent=${encodeURIComponent("준비서류와 비용 확인")}&cost=1`;
  const addressHref = `${base}&intent=${encodeURIComponent("부동산 주소로 절차 확인")}`;

  return (
    <section
      id="regional-remote-inheritance"
      className={`rounded-xl border border-beige-dark bg-[var(--surface-muted)] p-5 sm:p-6 ${className}`}
      aria-labelledby="regional-remote-inheritance-title"
    >
      <p className="text-xs font-semibold tracking-wide text-navy/70">
        방문 전 진행 가능 여부 확인
      </p>
      <h2
        id="regional-remote-inheritance-title"
        className="mt-2 text-lg font-bold text-[var(--text-primary)] sm:text-xl"
      >
        {title ??
          `${regionLabel}에 직접 방문하지 않아도 상속절차부터 확인할 수 있습니다`}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/80 sm:text-base">
        {description ??
          `상속부동산이 ${regionLabel}에 있거나 피상속인이 해당 지역에 거주했더라도, 상속인이 부산·서울·경기·해외 등 다른 지역에 있다면 전화나 온라인으로 먼저 상황을 확인할 수 있습니다.`}
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
        사건별 관할, 본인확인, 인감·서명, 원본서류와 해외서류 요건에 따라 추가
        절차가 필요할 수 있습니다. 모든 사건이 완전 비대면으로 끝난다고 단정하지
        않습니다.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={base}
          className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm sm:min-w-[10rem]"
        >
          상속 절차 먼저 확인하기
        </Link>
        <Link
          href={costHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm sm:min-w-[10rem]"
        >
          준비서류와 비용 문의하기
        </Link>
        <Link
          href={addressHref}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm sm:min-w-[10rem]"
        >
          부동산 주소로 확인하기
        </Link>
      </div>
    </section>
  );
}
