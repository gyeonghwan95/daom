"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollaborationMegaMenu } from "@/components/layout/CollaborationMegaMenu";
import { DesktopNavFlyout } from "@/components/layout/DesktopNavFlyout";
import { useDesktopNavFlyout } from "@/components/layout/useDesktopNavFlyout";
import {
  isExactNavHref,
  isNavItemActive,
  isNavLinkActive,
  type NavItem,
} from "@/lib/navigation";

type NavMenuLinkProps = {
  item: NavItem;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function NavMenuLink({ item, variant, onNavigate }: NavMenuLinkProps) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item.href);
  const currentPage = active && isExactNavHref(pathname, item.href);
  const ariaCurrent = active ? (currentPage ? "page" : "true") : undefined;
  const hasGroups = Boolean(item.groups?.length);
  const { open, openMenu, closeMenu, rootRef, triggerRef, panelId } =
    useDesktopNavFlyout();

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        aria-current={ariaCurrent}
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
        aria-current={ariaCurrent}
        className={desktopLinkClass(active)}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative" onMouseEnter={openMenu}>
      <Link
        ref={triggerRef}
        href={item.href}
        aria-current={ariaCurrent}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
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
                {group.links.map((link) => {
                  const linkActive = isNavLinkActive(
                    pathname,
                    link.href,
                    item.href,
                  );
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        role="menuitem"
                        aria-current={linkActive ? "page" : undefined}
                        className={[
                          "block rounded-lg px-2 py-1.5 text-sm no-underline",
                          linkActive
                            ? "bg-beige font-semibold text-navy"
                            : "text-navy/80 hover:bg-beige hover:text-navy",
                        ].join(" ")}
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
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
    "inline-flex min-h-10 items-center rounded-lg px-2 text-[0.8125rem] transition-colors duration-200 xl:min-h-11 xl:px-2.5 xl:text-[0.875rem]",
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
