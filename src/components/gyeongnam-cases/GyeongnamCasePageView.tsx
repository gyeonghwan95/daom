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

const INHERITANCE_REMOTE_TYPES = new Set([
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

const INHERITANCE_COST_TYPES = new Set([
  "inheritance",
  "inheritance-cost",
  "inheritance-documents",
  "inheritance-property",
  "complex-inheritance",
  "residence-mismatch",
  "legacy",
]);

function inquiryFieldForDef(def: GyeongnamLandingDef): string {
  if (def.pageType.startsWith("corporate")) return "corporate-registration";
  if (
    def.pageType === "renunciation" ||
    def.pageType === "limited-acceptance"
  ) {
    return "inheritance-renunciation";
  }
  if (def.pageType === "rehabilitation") return "personal-rehabilitation";
  if (def.pageType === "preservation") return "preservation-registration";
  if (def.pageType === "mortgage-cancel" || def.pageType === "joint-mortgage") {
    return "mortgage";
  }
  if (
    def.pageType === "gift" ||
    def.pageType === "real-estate" ||
    def.pageType === "demolition"
  ) {
    return "real-estate-registration";
  }
  if (def.pageType === "payment-order") return "civil-debt";
  if (def.pageType === "region-hub") return "other";
  return "inheritance-registration";
}

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
  const showRemote = INHERITANCE_REMOTE_TYPES.has(def.pageType);
  const showCostGuide = INHERITANCE_COST_TYPES.has(def.pageType);
  const inquiryField = inquiryFieldForDef(def);
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
          {showCostGuide ? <InheritanceCostGuide fromPage={def.slug} /> : null}
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
