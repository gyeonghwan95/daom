/**
 * Inheritance SEO reset — title freeze + reserved intents.
 * Automatic SEO scripts must not retitle these targets without human approval.
 */
export {
  RESERVED_INHERITANCE_INTENTS,
  RESERVED_INHERITANCE_SLUG_BLOCKLIST,
  isReservedInheritancePath,
  isBlockedAutoInheritanceSlug,
} from "./reserved-inheritance-intents";

export const inheritanceSeoResetExperiment = {
  experimentStartedAt: "2026-09-26",
  titleFrozen: true,
  reason: "Structural reset experiment — intent separation + content pruning",
  targetUrls: [
    "/부산상속법무사",
    "/부산상속포기",
    "/부산상속전문법무사",
  ] as const,
  titles: {
    "/부산상속법무사": "부산 상속 법무사｜등기·포기·한정승인 중 먼저 확인할 절차",
    "/부산상속포기": "부산 상속포기 법무사｜3개월·후순위 상속인부터 확인",
    "/부산상속전문법무사":
      "부산에서 상속전문 법무사를 찾을 때｜업무 범위·사례·상담 기준",
  } as const,
  reservedIntents: [
    "BUSAN_INHERITANCE_HUB",
    "BUSAN_INHERITANCE_PROVIDER_SELECTION",
    "BUSAN_INHERITANCE_RENUNCIATION",
  ] as const,
} as const;

export function isInheritanceTitleFrozen(path: string): boolean {
  return (
    inheritanceSeoResetExperiment.titleFrozen &&
    (inheritanceSeoResetExperiment.targetUrls as readonly string[]).includes(
      path,
    )
  );
}

/** Guard for auto title writers — returns frozen title if path is locked. */
export function getFrozenInheritanceTitle(path: string): string | null {
  if (!isInheritanceTitleFrozen(path)) return null;
  return (
    inheritanceSeoResetExperiment.titles[
      path as keyof typeof inheritanceSeoResetExperiment.titles
    ] ?? null
  );
}
