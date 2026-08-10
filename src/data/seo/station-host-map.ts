/**
 * Station → Primary Host 매핑 (기존 URL만)
 * 신규 Station URL 생성 금지.
 */
import {
  allBusanRailStations,
  type BusanRailStation,
} from "@/data/geo/busan-rail-stations";

export type StationHostAssignment = {
  stationId: string;
  stationName: string;
  hostPage: string;
  priority: BusanRailStation["searchPriority"];
  action:
    | "ADD-SECTION"
    | "ALREADY-COVERED"
    | "MAP-TO-HUB"
    | "NEEDS-CONTENT"
    | "DO-NOT-ADD";
  notes?: string;
};

/** 기존에 존재하는 얇은 station-area SEO URL — 삭제하지 않음, 신규 생성·확장 중단 */
export const EXISTING_THIN_STATION_URLS = [
  "/서면역법무사",
  "/연산역법무사",
  "/센텀시티역법무사",
  "/해운대역법무사",
  "/광안역법무사",
  "/사상역법무사",
  "/명지역법무사",
] as const;

export function getStationHostAssignments(): StationHostAssignment[] {
  return allBusanRailStations.map((st) => {
    if (!st.hostPage) {
      return {
        stationId: st.id,
        stationName: st.name,
        hostPage: "",
        priority: st.searchPriority,
        action: "NEEDS-CONTENT",
        notes: "적합한 Host 없음 — 신규 URL 자동생성 금지",
      };
    }
    if (st.phase1Implemented) {
      return {
        stationId: st.id,
        stationName: st.name,
        hostPage: st.hostPage,
        priority: st.searchPriority,
        action: "ADD-SECTION",
      };
    }
    return {
      stationId: st.id,
      stationName: st.name,
      hostPage: st.hostPage,
      priority: st.searchPriority,
      action: "MAP-TO-HUB",
      notes: "Host 매핑만. Phase2 이후 섹션 검토",
    };
  });
}

export function getPrimaryStationsForHost(
  hostPath: string,
): BusanRailStation[] {
  return allBusanRailStations.filter(
    (st) => st.hostPage === hostPath && st.phase1Implemented,
  );
}
