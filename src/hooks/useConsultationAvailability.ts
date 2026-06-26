"use client";

import { useEffect, useState } from "react";
import {
  getConsultationAvailability,
  type ConsultationAvailability,
} from "@/lib/consultation-availability";

export function useConsultationAvailability(): ConsultationAvailability {
  const [availability, setAvailability] = useState<ConsultationAvailability>(
    () => getConsultationAvailability(),
  );

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
