import { RemoteServicePanel } from "@/components/nationwide/RemoteServicePanel";
import { REGION_REMOTE_POINTS } from "@/lib/nationwide/remote-panel-copy";
import type { SoutheastLandingDef } from "@/lib/southeast-cases";

type Props = { def: SoutheastLandingDef };

export function SoutheastServiceHero({ def }: Props) {
  return (
    <RemoteServicePanel
      badge={
        def.pageType === "region-hub"
          ? `${def.regionGroup} 전 지역 바로 상담·진행`
          : `${def.regionName} 바로 상담·진행`
      }
      title={`부산 방문 없이 ${def.primaryKeyword} 상담이 가능합니다`}
      titleAs="p"
      lead={def.officeDisclosure}
      points={REGION_REMOTE_POINTS}
      footnote="방문이 필요한 절차가 있으면 수임 전에 먼저 안내합니다."
      ariaLabel={`${def.regionGroup} 의뢰 안내`}
    />
  );
}
