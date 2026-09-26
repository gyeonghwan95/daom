/**
 * Reserved inheritance intents — auto page generators must not create
 * competing representatives for these roles.
 */
export const RESERVED_INHERITANCE_INTENTS = {
  BUSAN_INHERITANCE_HUB: {
    path: "/부산상속법무사",
    query: "부산 상속 법무사",
    role: "INHERITANCE_DECISION_HUB",
  },
  BUSAN_INHERITANCE_RENUNCIATION: {
    path: "/부산상속포기",
    query: "부산 상속포기 법무사",
    role: "RENUNCIATION_ACTION",
  },
  BUSAN_INHERITANCE_PROVIDER_SELECTION: {
    path: "/부산상속전문법무사",
    query: "부산 상속전문 법무사",
    role: "PROVIDER_SELECTION",
  },
} as const;

export type ReservedInheritanceIntentId =
  keyof typeof RESERVED_INHERITANCE_INTENTS;

const RESERVED_PATHS = new Set(
  Object.values(RESERVED_INHERITANCE_INTENTS).map((v) => v.path),
);

/** Slugs that must not be auto-spawned as additional “부산 상속*전문*” owners. */
export const RESERVED_INHERITANCE_SLUG_BLOCKLIST = [
  "부산상속법무사",
  "부산상속포기",
  "부산상속전문법무사",
  "부산상속전문",
  "부산상속법무사전문",
  "상속전문법무사부산",
] as const;

export function isReservedInheritancePath(path: string): boolean {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return RESERVED_PATHS.has(clean);
}

export function isBlockedAutoInheritanceSlug(slug: string): boolean {
  return (RESERVED_INHERITANCE_SLUG_BLOCKLIST as readonly string[]).includes(
    slug,
  );
}
