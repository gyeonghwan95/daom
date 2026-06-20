"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type InfiniteMarqueeProps = {
  children: React.ReactNode;
  /** 한 바퀴 도는 데 걸리는 초 (클수록 느림) */
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  pauseOnHover?: boolean;
};

export function InfiniteMarquee({
  children,
  speed = 45,
  direction = "left",
  className = "",
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div
        className={`flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`marquee-root ${pauseOnHover ? "marquee-root--pause" : ""} ${className}`}
    >
      <div
        className="marquee-track flex w-max gap-5"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        <div className="marquee-set flex shrink-0 gap-5">{children}</div>
        <div className="marquee-set flex shrink-0 gap-5" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
