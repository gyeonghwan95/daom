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
import { isAdminAnalyticsExcluded } from "@/lib/admin-ops/analytics-exclude";

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

  // 첫 클릭 때 상담 창 코드를 받느라 느린 회선에서 반응이 늦지 않게, 페이지가 한가해지면 미리 받아 둔다(그리지는 않음)
  useEffect(() => {
    const warm = () => {
      void import("@/components/consult-wizard/ConsultWizardShell");
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(warm, 3000);
    return () => clearTimeout(timer);
  }, []);

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
      {!isAdminPath(pathname) && !isAdminAnalyticsExcluded() ? (
        <AnalyticsBeacon />
      ) : null}
      {!isAdminPath(pathname) ? <DeferredConsultWizard /> : null}
      <IdleDeferredChrome />
    </QuickInquiryProvider>
  );
}
