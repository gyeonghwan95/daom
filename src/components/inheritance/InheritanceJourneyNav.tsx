import Link from "next/link";
import {
  getInheritanceJourneyNeighbors,
  INHERITANCE_JOURNEY_STAGES,
} from "@/lib/inheritance/journey";

export type InheritanceJourneyNavProps = {
  currentSlug: string;
  /** compact: 모바일용 짧은 라벨 */
  variant?: "full" | "compact";
  className?: string;
};

/**
 * 상속 검색 유입을 시간 순서로 연결하는 여정 네비.
 * 현재 단계 강조 + 이전/다음 단계 링크.
 */
export function InheritanceJourneyNav({
  currentSlug,
  variant = "full",
  className = "",
}: InheritanceJourneyNavProps) {
  const { current, prev, next } = getInheritanceJourneyNeighbors(currentSlug);
  if (!current) return null;

  return (
    <nav
      id="inheritance-journey"
      className={`rounded-xl border border-beige-dark bg-white p-4 sm:p-5 ${className}`}
      aria-label="상속 절차 단계 안내"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-navy/65">
            상속 절차 여정
          </p>
          <p className="mt-1 text-sm font-semibold text-navy sm:text-base">
            {current.step}단계 · {current.label}
          </p>
        </div>
        <Link
          href="/상속"
          className="text-sm font-medium text-navy-light underline-offset-2 hover:underline"
        >
          상속 종합 허브
        </Link>
      </div>

      <ol className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {INHERITANCE_JOURNEY_STAGES.map((stage) => {
          const active = stage.id === current.id;
          return (
            <li key={stage.id} className="shrink-0">
              <Link
                href={stage.href}
                className={
                  active
                    ? "flex min-w-[4.5rem] flex-col items-center rounded-lg bg-navy px-2.5 py-2 text-center text-white"
                    : "flex min-w-[4.5rem] flex-col items-center rounded-lg border border-beige-dark bg-[var(--surface-muted)] px-2.5 py-2 text-center text-navy/80 hover:border-navy-light"
                }
                aria-current={active ? "step" : undefined}
              >
                <span className="text-[10px] font-semibold opacity-80">
                  {stage.step}
                </span>
                <span className="mt-0.5 text-[11px] font-semibold leading-tight sm:text-xs">
                  {variant === "compact" ? stage.shortLabel : stage.shortLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 text-sm leading-relaxed text-navy/75">
        {current.description}. 지금 단계가 아니어도 이전·다음 안내를 먼저 읽어
        보시면 순서가 잡힙니다.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {prev ? (
          <Link
            href={prev.href}
            className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
          >
            이전: {prev.shortLabel}
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" aria-hidden />
        )}
        {next ? (
          <Link
            href={next.href}
            className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
          >
            다음: {next.shortLabel}
          </Link>
        ) : (
          <Link
            href="/상속상담전준비서류와비용"
            className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
          >
            서류·비용 확인하기
          </Link>
        )}
      </div>
    </nav>
  );
}
