"use client";

import { useEffect, useRef } from "react";

/**
 * 스크롤/터치 중 마키 애니메이션을 잠시 멈춰
 * iOS 등에서 transform + scroll 합성 깜빡임을 줄인다.
 */
export function usePauseMarqueeWhileScrolling<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let timer = 0;
    const pause = () => {
      root.classList.add("marquee-v-root--scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        root.classList.remove("marquee-v-root--scrolling");
      }, 180);
    };

    document.addEventListener("scroll", pause, { capture: true, passive: true });
    document.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("wheel", pause, { passive: true });

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("scroll", pause, true);
      document.removeEventListener("touchmove", pause);
      window.removeEventListener("wheel", pause);
      root.classList.remove("marquee-v-root--scrolling");
    };
  }, []);

  return ref;
}
