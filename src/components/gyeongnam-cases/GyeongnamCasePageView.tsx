import { Suspense } from "react";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import {
  InheritanceCostGuide,
  RegionalRemoteInheritance,
} from "@/components/inheritance";
import { GyeongnamServiceHero } from "@/components/gyeongnam-cases/GyeongnamServiceHero";
import {
  GyeongnamHubExplorer,
  type GyeongnamExplorerFilter,
  type GyeongnamExplorerItem,
} from "@/components/gyeongnam-cases/GyeongnamHubExplorer";
import type { PageData } from "@/lib/pageData/types";
import {
  inquiryRegionFromDef,
  type GyeongnamLandingDef,
} from "@/lib/gyeongnam-cases";

const INHERITANCE_TYPES = new Set([
  "inheritance",
  "inheritance-cost",
  "inheritance-documents",
  "inheritance-property",
  "complex-inheritance",
  "residence-mismatch",
  "legacy",
  "renunciation",
  "limited-acceptance",
  "region-hub",
]);

type Props = {
  page: PageData;
  def: GyeongnamLandingDef;
  explorerItems?: GyeongnamExplorerItem[];
  explorerFilters?: GyeongnamExplorerFilter[];
  coreLinks?: Array<{ href: string; label: string }>;
};

export function GyeongnamCasePageView({
  page,
  def,
  explorerItems = [],
  explorerFilters = [],
  coreLinks = [],
}: Props) {
  const showRemote = INHERITANCE_TYPES.has(def.pageType);
  const inquiryField =
    def.pageType === "renunciation" || def.pageType === "limited-acceptance"
      ? "inheritance-renunciation"
      : "inheritance-registration";
  const region = inquiryRegionFromDef(def);

  return (
    <PageDataTemplate
      page={page}
      heroAddon={<GyeongnamServiceHero def={def} />}
    >
      {showRemote ? (
        <div className="space-y-6">
          <RegionalRemoteInheritance
            regionLabel={def.regionName}
            inquiryRegion={region}
            fromPage={def.slug}
            inquiryField={inquiryField}
            description={def.remoteHint}
          />
          <InheritanceCostGuide fromPage={def.slug} />
        </div>
      ) : null}
      {def.pageType === "region-hub" ? (
        <Suspense
          fallback={<p className="text-sm text-navy/60">경남 목록 준비 중…</p>}
        >
          <GyeongnamHubExplorer
            items={explorerItems}
            filters={explorerFilters}
            coreLinks={coreLinks}
          />
        </Suspense>
      ) : null}
    </PageDataTemplate>
  );
}
