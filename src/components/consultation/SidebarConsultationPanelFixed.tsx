"use client";

import { useEffect, useState } from "react";
import { SidebarConsultationPanel } from "@/components/consultation/SidebarConsultationPanel";

type SidebarConsultationPanelFixedProps = {
  left: number;
  width: number;
  isReady: boolean;
};

/** footer와 패널 사이 여백 */
const PANEL_GAP_PX = 20;
/** 패널 대략 높이 (toc reserve와 동일 계열) */
const PANEL_RESERVE_PX = 344;
/** 헤더 + 여백 대략치 */
const TOP_RESERVE_PX = 96;

function computeBottomAboveFooter(): number {
  const minBottom = PANEL_GAP_PX;
  const maxBottom = Math.max(
    minBottom,
    window.innerHeight - PANEL_RESERVE_PX - TOP_RESERVE_PX,
  );

  const footer = document.querySelector("footer");
  if (!(footer instanceof HTMLElement)) {
    return minBottom;
  }

  const footerTop = footer.getBoundingClientRect().top;
  // footer가 뷰포트 하단에 가까워지면 bottom을 올려 footer 위에 멈춤
  const lift = window.innerHeight - footerTop + PANEL_GAP_PX;
  return Math.min(Math.max(minBottom, lift), maxBottom);
}

export function SidebarConsultationPanelFixed({
  left,
  width,
  isReady,
}: SidebarConsultationPanelFixedProps) {
  const [bottom, setBottom] = useState(PANEL_GAP_PX);

  useEffect(() => {
    const syncBottom = () => {
      setBottom(computeBottomAboveFooter());
    };

    syncBottom();
    window.addEventListener("scroll", syncBottom, { passive: true });
    window.addEventListener("resize", syncBottom);

    const footer = document.querySelector("footer");
    const resizeObserver =
      footer instanceof HTMLElement ? new ResizeObserver(syncBottom) : null;
    if (footer instanceof HTMLElement) {
      resizeObserver?.observe(footer);
    }

    return () => {
      window.removeEventListener("scroll", syncBottom);
      window.removeEventListener("resize", syncBottom);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed z-30 hidden lg:block ${
        isReady ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        bottom,
        left,
        width,
      }}
    >
      <SidebarConsultationPanel />
    </div>
  );
}
