import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>설정·정책</h1>
      <div className="admin-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>역할</h2>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>
          OWNER_ADMIN 1인. 직원/RBAC/팀 초대 기능은 없습니다.
        </p>
      </div>
      <div className="admin-card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>문서</h2>
        <ul style={{ fontSize: 14, lineHeight: 1.8 }}>
          <li>
            <Link href="/admin">대시보드</Link>
          </li>
          <li>
            저장소 문서: <code>docs/admin/ADMIN_SETUP.md</code>
          </li>
          <li>
            운영정책: <code>docs/admin/ADMIN_POLICY.md</code>
          </li>
          <li>
            보안 체크리스트: <code>docs/admin/ADMIN_SECURITY_CHECKLIST.md</code>
          </li>
        </ul>
      </div>
      <div className="admin-card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 15, marginTop: 0 }}>시크릿</h2>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
          API 키·SMTP·DB 비밀번호는 이 화면에서 수정하지 않습니다. Cloudflare
          Dashboard → Variables and secrets에서만 관리하세요.
        </p>
      </div>
    </div>
  );
}
