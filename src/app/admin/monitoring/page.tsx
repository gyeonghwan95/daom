"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSection, MetricCard } from "@/components/admin/MetricCard";
import type { HealthCard } from "@/lib/admin-ops/types";

type AlertRow = {
  id: string;
  level: string;
  title: string;
  detail: string;
  href?: string;
};

type IngestRow = {
  stored: number;
  skippedAdminSession: number;
  skippedDedupe: number;
  skippedAdminPath: number;
  skippedEmptyUa: number;
  skippedNoKv: number;
  badRequest: number;
  invalidType: number;
  rateLimited: number;
  storeError: number;
  lastAt?: string | null;
  lastReason?: string | null;
};

type MonitorKpis = {
  visitsToday?: number | null;
  sessionsToday?: number | null;
  ctaToday?: number | null;
  consultSubmitToday?: number | null;
  searchUsedToday?: number | null;
  toolUsedToday?: number | null;
  diagnosisCompleteToday?: number | null;
  emailSuccessToday?: number | null;
  emailFailedToday?: number | null;
  naverPlaceToday?: number | null;
};

type MonitorData = {
  health: HealthCard[];
  alerts: AlertRow[];
  generatedAt?: string;
  lastEventAt?: string | null;
  lastEventAgeMinutes?: number | null;
  ingest?: IngestRow | null;
  notice?: { impression: number; click: number; dismiss: number } | null;
  notifyChannels?: { telegram: boolean; email: boolean };
  kpis?: MonitorKpis;
};

function formatAge(minutes: number | null | undefined) {
  if (minutes == null) return "아직 없음";
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}시간 전`;
  return `${Math.round(hours / 24)}일 전`;
}

export default function AdminMonitoringPage() {
  const [data, setData] = useState<MonitorData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/monitoring", { credentials: "include" })
      .then(async (res) => {
        const json = (await res.json()) as { data?: MonitorData };
        if (cancelled) return;
        setData({
          health: json.data?.health || [],
          alerts: json.data?.alerts || [],
          generatedAt: json.data?.generatedAt,
          lastEventAt: json.data?.lastEventAt,
          lastEventAgeMinutes: json.data?.lastEventAgeMinutes,
          ingest: json.data?.ingest,
          notice: json.data?.notice,
          notifyChannels: json.data?.notifyChannels,
          kpis: json.data?.kpis,
        });
      })
      .catch(() => {
        /* keep empty */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const k = data?.kpis;
  const ingest = data?.ingest;
  const skipTotal =
    (ingest?.skippedAdminSession || 0) +
    (ingest?.skippedDedupe || 0) +
    (ingest?.skippedAdminPath || 0) +
    (ingest?.skippedEmptyUa || 0);

  return (
    <div>
      <AdminPageHeader title="모니터링" generatedAt={data?.generatedAt} />
      <p className="admin-prose">
        수집이 실제로 들어오는지, 문의가 전달되는지, 저장소가 살아 있는지만
        보여 줍니다. 가짜 수치는 만들지 않습니다.
      </p>

      <AdminSection title="확인할 사항">
        {!data?.alerts?.length ? (
          <p className="admin-empty">현재 긴급하게 확인할 항목이 없습니다.</p>
        ) : (
          data.alerts.map((a) => (
            <div key={a.id} className={`admin-alert admin-alert--${a.level}`}>
              <strong>{a.title}</strong>
              <div>{a.detail}</div>
            </div>
          ))
        )}
      </AdminSection>

      <AdminSection title="시스템 상태">
        <ul className="admin-health-grid">
          {(data?.health || []).map((h) => (
            <li key={h.id} className="admin-health-card">
              <div className="admin-health-card__top">
                <span className="admin-health-card__label">{h.label}</span>
                <span className={`admin-badge admin-badge--${h.status}`}>
                  {h.status}
                </span>
              </div>
              <div className="admin-health-card__detail">{h.detail}</div>
            </li>
          ))}
        </ul>
      </AdminSection>

      <AdminSection title="오늘 수집">
        <div className="admin-metric-grid" aria-label="오늘 수집">
          <MetricCard
            label="마지막 이벤트"
            value={data?.lastEventAgeMinutes ?? null}
            suffix={data?.lastEventAgeMinutes != null ? "분" : undefined}
            note={formatAge(data?.lastEventAgeMinutes)}
          />
          <MetricCard label="페이지뷰" value={k?.visitsToday ?? null} />
          <MetricCard label="세션" value={k?.sessionsToday ?? null} />
          <MetricCard label="CTA" value={k?.ctaToday ?? null} />
          <MetricCard label="문의 제출" value={k?.consultSubmitToday ?? null} />
          <MetricCard
            label="저장됨"
            value={ingest?.stored ?? null}
            note="봇·관리자 제외"
          />
          <MetricCard
            label="정상 스킵"
            value={skipTotal}
            note="관리자·중복·빈 UA"
          />
          <MetricCard
            label="저장 실패"
            value={ingest?.storeError ?? null}
            note={ingest?.lastReason ? `최근 ${ingest.lastReason}` : "KV 기록 오류"}
          />
          <MetricCard
            label="메일 성공/실패"
            value={k?.emailSuccessToday ?? null}
            note={`실패 ${k?.emailFailedToday ?? "—"}건`}
          />
          <MetricCard
            label="네이버 플레이스"
            value={k?.naverPlaceToday ?? null}
          />
        </div>
      </AdminSection>

      <AdminSection title="사이트 이용">
        <div className="admin-metric-grid" aria-label="사이트 이용">
          <MetricCard label="검색" value={k?.searchUsedToday ?? null} />
          <MetricCard label="계산기" value={k?.toolUsedToday ?? null} />
          <MetricCard
            label="자가진단"
            value={k?.diagnosisCompleteToday ?? null}
          />
          <MetricCard
            label="공지 노출"
            value={data?.notice?.impression ?? null}
            note={`클릭 ${data?.notice?.click ?? "—"} · 닫기 ${data?.notice?.dismiss ?? "—"}`}
          />
          <MetricCard
            label="전달 채널"
            value={
              data?.notifyChannels
                ? Number(data.notifyChannels.telegram) +
                  Number(data.notifyChannels.email)
                : null
            }
            note={
              data?.notifyChannels
                ? [
                    data.notifyChannels.telegram ? "Telegram" : null,
                    data.notifyChannels.email ? "Resend" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "미설정"
                : "확인 중"
            }
          />
        </div>
      </AdminSection>

      <AdminSection title="자동화 (참고)">
        <div className="admin-panel" style={{ padding: 0, border: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>작업</th>
                <th>실행 위치</th>
                <th>관리자 수동 실행</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SEO audit / regression</td>
                <td>CI / prebuild</td>
                <td>금지 (로컬 npm만)</td>
              </tr>
              <tr>
                <td>Sitemap 생성</td>
                <td>prebuild</td>
                <td>금지</td>
              </tr>
              <tr>
                <td>IndexNow</td>
                <td>GitHub Actions</td>
                <td>금지</td>
              </tr>
              <tr>
                <td>입찰 브리핑</td>
                <td>GitHub Actions</td>
                <td>금지</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminSection>
    </div>
  );
}
