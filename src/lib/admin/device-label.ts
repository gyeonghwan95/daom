export type DeviceKind = "mobile" | "desktop" | "unknown";

export function getDeviceLabel(device?: string | null): string {
  if (device === "mobile") return "모바일";
  if (device === "desktop") return "PC";
  return "미확인";
}

export function getDeviceBadgeClass(device?: string | null): string {
  if (device === "mobile") return "admin-badge admin-badge--mobile";
  if (device === "desktop") return "admin-badge admin-badge--desktop";
  return "admin-badge admin-badge--low_data";
}

/** 페이지·일자별 모바일/PC 조회 수 요약. 둘 다 0이면 대시. */
export function formatDeviceSplit(mobile?: number, desktop?: number): string {
  const m = mobile || 0;
  const d = desktop || 0;
  if (m === 0 && d === 0) return "—";
  return `모바일 ${m} · PC ${d}`;
}
