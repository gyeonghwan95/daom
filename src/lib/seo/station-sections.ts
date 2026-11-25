import { getPrimaryStationsForHost } from "@/data/seo/station-host-map";
import {
  buildStationSectionBody,
  getStationSectionContent,
  type StationSectionContent,
} from "@/data/seo/station-section-content";
import { getStationById } from "@/data/geo/busan-rail-stations";

export type StationPageSection = {
  id: string;
  title: string;
  body: string;
  items?: string[];
  links?: { href: string; label: string }[];
};

/** Host path(예: /서면법무사)에 배정된 Phase1 Station → 페이지 섹션 */
export function buildStationSectionsForHost(
  hostPath: string,
): StationPageSection[] {
  const stations = getPrimaryStationsForHost(hostPath);
  const sections: StationPageSection[] = [];

  if (stations.length === 0) return sections;

  sections.push({
    id: "station-rail-intro",
    title: "이 지역의 도시철도·전철에서 찾는 경우",
    body: "가까운 지하철역을 기준으로 찾으신다면 아래 역 안내를 눌러 보세요. 역 주변 생활권에서 자주 맡기시는 등기와 상담 전에 준비할 것을 함께 정리했습니다.",
  });

  for (const station of stations) {
    const content = getStationSectionContent(station.id);
    if (!content) continue;
    sections.push(stationContentToSection(station.id, content));
  }

  return sections;
}

export function stationContentToSection(
  stationId: string,
  content: StationSectionContent,
): StationPageSection {
  const station = getStationById(stationId);
  if (!station) {
    return {
      id: `station-${stationId}`,
      title: content.heading,
      body: [content.intro, content.localContext, content.nextStep].join("\n\n"),
      links: content.serviceLinks,
      items: content.checklist,
    };
  }
  const items = [
    ...(content.checklist ?? []),
    ...(content.faq
      ? [`Q. ${content.faq.question} — ${content.faq.answer}`]
      : []),
  ];
  return {
    id: station.stationSectionId ?? `station-${station.id}`,
    title: content.heading,
    body: buildStationSectionBody(station, content),
    items: items.length ? items : undefined,
    links: content.serviceLinks,
  };
}
