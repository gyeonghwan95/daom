"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearAdminAnalyticsExcluded,
  markAdminAnalyticsExcluded,
} from "@/lib/admin-ops/analytics-exclude";

type SessionState = {
  loading: boolean;
  authenticated: boolean;
  configured: boolean;
  storageConfigured: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

async function fetchOpsSession() {
  try {
    const res = await fetch("/api/admin/session", { credentials: "include" });
    const data = (await res.json()) as {
      authenticated?: boolean;
      configured?: boolean;
      storageConfigured?: boolean;
    };
    return {
      configured: Boolean(data.configured),
      authenticated: Boolean(data.authenticated),
      storageConfigured: Boolean(data.storageConfigured),
    };
  } catch {
    return {
      configured: false,
      authenticated: false,
      storageConfigured: false,
    };
  }
}

export function useAdminOpsSession(): SessionState {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [storageConfigured, setStorageConfigured] = useState(false);

  const refresh = useCallback(async () => {
    const session = await fetchOpsSession();
    setConfigured(session.configured);
    setAuthenticated(session.authenticated);
    setStorageConfigured(session.storageConfigured);
    setLoading(false);
    if (session.authenticated) markAdminAnalyticsExcluded();
    else clearAdminAnalyticsExcluded();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchOpsSession().then((session) => {
      if (cancelled) return;
      setConfigured(session.configured);
      setAuthenticated(session.authenticated);
      setStorageConfigured(session.storageConfigured);
      setLoading(false);
      if (session.authenticated) markAdminAnalyticsExcluded();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    clearAdminAnalyticsExcluded();
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    await refresh();
  }, [refresh]);

  return {
    loading,
    authenticated,
    configured,
    storageConfigured,
    refresh,
    logout,
  };
}
