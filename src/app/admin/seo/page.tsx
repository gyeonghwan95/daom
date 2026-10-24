import { AdminTableWrap } from "@/components/admin/AdminActionGrid";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSection } from "@/components/admin/MetricCard";
import { PageIdentity } from "@/components/admin/PageIdentity";
import summary from "@/generated/admin-seo-summary.json";
import {
  ADMIN_EXTRA_INFLOW_CHAMPIONS,
  ADMIN_PRIORITY_CHAMPIONS,
  ADMIN_SEO_PROGRAMS,
  lectureOwnerRows,
} from "@/lib/admin/seo-ops";

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
const lectureOwners = lectureOwnerRows();

export default function AdminSeoPage() {
  const k = data.kpis;

  return (
    <div>
      <AdminPageHeader title="SEO 상태" />
      <p className="admin-prose">
        대표 URL은 코드 기준입니다. Search Console은 연결되어 있지 않아 순위·클릭을
        추정하지 않습니다. 빌드 audit은 참고용입니다.
      </p>
      <p className="admin-page-header__meta">
        audit 보고서:{" "}
        {new Date(data.generatedAt).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        })}
      </p>

      <div className="admin-metric-grid">
        {ADMIN_SEO_PROGRAMS.map((program) => (
          <div className="admin-metric" key={program.id}>
            <div className="admin-metric__label">{program.label}</div>
            <div className="admin-metric__value">{program.count}</div>
            <div className="admin-metric__note">{program.detail}</div>
          </div>
        ))}
        <div className="admin-metric">
          <div className="admin-metric__label">공개 URL</div>
          <div className="admin-metric__value">{k.publicUrls ?? "—"}</div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">Sitemap URL</div>
          <div className="admin-metric__value">{k.sitemapUrls ?? "—"}</div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">Critical / Warning</div>
          <div className="admin-metric__value">
            {k.critical} / {k.warning}
          </div>
        </div>
        <div className="admin-metric">
          <div className="admin-metric__label">Regression</div>
          <div className="admin-metric__value">
            {k.regressionOk == null ? "—" : k.regressionOk ? "PASS" : "FAIL"}
          </div>
        </div>
      </div>

      <AdminSection title="핵심 검색어 → 대표 URL">
        <p className="admin-prose">
          「부산 법무사」는 홈 <code>/</code>만 가져갑니다.{" "}
          <code>/부산법무사</code>는 선택 안내 페이지입니다. 홈 타이틀은 「부산 법무사
          안윤정」입니다.
        </p>
        <AdminTableWrap>
        <table className="admin-table admin-table--dense">
          <thead>
            <tr>
              <th>검색어</th>
              <th>대표 페이지</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_PRIORITY_CHAMPIONS.map((row) => (
              <tr key={row.query}>
                <td>{row.query}</td>
                <td>
                  <PageIdentity path={row.path} showIntent />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </AdminTableWrap>
      </AdminSection>

      <AdminSection title="추가 유입 검색어">
        <AdminTableWrap>
        <table className="admin-table admin-table--dense">
          <thead>
            <tr>
              <th>검색어</th>
              <th>대표 페이지</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_EXTRA_INFLOW_CHAMPIONS.map((row) => (
              <tr key={row.query}>
                <td>{row.query}</td>
                <td>
                  <PageIdentity path={row.path} showIntent />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </AdminTableWrap>
      </AdminSection>

      <AdminSection title="특강·강의 대표 URL">
        <p className="admin-prose">
          학교·기관 섭외 검색어는 기존 강의 페이지만 사용합니다. 상속·법인 수임
          페이지와 제목·캐러셀을 나누고 있습니다.
        </p>
        <AdminTableWrap>
        <table className="admin-table admin-table--dense">
          <thead>
            <tr>
              <th>페이지</th>
              <th>검색어 수</th>
              <th className="admin-hide-sm">예시</th>
            </tr>
          </thead>
          <tbody>
            {lectureOwners.map((row) => (
              <tr key={row.path}>
                <td>
                  <PageIdentity path={row.path} showIntent />
                </td>
                <td>{row.count}</td>
                <td className="admin-hide-sm">{row.samples.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </AdminTableWrap>
      </AdminSection>

      <AdminSection title="SEO 이슈 (빌드 audit)">
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
                  <ul className="admin-seo-samples">
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
        <AdminSection title="제목·URL 보호 페이지">
          {!data.protectedPages.length ? (
            <p className="admin-empty">보호 목록 없음</p>
          ) : (
            <AdminTableWrap>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>페이지</th>
                  <th className="admin-hide-sm">역할</th>
                  <th>위험</th>
                </tr>
              </thead>
              <tbody>
                {data.protectedPages.map((p) => (
                  <tr key={p.path}>
                    <td>
                      <PageIdentity path={p.path} showIntent />
                    </td>
                    <td className="admin-hide-sm">{p.role || "SEO 보호"}</td>
                    <td>{p.risk || p.level || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </AdminTableWrap>
          )}
          <p className="admin-prose" style={{ marginTop: 8 }}>
            Title/H1/URL은 이 화면에서 바꾸지 않습니다. 변경은 코드 리뷰로만 합니다.
          </p>
        </AdminSection>

        <AdminSection title="Indexability 샘플">
          {!data.indexabilitySample?.length ? (
            <p className="admin-empty">샘플 없음</p>
          ) : (
            <AdminTableWrap>
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
            </AdminTableWrap>
          )}
        </AdminSection>
      </div>

      <AdminSection title="운영 시 확인할 것">
        <ul className="admin-checklist">
          <li>
            네이버 검색에서 핵심 검색어의 대표 URL이 위 표와 같은지 직접 확인합니다.
          </li>
          <li>
            색인 재등록은 공개 페이지 URL만 넣습니다. /admin 은 색인하지 않습니다.
          </li>
          <li>
            사이트 전화(010-4277-1279)와 플레이스 번호는 다를 수 있습니다. 강제로
            맞추지 않습니다.
          </li>
          <li>
            로컬 점검: <code>npm run audit:19-query-ready</code> ·{" "}
            <code>npm run audit:geo-100-ready</code> ·{" "}
            <code>npm run audit:remote-inheritance-ready</code> ·{" "}
            <code>npm run audit:lecture-100-ready</code>
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
