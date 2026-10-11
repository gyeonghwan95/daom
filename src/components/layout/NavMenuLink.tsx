"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollaborationMegaMenu } from "@/components/layout/CollaborationMegaMenu";
import { DesktopNavFlyout } from "@/components/layout/DesktopNavFlyout";
import { desktopLinkClass, NavChevron } from "@/components/layout/nav-trigger";
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

  const groups = item.groups!;
  // '전체 보기' 묶음은 열 대신 왼쪽 안내 카드 안에 둔다.
  const hubGroup = groups.find((group) => group.title === "전체 보기");
  const columnGroups = groups.filter((group) => group !== hubGroup);
  const hubLinks = hubGroup?.links ?? [{ href: item.href, label: `${item.label} 전체` }];

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
        <NavChevron open={open} />
      </Link>

      <DesktopNavFlyout
        open={open}
        panelId={panelId}
        ariaLabel={`${item.label} 하위 메뉴`}
        triggerRef={triggerRef}
        onMouseEnter={openMenu}
        maxWidth={columnGroups.length >= 3 ? 1040 : 760}
      >
        <div className="grid gap-5 md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-6">
          <div className="flex flex-col justify-between rounded-xl border border-navy/10 bg-beige/50 p-4">
            <div>
              <p className="text-[0.9375rem] font-semibold text-navy">{item.label}</p>
              {item.description ? (
                <p className="mt-1.5 text-xs leading-relaxed text-navy/65">
                  {item.description}
                </p>
              ) : null}
              <ul className="mt-3 space-y-1">
                {hubLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isExactNavHref(pathname, link.href) ? "page" : undefined}
                      className="group inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-navy no-underline hover:underline hover:underline-offset-4"
                      onClick={closeMenu}
                    >
                      {link.label}
                      <span aria-hidden className="text-navy/40 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contact"
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy no-underline hover:border-navy/30"
              onClick={closeMenu}
            >
              상황만 남기고 상담 받기
            </Link>
          </div>

          <div
            className={[
              "grid content-start gap-x-6 gap-y-5",
              columnGroups.length >= 4
                ? "sm:grid-cols-2 xl:grid-cols-4"
                : columnGroups.length === 3
                  ? "sm:grid-cols-3"
                  : columnGroups.length === 2
                    ? "sm:grid-cols-2"
                    : "grid-cols-1",
            ].join(" ")}
          >
            {columnGroups.map((group) => (
              <div key={group.title} className="min-w-0">
                <p className="mb-2 border-b border-beige-dark pb-1.5 text-xs font-semibold tracking-wide text-navy/55">
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
                          aria-current={linkActive ? "page" : undefined}
                          className={[
                            "flex min-h-9 items-center rounded-lg px-2 text-sm leading-snug no-underline",
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
        </div>
      </DesktopNavFlyout>
    </div>
  );
}

function mobileLinkClass(active: boolean) {
  return [
    "flex min-h-12 items-center rounded-lg px-4 text-base transition-colors duration-200 no-underline",
    active
      ? "border-l-[3px] border-navy bg-beige pl-[calc(1rem-3px)] font-semibold text-navy"
      : "border-l-[3px] border-transparent font-medium text-navy/80 active:bg-beige/80",
  ].join(" ");
}
