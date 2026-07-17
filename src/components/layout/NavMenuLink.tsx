"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  if (variant === "mobile") {
    // 그룹 메뉴는 MobileNav 드릴다운에서 처리
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
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        className={desktopLinkClass(active || open)}
      >
        {item.label}
      </Link>
      {open ? (
        <div
          className="absolute right-0 top-full z-50 min-w-[22rem] rounded-xl border border-beige-dark bg-white p-4 shadow-lg"
          role="menu"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {item.groups!.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy/50">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        role="menuitem"
                        className="block rounded-lg px-2 py-1.5 text-sm text-navy/80 no-underline hover:bg-beige hover:text-navy"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
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
