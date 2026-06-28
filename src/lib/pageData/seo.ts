import { buildSeoTitle } from "@/lib/seo/metadata";

/** 메타 타이틀 28~38자 내외 */
export function buildMetaTitle(primary: string): string {
  const titled = buildSeoTitle(primary);
  if (titled.length >= 28 && titled.length <= 38) {
    return titled;
  }
  if (titled.length > 38) {
    const trimmed = primary.length > 22 ? `${primary.slice(0, 20)}…` : primary;
    const candidate = buildSeoTitle(trimmed);
    return candidate.length <= 38 ? candidate : candidate.slice(0, 38);
  }
  const padded = `${primary} | 부산 법무사`;
  return padded.length <= 38 ? padded : buildSeoTitle(primary.slice(0, 18));
}

/** 메타 디스크립션 80~120자 내외 */
export function buildMetaDescription(
  base: string,
  suffix = " 해운대·센텀 다옴법무사사무소에서 전화·카카오톡·방문(예약) 상담이 가능합니다.",
): string {
  const trimmed = base.trim().replace(/\s+/g, " ");
  if (trimmed.length >= 80 && trimmed.length <= 120) {
    return trimmed;
  }
  if (trimmed.length > 120) {
    return `${trimmed.slice(0, 117)}…`;
  }
  const combined = `${trimmed}${suffix}`;
  if (combined.length <= 120) {
    return combined;
  }
  const room = 120 - suffix.length;
  return `${trimmed.slice(0, Math.max(room - 1, 60)).trim()}…`;
}
