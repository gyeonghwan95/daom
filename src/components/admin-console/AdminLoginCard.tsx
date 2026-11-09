"use client";

import { useEffect, useRef, useState } from "react";

export function AdminLoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || data.ok === false) {
        setError(data.message || data.error || "로그인에 실패했습니다.");
        return;
      }
      setPassword("");
      const { markAdminAnalyticsExcluded } = await import(
        "@/lib/admin-ops/analytics-exclude"
      );
      markAdminAnalyticsExcluded();
      onSuccess();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-login__form">
      <label className="admin-login__label" htmlFor="admin-password">
        비밀번호
      </label>
      <input
        ref={inputRef}
        id="admin-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="admin-input"
        required
        minLength={12}
      />
      {error ? (
        <p role="alert" className="admin-login__error">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="admin-btn admin-btn--primary admin-login__submit"
      >
        {submitting ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
