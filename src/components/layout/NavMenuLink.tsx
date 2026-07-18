"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollaborationMegaMenu } from "@/components/layout/CollaborationMegaMenu";
import { DesktopNavFlyout } from "@/components/layout/DesktopNavFlyout";
import { isNavItemActive, type NavItem } from "@/lib/navigation";

type NavMenuLinkProps = {
  item: NavItem;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function NavMenuLink({ item, variant, onNavigate }: NavMenuLinkProps) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item.href);
  const [open, setOpen] = useState(false);
  const hasGroups = Boolean(item.groups?.length);
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
    setOpen(true);
  }, [clearCloseTimer]);

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

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className={mobileLinkClass(active)}
      >
        {item.label}
      </Link>
    );
  }

  if (item.megaMenu) {
    return <CollaborationMegaMenu label={item.label} href={item.href} />;
  }

  if (!hasGroups) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={desktopLinkClass(active)}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        ref={triggerRef}
        href={item.href}
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        className={desktopLinkClass(active || open)}
        onFocus={openMenu}
      >
        {item.label}
      </Link>

      <DesktopNavFlyout
        open={open}
        panelId={panelId}
        ariaLabel={`${item.label} 하위 메뉴`}
        triggerRef={triggerRef}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <div
          className={[
            "grid gap-5",
            item.groups!.length > 1 ? "sm:grid-cols-2" : "grid-cols-1",
          ].join(" ")}
          role="menu"
        >
          {item.groups!.map((group) => (
            <div key={group.title} className="min-w-0">
              <p className="mb-2 border-b border-beige-dark pb-1.5 text-xs font-semibold tracking-wide text-navy/50">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      role="menuitem"
                      className="block rounded-lg px-2 py-1.5 text-sm text-navy/80 no-underline hover:bg-beige hover:text-navy"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DesktopNavFlyout>
    </div>
  );
}

function desktopLinkClass(active: boolean) {
  return [
    "inline-flex min-h-11 items-center rounded-lg px-3 text-[0.9375rem] transition-colors duration-200",
    active
      ? "bg-beige font-semibold text-navy shadow-sm ring-1 ring-inset ring-navy/10"
      : "font-medium text-navy/70 hover:bg-beige/70 hover:text-navy",
  ].join(" ");
}

function mobileLinkClass(active: boolean) {
  return [
    "flex min-h-12 items-center rounded-lg px-4 text-base transition-colors duration-200 no-underline",
    active
      ? "border-l-[3px] border-navy bg-beige pl-[calc(1rem-3px)] font-semibold text-navy"
      : "border-l-[3px] border-transparent font-medium text-navy/80 active:bg-beige/80",
  ].join(" ");
}
