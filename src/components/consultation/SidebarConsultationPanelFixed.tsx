"use client";

import { useEffect, useRef, useState } from "react";
import { SidebarConsultationPanel } from "@/components/consultation/SidebarConsultationPanel";
import { computeBottomFixedAboveFooter } from "@/lib/section-nav/footer-boundary";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState(() =>
    computeBottomFixedAboveFooter(0),
  );

  useEffect(() => {
    const sync = () => {
      const panelHeight = panelRef.current?.getBoundingClientRect().height ?? 0;
      setLayout(computeBottomFixedAboveFooter(panelHeight));
    };

    sync();
    const timer = window.setTimeout(sync, 160);

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    const footer = document.querySelector("footer");
    const resizeObserver = new ResizeObserver(sync);
    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }
    if (footer instanceof HTMLElement) {
      resizeObserver.observe(footer);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      resizeObserver.disconnect();
    };
  }, []);

  const show = isReady && layout.visible;

  return (
    <div
      ref={panelRef}
      className={`fixed z-30 hidden transition-opacity duration-200 lg:block ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        bottom: layout.bottom,
        left,
        width,
        // 짧은 창·확대 화면에서도 헤더 아래로 모든 버튼에 닿을 수 있게 패널 안에서 스크롤
        maxHeight: `calc(100vh - ${layout.bottom}px - var(--header-height, 80px) - 12px)`,
        overflowY: "auto",
        overscrollBehavior: "contain",
      }}
      aria-hidden={show ? undefined : true}
    >
      <SidebarConsultationPanel />
    </div>
  );
}
