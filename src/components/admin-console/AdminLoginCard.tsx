"use client";

import { useState } from "react";

export function AdminLoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message || "로그인에 실패했습니다.");
        return;
      }
      setPassword("");
      onSuccess();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-card">
      <label style={{ display: "block", fontSize: 13, fontWeight: 600 }}>
        비밀번호
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            minHeight: 42,
            padding: "0 10px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
          required
          minLength={12}
        />
      </label>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c", fontSize: 13, marginTop: 10 }}>
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        style={{
          marginTop: 14,
          minHeight: 42,
          width: "100%",
          border: 0,
          borderRadius: 8,
          background: "#0f172a",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {submitting ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
