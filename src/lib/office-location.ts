export const officeLocation = {
  fullAddress: "부산광역시 해운대구 센텀동로 200 D동 1층 LAB9호",
  shortAddress: "부산광역시 해운대구 센텀동로 200",
  room: "D동 1층 LAB9호",
  areaLabel: "해운대 · 센텀",
  subway: "지하철 2·동해선 센텀시티역 도보 5분",
  parking: "주차 가능",
  accessSummary: "주차 가능 · 센텀시티역 도보 5분",
  visitNotice: "꼭 예약 후 방문해 주세요.",
  visitNoticeDetail:
    "사무소 방문은 반드시 사전 예약 후 이용해 주세요. 전화, 카카오톡, 네이버 톡톡 중 편한 방법으로 예약을 요청하시면 안내해 드립니다.",
} as const;

export function getOfficeLocationLine(): string {
  return officeLocation.fullAddress;
}

export function getOfficeLocationWithAccess(): string {
  return `${officeLocation.fullAddress} (${officeLocation.accessSummary})`;
}

export function getNaverMapSearchUrl(
  query: string = officeLocation.fullAddress,
): string {
  return `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
}
