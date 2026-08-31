import indexPolicy from "../../../seo/index-policy.json";
import { getGlossaryCanonicalOverride } from "@/lib/glossary/policy";

function normalizePath(raw: string): string {
  const decoded = (raw.split("?")[0] ?? raw).trim();
  if (!decoded || decoded === "/") return "/";
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

const NOINDEX = new Set(
  (indexPolicy.noindex as string[]).map((path) => normalizePath(path)),
);

const CANONICAL_OVERRIDES = Object.fromEntries(
  Object.entries(indexPolicy.canonicalOverrides as Record<string, string>).map(
    ([from, to]) => [normalizePath(from), normalizePath(to)],
  ),
);

export function isNoIndexPath(path: string): boolean {
  return NOINDEX.has(normalizePath(path));
}

export function getCanonicalOverridePath(path: string): string | undefined {
  const normalized = normalizePath(path);
  return CANONICAL_OVERRIDES[normalized] ?? getGlossaryCanonicalOverride(normalized);
}

export function resolveCanonicalPath(path: string): string {
  return getCanonicalOverridePath(path) ?? normalizePath(path);
}

export function getNoIndexPaths(): string[] {
  return [...NOINDEX];
}
