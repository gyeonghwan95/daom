"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminTableWrap } from "@/components/admin/AdminActionGrid";
import { AdminFilterChips } from "@/components/admin/AdminIntentMix";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { formatDeviceSplit } from "@/lib/admin/device-label";
import {
  buildLeadPages,
  buildPageWatchlist,
  buildRisingPages,
} from "@/lib/admin/ops-insights";
import {
  ADMIN_INTENT_LABEL,
  classifyAdminPath,
  mixByIntent,
  type AdminPathIntent,
} from "@/lib/admin/path-intent";
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
  mobileToday?: number;
  desktopToday?: number;
  mobile30d?: number;
  desktop30d?: number;
};

const TREND_LABEL: Record<string, string> = {
  up: "상승",
  down: "감소",
  stable: "안정",
  low_data: "데이터 부족",
};

type IntentFilter = AdminPathIntent | "all";

export default function AdminPagesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState<IntentFilter>("all");

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

  const intentMix = useMemo(
    () =>
      mixByIntent(
        rows.map((row) => ({ path: row.path, visits: row.visits30d })),
      ),
    [rows],
  );

  const watchlist = useMemo(() => buildPageWatchlist(rows), [rows]);
  const rising = useMemo(() => buildRisingPages(rows), [rows]);
  const leads = useMemo(() => buildLeadPages(rows), [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (intent !== "all" && classifyAdminPath(r.path) !== intent) return false;
      if (!q) return true;
      const title = getPageDisplayName(r.path)?.toLowerCase() || "";
      const label = ADMIN_INTENT_LABEL[classifyAdminPath(r.path)];
      return (
        r.path.toLowerCase().includes(q) ||
        title.includes(q) ||
        label.includes(q)
      );
    });
  }, [rows, query, intent]);

  const todayViews = rows.reduce((sum, row) => sum + (row.visitsToday || 0), 0);
  const todayLeads = rows.reduce((sum, row) => sum + (row.consultSubmit || 0), 0);

  return (
    <div>
      <AdminPageHeader title="페이지 성과" />
      <p className="admin-prose">
        오늘 · 7일 · 30일(KST) 페이지뷰. 전환율은 문의 제출 ÷ 페이지뷰입니다.
        특강 페이지는 전화 상담 전환이 낮아도 정상일 수 있습니다.
      </p>
      {message ? <p className="admin-alert admin-alert--info">{message}</p> : null}

      <p className="admin-summary">
        오늘 페이지뷰 {todayViews.toLocaleString("ko-KR")} · 문의 제출{" "}
        {todayLeads.toLocaleString("ko-KR")} · 측정 페이지 {rows.length}개
        {rising.length ? ` · 상승 ${rising.length}` : ""}
      </p>

      <div className="admin-two-col">
        <AdminSection title="오늘 상승 중인 페이지">
          {!rising.length ? (
            <p className="admin-empty">오늘은 상승 신호가 있는 페이지가 없습니다.</p>
          ) : (
            <AdminTableWrap>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>페이지</th>
                    <th>오늘</th>
                    <th className="admin-hide-sm">7일</th>
                    <th>문의</th>
                  </tr>
                </thead>
                <tbody>
                  {rising.map((row) => (
                    <tr key={row.path}>
                      <td>
                        <PageIdentity path={row.path} showIntent />
                      </td>
                      <td>{row.visitsToday}</td>
                      <td className="admin-hide-sm">{row.visits7d}</td>
                      <td>{row.consultSubmit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrap>
          )}
        </AdminSection>
        <AdminSection title="문의가 나온 페이지 (30일)">
          {!leads.length ? (
            <p className="admin-empty">아직 문의 제출이 없습니다.</p>
          ) : (
            <AdminTableWrap>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>페이지</th>
                    <th>문의</th>
                    <th>CTA</th>
                    <th>전환율</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((row) => (
                    <tr key={row.path}>
                      <td>
                        <PageIdentity path={row.path} showIntent />
                      </td>
                      <td>{row.consultSubmit}</td>
                      <td>{row.cta}</td>
                      <td>{row.conversionRate ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrap>
          )}
        </AdminSection>
      </div>

      {watchlist.length ? (
        <AdminSection title="방문은 있는데 문의가 없는 페이지 (30일)">
          <p className="admin-prose">
            특강·계산기는 제외했습니다. 상속·법인·지역 페이지에서 전화·카카오 클릭을 같이 보세요.
          </p>
          <AdminTableWrap>
          <table className="admin-table">
            <thead>
              <tr>
                <th>페이지</th>
                <th>30일 뷰</th>
                <th>CTA</th>
                <th>상황</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((row) => (
                <tr key={row.path}>
                  <td>
                    <PageIdentity path={row.path} showIntent />
                  </td>
                  <td>{row.visits30d}</td>
                  <td>{row.cta}</td>
                  <td>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </AdminTableWrap>
        </AdminSection>
      ) : null}

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-input"
          placeholder="페이지 제목·URL·의도 검색 (예: 상속, 특강)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="페이지 검색"
        />
        <AdminFilterChips
          value={intent}
          onChange={setIntent}
          options={intentMix.map((row) => ({
            id: row.intent,
            label: row.label,
            count: row.visits,
          }))}
        />
      </div>

      <div className="admin-panel">
        {filtered.length === 0 ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <AdminTableWrap>
          <table className="admin-table admin-table--dense">
            <thead>
              <tr>
                <th>페이지</th>
                <th>오늘</th>
                <th className="admin-hide-sm">오늘 기기</th>
                <th className="admin-hide-md">7일</th>
                <th>30일</th>
                <th className="admin-hide-sm">30일 기기</th>
                <th>상태</th>
                <th className="admin-hide-md">CTA</th>
                <th>문의</th>
                <th className="admin-hide-sm">네이버</th>
                <th>전환율</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.path}>
                  <td>
                    <PageIdentity path={r.path} showIntent />
                  </td>
                  <td>{r.visitsToday}</td>
                  <td className="admin-hide-sm">{formatDeviceSplit(r.mobileToday, r.desktopToday)}</td>
                  <td className="admin-hide-md">{r.visits7d}</td>
                  <td>{r.visits30d}</td>
                  <td className="admin-hide-sm">{formatDeviceSplit(r.mobile30d, r.desktop30d)}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${r.trend}`}>
                      {TREND_LABEL[r.trend] || r.trend}
                    </span>
                  </td>
                  <td className="admin-hide-md">{r.cta}</td>
                  <td>{r.consultSubmit}</td>
                  <td className="admin-hide-sm">{r.naverPlace}</td>
                  <td>{r.conversionRate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </AdminTableWrap>
        )}
      </div>
    </div>
  );
}
