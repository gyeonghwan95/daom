"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteSearchButton } from "./SiteSearchButton";
import { SiteSearchDrawer } from "./SiteSearchDrawer";

type SiteSearchControlsProps = {
  onOpenSearch: () => void;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
};

export function SiteSearchControls({
  onOpenSearch,
  searchOpen,
  onSearchOpenChange,
}: SiteSearchControlsProps) {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setQuery("");
  }

  useEffect(() => {
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

  return (
    <>
      <SiteSearchButton
        ref={buttonRef}
        open={searchOpen}
        onClick={toggle}
        id="site-search-button"
      />

      <SiteSearchDrawer
        open={searchOpen}
        onClose={() => onSearchOpenChange(false)}
        returnFocusRef={buttonRef}
        query={query}
        onQueryChange={setQuery}
      />
    </>
  );
}
