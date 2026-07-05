"use client";

import { SidebarConsultationPanel } from "@/components/consultation/SidebarConsultationPanel";

type SidebarConsultationPanelFixedProps = {
  left: number;
  width: number;
  isReady: boolean;
};

export function SidebarConsultationPanelFixed({
  left,
  width,
  isReady,
}: SidebarConsultationPanelFixedProps) {
  return (
    <div
      className={`fixed z-30 hidden lg:block ${
        isReady ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        left,
        width,
      }}
    >
      <SidebarConsultationPanel />
    </div>
  );
}
