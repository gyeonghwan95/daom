"use client";

import dynamic from "next/dynamic";
import { QuickInquiryProvider } from "@/components/quick-inquiry/QuickInquiryProvider";

const ConsultWizardShell = dynamic(
  () =>
    import("@/components/consult-wizard/ConsultWizardShell").then(
      (m) => m.ConsultWizardShell,
    ),
  { ssr: false },
);

/** 간편 문의 플로팅은 제거하고 단계형 상담 셸만 마운트 */
export function QuickInquiryRoot({ children }: { children: React.ReactNode }) {
  return (
    <QuickInquiryProvider>
      {children}
      <ConsultWizardShell />
    </QuickInquiryProvider>
  );
}
