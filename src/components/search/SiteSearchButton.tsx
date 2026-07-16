"use client";

import { forwardRef } from "react";
import { SearchCloseIcon, SearchIcon } from "./SearchIcons";

type SiteSearchButtonProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
  id?: string;
};

export const SiteSearchButton = forwardRef<
  HTMLButtonElement,
  SiteSearchButtonProps
>(function SiteSearchButton(
  { open, onClick, className = "", id = "site-search-button" },
  ref,
) {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      data-site-search-toggle
      className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-beige-dark bg-beige text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${className}`}
      aria-label={open ? "사이트 전체 검색 닫기" : "사이트 전체 검색 열기"}
      aria-expanded={open}
      aria-controls="site-search-drawer"
      title={open ? "검색 닫기" : "사이트 검색"}
      onClick={onClick}
    >
      {open ? <SearchCloseIcon /> : <SearchIcon />}
    </button>
  );
});
