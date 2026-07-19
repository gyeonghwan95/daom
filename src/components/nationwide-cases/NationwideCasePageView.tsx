import Link from "next/link";
import { Suspense } from "react";
import { NationwideServiceNotice } from "@/components/nationwide/NationwideServiceNotice";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import {
  NationwideRegionExplorer,
  type RegionExplorerGroup,
  type RegionExplorerItem,
} from "@/components/nationwide-cases/NationwideRegionExplorer";
import type { PageData } from "@/lib/pageData/types";
import type { NationwideServiceType } from "@/lib/nationwide";
import {
  caseNationwidePath,
  inquiryRegionParam,
  type RegionLandingDef,
} from "@/lib/nationwide-cases";

type Props = {
  page: PageData;
  def: RegionLandingDef;
  explorerItems?: RegionExplorerItem[];
  explorerGroups?: RegionExplorerGroup[];
};

export function NationwideCasePageView({
  page,
  def,
  explorerItems = [],
  explorerGroups = [],
}: Props) {
  const region = inquiryRegionParam(def);
  const inquiryQs = new URLSearchParams({ from: "nationwide" });
  if (region) inquiryQs.set("region", region);
  inquiryQs.set("field", "inheritance-registration");
  const inquiryHref = `/contact/inquiry?${inquiryQs.toString()}`;

  return (
    <PageDataTemplate
      page={page}
      heroAddon={
        <div className="space-y-4">
          <p className="inline-flex items-center rounded-md bg-navy px-2.5 py-1 text-xs font-semibold tracking-wide text-white">
            {def.kind === "hub" || def.regionName === "전국"
              ? "전국 의뢰 상담 가능"
              : `${def.regionName} 부동산 전국 의뢰 가능`}
          </p>
          <NationwideServiceNotice
            type={(def.noticeType ?? "remote-accept") as NationwideServiceType}
            ctaLabel={def.ctaTitle}
            ctaHref={inquiryHref}
          />
          <aside
            className="rounded-lg border border-beige-dark border-l-4 border-l-navy bg-[var(--surface-muted)] p-4 text-[1.015rem] leading-[1.7] text-[var(--text-body)]"
            aria-label="사무소 위치 안내"
          >
            {def.disclosure}
          </aside>
        </div>
      }
    >
      {def.kind === "region-hub" ? (
        <Suspense fallback={<p className="text-sm text-navy/60">지역 목록 준비 중…</p>}>
          <NationwideRegionExplorer
            items={explorerItems}
            groups={explorerGroups}
          />
        </Suspense>
      ) : null}

      {def.kind === "hub" ? (
        <section className="space-y-3" aria-label="전국 업무 바로가기">
          <h2 className="section-heading">전국 업무 바로가기</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {def.relatedServiceSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={caseNationwidePath(slug)}
                  className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 text-sm font-medium text-navy no-underline hover:bg-beige/40"
                >
                  {slug.replace(/법무사$/, "").replace(/등기$/, "등기 ")}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={caseNationwidePath("지역별상속등기법무사")}
                className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 text-sm font-medium text-navy no-underline hover:bg-beige/40"
              >
                지역별 상속등기 안내
              </Link>
            </li>
          </ul>
        </section>
      ) : null}
    </PageDataTemplate>
  );
}
