/** 히어로 등에서 데스크톱 플로팅 상담 패널을 연다 */
export const OPEN_FLOATING_CONSULT_EVENT = "daom:open-floating-consult";

let pendingOpen = false;

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
