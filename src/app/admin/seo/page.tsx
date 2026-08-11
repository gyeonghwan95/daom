export default function AdminSeoPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>SEO 상태</h1>
      <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
        Search Console API 미연결 — 순위·클릭 수치를 추정·생성하지 않습니다.
      </p>
      <div className="admin-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>로컬/CI에서 확인</h2>
        <ul style={{ lineHeight: 1.8, fontSize: 14 }}>
          <li>
            <code>npm run seo:audit:priority</code>
          </li>
          <li>
            <code>npm run sitemap:validate</code>
          </li>
          <li>
            진단 문서: <code>docs/seo/GOOGLE_INDEXING_DIAGNOSIS_2026-08.md</code>
          </li>
          <li>
            색인 요청 큐:{" "}
            <code>scripts/output/index-request-urls-2026-08-10.txt</code>
          </li>
        </ul>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          관리자 경로·API는 robots/sitemap에서 제외되어 있습니다.
        </p>
      </div>
    </div>
  );
}
