"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteSearchButton } from "./SiteSearchButton";
import { SiteSearchDrawer } from "./SiteSearchDrawer";

type HeaderSearchProps = {
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  onOpenSearch: () => void;
};

/** 헤더 상단바 버튼 + 헤더 하단 드로어를 분리해 배치 */
export function useHeaderSearch({
  searchOpen,
  onSearchOpenChange,
  onOpenSearch,
}: HeaderSearchProps) {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");
    onSearchOpenChange(false);
  }, [pathname, onSearchOpenChange]);

  const toggle = useCallback(() => {
    if (searchOpen) {
      onSearchOpenChange(false);
      return;
    }
    setQuery("");
    onOpenSearch();
  }, [onOpenSearch, onSearchOpenChange, searchOpen]);

  const button = (
    <SiteSearchButton
      ref={buttonRef}
      open={searchOpen}
      onClick={toggle}
      id="site-search-button"
    />
  );

  const drawer = (
    <SiteSearchDrawer
      open={searchOpen}
      onClose={() => onSearchOpenChange(false)}
      returnFocusRef={buttonRef}
      query={query}
      onQueryChange={setQuery}
    />
  );

  return { button, drawer };
}
