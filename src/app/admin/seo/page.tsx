"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import summary from "@/generated/admin-seo-summary.json";

type SeoSummary = {
  generatedAt: string;
  searchConsoleConnected: boolean;
  kpis: {
    publicUrls: number | null;
    sitemapUrls: number | null;
    critical: number;
    warning: number;
    info: number;
    protectedPageCount: number;
    regressionOk: boolean | null;
  };
  issues: Array<{
    id: string;
    severity: "critical" | "warning" | "info";
    title: string;
    detail: string;
    count: number;
    samples?: string[];
  }>;
  protectedPages: Array<{
    path: string;
    level?: string;
    role?: string;
    risk?: string;
  }>;
  indexabilitySample: Array<{
    path: string;
    status: string;
    inSitemap?: boolean;
  }>;
  notes: string[];
};

const data = summary as SeoSummary;

export default function AdminSeoPage() {
  const k = data.kpis;

  return (
    <div>
      <AdminPageHeader title="SEO 상태" />
      <p className="admin-prose">
        빌드 시점 audit 보고서 기준입니다. Search Console API 미연결 — 순위·클릭
        수치를 추정하지 않습니다.
      </p>
      <p className="admin-page-header__meta">
        보고서 생성:{" "}
        {new Date(data.generatedAt).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        })}
      </p>

      <div className="admin-metric-grid">
        <div className="admin-metric">
          <div className="admin-metric__label">공개 URL</div>
          <div className="admin-metric__value">
            {k.publicUrls ?? "—"}
          </div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">Sitemap URL</div>
          <div className="admin-metric__value">
            {k.sitemapUrls ?? "—"}
          </div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">Critical</div>
          <div className="admin-metric__value">{k.critical}</div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">Warning</div>
          <div className="admin-metric__value">{k.warning}</div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">보호 페이지</div>
          <div className="admin-metric__value">{k.protectedPageCount}</div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">Regression</div>
          <div className="admin-metric__value">
            {k.regressionOk == null ? "—" : k.regressionOk ? "PASS" : "FAIL"}
          </div>
        </div>
      </div>

      <AdminSection title="SEO 이슈">
        {data.issues.length === 0 ? (
          <p className="admin-empty">
            현재 audit 보고서 기준 긴급 SEO 이슈가 없습니다.
          </p>
        ) : (
          <ul className="admin-seo-issues">
            {data.issues.map((issue) => (
              <li
                key={issue.id}
                className={`admin-alert admin-alert--${
                  issue.severity === "critical"
                    ? "critical"
                    : issue.severity === "warning"
                      ? "warning"
                      : "info"
                }`}
              >
                <strong>{issue.title}</strong>
                <div>{issue.detail}</div>
                {issue.samples?.length ? (
                  <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 12 }}>
                    {issue.samples.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </AdminSection>

      <div className="admin-two-col">
        <AdminSection title="SEO 보호 페이지">
          {!data.protectedPages.length ? (
            <p className="admin-empty">보호 목록 없음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>페이지</th>
                  <th>등급</th>
                  <th>위험</th>
                </tr>
              </thead>
              <tbody>
                {data.protectedPages.map((p) => (
                  <tr key={p.path}>
                    <td>
                      <PageIdentity path={p.path} />
                      {p.role ? (
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {p.role}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--stable">
                        SEO 보호
                      </span>
                    </td>
                    <td>{p.risk || p.level || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="admin-prose" style={{ marginTop: 8 }}>
            Title/H1/URL 변경 제한 — 관리자가 수동으로 신중히 처리하세요.
          </p>
        </AdminSection>

        <AdminSection title="Indexability 샘플">
          {!data.indexabilitySample?.length ? (
            <p className="admin-empty">샘플 없음</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>페이지</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {data.indexabilitySample.map((r) => (
                  <tr key={r.path}>
                    <td>
                      <PageIdentity path={r.path} />
                    </td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminSection>
      </div>

      <AdminSection title="부산 법무사 Recovery">
        <p className="admin-prose">
          Champion: <code>/부산법무사</code> (부산 법무사, 부산 법무사 추천).
          Title/H1/canonical 자동 변경 금지. Known-good commit: <code>e064454</code>.
          순위 수치는 추정하지 않습니다. Search Advisor 수집·색인은 관리자가 수동
          확인하세요.
        </p>
        <ul style={{ lineHeight: 1.8, fontSize: 14 }}>
          <li>Last public SEO change class: duplicate TOC DOM (Phase 1 SAFE)</li>
          <li>
            Ranking observation: <code>data/seo/ranking-observations.json</code> —
            「부산 법무사」 노출 URL은 미확정(null)
          </li>
          <li>
            Rollback: Phase 1은{" "}
            <code>src/components/readability/PageTableOfContents.tsx</code> 만
          </li>
          <li>
            <code>npm run seo:audit:busan</code> ·{" "}
            <code>npm run seo:snapshot:busan-lawyer</code>
          </li>
        </ul>
      </AdminSection>

      <AdminSection title="로컬/CI 재실행">
        <ul style={{ lineHeight: 1.8, fontSize: 14, margin: 0 }}>
          <li>
            <code>npm run seo:audit:priority</code>
          </li>
          <li>
            <code>npm run seo:regression</code>
          </li>
          <li>
            <code>npm run sitemap:validate</code>
          </li>
        </ul>
        {data.notes.map((n) => (
          <p key={n} className="admin-prose">
            {n}
          </p>
        ))}
      </AdminSection>
    </div>
  );
}
