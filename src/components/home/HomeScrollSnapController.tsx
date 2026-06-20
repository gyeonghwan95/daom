"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HOME_SECTION_IDS = [
  "home-hero",
  "home-services",
  "home-trust",
  "home-activities",
  "home-press",
  "home-youtube",
  "home-insights",
  "home-faq",
  "home-contact",
] as const;

const WHEEL_THRESHOLD = 36;
const SNAP_LOCK_MS = 700;

function getHeaderOffset(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height",
  );
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 64;
}

function getSections(): HTMLElement[] {
  return HOME_SECTION_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => Boolean(el),
  );
}

function getActiveSectionIndex(sections: HTMLElement[]): number {
  const marker = window.scrollY + getHeaderOffset() + 8;
  let active = 0;

  for (let i = 0; i < sections.length; i += 1) {
    if (sections[i].offsetTop <= marker) {
      active = i;
    }
  }

  return active;
}

function isScrollableAncestor(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  let node: Element | null = target;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const canScroll =
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight + 1;

    if (canScroll) return true;
    node = node.parentElement;
  }

  return false;
}

function canExitSectionDown(section: HTMLElement): boolean {
  const sectionBottom = section.offsetTop + section.offsetHeight;
  const viewportBottom = window.scrollY + window.innerHeight;
  return viewportBottom >= sectionBottom - 12;
}

function canExitSectionUp(section: HTMLElement): boolean {
  return window.scrollY <= section.offsetTop + 12;
}

/**
 * CSS scroll-snap 보조 — 휠 한 번에 다음/이전 홈 섹션으로 이동.
 * 섹션 높이가 화면보다 크면 섹션 내부 스크롤을 먼저 허용합니다.
 */
export function HomeScrollSnapController() {
  const reduced = useReducedMotion();
  const lockUntil = useRef(0);

  useEffect(() => {
    if (reduced) return;
    if (!document.querySelector(".home-scroll-snap")) return;

    function onWheel(event: WheelEvent) {
      if (Date.now() < lockUntil.current) {
        event.preventDefault();
        return;
      }

      if (isScrollableAncestor(event.target)) return;

      const delta = event.deltaY;
      if (Math.abs(delta) < WHEEL_THRESHOLD) return;

      const sections = getSections();
      if (sections.length === 0) return;

      const activeIndex = getActiveSectionIndex(sections);
      const activeSection = sections[activeIndex];
      const tallSection = activeSection.offsetHeight > window.innerHeight + 24;

      if (delta > 0) {
        if (tallSection && !canExitSectionDown(activeSection)) return;

        const next = sections[activeIndex + 1];
        if (!next) return;

        event.preventDefault();
        lockUntil.current = Date.now() + SNAP_LOCK_MS;
        next.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (tallSection && !canExitSectionUp(activeSection)) return;

      const prev = sections[activeIndex - 1];
      if (!prev) return;

      event.preventDefault();
      lockUntil.current = Date.now() + SNAP_LOCK_MS;
      prev.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [reduced]);

  return null;
}
