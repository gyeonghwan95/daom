"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  copyConsultText,
  type ConsultChatStatus,
} from "@/lib/open-consult-chat";

export function useConsultChatLaunch() {
  const [status, setStatus] = useState<ConsultChatStatus>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const launch = useCallback((text: string) => {
    void copyConsultText(text).then((ok) => {
      setStatus(ok ? "copied" : "failed");
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus("idle"), 5000);
    });
  }, []);

  return { status, copied: status === "copied", launch };
}
