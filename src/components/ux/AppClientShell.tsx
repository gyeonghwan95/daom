"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { NavigationProgress } from "@/components/ux/NavigationProgress";
import {
  QuickInquiryProvider,
  useOptionalQuickInquiry,
} from "@/components/quick-inquiry/QuickInquiryProvider";
import { isAdminPath } from "@/components/layout/PublicOnly";

const FloatingCTA = dynamic(
  () =>
    import("@/components/consultation/FloatingCTA").then((m) => m.FloatingCTA),
  { ssr: false },
);

const FloatingNoticeHost = dynamic(
  () =>
    import("@/components/notices/FloatingNoticeHost").then(
      (m) => m.FloatingNoticeHost,
    ),
  { ssr: false },
);

const AnalyticsBeacon = dynamic(
  () =>
    import("@/components/admin-ops/AnalyticsBeacon").then(
      (m) => m.AnalyticsBeacon,
    ),
  { ssr: false },
);

const MobileBottomCTA = dynamic(
  () =>
    import("@/components/layout/MobileBottomCTA").then((m) => m.MobileBottomCTA),
  { ssr: false },
);

const ConsultWizardShell = dynamic(
  () =>
    import("@/components/consult-wizard/ConsultWizardShell").then(
      (m) => m.ConsultWizardShell,
    ),
  { ssr: false },
);

/** 상담 창은 최초 open 이후에만 청크 로드 */
function DeferredConsultWizard() {
  const inquiry = useOptionalQuickInquiry();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!inquiry?.open || loaded) return;
    const timer = window.setTimeout(() => setLoaded(true), 0);
    return () => window.clearTimeout(timer);
  }, [inquiry?.open, loaded]);

  if (!loaded) return null;
  return <ConsultWizardShell />;
}

/** 첫 페인트 이후 idle에 CTA 마운트 — LCP/INP 간섭 완화 */
function IdleDeferredChrome() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 1800 });
    } else {
      timeoutId = setTimeout(enable, 400);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready || isAdminPath(pathname)) return null;

  return (
    <>
      <MobileBottomCTA />
      <FloatingCTA />
      <FloatingNoticeHost />
    </>
  );
}

/**
 * 루트 클라이언트 셸: progress + 지연 로딩 CTA/상담.
 */
export function AppClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // 브라우저 기본 스크롤 복원 유지 (뒤로가기 UX)
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto";
    }
  }, []);

  return (
    <QuickInquiryProvider>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {children}
      {!isAdminPath(pathname) ? <AnalyticsBeacon /> : null}
      {!isAdminPath(pathname) ? <DeferredConsultWizard /> : null}
      <IdleDeferredChrome />
    </QuickInquiryProvider>
  );
}
