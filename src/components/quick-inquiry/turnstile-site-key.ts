"use client";

import { useSyncExternalStore } from "react";

/**
 * Turnstile 사이트 키(공개 값) 공유 저장소.
 * 1) 빌드 시점 NEXT_PUBLIC_TURNSTILE_SITE_KEY  2) 없으면 /api/turnstile-config(Cloudflare 실행 시점 환경변수)
 * 둘 다 없으면 "missing" — 위젯 자리에 대체 상담 채널을 보여 준다.
 */
export type TurnstileKeyState = { siteKey: string; status: "loading" | "ready" | "missing" };

const BUILD_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

let state: TurnstileKeyState = BUILD_KEY
  ? { siteKey: BUILD_KEY, status: "ready" }
  : { siteKey: "", status: "loading" };
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(next: TurnstileKeyState) {
  state = next;
  for (const l of listeners) l();
}

function ensureLoaded() {
  if (state.status !== "loading" || pending || typeof window === "undefined") return;
  pending = fetch("/api/turnstile-config", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { siteKey?: unknown } | null) => {
      const key = typeof data?.siteKey === "string" ? data.siteKey.trim() : "";
      setState(key ? { siteKey: key, status: "ready" } : { siteKey: "", status: "missing" });
    })
    .catch(() => setState({ siteKey: "", status: "missing" }));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  ensureLoaded();
  return () => {
    listeners.delete(listener);
  };
}

const SERVER_STATE: TurnstileKeyState = BUILD_KEY
  ? { siteKey: BUILD_KEY, status: "ready" }
  : { siteKey: "", status: "loading" };

export function useTurnstileSiteKey(): TurnstileKeyState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}

/** 제출 시점 확인용(동기). 사이트 키를 알고 있으면 토큰이 필요하다. */
export function getTurnstileSiteKeyNow(): string {
  return state.siteKey;
}
