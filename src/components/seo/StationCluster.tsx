import type { BusanRailStation } from "@/data/geo/busan-rail-stations";
import { getStationSectionContent } from "@/data/seo/station-section-content";
import { StationServiceSection } from "./StationServiceSection";

type Props = {
  stations: BusanRailStation[];
  introTitle?: string;
  introBody?: string;
};

/** Host 페이지에 여러 역 섹션을 묶을 때 사용 (SSR) */
export function StationCluster({
  stations,
  introTitle = "이 지역의 도시철도·전철에서 찾는 경우",
  introBody = "역 이름으로 찾으셨다면 아래 안내에서 생활권과 연결되는 업무로 이어가면 됩니다.",
}: Props) {
  const withContent = stations.filter((st) => getStationSectionContent(st.id));
  if (withContent.length === 0) return null;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="section-heading">{introTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-navy/70">
          {introBody}
        </p>
      </div>
      {withContent.map((station) => {
        const content = getStationSectionContent(station.id)!;
        return (
          <StationServiceSection
            key={station.id}
            station={station}
            content={content}
          />
        );
      })}
    </div>
  );
}
