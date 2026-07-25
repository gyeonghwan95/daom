"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";
import { suggestSituationsFromPath } from "@/lib/consult-wizard/catalog";
import { trackConsultEvent } from "@/lib/consult-wizard/analytics";

export type QuickInquiryOpenOptions = {
  pageTitle?: string;
  pageUrl?: string;
  source?: "floating" | "mobile" | "inline" | "landing" | "cta" | "other";
  /** 페이지 맥락으로 미리 선택할 상황 (변경 가능) */
  presetSituationIds?: ConsultSituationId[];
};

type QuickInquiryContextValue = {
  open: boolean;
  pageTitle: string;
  pageUrl: string;
  source: QuickInquiryOpenOptions["source"];
  presetSituationIds: ConsultSituationId[];
  openInquiry: (options?: QuickInquiryOpenOptions) => void;
  closeInquiry: () => void;
};

const QuickInquiryContext = createContext<QuickInquiryContextValue | null>(null);

function resolvePageMeta(options?: QuickInquiryOpenOptions) {
  if (typeof window === "undefined") {
    return {
      pageTitle: options?.pageTitle ?? "",
      pageUrl: options?.pageUrl ?? "",
      path: "",
    };
  }

  let pageUrl = options?.pageUrl?.trim() || window.location.href;
  if (pageUrl.startsWith("/")) {
    pageUrl = `${window.location.origin}${pageUrl}`;
  }

  let path = "";
  try {
    path = new URL(pageUrl).pathname;
  } catch {
    path = window.location.pathname;
  }

  return {
    pageTitle: options?.pageTitle?.trim() || document.title || "",
    pageUrl,
    path,
  };
}

export function QuickInquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [source, setSource] =
    useState<QuickInquiryOpenOptions["source"]>("other");
  const [presetSituationIds, setPresetSituationIds] = useState<
    ConsultSituationId[]
  >([]);

  const openInquiry = useCallback((options?: QuickInquiryOpenOptions) => {
    const meta = resolvePageMeta(options);
    const presets =
      options?.presetSituationIds?.length
        ? options.presetSituationIds
        : suggestSituationsFromPath(meta.path);

    setPageTitle(meta.pageTitle);
    setPageUrl(meta.pageUrl);
    setSource(options?.source ?? "other");
    setPresetSituationIds(presets);
    setOpen(true);

    trackConsultEvent({
      event: "consult_start",
      source: options?.source ?? "other",
      pagePath: meta.path,
      situationIds: presets,
    });
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
      presetSituationIds,
      openInquiry,
      closeInquiry,
    }),
    [
      open,
      pageTitle,
      pageUrl,
      source,
      presetSituationIds,
      openInquiry,
      closeInquiry,
    ],
  );

  return (
    <QuickInquiryContext.Provider value={value}>
      {children}
    </QuickInquiryContext.Provider>
  );
}

export function useQuickInquiry() {
  const ctx = useContext(QuickInquiryContext);
  if (!ctx) {
    throw new Error("useQuickInquiry must be used within QuickInquiryProvider");
  }
  return ctx;
}

export function useOptionalQuickInquiry() {
  return useContext(QuickInquiryContext);
}
