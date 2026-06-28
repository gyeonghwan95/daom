"use client";

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

  if (variant === "desktop") {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={[
          "inline-flex min-h-11 items-center rounded-lg px-3 text-[0.9375rem] transition-colors duration-200",
          active
            ? "bg-beige font-semibold text-navy shadow-sm ring-1 ring-inset ring-navy/10"
            : "font-medium text-navy/70 hover:bg-beige/70 hover:text-navy",
        ].join(" ")}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={[
        "flex min-h-12 items-center rounded-lg px-4 text-base transition-colors duration-200",
        active
          ? "border-l-[3px] border-navy bg-beige pl-[calc(1rem-3px)] font-semibold text-navy"
          : "border-l-[3px] border-transparent font-medium text-navy/80 active:bg-beige/80",
      ].join(" ")}
    >
      {item.label}
    </Link>
  );
}
