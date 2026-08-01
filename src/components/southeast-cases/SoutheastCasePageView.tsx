import { Suspense } from "react";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import {
  InheritanceCostGuide,
  RegionalRemoteInheritance,
} from "@/components/inheritance";
import { SoutheastServiceHero } from "@/components/southeast-cases/SoutheastServiceHero";
import {
  SoutheastHubExplorer,
  type SoutheastExplorerFilter,
  type SoutheastExplorerItem,
} from "@/components/southeast-cases/SoutheastHubExplorer";
import type { PageData } from "@/lib/pageData/types";
import {
  inquiryRegionFromSoutheast,
  type SoutheastLandingDef,
} from "@/lib/southeast-cases";

const INHERITANCE_TYPES = new Set([
  "inheritance",
  "inheritance-cost",
  "inheritance-documents",
  "apartment-inheritance",
  "land-inheritance",
  "farmland-inheritance",
  "forest-inheritance",
  "factory-inheritance",
  "complex-inheritance",
  "residence-mismatch",
  "legacy",
  "bequest",
  "renunciation",
  "limited-acceptance",
  "region-hub",
]);

type Props = {
  page: PageData;
  def: SoutheastLandingDef;
  explorerItems?: SoutheastExplorerItem[];
  explorerFilters?: SoutheastExplorerFilter[];
  coreLinks?: Array<{ href: string; label: string }>;
};

export function SoutheastCasePageView({
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
  const region = inquiryRegionFromSoutheast(def);

  return (
    <PageDataTemplate
      page={page}
      heroAddon={<SoutheastServiceHero def={def} />}
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
          fallback={<p className="text-sm text-navy/60">지역 목록 준비 중…</p>}
        >
          <SoutheastHubExplorer
            items={explorerItems}
            filters={explorerFilters}
            coreLinks={coreLinks}
            groupLabel={def.regionGroup}
          />
        </Suspense>
      ) : null}
    </PageDataTemplate>
  );
}
