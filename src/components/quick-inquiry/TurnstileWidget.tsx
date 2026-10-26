"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InquiryFailureFallback } from "@/components/conversion/InquiryFailureFallback";
import {
  getTurnstileSiteKeyNow,
  prefetchTurnstileSiteKey,
  useTurnstileSiteKey,
} from "./turnstile-site-key";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          size?: "normal" | "compact" | "flexible" | "invisible";
          appearance?: "always" | "execute" | "interaction-only";
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      ready: (cb: () => void) => void;
    };
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile load failed")));
      if (window.turnstile) resolve();
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile load failed"));
    document.head.appendChild(script);
  });
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void;
  onError?: () => void;
  resetSignal?: number;
};

export function TurnstileWidget({ onToken, onError, resetSignal = 0 }: TurnstileWidgetProps) {
  // 빌드 시점 키가 없으면 /api/turnstile-config(실행 시점)에서 받는다 — 빌드 환경에 키가 빠져 모든 문의가 실패했던 문제(2026-10-12)
  const { siteKey, status } = useTurnstileSiteKey();
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleToken = useCallback(
    (token: string) => {
      onToken(token);
    },
    [onToken],
  );

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !hostRef.current || !window.turnstile) return;
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
        widgetIdRef.current = window.turnstile.render(hostRef.current, {
          sitekey: siteKey,
          // always: 팝업·인라인 폼에서 위젯이 보이도록 (interaction-only는 UI가 안 나와 검증 누락으로 이어짐)
          appearance: "always",
          size: "flexible",
          theme: "light",
          callback: handleToken,
          "error-callback": () => {
            setFailed(true);
            onError?.();
          },
          "expired-callback": () => {
            onToken("");
          },
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          onError?.();
        }
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, handleToken, onError, onToken]);

  useEffect(() => {
    if (!siteKey || !widgetIdRef.current || !window.turnstile) return;
    window.turnstile.reset(widgetIdRef.current);
    onToken("");
  }, [resetSignal, siteKey, onToken]);

  if (!siteKey) {
    if (status === "loading") {
      return (
        <div className="quick-inquiry__turnstile">
          <p className="mt-1 text-xs text-navy/55">보안 확인 준비 중…</p>
        </div>
      );
    }
    // 사이트 키를 받을 수 없으면 신청이 전달되지 않으므로 처음부터 대체 채널을 보여 준다
    return (
      <InquiryFailureFallback
        title="지금은 온라인 신청을 받을 수 없습니다. 아래로 바로 연락해 주세요"
        description="보안 확인을 불러오지 못해 이 양식으로는 전달되지 않습니다. 카카오톡·네이버 톡톡·전화·네이버 예약으로 말씀해 주시면 바로 확인하겠습니다."
      />
    );
  }

  return (
    <div className="quick-inquiry__turnstile">
      <p className="quick-inquiry__turnstile-label mb-2 text-xs font-medium text-navy/70">
        보안 확인 <span className="text-navy/45">(필수)</span>
      </p>
      <div ref={hostRef} className="quick-inquiry__turnstile-host min-h-[65px]" />
      {!ready && !failed ? (
        <p className="mt-1 text-xs text-navy/55">보안 확인 준비 중…</p>
      ) : null}
      {failed ? (
        <>
          <p className="mt-1 text-xs text-red-700" role="alert">
            보안 확인을 불러오지 못했습니다. 새로고침 후 다시 시도하시거나 아래로 바로 연락해 주세요.
          </p>
          <InquiryFailureFallback
            className="mt-3"
            title="보안 확인 없이 바로 연락하기"
            description="카카오톡·네이버 톡톡·전화·네이버 예약 중 편한 방법으로 말씀해 주세요."
          />
        </>
      ) : null}
    </div>
  );
}

/** 상담 창이 열릴 때 키와 스크립트를 미리 받아 둔다 — 연락처 단계에서 보안 확인이 바로 끝나도록 */
export function preloadTurnstile() {
  prefetchTurnstileSiteKey();
  loadTurnstileScript().catch(() => {
    // 실패는 위젯을 그릴 때 다시 시도하고 대체 채널을 안내한다
  });
}

/** 사이트 키를 알고 있으면(빌드 또는 실행 시점) 제출 전에 토큰이 필요하다 */
export function isTurnstileConfigured() {
  return Boolean(getTurnstileSiteKeyNow());
}
