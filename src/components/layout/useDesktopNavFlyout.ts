"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { claimDesktopNavFlyout } from "@/components/layout/nav-flyout-hover";

/**
 * Hover open/close for desktop nav flyouts.
 * Stays open for the whole <header> + fixed panel; closes only when the
 * pointer leaves that region (or Escape / outside click / explicit close).
 */
export function useDesktopNavFlyout(options?: {
  onOpen?: () => void;
}) {
  const onOpen = options?.onOpen;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelId = useId();

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        onOpen?.();
      }
      return true;
    });
  }, [onOpen]);

  useEffect(() => {
    if (!open) return;
    return claimDesktopNavFlyout(closeMenu);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const header = document.querySelector("header");
    if (!header) return;

    const onHeaderLeave = (event: MouseEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && header.contains(next)) return;
      closeMenu();
    };

    header.addEventListener("mouseleave", onHeaderLeave);
    return () => header.removeEventListener("mouseleave", onHeaderLeave);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      const panel = document.getElementById(panelId);
      if (panel?.contains(target)) return;
      const header = document.querySelector("header");
      if (header?.contains(target)) return;
      closeMenu();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, closeMenu, panelId]);

  return {
    open,
    openMenu,
    closeMenu,
    rootRef,
    triggerRef,
    panelId,
  };
}
