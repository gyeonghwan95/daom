"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavMenuLink } from "@/components/layout/NavMenuLink";
import { useHeaderSearch } from "@/components/search/SiteSearchControls";
import { mainNavigation } from "@/lib/navigation";
import { siteFavicon } from "@/lib/site-images";
import { siteConfig } from "@/lib/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerBarRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const openSearch = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(true);
  }, []);

  const { button: searchButton, drawer: searchDrawer } = useHeaderSearch({
    searchOpen,
    onSearchOpenChange: setSearchOpen,
    onOpenSearch: openSearch,
  });

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

  useEffect(() => {
    const el = headerBarRef.current;
    if (!el) return;

    const syncHeaderHeight = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (height > 0) {
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`,
        );
      }
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(el);
    window.addEventListener("resize", syncHeaderHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const openMenu = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 w-full overflow-visible border-b border-beige-dark bg-white/95 backdrop-blur-sm ${
          menuOpen || searchOpen ? "z-[100]" : "z-40"
        }`}
      >
        <div ref={headerBarRef}>
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
                <p className="site-header__brand-rep">
                  {siteConfig.representative}
                </p>
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
              {searchButton}

              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-beige-dark bg-beige text-navy lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
                onClick={openMenu}
              >
                {menuOpen ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
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
        </div>

        {searchDrawer}
      </header>

      {mounted &&
        createPortal(
          <MobileNav open={menuOpen} onClose={closeMenu} />,
          document.body,
        )}
    </>
  );
}
