"use client";

import { useEffect, useState } from "react";
import { usePauseMarqueeWhileScrolling } from "@/hooks/usePauseMarqueeWhileScrolling";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type InfiniteVerticalMarqueeProps = {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down";
  className?: string;
  pauseOnHover?: boolean;
  ariaLabel?: string;
};

export function InfiniteVerticalMarquee({
  children,
  speed = 36,
  direction = "up",
  className = "",
  pauseOnHover = true,
  ariaLabel,
}: InfiniteVerticalMarqueeProps) {
  const reduced = useReducedMotion();
  const rootRef = usePauseMarqueeWhileScrolling<HTMLDivElement>();
  const [cloneReady, setCloneReady] = useState(false);

  useEffect(() => {
    setCloneReady(true);
  }, []);

  if (reduced) {
    return (
      <div
        className={`flex flex-col gap-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`marquee-v-root h-full ${pauseOnHover ? "marquee-v-root--pause" : ""} ${className}`}
      aria-label={ariaLabel}
    >
      <div
        className="marquee-v-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "down" ? "reverse" : "normal",
        }}
      >
        <div className="marquee-v-set">{children}</div>
        {cloneReady ? (
          <div className="marquee-v-set" aria-hidden="true">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
