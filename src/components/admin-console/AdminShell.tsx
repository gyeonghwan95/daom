"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAdminOpsSession } from "@/components/admin-console/useAdminOpsSession";
import { AdminLoginCard } from "@/components/admin-console/AdminLoginCard";

const NAV = [
  { href: "/admin", label: "대시보드", short: "홈" },
  { href: "/admin/analytics", label: "유입 분석", short: "유입" },
  { href: "/admin/pages", label: "페이지", short: "페이지" },
  { href: "/admin/conversions", label: "전환", short: "전환" },
  { href: "/admin/email", label: "메일", short: "메일" },
  { href: "/admin/notices", label: "공지", short: "공지" },
  { href: "/admin/monitoring", label: "모니터링", short: "상태" },
  { href: "/admin/seo", label: "SEO", short: "SEO" },
  { href: "/admin/settings", label: "설정", short: "설정" },
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
        <main className="admin-shell__main admin-shell__main--narrow">
          <h1 className="admin-page-header__title">운영 관제센터</h1>
          <p className="admin-prose">
            Cloudflare Pages에 <code>ADMIN_PASSWORD</code>(12자+),{" "}
            <code>ADMIN_SESSION_SECRET</code>(32자+)를 Runtime Secret으로
            설정하고, <code>ADMIN_KV</code> 바인딩을 연결한 뒤 재배포하세요.
          </p>
        </main>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__main admin-shell__main--narrow">
          <h1 className="admin-page-header__title">관리자 로그인</h1>
          <p className="admin-prose">OWNER_ADMIN · HttpOnly 세션</p>
          <AdminLoginCard onSuccess={() => void session.refresh()} />
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell__nav" aria-label="관리자 메뉴">
        <div className="admin-shell__brand">다옴 운영센터</div>
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
                <span className="admin-shell__link-full">{item.label}</span>
                <span className="admin-shell__link-short">{item.short}</span>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="admin-shell__logout"
          onClick={() => void session.logout()}
        >
          로그아웃
        </button>
      </aside>
      <div className="admin-shell__workspace">
        <main className="admin-shell__main">{children}</main>
      </div>
    </div>
  );
}
