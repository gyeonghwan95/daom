"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSection, MetricCard } from "@/components/admin/MetricCard";
import { useAdminOpsSession } from "@/components/admin-console/useAdminOpsSession";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";
import type { HealthCard } from "@/lib/admin-ops/types";

type MonitorData = {
  health?: HealthCard[];
  lastEventAt?: string | null;
  lastEventAgeMinutes?: number | null;
  notifyChannels?: { telegram: boolean; email: boolean };
  generatedAt?: string;
};

export default function AdminSettingsPage() {
  const session = useAdminOpsSession();
  const [monitor, setMonitor] = useState<MonitorData | null>(null);

  useEffect(() => {
    if (!session.authenticated) return;
    let cancelled = false;
    adminFetchJson<MonitorData>("/api/admin/monitoring").then((result) => {
      if (cancelled || !result.ok) return;
      setMonitor(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, [session.authenticated]);

  const channels = monitor?.notifyChannels;
  const localPreview =
    typeof window !== "undefined" &&
    (window.location.port === "8788" || window.location.port === "8787");

  return (
    <div>
      <AdminPageHeader
        title="설정·운영 기준"
        generatedAt={monitor?.generatedAt}
      />
      <p className="admin-prose">
        비밀번호·API 키는 이 화면에서 바꾸지 않습니다. 아래는 지금 운영에 필요한
        연결 상태와 숫자 읽는 법입니다.
      </p>

      <div className="admin-metric-grid">
        <div className="admin-metric">
          <div className="admin-metric__label">역할</div>
          <div className="admin-metric__value">1인</div>
          <div className="admin-metric__note">OWNER_ADMIN · 직원 초대 없음</div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">저장소</div>
          <div className="admin-metric__value">
            {session.storageConfigured ? "연결" : "없음"}
          </div>
          <div className="admin-metric__note">
            {session.storageConfigured
              ? "ADMIN_KV"
              : "바인딩이 없으면 수치가 쌓이지 않습니다"}
          </div>
        </div>
        <MetricCard
          label="전달 채널"
          value={
            channels
              ? Number(channels.telegram) + Number(channels.email)
              : null
          }
          note={
            channels
              ? [
                  channels.telegram ? "Telegram" : null,
                  channels.email ? "Resend" : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "미설정"
              : "확인 중"
          }
        />
        <MetricCard
          label="마지막 수집"
          value={monitor?.lastEventAgeMinutes ?? null}
          suffix={monitor?.lastEventAgeMinutes != null ? "분 전" : undefined}
          note={monitor?.lastEventAt ? "공개 이벤트 기준" : "아직 공개 트래픽 없음"}
        />
      </div>

      <AdminSection title="지금 연결 상태">
        <ul className="admin-health-list">
          {(monitor?.health || []).map((h) => (
            <li key={h.id}>
              <span className={`admin-badge admin-badge--${h.status}`}>
                {h.status}
              </span>
              <strong>{h.label}</strong> {h.detail}
            </li>
          ))}
        </ul>
        {localPreview ? (
          <p className="admin-alert admin-alert--info">
            로컬 Pages 미리보기입니다. 숫자·로그는 이 환경의 KV에만 쌓입니다.
          </p>
        ) : null}
      </AdminSection>

      <AdminSection title="숫자 읽는 법">
        <ul className="admin-checklist">
          <li>페이지뷰는 조회 수입니다. 고유 방문자는 없습니다.</li>
          <li>관리자가 /admin에 들어온 기록, 봇, 빈 User-Agent는 집계에서 빠집니다.</li>
          <li>
            전화·카카오 클릭은 전환이지만 문의 제출은 아닙니다. 실제 통화 여부는
            저장하지 않습니다.
          </li>
          <li>
            특강 페이지 방문은 수임 상담과 따로 봅니다. 강의문의 제출은 메일 화면에
            유형으로 표시됩니다.
          </li>
          <li>“—”는 데이터 없음입니다. 가짜 0이 아닙니다.</li>
        </ul>
      </AdminSection>

      <AdminSection title="로컬에서 숫자를 보려면">
        <p className="admin-prose">
          일반 <code>next dev</code>는 Cloudflare Functions가 없어 관리자 API가
          동작하지 않습니다.
        </p>
        <ul className="admin-checklist">
          <li>
            <code>npm run build</code> 후 <code>npm run preview:cf</code>
          </li>
          <li>
            브라우저에서 <code>http://127.0.0.1:8788/admin</code>
          </li>
          <li>
            시크릿은 Cloudflare Dashboard → Variables and secrets, KV는 ADMIN_KV
            바인딩만 사용합니다.
          </li>
        </ul>
      </AdminSection>

      <AdminSection title="연락처 표시">
        <p className="admin-prose">
          사이트 대표 전화와 네이버 플레이스 번호가 다를 수 있습니다. 관리자
          화면에서 하나로 맞추지 않습니다.
        </p>
      </AdminSection>
    </div>
  );
}
