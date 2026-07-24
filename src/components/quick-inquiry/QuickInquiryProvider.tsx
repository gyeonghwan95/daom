"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type QuickInquiryOpenOptions = {
  pageTitle?: string;
  pageUrl?: string;
  source?: "floating" | "mobile" | "inline" | "other";
};

type QuickInquiryContextValue = {
  open: boolean;
  pageTitle: string;
  pageUrl: string;
  source: QuickInquiryOpenOptions["source"];
  openInquiry: (options?: QuickInquiryOpenOptions) => void;
  closeInquiry: () => void;
};

const QuickInquiryContext = createContext<QuickInquiryContextValue | null>(null);

function resolvePageMeta(options?: QuickInquiryOpenOptions) {
  if (typeof window === "undefined") {
    return {
      pageTitle: options?.pageTitle ?? "",
      pageUrl: options?.pageUrl ?? "",
    };
  }

  let pageUrl = options?.pageUrl?.trim() || window.location.href;
  if (pageUrl.startsWith("/")) {
    pageUrl = `${window.location.origin}${pageUrl}`;
  }

  return {
    pageTitle: options?.pageTitle?.trim() || document.title || "",
    pageUrl,
  };
}

export function QuickInquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [source, setSource] = useState<QuickInquiryOpenOptions["source"]>("other");

  const openInquiry = useCallback((options?: QuickInquiryOpenOptions) => {
    const meta = resolvePageMeta(options);
    setPageTitle(meta.pageTitle);
    setPageUrl(meta.pageUrl);
    setSource(options?.source ?? "other");
    setOpen(true);
  }, []);

  const closeInquiry = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      open,
      pageTitle,
      pageUrl,
      source,
      openInquiry,
      closeInquiry,
    }),
    [open, pageTitle, pageUrl, source, openInquiry, closeInquiry],
  );

  return (
    <QuickInquiryContext.Provider value={value}>{children}</QuickInquiryContext.Provider>
  );
}

export function useQuickInquiry() {
  const ctx = useContext(QuickInquiryContext);
  if (!ctx) {
    throw new Error("useQuickInquiry must be used within QuickInquiryProvider");
  }
  return ctx;
}

/** Provider 밖(선택)에서도 안전하게 쓰기 위한 훅 */
export function useOptionalQuickInquiry() {
  return useContext(QuickInquiryContext);
}
