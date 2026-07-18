"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  isNavItemActive,
  mainNavigation,
  type NavItem,
} from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [submenu, setSubmenu] = useState<NavItem | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const rootScrollRef = useRef<HTMLDivElement>(null);
  const subScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const titleId = useId();

  const handleClose = useCallback(() => {
    setSubmenu(null);
    setExpandedGroup(null);
    onClose();
  }, [onClose]);

  const openSubmenu = useCallback((item: NavItem) => {
    setExpandedGroup(null);
    setSubmenu(item);
  }, []);

  const updateScrollHints = useCallback((el: HTMLDivElement | null) => {
    if (!el) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }
    const maxScroll = el.scrollHeight - el.clientHeight;
    const hasOverflow = maxScroll > 8;
    setCanScrollUp(hasOverflow && el.scrollTop > 6);
    setCanScrollDown(hasOverflow && el.scrollTop < maxScroll - 6);
  }, []);

  useEffect(() => {
    if (!open) return;

    const el = submenu ? subScrollRef.current : rootScrollRef.current;
    if (!el) return;

    el.scrollTop = 0;
    updateScrollHints(el);

    const onScroll = () => updateScrollHints(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(() => updateScrollHints(el));
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [open, submenu, updateScrollHints]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (submenu) {
          setSubmenu(null);
          setExpandedGroup(null);
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, submenu, handleClose]);

  if (!open) return null;

  const inSubmenu = Boolean(submenu);
  const transitionClass = reducedMotion
    ? ""
    : "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden lg:hidden"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]"
        aria-label="메뉴 닫기"
        onClick={handleClose}
      />

      <nav
        className="absolute inset-y-0 right-0 z-10 flex w-full max-w-full flex-col overflow-hidden bg-cream shadow-2xl sm:max-w-[22.5rem]"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
        aria-label="모바일 메뉴"
      >
        <div className="flex shrink-0 items-center gap-1 border-b border-beige-dark bg-white/90 px-2 py-2.5 backdrop-blur-sm">
          {inSubmenu ? (
            <>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-navy active:bg-beige/70"
                onClick={() => {
                  setSubmenu(null);
                  setExpandedGroup(null);
                }}
                aria-label="상위 메뉴로 돌아가기"
              >
                <ChevronLeftIcon />
                <span className="text-sm font-medium">뒤로</span>
              </button>
              <p
                id={titleId}
                className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-navy"
              >
                {submenu!.label}
              </p>
            </>
          ) : (
            <div className="min-w-0 flex-1 px-2">
              <p
                id={titleId}
                className="truncate text-sm font-semibold text-navy"
              >
                {siteConfig.name}
              </p>
              <p className="truncate text-[0.6875rem] text-navy/50">메뉴</p>
            </div>
          )}

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-navy active:bg-beige/70"
            aria-label="메뉴 닫기"
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          {canScrollUp ? (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 bg-gradient-to-b from-cream via-cream/85 to-transparent"
              aria-hidden
            />
          ) : null}

          <div
            className={[
              "absolute inset-0",
              transitionClass,
              inSubmenu
                ? "pointer-events-none -translate-x-full"
                : "translate-x-0",
            ].join(" ")}
            aria-hidden={inSubmenu}
          >
            <div
              ref={rootScrollRef}
              className={[
                "h-full overflow-x-hidden overflow-y-auto overscroll-contain",
                !inSubmenu && canScrollDown ? "pb-10" : "pb-3",
              ].join(" ")}
            >
              <ul className="space-y-1 px-3 pt-3">
                {mainNavigation.map((item) => {
                  const active = isNavItemActive(pathname, item.href);
                  const hasChildren = Boolean(item.groups?.length);

                  if (hasChildren) {
                    return (
                      <li key={item.href}>
                        <button
                          type="button"
                          onClick={() => openSubmenu(item)}
                          aria-haspopup="true"
                          className={[
                            "group flex w-full min-h-[3.25rem] items-center gap-3 rounded-2xl px-3.5 text-left transition-colors",
                            active
                              ? "bg-white font-semibold text-navy shadow-sm ring-1 ring-beige-dark"
                              : "bg-white/60 font-medium text-navy/85 ring-1 ring-transparent active:bg-beige/70",
                          ].join(" ")}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-[0.9375rem] leading-tight">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[0.6875rem] font-normal text-navy/45">
                              {item.megaMenu
                                ? "복대리·부동산·건축·기업 협업"
                                : "하위 메뉴 보기"}
                            </span>
                          </span>
                          <span
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-beige text-navy/55"
                            aria-hidden
                          >
                            <ChevronRightIcon />
                          </span>
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={handleClose}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "flex min-h-[3.25rem] items-center rounded-2xl px-3.5 text-[0.9375rem] no-underline transition-colors",
                          active
                            ? "bg-white font-semibold text-navy shadow-sm ring-1 ring-beige-dark"
                            : "bg-white/60 font-medium text-navy/85 active:bg-beige/70",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            className={[
              "absolute inset-0",
              transitionClass,
              inSubmenu
                ? "translate-x-0"
                : "pointer-events-none translate-x-full",
            ].join(" ")}
            aria-hidden={!inSubmenu}
          >
            <div
              ref={subScrollRef}
              className={[
                "h-full overflow-x-hidden overflow-y-auto overscroll-contain",
                inSubmenu && canScrollDown ? "pb-10" : "pb-3",
              ].join(" ")}
            >
              {submenu ? (
                <MobileNavSubmenu
                  item={submenu}
                  pathname={pathname}
                  expandedGroup={expandedGroup}
                  onToggleGroup={(title) =>
                    setExpandedGroup((prev) => (prev === title ? null : title))
                  }
                  onClose={handleClose}
                />
              ) : null}
            </div>
          </div>

          {canScrollDown ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end"
              aria-hidden
            >
              <div className="h-11 w-full bg-gradient-to-t from-cream via-cream/95 to-transparent" />
              <p className="absolute bottom-2 rounded-full border border-beige-dark bg-white/95 px-2.5 py-1 text-[0.6875rem] font-medium text-navy/65 shadow-sm">
                아래로 더 보기
              </p>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-beige-dark bg-white p-3">
          {submenu?.megaMenu ? (
            <div className="grid gap-2">
              <Link
                href="/협업문의"
                className="btn-primary w-full"
                onClick={handleClose}
              >
                협업 문의서 작성
              </Link>
              <Link
                href="/partners"
                className="btn-secondary w-full"
                onClick={handleClose}
              >
                협업문의 종합안내
              </Link>
            </div>
          ) : submenu ? (
            <Link
              href={submenu.href}
              className="btn-secondary w-full"
              onClick={handleClose}
            >
              {submenu.label} 전체 보기
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/contact"
                className="btn-primary w-full"
                onClick={handleClose}
              >
                상담 신청
              </Link>
              <Link
                href="/partners"
                className="btn-secondary w-full"
                onClick={handleClose}
              >
                협업문의
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

function MobileNavSubmenu({
  item,
  pathname,
  expandedGroup,
  onToggleGroup,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  expandedGroup: string | null;
  onToggleGroup: (title: string) => void;
  onClose: () => void;
}) {
  const isCollab = Boolean(item.megaMenu);
  const hubLabel = isCollab ? "협업문의 종합안내" : `${item.label} 홈`;
  const hubHint = isCollab
    ? "전문직·기업·기관 협업 분야 전체 보기"
    : "관련 안내 페이지로 이동";

  return (
    <div className="px-3 pt-3">
      <Link
        href={item.href}
        onClick={onClose}
        className="mb-3 flex items-center gap-3 rounded-2xl border border-beige-dark bg-white px-4 py-3.5 no-underline shadow-[0_1px_2px_rgba(30,58,95,0.04)] active:bg-beige/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-cream">
          <MenuMarkIcon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.9375rem] font-semibold text-navy">
            {hubLabel}
          </span>
          <span className="mt-0.5 block text-xs text-navy/50">{hubHint}</span>
        </span>
        <span className="text-navy/35" aria-hidden>
          <ChevronRightIcon />
        </span>
      </Link>

      <div className="space-y-2">
        {item.groups!.map((group, groupIndex) => {
          const links = group.links
            .filter((link) => !(isCollab && link.href === "/partners"))
            .slice(0, isCollab ? 6 : undefined);
          const useAccordion = isCollab || item.groups!.length > 2;
          const expanded = !useAccordion || expandedGroup === group.title;

          return (
            <section
              key={group.title}
              aria-labelledby={`mobile-nav-group-${groupIndex}`}
              className="overflow-hidden rounded-2xl border border-beige-dark bg-white"
            >
              {useAccordion ? (
                <button
                  type="button"
                  id={`mobile-nav-group-${groupIndex}`}
                  aria-expanded={expanded}
                  onClick={() => onToggleGroup(group.title)}
                  className="flex w-full min-h-12 items-center gap-2 px-4 text-left"
                >
                  <span className="min-w-0 flex-1 text-[0.8125rem] font-semibold text-navy">
                    {group.title}
                  </span>
                  <span className="text-[0.6875rem] text-navy/40">
                    {links.length}
                  </span>
                  <span
                    className={[
                      "text-navy/40 transition-transform",
                      expanded ? "rotate-90" : "",
                    ].join(" ")}
                    aria-hidden
                  >
                    <ChevronRightIcon size={16} />
                  </span>
                </button>
              ) : (
                <h2
                  id={`mobile-nav-group-${groupIndex}`}
                  className="border-b border-beige-dark/80 px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-navy/45"
                >
                  {group.title}
                </h2>
              )}

              {expanded ? (
                <ul
                  className={
                    useAccordion ? "border-t border-beige-dark/80" : undefined
                  }
                >
                  {links.map((link, index) => {
                    const pathOnly = link.href.split("#")[0];
                    const linkActive =
                      pathname === pathOnly ||
                      pathname.startsWith(`${pathOnly}/`);
                    const isLast = index === links.length - 1;
                    return (
                      <li key={`${group.title}-${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          aria-current={linkActive ? "page" : undefined}
                          className={[
                            "flex min-h-12 items-center gap-3 px-4 text-[0.9375rem] no-underline transition-colors",
                            !isLast ? "border-b border-beige-dark/70" : "",
                            linkActive
                              ? "bg-beige/70 font-semibold text-navy"
                              : "font-medium text-navy/80 active:bg-beige/50",
                          ].join(" ")}
                        >
                          <span className="min-w-0 flex-1 leading-snug">
                            {link.label}
                          </span>
                          {linkActive ? (
                            <span className="shrink-0 text-[0.625rem] font-semibold tracking-wide text-navy/55">
                              현재
                            </span>
                          ) : (
                            <span className="shrink-0 text-navy/25" aria-hidden>
                              <ChevronRightIcon size={16} />
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                  {isCollab ? (
                    <li>
                      <Link
                        href="/partners#all-services"
                        onClick={onClose}
                        className="flex min-h-11 items-center gap-2 bg-beige/30 px-4 text-sm font-medium text-navy no-underline active:bg-beige/50"
                      >
                        {group.title} 전체 보기
                        <span className="ml-auto text-navy/25" aria-hidden>
                          <ChevronRightIcon size={16} />
                        </span>
                      </Link>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ChevronRightIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuMarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19.5V6.8c0-.7.4-1.3 1-1.6L12 2l7 3.2c.6.3 1 .9 1 1.6v12.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12v9.5M4 19.5c2.2-1.2 5-1.2 8 0s5.8 1.2 8 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
