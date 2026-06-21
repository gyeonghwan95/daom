import type { Swiper as SwiperInstance } from "swiper";

const SCROLL_EDGE = 2;
const SLIDE_INNER_SELECTOR = ".home-fullpage-slide__inner";

export function getActiveSlideScroller(
  swiper: SwiperInstance,
): HTMLElement | null {
  const slide = swiper.slides[swiper.activeIndex] as HTMLElement | undefined;
  return slide?.querySelector<HTMLElement>(SLIDE_INNER_SELECTOR) ?? null;
}

export function getSlideScroller(
  slide: HTMLElement,
): HTMLElement | null {
  return slide.querySelector<HTMLElement>(SLIDE_INNER_SELECTOR);
}

export function isSlideScrollerOverflowing(scroller: HTMLElement): boolean {
  return scroller.scrollHeight > scroller.clientHeight + SCROLL_EDGE;
}

export function isAtScrollTop(scroller: HTMLElement): boolean {
  return scroller.scrollTop <= SCROLL_EDGE;
}

export function isAtScrollBottom(scroller: HTMLElement): boolean {
  return (
    scroller.scrollTop + scroller.clientHeight >=
    scroller.scrollHeight - SCROLL_EDGE
  );
}

/** 슬라이드 내부 스크롤이 먼저 소비되어야 하면 true */
export function shouldConsumeVerticalScroll(
  scroller: HTMLElement,
  deltaY: number,
): boolean {
  if (!isSlideScrollerOverflowing(scroller)) return false;
  if (deltaY > 0) return !isAtScrollBottom(scroller);
  if (deltaY < 0) return !isAtScrollTop(scroller);
  return false;
}

export function resetSlideScrollerScroll(scroller: HTMLElement | null): void {
  if (scroller) scroller.scrollTop = 0;
}

export function bindHomeSlideNestedScroll(swiper: SwiperInstance): () => void {
  const root = swiper.el;
  if (!root) return () => {};

  let touchStartY = 0;

  const onSlideChange = () => {
    resetSlideScrollerScroll(getActiveSlideScroller(swiper));
  };

  const onWheel = (event: WheelEvent) => {
    const scroller = getActiveSlideScroller(swiper);
    if (!scroller) return;

    if (shouldConsumeVerticalScroll(scroller, event.deltaY)) {
      event.stopPropagation();
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0]?.clientY ?? 0;
    swiper.allowTouchMove = true;
  };

  const onTouchMove = (event: TouchEvent) => {
    const scroller = getActiveSlideScroller(swiper);
    if (!scroller || !isSlideScrollerOverflowing(scroller)) {
      swiper.allowTouchMove = true;
      return;
    }

    const currentY = event.touches[0]?.clientY ?? touchStartY;
    const deltaY = touchStartY - currentY;

    if (Math.abs(deltaY) < 4) return;

    swiper.allowTouchMove = !shouldConsumeVerticalScroll(
      scroller,
      deltaY > 0 ? 1 : -1,
    );
  };

  const onTouchEnd = () => {
    swiper.allowTouchMove = true;
  };

  swiper.on("slideChangeTransitionStart", onSlideChange);
  root.addEventListener("wheel", onWheel, { capture: true });
  root.addEventListener("touchstart", onTouchStart, { passive: true });
  root.addEventListener("touchmove", onTouchMove, { passive: true });
  root.addEventListener("touchend", onTouchEnd, { passive: true });
  root.addEventListener("touchcancel", onTouchEnd, { passive: true });

  resetSlideScrollerScroll(getActiveSlideScroller(swiper));

  return () => {
    root.removeEventListener("wheel", onWheel, { capture: true });
    root.removeEventListener("touchstart", onTouchStart);
    root.removeEventListener("touchmove", onTouchMove);
    root.removeEventListener("touchend", onTouchEnd);
    root.removeEventListener("touchcancel", onTouchEnd);

    if (!swiper.destroyed) {
      swiper.off("slideChangeTransitionStart", onSlideChange);
      swiper.allowTouchMove = true;
    }
  };
}
