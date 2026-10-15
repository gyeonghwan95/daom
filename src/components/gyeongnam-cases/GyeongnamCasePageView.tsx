import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { NationwideServiceNotice } from "@/components/nationwide/NationwideServiceNotice";
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
  // 상속·유증등기 페이지에는 전국 의뢰 패널(관할 특례)을 둔다. 상속포기(가정법원 사건)는 제외.
  const showNationwideNotice = INHERITANCE_COST_TYPES.has(def.pageType);
  const inquiryField = inquiryFieldForDef(def);
  const region = inquiryRegionFromDef(def);

  return (
    <PageDataTemplate
      page={page}
      hasRemoteNotice={showNationwideNotice}
      heroAddon={
        <>
          <GyeongnamServiceHero def={def} />
          {showNationwideNotice ? (
            <NationwideServiceNotice
              type="jurisdiction-exception"
              badge={`${def.regionName} 부동산 전국 의뢰 가능`}
              showDetails={false}
            />
          ) : null}
        </>
      }
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
        <GyeongnamHubExplorer
          items={explorerItems}
          filters={explorerFilters}
          coreLinks={coreLinks}
        />
      ) : null}
    </PageDataTemplate>
  );
}
