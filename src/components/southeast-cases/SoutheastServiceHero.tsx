import type { SoutheastLandingDef } from "@/lib/southeast-cases";

type Props = { def: SoutheastLandingDef };

export function SoutheastServiceHero({ def }: Props) {
  return (
    <div className="space-y-4">
      <p className="inline-flex items-center rounded-md bg-navy px-2.5 py-1 text-xs font-semibold tracking-wide text-white">
        {def.pageType === "region-hub"
          ? `${def.regionGroup} 전 지역 바로 상담·진행`
          : `${def.regionName} 바로 상담·진행`}
      </p>
      <aside
        className="rounded-xl border border-beige-dark border-l-4 border-l-navy bg-white p-4 md:p-5"
        aria-label={`${def.regionGroup} 의뢰 안내`}
      >
        <p className="text-sm font-bold text-[var(--text-muted)]">
          {def.regionGroup} · {def.primaryKeyword}
        </p>
        <p className="mt-3 text-[1.015rem] leading-[1.7] text-[var(--text-body)] md:text-base">
          {def.officeDisclosure}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          관할·서류만 맞으면 방문 없이 끝까지 진행할 수 있습니다. 지금 상황만 남겨
          주시면 바로 진행 방법을 안내해 드립니다.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            "안윤정 법무사 직접 확인",
            "보수와 공과금 구분",
            "방문·비대면 범위 사전 안내",
            "접수·보정·완료 진행상황 공유",
          ].map((item) => (
            <li
              key={item}
              className="rounded-lg border border-beige-dark bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--text-body)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
