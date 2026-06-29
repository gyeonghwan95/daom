import type { GlossaryCategory } from "@/lib/glossary/types";

const SERVICE_DOMAIN: Record<string, string> = {
  "inheritance-registration": "상속",
  "inheritance-renunciation": "상속",
  "qualified-acceptance": "상속",
  "real-estate-registration": "부동산등기",
  "ownership-transfer": "부동산등기",
  "corporate-registration": "법인등기",
  "company-establishment": "법인등기",
  "director-change": "법인등기",
  "personal-rehabilitation": "회생파산",
  bankruptcy: "회생파산",
};

const GLOSSARY_DOMAIN: Record<GlossaryCategory, string> = {
  inheritance: "상속",
  "real-estate": "부동산등기",
  rights: "민사·채권",
  civil: "민사·채권",
  rehab: "회생파산",
  corporate: "법인등기",
  "tax-fee": "등기·비용",
};

export function getServiceDomain(serviceSlug?: string): string | undefined {
  if (!serviceSlug) return undefined;
  return SERVICE_DOMAIN[serviceSlug];
}

export function getGlossaryDomain(category: GlossaryCategory): string {
  return GLOSSARY_DOMAIN[category];
}

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function categoriesMatch(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const left = a.trim();
  const right = b.trim();
  if (left === right) return true;
  return left.includes(right) || right.includes(left);
}

export function regionsMatch(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const left = a.trim();
  const right = b.trim();
  if (left === right) return true;
  if (left.includes(right) || right.includes(left)) return true;
  if (right === "부산 전역" || left === "부산 전역") return true;
  if (left.includes("부산") && right.includes("부산")) return true;
  return false;
}

export function collectServiceSlugs(
  serviceSlug?: string,
  relatedServices?: string[],
): string[] {
  return [...new Set([serviceSlug, ...(relatedServices ?? [])].filter(Boolean))] as string[];
}
