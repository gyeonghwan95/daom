"use client";

import { useEffect, useState } from "react";
import type { FloatingNotice } from "@/lib/admin-ops/types";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<FloatingNotice[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/notices", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json()) as {
          ok?: boolean;
          data?: { notices?: FloatingNotice[]; storageConfigured?: boolean };
          message?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setError(json.message || "불러오기 실패");
          return;
        }
        setNotices(json.data?.notices || []);
        if (json.data && json.data.storageConfigured === false) {
          setError("ADMIN_KV가 없어 공지를 저장할 수 없습니다.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("네트워크 오류");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function reload() {
    const res = await fetch("/api/admin/notices", { credentials: "include" });
    const json = (await res.json()) as {
      data?: { notices?: FloatingNotice[] };
    };
    setNotices(json.data?.notices || []);
  }

  async function create(publishNow: boolean) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          publishNow,
          status: publishNow ? "active" : "draft",
          displayScope: "home",
          position: "bottom-left",
          style: "notice",
          dismissible: true,
          priority: 10,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.message || "저장 실패");
        return;
      }
      setTitle("");
      setMessage("");
      await reload();
    } finally {
      setSaving(false);
    }
  }

  async function archive(id: string) {
    await fetch(`/api/admin/notices/${id}/archive`, {
      method: "POST",
      credentials: "include",
    });
    await reload();
  }

  async function publish(id: string) {
    await fetch(`/api/admin/notices/${id}/publish`, {
      method: "POST",
      credentials: "include",
    });
    await reload();
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>플로팅 공지</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
        plain text만 사용합니다. CTA는 내부 경로 또는 https URL만 허용됩니다.
      </p>

      {error ? (
        <p className="admin-alert admin-alert--warning" role="alert">
          {error}
        </p>
      ) : null}

      <section className="admin-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>새 공지</h2>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600 }}>
          제목
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 6,
              minHeight: 40,
              padding: "0 10px",
            }}
            maxLength={80}
          />
        </label>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            marginTop: 10,
          }}
        >
          내용
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{
              display: "block",
              width: "100%",
              marginTop: 6,
              padding: 10,
            }}
            maxLength={500}
          />
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={saving || !title || !message}
            onClick={() => void create(true)}
            style={{
              minHeight: 40,
              padding: "0 14px",
              background: "#0f172a",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            즉시 게시
          </button>
          <button
            type="button"
            disabled={saving || !title || !message}
            onClick={() => void create(false)}
            style={{
              minHeight: 40,
              padding: "0 14px",
              background: "#fff",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            초안 저장
          </button>
        </div>
      </section>

      <section className="admin-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>목록</h2>
        {notices.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: 13 }}>공지 없음</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ color: "#64748b" }}>
                      {n.message.slice(0, 80)}
                    </div>
                  </td>
                  <td>{n.status}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {n.status !== "active" && n.status !== "archived" ? (
                        <button type="button" onClick={() => void publish(n.id)}>
                          게시
                        </button>
                      ) : null}
                      {n.status !== "archived" ? (
                        <button type="button" onClick={() => void archive(n.id)}>
                          보관
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
