/** footer와 고정 UI 사이 여백 */
export const FOOTER_UI_GAP_PX = 20;

function canUseDom(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getHeaderReservePx(): number {
  if (!canUseDom()) return 92;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height",
  );
  const parsed = parseFloat(raw);
  return (Number.isFinite(parsed) ? parsed : 80) + 12;
}

export function getFooterTopPx(): number | null {
  if (!canUseDom()) return null;
  const footer = document.querySelector("footer");
  if (!(footer instanceof HTMLElement)) return null;
  return footer.getBoundingClientRect().top;
}

/** top 고정 요소(페이지 목차) — footer 위에 들어갈 수 있는 최대 높이 */
export function getMaxHeightAboveFooter(topPx: number): number | null {
  const footerTop = getFooterTopPx();
  if (footerTop === null) return null;

  const available = footerTop - FOOTER_UI_GAP_PX - topPx;
  return available;
}

/** top 고정 요소 — footer와 겹치면 false */
export function isTopFixedVisibleAboveFooter(
  topPx: number,
  heightPx: number,
): boolean {
  const maxHeight = getMaxHeightAboveFooter(topPx);
  if (maxHeight === null) return true;
  if (maxHeight <= 0) return false;
  return heightPx <= maxHeight;
}

export type BottomFixedLayout = {
  bottom: number;
  visible: boolean;
};

/** bottom 고정 요소(상담 패널) */
export function computeBottomFixedAboveFooter(
  panelHeight: number,
): BottomFixedLayout {
  const minBottom = FOOTER_UI_GAP_PX;
  if (!canUseDom()) {
    return { bottom: minBottom, visible: true };
  }
  const viewportHeight = window.innerHeight;

  if (panelHeight <= 0) {
    return { bottom: minBottom, visible: true };
  }

  const footerTop = getFooterTopPx();
  if (footerTop === null) {
    return { bottom: minBottom, visible: true };
  }

  const topLimit = getHeaderReservePx();

  if (footerTop >= viewportHeight - minBottom) {
    return { bottom: minBottom, visible: true };
  }

  const requiredBottom = viewportHeight - footerTop + FOOTER_UI_GAP_PX;
  const panelTop = viewportHeight - requiredBottom - panelHeight;

  if (panelTop < topLimit) {
    return { bottom: requiredBottom, visible: false };
  }

  return {
    bottom: Math.max(minBottom, requiredBottom),
    visible: true,
  };
}
