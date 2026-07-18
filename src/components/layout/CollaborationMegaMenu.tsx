"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DesktopNavFlyout } from "@/components/layout/DesktopNavFlyout";
import {
  linksForMegaArea,
  megaMenuAreas,
} from "@/lib/b2b/collaboration-registry";
import { isNavItemActive } from "@/lib/navigation";
import { trackB2BEvent } from "@/lib/analytics/track-b2b";

type CollaborationMegaMenuProps = {
  label: string;
  href: string;
};

export function CollaborationMegaMenu({
  label,
  href,
}: CollaborationMegaMenuProps) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, href);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen((wasOpen) => {
      if (!wasOpen) {
        trackB2BEvent("collaboration_menu_open", { source_page: pathname });
      }
      return true;
    });
  }, [clearCloseTimer, pathname]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  }, [clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

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
      if (!rootRef.current?.contains(event.target as Node)) {
        const panel = document.getElementById(panelId);
        if (panel?.contains(event.target as Node)) return;
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, closeMenu, panelId]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        ref={triggerRef}
        href={href}
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        className={[
          "inline-flex min-h-11 items-center rounded-lg px-3 text-[0.9375rem] transition-colors duration-200",
          active || open
            ? "bg-beige font-semibold text-navy shadow-sm ring-1 ring-inset ring-navy/10"
            : "font-medium text-navy/70 hover:bg-beige/70 hover:text-navy",
        ].join(" ")}
        onFocus={openMenu}
      >
        {label}
      </Link>

      <DesktopNavFlyout
        open={open}
        panelId={panelId}
        ariaLabel="협업문의 하위 메뉴"
        triggerRef={triggerRef}
        wide
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {megaMenuAreas.map((area) => {
              const links = linksForMegaArea(area.id).slice(0, 7);
              if (!links.length) return null;
              return (
                <div key={area.id} className="min-w-0">
                  <p className="mb-2 border-b border-beige-dark pb-1.5 text-xs font-semibold tracking-wide text-navy/50">
                    {area.title}
                  </p>
                  <ul className="space-y-0.5">
                    {links.map((link) => (
                      <li key={`${area.id}-${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="block rounded-lg px-2 py-1.5 text-sm leading-snug text-navy/80 no-underline hover:bg-beige hover:text-navy"
                          onClick={closeMenu}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-navy/10 bg-beige/50 p-4">
            <div>
              <p className="text-sm font-semibold text-navy">
                어떤 페이지를 봐야 할지 모르시나요?
              </p>
              <p className="mt-2 text-xs leading-relaxed text-navy/70">
                업무 종류, 소재지, 예상 건수와 희망 일정만 알려주시면 먼저 확인할
                항목부터 안내합니다.
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/협업문의"
                className="btn-primary flex min-h-11 w-full items-center justify-center px-3 text-sm"
                onClick={closeMenu}
              >
                협업 문의서 작성
              </Link>
              <Link
                href="/partners#all-services"
                className="flex min-h-10 w-full items-center justify-center rounded-lg text-sm font-medium text-navy/75 underline-offset-2 hover:underline"
                onClick={closeMenu}
              >
                전체 협업업무 보기
              </Link>
            </div>
          </div>
        </div>
      </DesktopNavFlyout>
    </div>
  );
}
