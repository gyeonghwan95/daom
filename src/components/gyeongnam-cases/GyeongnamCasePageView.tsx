import { Suspense } from "react";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { GyeongnamServiceHero } from "@/components/gyeongnam-cases/GyeongnamServiceHero";
import {
  GyeongnamHubExplorer,
  type GyeongnamExplorerFilter,
  type GyeongnamExplorerItem,
} from "@/components/gyeongnam-cases/GyeongnamHubExplorer";
import type { PageData } from "@/lib/pageData/types";
import type { GyeongnamLandingDef } from "@/lib/gyeongnam-cases";

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
  return (
    <PageDataTemplate
      page={page}
      heroAddon={<GyeongnamServiceHero def={def} />}
    >
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
