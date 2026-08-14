"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FunnelChart } from "@/components/admin/charts/FunnelChart";
import { AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { getCtaKindLabel } from "@/lib/admin/activity-labels";
import { formatKoreanNumber } from "@/lib/admin/url-display";
import { adminFetchJson } from "@/lib/admin-ops/admin-fetch";

type ConversionsData = {
  date?: string;
  message?: string;
  funnel?: {
    pageViews: number;
    cta: number;
    consultStart: number;
    consultSubmit: number;
    mailSuccess: number;
    rates: {
      viewToCta: number | null;
      ctaToStart: number | null;
      startToSubmit: number | null;
      submitToMail: number | null;
    };
  } | null;
  last7?: {
    pageViews: number;
    cta: number;
    consultSubmit: number;
    naverPlace: number;
  };
  channels?: Array<{
    channel: string;
    clicks: number;
    topPage: string | null;
  }>;
  topCtaPages?: Array<{
    path: string;
    visits: number;
    cta: number;
    phone: number;
    kakao: number;
    naver: number;
    consultSubmit: number;
    naverPlace: number;
  }>;
  naverPlaceByPlacement?: Array<{ placement: string; count: number }>;
  naverPlaceTopPaths?: Array<{
    path: string;
    visits: number;
    naverPlace: number;
    ctr: number | null;
  }>;
  destinations?: Array<{
    kind: string;
    dest: string;
    clicks: number;
  }>;
};

export default function AdminConversionsPage() {
  const [data, setData] = useState<ConversionsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminFetchJson<ConversionsData>("/api/admin/conversions").then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setData(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error && !data) {
    return (
      <div>
        <AdminPageHeader title="전환 분석" />
        <p className="admin-alert admin-alert--warning">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <AdminPageHeader title="전환 분석" />
        <p>불러오는 중…</p>
      </div>
    );
  }

  const f = data.funnel;

  return (
    <div>
      <AdminPageHeader title="전환 분석" />
      <p className="admin-prose">
        버튼을 눌렀을 때 이동한 주소(전화·카카오·문의 페이지 등)를 보여 줍니다.
        이름·전화번호 같은 개인정보는 저장하지 않습니다. 네이버 예약 완료는 측정하지 않습니다.
      </p>
      {data.message ? (
        <p className="admin-alert admin-alert--info">{data.message}</p>
      ) : null}

      <AdminSection title="전환 Funnel (오늘)">
        {!f ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <FunnelChart
            steps={[
              { label: "페이지뷰", value: f.pageViews },
              { label: "CTA 클릭", value: f.cta, rate: f.rates.viewToCta },
              { label: "상담 시작", value: f.consultStart, rate: f.rates.ctaToStart },
              { label: "문의 제출", value: f.consultSubmit, rate: f.rates.startToSubmit },
              { label: "메일 성공", value: f.mailSuccess, rate: f.rates.submitToMail },
            ]}
          />
        )}
      </AdminSection>

      {data.last7 ? (
        <p className="admin-summary">
          최근 7일 · 페이지뷰 {formatKoreanNumber(data.last7.pageViews)} · CTA{" "}
          {formatKoreanNumber(data.last7.cta)} · 문의{" "}
          {formatKoreanNumber(data.last7.consultSubmit)} · 네이버 플레이스{" "}
          {formatKoreanNumber(data.last7.naverPlace)}
        </p>
      ) : null}

      <AdminSection title="클릭한 버튼 → 이동한 주소 (오늘)">
        {!data.destinations?.length ? (
          <p className="admin-empty">
            아직 목적지 기록이 없습니다. 이후 클릭부터 버튼 종류와 이동 URL이 쌓입니다.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>버튼</th>
                <th>이동 URL</th>
                <th>클릭</th>
              </tr>
            </thead>
            <tbody>
              {data.destinations.map((r) => (
                <tr key={`${r.kind}|${r.dest}`}>
                  <td>{getCtaKindLabel(r.kind)}</td>
                  <td>
                    <code className="admin-dest">{r.dest}</code>
                  </td>
                  <td>{r.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminSection>

      <div className="admin-two-col">
        <AdminSection title="채널별 CTA (오늘)">
          {!data.channels?.length ? (
            <p className="admin-empty">아직 측정되지 않음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>채널</th>
                  <th>클릭</th>
                  <th>Top page</th>
                </tr>
              </thead>
              <tbody>
                {data.channels.map((c) => (
                  <tr key={c.channel}>
                    <td>{c.channel}</td>
                    <td>{c.clicks}</td>
                    <td>
                      {c.topPage ? <PageIdentity path={c.topPage} /> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>

        <AdminSection title="네이버 플레이스 Placement">
          {!data.naverPlaceByPlacement?.length ? (
            <p className="admin-empty">선택 기간에 네이버 플레이스 클릭이 없습니다.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>위치</th>
                  <th>클릭</th>
                </tr>
              </thead>
              <tbody>
                {data.naverPlaceByPlacement.map((r) => (
                  <tr key={r.placement}>
                    <td>{r.placement}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>
      </div>

      <AdminSection title="전환이 발생한 페이지 (오늘)">
        {!data.topCtaPages?.length ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>페이지</th>
                <th>뷰</th>
                <th>CTA</th>
                <th>전화</th>
                <th>카카오</th>
                <th>문의</th>
                <th>네이버</th>
              </tr>
            </thead>
            <tbody>
              {data.topCtaPages.map((r) => (
                <tr key={r.path}>
                  <td>
                    <PageIdentity path={r.path} />
                  </td>
                  <td>{r.visits}</td>
                  <td>{r.cta}</td>
                  <td>{r.phone}</td>
                  <td>{r.kakao}</td>
                  <td>{r.consultSubmit}</td>
                  <td>{r.naverPlace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminSection>
    </div>
  );
}
