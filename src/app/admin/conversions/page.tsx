"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import { formatKoreanNumber, formatPercent } from "@/lib/admin/url-display";
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
        오늘(KST) 기준 Funnel · 채널별 CTA · 네이버 플레이스 이동 클릭.
        “네이버 예약 완료”는 측정하지 않습니다.
      </p>
      {data.message ? (
        <p className="admin-alert admin-alert--info">{data.message}</p>
      ) : null}

      <AdminSection title="전환 Funnel (오늘)">
        {!f ? (
          <p className="admin-empty">아직 측정되지 않음</p>
        ) : (
          <ol className="admin-funnel admin-funnel--wide">
            <li>
              <span>페이지뷰</span>
              <strong>{formatKoreanNumber(f.pageViews)}</strong>
            </li>
            <li>
              <span>CTA 클릭</span>
              <strong>
                {formatKoreanNumber(f.cta)}
                <small>{formatPercent(f.rates.viewToCta)}</small>
              </strong>
            </li>
            <li>
              <span>상담 시작</span>
              <strong>
                {formatKoreanNumber(f.consultStart)}
                <small>{formatPercent(f.rates.ctaToStart)}</small>
              </strong>
            </li>
            <li>
              <span>문의 제출</span>
              <strong>
                {formatKoreanNumber(f.consultSubmit)}
                <small>{formatPercent(f.rates.startToSubmit)}</small>
              </strong>
            </li>
            <li>
              <span>메일 성공</span>
              <strong>
                {formatKoreanNumber(f.mailSuccess)}
                <small>{formatPercent(f.rates.submitToMail)}</small>
              </strong>
            </li>
          </ol>
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
