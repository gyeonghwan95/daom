"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  countSearchResults,
  normalizeQueryInput,
  searchSite,
} from "@/lib/search";
import type { SearchIndexItem } from "@/lib/search/types";
import { SearchCloseIcon } from "./SearchIcons";
import { SiteSearchInput } from "./SiteSearchInput";
import { SiteSearchResults } from "./SiteSearchResults";

type SiteSearchDrawerProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
};

const DRAWER_RESULT_LIMIT = 10;

async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  const data = await import("@/generated/search-index.json");
  return (data.default ?? data) as SearchIndexItem[];
}

export function SiteSearchDrawer({
  open,
  onClose,
  returnFocusRef,
  query,
  onQueryChange,
}: SiteSearchDrawerProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const [index, setIndex] = useState<SearchIndexItem[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const [placeholder, setPlaceholder] = useState("업무·지역·강의 검색");

  const deferredQuery = useDeferredValue(normalizeQueryInput(query));

  if (prevQuery !== deferredQuery) {
    setPrevQuery(deferredQuery);
    setActiveIndex(0);
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setPlaceholder(
        media.matches
          ? "상속등기, 개인회생, 법인설립, 전세사기 강의 등을 검색해보세요"
          : "업무·지역·강의 검색",
      );
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open || index) return;

    let cancelled = false;
    void loadSearchIndex().then((items) => {
      if (!cancelled) setIndex(items);
    });

    return () => {
      cancelled = true;
    };
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  const results = useMemo(() => {
    if (!index || !deferredQuery) return [];
    return searchSite(index, deferredQuery, { limit: DRAWER_RESULT_LIMIT });
  }, [index, deferredQuery]);

  const totalCount = useMemo(() => {
    if (!index || !deferredQuery) return 0;
    return countSearchResults(index, deferredQuery);
  }, [index, deferredQuery]);

  const closeAndRestoreFocus = useCallback(() => {
    onClose();
    window.requestAnimationFrame(() => {
      returnFocusRef.current?.focus();
    });
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndRestoreFocus();
      }
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (returnFocusRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest("[data-site-search-toggle]")
      ) {
        return;
      }
      closeAndRestoreFocus();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open, closeAndRestoreFocus, returnFocusRef]);

  const selectActiveResult = useCallback(() => {
    const item = results[activeIndex];
    if (!item) return;
    onClose();
    router.push(item.href);
  }, [activeIndex, onClose, results, router]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((prev) => (prev + 1) % results.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      return;
    }
    if (event.key === "Enter") {
      if (results.length > 0) {
        event.preventDefault();
        selectActiveResult();
        return;
      }
      const q = normalizeQueryInput(query);
      if (q) {
        event.preventDefault();
        onClose();
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }
    }
  };

  if (!open) return null;

  const activeDescendant =
    results.length > 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div
      id="site-search-drawer"
      ref={panelRef}
      role="search"
      aria-label="사이트 전체 검색"
      className={`site-search-drawer site-search-drawer--open fixed inset-x-0 z-[45] border-b border-beige-dark bg-white/98 shadow-[0_12px_28px_rgba(30,58,95,0.08)] backdrop-blur-sm ${
        reducedMotion ? "site-search-drawer--reduced" : ""
      }`}
      style={{ top: "var(--header-height)" }}
    >
      <Container className="py-3 md:py-4">
        <div className="flex items-start gap-2 md:gap-3">
          <SiteSearchInput
            value={query}
            onChange={onQueryChange}
            onClear={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            onKeyDown={onInputKeyDown}
            inputRef={inputRef}
            listboxId={listboxId}
            activeDescendant={activeDescendant}
            placeholder={placeholder}
          />
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-beige-dark text-navy hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label="검색 닫기"
            onClick={closeAndRestoreFocus}
          >
            <SearchCloseIcon />
          </button>
        </div>

        <div className="mt-3 max-h-[min(60dvh,28rem)] overflow-y-auto overscroll-contain pb-[max(0.5rem,env(safe-area-inset-bottom))] md:max-h-[min(55dvh,32rem)]">
          <div className="mx-auto w-full max-w-3xl">
            <SiteSearchResults
              query={deferredQuery}
              results={results}
              totalCount={totalCount}
              activeIndex={activeIndex}
              loading={!index}
              listboxId={listboxId}
              onSelect={onClose}
              onActiveIndexChange={setActiveIndex}
              showAllResultsLink={totalCount > DRAWER_RESULT_LIMIT}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
