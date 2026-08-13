"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/admin-ops/track-client";

/** Soft page_view beacon — fails open. Mount immediately (not idle-deferred). */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    trackPageView(pathname);
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) trackPageView(pathname);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [pathname]);

  return null;
}
