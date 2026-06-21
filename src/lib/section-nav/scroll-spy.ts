export function getSectionNavRootMargin(): string {
  if (typeof document === "undefined") {
    return "-88px 0px -55% 0px";
  }

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 72;
  const offset = Math.round(headerHeight + 16);

  return `-${offset}px 0px -55% 0px`;
}

export type SectionNavFixedLayout = {
  left: number;
  width: number;
};

export function computeSectionNavFixedLayout(
  anchorEl: HTMLElement,
): SectionNavFixedLayout {
  const rect = anchorEl.getBoundingClientRect();

  return {
    left: rect.left,
    width: rect.width,
  };
}
