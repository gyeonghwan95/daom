"use client";

import { usePauseMarqueeWhileScrolling } from "@/hooks/usePauseMarqueeWhileScrolling";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type InfiniteVerticalMarqueeProps = {
  children: React.ReactNode;
  /** 한 바퀴 도는 데 걸리는 초 (클수록 느림) */
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
        <div className="marquee-v-set" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
