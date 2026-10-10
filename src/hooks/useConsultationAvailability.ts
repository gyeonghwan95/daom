"use client";

import { useEffect, useState } from "react";
import {
  getConsultationAvailability,
  type ConsultationAvailability,
} from "@/lib/consultation-availability";

/**
 * 정적 HTML(빌드 시각)과 첫 클라이언트 렌더가 같은 값을 갖도록 시각과 무관한 문구로 시작하고,
 * 마운트 직후 실제 한국 시각으로 바꾼다. (빌드 요일이 수집본에 남거나 hydration이 어긋나지 않게)
 */
const NEUTRAL_AVAILABILITY: ConsultationAvailability = {
  isOpen: false,
  statusLabel: "상담 안내",
  statusHint: "전화·카카오톡·네이버 톡톡으로 상담을 남길 수 있어요",
};

export function useConsultationAvailability(): ConsultationAvailability {
  const [availability, setAvailability] =
    useState<ConsultationAvailability>(NEUTRAL_AVAILABILITY);

  useEffect(() => {
    const sync = () => setAvailability(getConsultationAvailability());
    sync();

    const interval = window.setInterval(sync, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return availability;
}
