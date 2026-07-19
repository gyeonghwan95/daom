import { Suspense } from "react";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { SoutheastServiceHero } from "@/components/southeast-cases/SoutheastServiceHero";
import {
  SoutheastHubExplorer,
  type SoutheastExplorerFilter,
  type SoutheastExplorerItem,
} from "@/components/southeast-cases/SoutheastHubExplorer";
import type { PageData } from "@/lib/pageData/types";
import type { SoutheastLandingDef } from "@/lib/southeast-cases";

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
  return (
    <PageDataTemplate
      page={page}
      heroAddon={<SoutheastServiceHero def={def} />}
    >
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
