"use client";

import { useEffect, useState } from "react";
import type { EmailLogEntry } from "@/lib/admin-ops/types";

export default function AdminEmailPage() {
  const [logs, setLogs] = useState<EmailLogEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/email", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json()) as {
          data?: { logs?: EmailLogEntry[]; message?: string };
        };
        if (cancelled) return;
        setLogs(json.data?.logs || []);
        setMessage(json.data?.message || null);
      })
      .catch(() => {
        if (!cancelled) setMessage("불러오기 실패");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const failed = logs.filter((l) => l.status === "failed");

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>메일·알림 로그</h1>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        수신 주소는 마스킹됩니다. 본문은 저장하지 않습니다.
      </p>
      {failed.length > 0 ? (
        <p className="admin-alert admin-alert--critical">
          실패 {failed.length}건 — Resend 도메인 인증·API 키·Telegram 설정을
          확인하세요.
        </p>
      ) : null}
      {message ? <p className="admin-alert admin-alert--info">{message}</p> : null}
      <div className="admin-card" style={{ marginTop: 16, overflowX: "auto" }}>
        {logs.length === 0 ? (
          <p style={{ color: "#64748b" }}>로그 없음</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>시각</th>
                <th>유형</th>
                <th>채널</th>
                <th>수신</th>
                <th>상태</th>
                <th>오류</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.timestamp}</td>
                  <td>{l.messageType}</td>
                  <td>{l.provider}</td>
                  <td>{l.recipientMasked}</td>
                  <td>{l.status}</td>
                  <td>{l.errorSummary || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
