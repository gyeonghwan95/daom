import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { NationwideServiceNotice } from "@/components/nationwide/NationwideServiceNotice";
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
  // 상속·유증등기 페이지에는 전국 의뢰 패널(관할 특례)을 둔다. 상속포기·한정승인(가정법원 사건)과 업무 종합 허브는 제외.
  const showNationwideNotice =
    showRemote &&
    def.pageType !== "renunciation" &&
    def.pageType !== "limited-acceptance" &&
    def.pageType !== "region-hub";
  const inquiryField =
    def.pageType === "renunciation" || def.pageType === "limited-acceptance"
      ? "inheritance-renunciation"
      : "inheritance-registration";
  const region = inquiryRegionFromSoutheast(def);

  return (
    <PageDataTemplate
      page={page}
      hasRemoteNotice={showNationwideNotice}
      heroAddon={
        <>
          <SoutheastServiceHero def={def} />
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
          <InheritanceCostGuide fromPage={def.slug} />
        </div>
      ) : null}
      {def.pageType === "region-hub" ? (
        <SoutheastHubExplorer
            items={explorerItems}
            filters={explorerFilters}
            coreLinks={coreLinks}
            groupLabel={def.regionGroup}
          />
      ) : null}
    </PageDataTemplate>
  );
}
