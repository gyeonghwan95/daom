"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SHOW_DELAY_MS = 180;
const COMPLETE_HOLD_MS = 220;

/**
 * 내부 라우트 전환 시 상단 2~3px 진행 표시.
 * 180ms 이내 완료되면 깜빡이지 않도록 지연 노출한다.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigating = useRef(false);
  const routeKey = `${pathname}?${searchParams?.toString() ?? ""}`;
  const prevRoute = useRef(routeKey);

  const clearTimers = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (completeTimer.current) clearTimeout(completeTimer.current);
    showTimer.current = null;
    completeTimer.current = null;
  }, []);

  const finish = useCallback(() => {
    navigating.current = false;
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
      setVisible(false);
      setActive(false);
      setDone(false);
      return;
    }
    setDone(true);
    completeTimer.current = setTimeout(() => {
      setVisible(false);
      setActive(false);
      setDone(false);
    }, COMPLETE_HOLD_MS);
  }, []);

  const start = useCallback(() => {
    if (navigating.current) return;
    navigating.current = true;
    setDone(false);
    setActive(true);
    clearTimers();
    showTimer.current = setTimeout(() => {
      setVisible(true);
      showTimer.current = null;
    }, SHOW_DELAY_MS);
  }, [clearTimers]);

  useEffect(() => {
    if (prevRoute.current === routeKey) return;
    prevRoute.current = routeKey;
    finish();
  }, [routeKey, finish]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const nextKey = `${url.pathname}?${url.searchParams.toString()}`;
      const currentKey = `${window.location.pathname}?${window.location.search.replace(/^\?/, "")}`;
      if (nextKey === currentKey || url.hash) return;

      start();
    };

    const onPopState = () => {
      const nextKey = `${window.location.pathname}?${window.location.search.replace(/^\?/, "")}`;
      if (nextKey !== prevRoute.current) start();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, [start, clearTimers]);

  if (!visible && !active) return null;

  return (
    <div
      className={`nav-progress${visible ? " nav-progress--visible" : ""}${done ? " nav-progress--done" : ""}${reducedMotion ? " nav-progress--reduced" : ""}`}
      role="progressbar"
      aria-hidden={!visible}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={visible ? "페이지를 불러오는 중입니다." : undefined}
    >
      <div className="nav-progress__bar" />
      <span className="sr-only" aria-live="polite">
        {visible && !done ? "페이지를 불러오는 중입니다." : null}
        {done ? "페이지 로딩이 완료되었습니다." : null}
      </span>
    </div>
  );
}
