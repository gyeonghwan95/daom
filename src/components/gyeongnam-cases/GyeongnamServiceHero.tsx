import Link from "next/link";
import type { GyeongnamLandingDef } from "@/lib/gyeongnam-cases";
import { inquiryRegionFromDef } from "@/lib/gyeongnam-cases";

type Props = {
  def: GyeongnamLandingDef;
};

export function GyeongnamServiceHero({ def }: Props) {
  const region = inquiryRegionFromDef(def);
  const inquiry = `/contact/inquiry?from=nationwide&region=${encodeURIComponent(region)}&field=${
    def.pageType.startsWith("corporate")
      ? "corporate-registration"
      : "inheritance-registration"
  }`;

  return (
    <div className="space-y-4">
      <p className="inline-flex items-center rounded-md bg-navy px-2.5 py-1 text-xs font-semibold tracking-wide text-white">
        {def.pageType === "region-hub"
          ? "경남 전 지역 상담 가능 여부 확인"
          : `${def.regionName} 경남 상담 가능 여부 확인`}
      </p>

      <aside
        className="rounded-xl border border-beige-dark border-l-4 border-l-navy bg-white p-4 md:p-5"
        aria-label="경남 의뢰 안내"
      >
        <p className="text-sm font-bold text-[var(--text-muted)]">
          {def.regionName} · {def.primaryKeyword}
        </p>
        <p className="mt-3 text-[1.015rem] leading-[1.7] text-[var(--text-body)] md:text-base">
          {def.officeDisclosure}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          관할·서류 조건이 맞으면 검토할 수 있지만, 현재 상황을 상담으로 말씀해
          주시면 가능 여부를 안내해 드립니다.
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
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link href={inquiry} className="btn-primary min-h-12 px-5 text-sm">
            {def.ctaTitle}
          </Link>
          <Link href={inquiry} className="btn-secondary min-h-12 px-5 text-sm">
            상담 신청서 작성
          </Link>
        </div>
      </aside>
    </div>
  );
}
