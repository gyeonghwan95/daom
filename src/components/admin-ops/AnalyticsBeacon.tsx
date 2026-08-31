"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isAdminAnalyticsExcluded } from "@/lib/admin-ops/analytics-exclude";
import { trackPageView } from "@/lib/admin-ops/track-client";

/** Soft page_view — 실제 탐색 1회당 1건. 프리렌더·숨은 탭·bfcache 복원은 제외. */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (isAdminAnalyticsExcluded()) return;
    let cancelled = false;

    const fire = () => {
      if (cancelled) return;
      trackPageView(pathname);
    };

    const vis = String(document.visibilityState);
    if (vis === "hidden" || vis === "prerender") {
      const onVis = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVis);
          fire();
        }
      };
      document.addEventListener("visibilitychange", onVis);
      return () => {
        cancelled = true;
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    fire();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
