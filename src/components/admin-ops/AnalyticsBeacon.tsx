"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/admin-ops/track-client";

/** Soft page_view beacon — fails open */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
