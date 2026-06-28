"use client";

import { useCallback, useEffect, useState } from "react";

type AdminSessionState = {
  loading: boolean;
  authenticated: boolean;
  configured: boolean;
  localDev: boolean;
};

async function fetchAdminSession(): Promise<Omit<AdminSessionState, "loading">> {
  try {
    const response = await fetch("/api/admin/session", {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return { authenticated: false, configured: false, localDev: false };
    }

    const data = (await response.json()) as {
      authenticated?: boolean;
      configured?: boolean;
      localDev?: boolean;
    };

    return {
      authenticated: Boolean(data.authenticated),
      configured: Boolean(data.configured),
      localDev: Boolean(data.localDev),
    };
  } catch {
    return { authenticated: false, configured: false, localDev: false };
  }
}

export function useAdminSession() {
  const [state, setState] = useState<AdminSessionState>({
    loading: true,
    authenticated: false,
    configured: false,
    localDev: false,
  });

  const refresh = useCallback(async () => {
    const session = await fetchAdminSession();
    setState({ loading: false, ...session });
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchAdminSession().then((session) => {
      if (cancelled) return;
      setState({ loading: false, ...session });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...state, refresh };
}
