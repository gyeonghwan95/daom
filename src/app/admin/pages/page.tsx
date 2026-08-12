"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { getPageDisplayName } from "@/lib/admin/url-display";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";

type Row = {
  path: string;
  visitsToday: number;
  visits7d: number;
  visits30d: number;
  trend: string;
  cta: number;
  consultSubmit: number;
  naverPlace: number;
  conversionRate: number | null;
};

const TREND_LABEL: Record<string, string> = {
  up: "상승",
  down: "감소",
  stable: "안정",
  low_data: "데이터 부족",
};

export default function AdminPagesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminFetchJson<{ rows?: Row[]; message?: string }>(
      "/api/admin/pages?days=30",
    ).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setRows(result.data?.rows || []);
      setMessage(result.data?.message || null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const title = getPageDisplayName(r.path)?.toLowerCase() || "";
      return (
        r.path.toLowerCase().includes(q) ||
        title.includes(q)
      );
    });
  }, [rows, query]);

  return (
    <div>
      <AdminPageHeader title="페이지 성과" />
      <p className="admin-prose">오늘 · 7일 · 30일(KST) · page_view 기준</p>
      {message ? <p className="admin-alert admin-alert--info">{message}</p> : null}

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-input"
          placeholder="페이지 제목·URL 검색 (예: 상속, 협업문의)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="페이지 검색"
        />
      </div>

      <div className="admin-panel">
        {filtered.length === 0 ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <table className="admin-table admin-table--dense">
            <thead>
              <tr>
                <th>페이지</th>
                <th>오늘</th>
                <th>7일</th>
                <th>30일</th>
                <th>상태</th>
                <th>CTA</th>
                <th>문의</th>
                <th>네이버</th>
                <th>전환율</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.path}>
                  <td>
                    <PageIdentity path={r.path} />
                  </td>
                  <td>{r.visitsToday}</td>
                  <td>{r.visits7d}</td>
                  <td>{r.visits30d}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${r.trend}`}>
                      {TREND_LABEL[r.trend] || r.trend}
                    </span>
                  </td>
                  <td>{r.cta}</td>
                  <td>{r.consultSubmit}</td>
                  <td>{r.naverPlace}</td>
                  <td>{r.conversionRate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
