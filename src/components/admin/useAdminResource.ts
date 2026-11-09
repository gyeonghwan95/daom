"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";

export function useAdminResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void adminFetchJson<T>(path).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setData(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, [path]);

  const request = useCallback(
    async (mode: "init" | "refresh") => {
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      const result = await adminFetchJson<T>(path);
      setLoading(false);
      setRefreshing(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setData(result.data);
    },
    [path],
  );

  return {
    data,
    error,
    loading,
    refreshing,
    reload: () => void request("refresh"),
    retry: () => void request("init"),
  };
}
