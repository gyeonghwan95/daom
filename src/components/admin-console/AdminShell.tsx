"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAdminOpsSession } from "@/components/admin-console/useAdminOpsSession";
import { AdminLoginCard } from "@/components/admin-console/AdminLoginCard";
import { AdminLoading } from "@/components/admin/AdminState";

const NAV_GROUPS = [
  {
    label: "성과",
    items: [
      { href: "/admin", label: "대시보드", short: "홈" },
      { href: "/admin/analytics", label: "유입 분석", short: "유입" },
      { href: "/admin/pages", label: "페이지", short: "페이지" },
      { href: "/admin/conversions", label: "전환", short: "전환" },
    ],
  },
  {
    label: "운영",
    items: [
      { href: "/admin/email", label: "메일", short: "메일" },
      { href: "/admin/notices", label: "공지", short: "공지" },
    ],
  },
  {
    label: "시스템",
    items: [
      { href: "/admin/monitoring", label: "모니터링", short: "상태" },
      { href: "/admin/seo", label: "SEO", short: "SEO" },
      { href: "/admin/settings", label: "설정", short: "설정" },
    ],
  },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/admin";
  const session = useAdminOpsSession();

  if (session.loading) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__main">
          <AdminLoading label="세션 확인 중" />
        </main>
      </div>
    );
  }

  if (!session.configured) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__main admin-shell__main--narrow">
          <p className="admin-login__brand">다옴 운영센터</p>
          <h1 className="admin-page-header__title">관리자 설정이 필요합니다</h1>
          <p className="admin-prose">
            Cloudflare Pages에 <code>ADMIN_PASSWORD</code>(12자+),{" "}
            <code>ADMIN_SESSION_SECRET</code>(32자+)를 Runtime Secret으로 설정하고,{" "}
            <code>ADMIN_KV</code> 바인딩을 연결한 뒤 재배포하세요.
          </p>
        </main>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__main admin-shell__main--narrow">
          <div className="admin-login">
            <p className="admin-login__brand">다옴 운영센터</p>
            <h1 className="admin-page-header__title">관리자 로그인</h1>
            <p className="admin-prose">
              OWNER_ADMIN · 세션 8시간 · 비밀번호는 서버에만 있습니다. 15분 동안 5회
              실패하면 잠시 막힙니다.
            </p>
            <AdminLoginCard onSuccess={() => void session.refresh()} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <a href="#admin-main" className="admin-skip">
        본문으로 건너뛰기
      </a>
      <aside className="admin-shell__nav" aria-label="관리자 메뉴">
        <div className="admin-shell__nav-top">
          <div className="admin-shell__brand">
            다옴 운영센터
            <span>페이지뷰 기준 · 고유방문자 없음</span>
            <strong
              className={
                session.storageConfigured
                  ? "admin-shell__kv admin-shell__kv--ok"
                  : "admin-shell__kv admin-shell__kv--off"
              }
            >
              {session.storageConfigured ? "KV 연결" : "KV 없음"}
            </strong>
          </div>
          <button
            type="button"
            className="admin-shell__logout"
            onClick={() => void session.logout()}
          >
            로그아웃
          </button>
        </div>
        <nav>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="admin-shell__group">
              <p className="admin-shell__group-label">{group.label}</p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-shell__link"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  <span className="admin-shell__link-full">{item.label}</span>
                  <span className="admin-shell__link-short">{item.short}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="admin-shell__workspace">
        <main id="admin-main" className="admin-shell__main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
