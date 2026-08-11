"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardPayload } from "@/lib/admin-ops/types";

function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  return String(n);
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/dashboard", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json()) as {
          ok?: boolean;
          data?: DashboardPayload;
          message?: string;
        };
        if (cancelled) return;
        if (!res.ok || !json.ok || !json.data) {
          setError(json.message || "대시보드를 불러오지 못했습니다.");
          return;
        }
        setData(json.data);
      })
      .catch(() => {
        if (!cancelled) setError("네트워크 오류");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>대시보드</h1>
        <p className="admin-alert admin-alert--warning" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return <p>불러오는 중…</p>;
  }

  const k = data.kpis;

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>대시보드</h1>
        <p style={{ marginTop: 6, color: "#64748b", fontSize: 14 }}>{data.summaryLine}</p>
        <p style={{ marginTop: 4, color: "#94a3b8", fontSize: 12 }}>
          Asia/Seoul · {new Date(data.generatedAt).toLocaleString("ko-KR")}
        </p>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <Link href="/admin/notices" className="btn-primary" style={{ minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          + 공지 만들기
        </Link>
        <Link href="/admin/email" style={{ minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", textDecoration: "none", color: "#0f172a", fontSize: 14, fontWeight: 600 }}>
          메일 실패 보기
        </Link>
        <Link href="/admin/monitoring" style={{ minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", textDecoration: "none", color: "#0f172a", fontSize: 14, fontWeight: 600 }}>
          시스템 점검
        </Link>
      </div>

      {data.alerts.length > 0 ? (
        <section aria-label="확인할 사항" style={{ marginBottom: 16 }}>
          {data.alerts.map((a) => (
            <div key={a.id} className={`admin-alert admin-alert--${a.level}`}>
              <strong>{a.title}</strong>
              <div style={{ marginTop: 4 }}>{a.detail}</div>
            </div>
          ))}
        </section>
      ) : null}

      <section className="admin-kpi-grid" aria-label="KPI">
        <div className="admin-kpi">
          <div className="admin-kpi__label">오늘 방문</div>
          <div className="admin-kpi__value">{fmt(k.visitsToday)}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>어제 {fmt(k.visitsYesterday)}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">최근 7일 방문</div>
          <div className="admin-kpi__value">{fmt(k.visits7d)}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>직전 7일 {fmt(k.visitsPrev7d)}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">오늘 상담 제출</div>
          <div className="admin-kpi__value">{fmt(k.consultSubmitToday)}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi__label">메일 성공 / 실패</div>
          <div className="admin-kpi__value">
            {fmt(k.emailSuccessToday)}/{fmt(k.emailFailedToday)}
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            활성 공지 {k.activeNotices}
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <section className="admin-card">
          <h2 style={{ margin: "0 0 10px", fontSize: 15 }}>오늘 상위 페이지</h2>
          {data.topPathsToday.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: 13 }}>아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>경로</th>
                  <th>방문</th>
                  <th>CTA</th>
                </tr>
              </thead>
              <tbody>
                {data.topPathsToday.map((r) => (
                  <tr key={r.path}>
                    <td>{r.path}</td>
                    <td>{r.visits}</td>
                    <td>{r.cta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card">
          <h2 style={{ margin: "0 0 10px", fontSize: 15 }}>최근 7일 방문</h2>
          {data.visitsByDay.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: 13 }}>아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>방문</th>
                  <th>제출</th>
                </tr>
              </thead>
              <tbody>
                {data.visitsByDay.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{d.visits}</td>
                    <td>{d.submits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card">
          <h2 style={{ margin: "0 0 10px", fontSize: 15 }}>시스템 상태</h2>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
            {data.health.map((h) => (
              <li key={h.id}>
                <strong>{h.label}</strong> [{h.status}] {h.detail}
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <h2 style={{ margin: "0 0 10px", fontSize: 15 }}>최근 관리자 작업</h2>
          {data.recentAudit.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: 13 }}>기록 없음</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
              {data.recentAudit.map((a) => (
                <li key={a.id}>{a.summary}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {!data.storageConfigured ? (
        <p className="admin-alert admin-alert--info" style={{ marginTop: 16 }}>
          ADMIN_KV가 연결되지 않아 통계·공지·메일 로그가 저장되지 않습니다. 숫자
          “—”는 데이터 없음을 의미합니다(가짜 0 아님).
        </p>
      ) : null}
    </div>
  );
}
