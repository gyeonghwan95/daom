"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type DesktopNavFlyoutProps = {
  open: boolean;
  panelId: string;
  ariaLabel: string;
  /** 트리거 요소 — 패널 콘텐츠를 이 메뉴 아래 중심으로 맞춤 */
  triggerRef: React.RefObject<HTMLElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
  /** 메가메뉴처럼 넓은 콘텐츠 */
  wide?: boolean;
};

/**
 * 뷰포트 전체 너비 드롭다운.
 * 배경은 화면 전체, 내부 목록은 트리거 메뉴 아래를 중심으로 배치(화면 밖으로 넘치면 clamp).
 */
export function DesktopNavFlyout({
  open,
  panelId,
  ariaLabel,
  triggerRef,
  onMouseEnter,
  onMouseLeave,
  children,
  wide = false,
}: DesktopNavFlyoutProps) {
  const panelInnerRef = useRef<HTMLDivElement>(null);
  const [contentStyle, setContentStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === "undefined") return;

    const rect = trigger.getBoundingClientRect();
    const viewport = window.innerWidth;
    const edge = viewport < 768 ? 12 : 24;

    if (wide) {
      // 메가메뉴: 화면 거의 전체 너비 (좌우 여백만)
      setContentStyle({
        left: edge,
        width: Math.max(280, viewport - edge * 2),
      });
      return;
    }

    // 일반 드롭다운: 해당 메뉴 아래 중심 + 화면 밖으로 넘치면 clamp
    const maxWidth = Math.min(640, viewport - edge * 2);
    const width = Math.max(260, maxWidth);
    const center = rect.left + rect.width / 2;
    const idealLeft = center - width / 2;
    const left = Math.min(
      Math.max(edge, idealLeft),
      viewport - width - edge,
    );

    setContentStyle({ left, width });
  }, [triggerRef, wide]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  if (!open) return null;

  return (
    <div
      id={panelId}
      role="region"
      aria-label={ariaLabel}
      className="fixed inset-x-0 z-[60] border-b border-beige-dark bg-white shadow-[0_12px_32px_-12px_rgba(30,58,95,0.22)]"
      style={{ top: "var(--header-height)" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 헤더 하단 ↔ 패널 사이 호버 끊김 방지(전체 너비) */}
      <div
        className="absolute inset-x-0 bottom-full h-10"
        aria-hidden
      />

      <div className="relative max-h-[min(70vh,36rem)] overflow-y-auto overscroll-contain py-4 md:py-5">
        <div
          ref={panelInnerRef}
          className="relative"
          style={
            contentStyle
              ? {
                  marginLeft: contentStyle.left,
                  width: contentStyle.width,
                  maxWidth: `calc(100vw - 1.5rem)`,
                }
              : {
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "min(100% - 1.5rem, 72rem)",
                }
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
