"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";
import {
  CONSULT_SITUATIONS,
  suggestSituationsFromPath,
} from "@/lib/consult-wizard/catalog";
import { trackEvent } from "@/lib/admin-ops/beacon";
import { trackCtaEvent } from "@/lib/admin-ops/track-client";
import { trackConsultEvent } from "@/lib/consult-wizard/analytics";
import { CONTACT_INQUIRY_PATH } from "@/lib/consultation-inquiry";
import { isAdminPath } from "@/components/layout/PublicOnly";

function isConsultSituationId(value: string): value is ConsultSituationId {
  return CONSULT_SITUATIONS.some((s) => s.id === value);
}

export type QuickInquiryOpenOptions = {
  pageTitle?: string;
  pageUrl?: string;
  source?: "floating" | "mobile" | "inline" | "landing" | "cta" | "other";
  /** 페이지 맥락으로 미리 선택할 상황 (변경 가능) */
  presetSituationIds?: ConsultSituationId[];
  /** 계산·자가진단 등에서 가져온 한 줄 메모 */
  note?: string;
};

type QuickInquiryContextValue = {
  open: boolean;
  pageTitle: string;
  pageUrl: string;
  source: QuickInquiryOpenOptions["source"];
  presetSituationIds: ConsultSituationId[];
  note: string;
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
  const [note, setNote] = useState("");

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
    setNote(options?.note?.trim() ?? "");
    setOpen(true);

    trackConsultEvent({
      event: "consult_start",
      source: options?.source ?? "other",
      pagePath: meta.path,
      situationIds: presets,
    });
    void trackEvent({
      type: "consultation_start",
      path: meta.path || "/",
      meta: { source: options?.source ?? "other", dest: "#inquiry", kind: "contact" },
    });
  }, []);

  const closeInquiry = useCallback(() => {
    setOpen(false);
  }, []);

  // 본문의 '/contact/inquiry?field=…' 링크는 신청서 페이지로 떠나는 대신 이 자리에서 상담 창을 연다.
  // 링크(href)는 HTML에 그대로 남겨 검색·내부 링크 구조는 바뀌지 않고, 새 탭·수정키 클릭은 원래대로 이동한다.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== CONTACT_INQUIRY_PATH) return;
      // 신청서 페이지 자체·관리자 화면(상담 창을 그리지 않음)에서는 원래대로 이동
      if (window.location.pathname === CONTACT_INQUIRY_PATH || isAdminPath(window.location.pathname)) return;

      event.preventDefault();
      event.stopPropagation();

      const field = url.searchParams.get("field") ?? "";
      const presets = isConsultSituationId(field) ? [field] : undefined;
      const region = url.searchParams.get("region");
      const cost = url.searchParams.get("cost");
      const note = [
        url.searchParams.get("intent"),
        region ? `지역 ${region}` : "",
        cost === "1" || cost === "true" ? "비용 안내 요청" : "",
      ]
        .filter(Boolean)
        .join(" · ");

      trackCtaEvent("contact", window.location.pathname, anchor.getAttribute("href") ?? CONTACT_INQUIRY_PATH);
      openInquiry({ source: "cta", presetSituationIds: presets, note });
    };
    // 캡처 단계 — Next Link의 이동 처리보다 먼저 가로챈다
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openInquiry]);

  const value = useMemo(
    () => ({
      open,
      pageTitle,
      pageUrl,
      source,
      presetSituationIds,
      note,
      openInquiry,
      closeInquiry,
    }),
    [
      open,
      pageTitle,
      pageUrl,
      source,
      presetSituationIds,
      note,
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
