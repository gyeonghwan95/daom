"use client";

import dynamic from "next/dynamic";
import { QuickInquiryProvider } from "./QuickInquiryProvider";

const QuickInquiryShell = dynamic(
  () => import("./QuickInquiryShell").then((m) => m.QuickInquiryShell),
  { ssr: false },
);

const QuickInquiryFloatingButton = dynamic(
  () =>
    import("./QuickInquiryFloatingButton").then((m) => m.QuickInquiryFloatingButton),
  { ssr: false },
);

export function QuickInquiryRoot({ children }: { children: React.ReactNode }) {
  return (
    <QuickInquiryProvider>
      {children}
      <QuickInquiryFloatingButton />
      <QuickInquiryShell />
    </QuickInquiryProvider>
  );
}
