"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageIdentity } from "@/components/admin/PageIdentity";
import type { EmailLogEntry } from "@/lib/admin-ops/types";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";

export default function AdminEmailPage() {
  const [logs, setLogs] = useState<EmailLogEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminFetchJson<{ logs?: EmailLogEntry[]; message?: string }>(
      "/api/admin/email",
    ).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setLogs(result.data?.logs || []);
      setMessage(result.data?.message || null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const failed = logs.filter((l) => l.status === "failed");
  const success = logs.filter((l) => l.status === "success").length;
  const total = logs.length;
  const rate = total > 0 ? Math.round((success / total) * 1000) / 10 : null;

  return (
    <div>
      <AdminPageHeader title="메일·알림" />
      <p className="admin-prose">수신 주소 마스킹 · 본문 미저장</p>

      {failed.length > 0 ? (
        <p className="admin-alert admin-alert--critical">
          실패 {failed.length}건 — Resend·Telegram 설정을 확인하세요.
        </p>
      ) : null}
      {message ? <p className="admin-alert admin-alert--info">{message}</p> : null}

      <div className="admin-metric-grid">
        <div className="admin-metric">
          <div className="admin-metric__label">최근 로그 성공률</div>
          <div className="admin-metric__value">
            {rate != null ? `${rate}%` : "—"}
          </div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">성공 / 실패</div>
          <div className="admin-metric__value">
            {success}/{failed.length}
          </div>
        </div>
      </div>

      <div className="admin-panel">
        {logs.length === 0 ? (
          <p className="admin-empty">로그 없음 — 문의 접수 후 기록됩니다.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>시각</th>
                <th>유형</th>
                <th>유입 페이지</th>
                <th>채널</th>
                <th>상태</th>
                <th>오류</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.timestamp}</td>
                  <td>{l.messageType}</td>
                  <td>
                    {l.path ? <PageIdentity path={l.path} /> : "—"}
                  </td>
                  <td>{l.provider}</td>
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
