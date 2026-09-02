/**
 * 지역명을 앞에 붙일 때 이미 같은 말로 시작하면 중복하지 않는다.
 * `includes`가 아니라 `startsWith`만 본다. URL·slug·잠긴 H1은 여기서 바꾸지 않는다.
 */
export function withRegionLabel(regionLabel: string, text: string): string {
  const region = regionLabel.trim();
  const value = text.trim();
  if (!value) return region;
  if (!region) return value;
  if (value.startsWith(region)) return value;
  return `${region} ${value}`;
}

/** 동네 목록이 이미 지역명으로 시작하면 `부산 부산진구`처럼 겹치지 않게 붙인다. */
export function formatPlaceList(regionLabel: string, places: string[]): string {
  const cleaned = places.map((place) => place.trim()).filter(Boolean);
  const joined = cleaned.join(", ");
  if (!joined) return regionLabel.trim();
  return withRegionLabel(regionLabel, joined);
}
