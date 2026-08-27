/** 히어로 등에서 데스크톱 플로팅 상담 패널을 연다 */
export const OPEN_FLOATING_CONSULT_EVENT = "daom:open-floating-consult";
export const FLOATING_CONSULT_MIN_WIDTH = "64rem";

let pendingOpen = false;

export function isDesktopFloatingConsultViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(min-width: ${FLOATING_CONSULT_MIN_WIDTH})`).matches;
}

export function openFloatingConsult(): void {
  pendingOpen = true;
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_FLOATING_CONSULT_EVENT));
}

export function consumeFloatingConsultPending(): boolean {
  const pending = pendingOpen;
  pendingOpen = false;
  return pending;
}
