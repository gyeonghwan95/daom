import Link from "next/link";
import { Suspense } from "react";
import { NationwideServiceNotice } from "@/components/nationwide/NationwideServiceNotice";
import {
  InheritanceCostGuide,
  RegionalRemoteInheritance,
} from "@/components/inheritance";
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

/**
 * 시·도 단위 상속 허브: 같은 '전국 의뢰' 세부 설명이 여러 시·도에 반복되어 간결형으로 보여 준다.
 * 지역 고유 내용(localIntro·localPoints·localFaqs·지역 커버리지)이 첫 화면을 차지하게 한다.
 */
const SIDO_INHERITANCE_HUBS = new Set([
  "경기상속등기법무사", "인천상속등기법무사", "광주상속등기법무사", "세종상속등기법무사", "강원상속등기법무사",
  "충북상속등기법무사", "충남상속등기법무사", "전북상속등기법무사", "전남상속등기법무사", "경북상속등기법무사",
  "경남상속등기법무사", "제주상속등기법무사", "울산상속등기법무사",
]);

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
  const showRemote =
    def.kind !== "hub" ||
    def.primaryKeyword.includes("상속") ||
    def.regionName === "전국";

  return (
    <PageDataTemplate
      page={page}
      hasRemoteNotice
      heroAddon={
        <NationwideServiceNotice
          type={(def.noticeType ?? "remote-accept") as NationwideServiceType}
          badge={
            def.kind === "hub" || def.regionName === "전국"
              ? "전국 의뢰 가능"
              : `${def.regionName} 부동산 전국 의뢰 가능`
          }
          footnote={SIDO_INHERITANCE_HUBS.has(def.slug) ? undefined : def.disclosure}
          showDetails={!SIDO_INHERITANCE_HUBS.has(def.slug)}
          ctaLabel={def.ctaTitle}
          ctaHref={inquiryHref}
        />
      }
    >
      {showRemote && def.primaryKeyword.includes("상속") ? (
        <div className="space-y-6">
          <RegionalRemoteInheritance
            regionLabel={def.regionName}
            inquiryRegion={region || undefined}
            fromPage={def.slug}
            description={def.localIntro?.slice(0, 220)}
          />
          <InheritanceCostGuide fromPage={def.slug} />
        </div>
      ) : null}

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
