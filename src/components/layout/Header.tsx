"use client";

import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { NavMenuLink } from "@/components/layout/NavMenuLink";
import { SiteSearchControls } from "@/components/search/SiteSearchControls";
import { mainNavigation } from "@/lib/navigation";
import { siteFavicon } from "@/lib/site-images";
import { siteConfig } from "@/lib/site";

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] lg:hidden"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="모바일 메뉴"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]"
        aria-label="메뉴 닫기"
        onClick={onClose}
      />
      <nav
        className="absolute right-0 top-0 z-10 flex h-full w-[min(100vw-3rem,20rem)] max-w-full flex-col bg-cream shadow-2xl"
        style={{
          paddingBottom: "calc(7rem + env(safe-area-inset-bottom, 0px))",
        }}
        aria-label="모바일 메뉴"
      >
        <div className="flex items-center justify-between border-b border-beige-dark px-4 py-3">
          <p className="truncate pr-2 text-sm font-semibold text-navy">
            {siteConfig.name}
          </p>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-navy"
            aria-label="메뉴 닫기"
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
          {mainNavigation.map((item) => (
            <li key={item.href}>
              <NavMenuLink item={item} variant="mobile" onNavigate={onClose} />
            </li>
          ))}
        </ul>
        <div className="border-t border-beige-dark p-4">
          <Link href="/contact" className="btn-primary w-full" onClick={onClose}>
            상담 신청하기
          </Link>
        </div>
      </nav>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("mobile-menu-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const openSearch = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(true);
  }, []);

  const openMenu = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 w-full border-b border-beige-dark bg-white/95 backdrop-blur-sm ${
          menuOpen || searchOpen ? "z-[100]" : "z-40"
        }`}
      >
        <Container
          fullWidth
          className="flex items-center justify-between gap-3 py-2.5 md:py-3 lg:gap-6"
        >
          <Link
            href="/"
            className="site-header__brand flex min-h-11 min-w-0 flex-1 items-center gap-2.5 sm:gap-3 lg:flex-none lg:shrink-0"
            onClick={() => {
              closeMenu();
              setSearchOpen(false);
            }}
          >
            <span className="site-header__brand-mark" aria-hidden>
              <Image
                src={siteFavicon}
                alt=""
                width={56}
                height={56}
                priority
                className="site-header__brand-logo"
              />
            </span>
            <div className="site-header__brand-text min-w-0">
              <p className="site-header__brand-name">{siteConfig.name}</p>
              <p className="site-header__brand-rep">{siteConfig.representative}</p>
            </div>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 justify-end lg:block"
            aria-label="주 메뉴"
          >
            <ul className="flex flex-wrap items-center justify-end gap-x-0.5 gap-y-1 xl:gap-x-1">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <NavMenuLink item={item} variant="desktop" />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <SiteSearchControls
              searchOpen={searchOpen}
              onSearchOpenChange={setSearchOpen}
              onOpenSearch={openSearch}
            />

            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-beige-dark bg-beige text-navy lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              onClick={openMenu}
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </Container>
      </header>

      {mounted &&
        createPortal(
          <MobileMenu open={menuOpen} onClose={closeMenu} />,
          document.body,
        )}
    </>
  );
}
