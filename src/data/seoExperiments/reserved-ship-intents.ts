/**
 * Reserved ship intents — auto page generators must not create
 * competing representatives for these roles.
 */
export const RESERVED_SHIP_INTENTS = {
  SHIP_REGISTRATION: {
    path: "/선박등기",
    query: "선박등기",
    role: "SHIP_REGISTRATION_HUB",
  },
  SHIP_INHERITANCE: {
    path: "/선박상속",
    query: "선박상속",
    role: "SHIP_INHERITANCE_ACTION",
  },
  SHIP_MANAGER: {
    path: "/선박관리인선임등기",
    query: "선박관리인 선임등기",
    role: "SHIP_MANAGER_ACTION",
  },
  SHIP_REGISTRATION_VS_ADMIN_REGISTRATION: {
    path: "/선박등기와선박등록",
    query: "선박등기 선박등록 차이",
    role: "SHIP_RECORD_COMPARISON",
  },
  SHIP_OWNERSHIP_TRANSFER: {
    path: "/선박등기",
    query: "선박 소유권이전등기",
    role: "SHIP_REGISTRATION_HUB_SECTION",
  },
  SHIP_MORTGAGE: {
    path: "/선박등기",
    query: "선박 저당권 설정",
    role: "SHIP_REGISTRATION_HUB_SECTION",
  },
} as const;

export type ReservedShipIntentId = keyof typeof RESERVED_SHIP_INTENTS;

const RESERVED_PATHS: ReadonlySet<string> = new Set(
  Object.values(RESERVED_SHIP_INTENTS).map((v) => v.path),
);

/** Slugs that must not be auto-spawned as additional ship owners. */
export const RESERVED_SHIP_SLUG_BLOCKLIST = [
  "선박등기법무사",
  "선박상속법무사",
  "선박상속등기",
  "부산선박상속",
  "어선상속",
  "선박관리인",
  "선박관리인선임",
  "선박등록",
  "선박소유권이전등기",
  "선박저당권",
  "선박저당권설정등기",
] as const;

export function isReservedShipPath(path: string): boolean {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return RESERVED_PATHS.has(clean);
}

export function isBlockedAutoShipSlug(slug: string): boolean {
  return (RESERVED_SHIP_SLUG_BLOCKLIST as readonly string[]).includes(slug);
}
