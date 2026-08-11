"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAdminOpsSession } from "@/components/admin-console/useAdminOpsSession";
import { AdminLoginCard } from "@/components/admin-console/AdminLoginCard";

const NAV = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/analytics", label: "유입·전환" },
  { href: "/admin/pages", label: "페이지" },
  { href: "/admin/email", label: "메일" },
  { href: "/admin/notices", label: "공지" },
  { href: "/admin/monitoring", label: "모니터링" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/settings", label: "설정" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/admin";
  const session = useAdminOpsSession();

  if (session.loading) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__main">
          <p>세션 확인 중…</p>
        </main>
      </div>
    );
  }

  if (!session.configured) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__main" style={{ maxWidth: 560 }}>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>운영 콘솔</h1>
          <p style={{ marginTop: 12, lineHeight: 1.6, color: "#475569" }}>
            Cloudflare Pages에{" "}
            <code>ADMIN_PASSWORD</code>(12자+),{" "}
            <code>ADMIN_SESSION_SECRET</code>(32자+)를 Runtime Secret으로
            설정하고, <code>ADMIN_KV</code> 바인딩을 연결한 뒤 재배포하세요.
            자세한 절차는 <code>docs/admin/ADMIN_SETUP.md</code>를 참고하세요.
          </p>
        </main>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__main" style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>관리자 로그인</h1>
          <p style={{ marginTop: 8, marginBottom: 16, color: "#64748b", fontSize: 14 }}>
            OWNER_ADMIN · 세션은 HttpOnly 쿠키로만 유지됩니다.
          </p>
          <AdminLoginCard onSuccess={() => void session.refresh()} />
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell__nav" aria-label="관리자 메뉴">
        <div className="admin-shell__brand">다옴 운영 콘솔</div>
        <nav>
          {NAV.map((item) => {
            const current =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="admin-shell__link"
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="admin-shell__link"
          style={{ marginTop: 16, width: "100%", textAlign: "left", border: 0, background: "transparent", cursor: "pointer" }}
          onClick={() => void session.logout()}
        >
          로그아웃
        </button>
      </aside>
      <main className="admin-shell__main">{children}</main>
    </div>
  );
}
