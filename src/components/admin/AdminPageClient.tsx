"use client";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminRefreshPanel } from "@/components/admin/AdminRefreshPanel";
import { useAdminSession } from "@/components/admin/useAdminSession";

type AdminPageClientProps = {
  blogFetchedAt: string | null;
  reviewsFetchedAt: string | null;
};

export function AdminPageClient({
  blogFetchedAt,
  reviewsFetchedAt,
}: AdminPageClientProps) {
  const { loading, authenticated, configured, refresh } = useAdminSession();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    await refresh();
  }

  if (loading) {
    return <p className="text-sm text-navy/60">세션 확인 중…</p>;
  }

  if (!configured) {
    return (
      <div className="rounded-lg border border-navy/10 bg-beige/30 px-4 py-4 text-sm leading-relaxed text-navy/75">
        <p className="font-semibold text-navy">관리자 기능이 비활성화되어 있습니다.</p>
        <p className="mt-2">
          서버 환경 변수{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code>
          {" "}및{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">
            ADMIN_SESSION_SECRET
          </code>
          를 설정한 뒤 Node 서버로 실행해 주세요. 정적 export 배포(
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">
            npm run build:static
          </code>
          )에서는 API를 사용할 수 없습니다.
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div>
        <p className="mb-4 text-sm text-navy/70">
          관리자 비밀번호로 로그인하세요. 15분간 5회 이상 실패하면 일시적으로
          차단됩니다.
        </p>
        <AdminLoginForm onSuccess={refresh} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/70 px-4 py-4">
        <p className="text-sm font-semibold text-emerald-900">로그인됨</p>
        <p className="mt-1 text-sm text-emerald-900/80">
          세션은 8시간 후 만료됩니다. httpOnly·Secure·SameSite=Strict 쿠키로
          보호됩니다.
        </p>
      </div>

      <AdminRefreshPanel
        blogFetchedAt={blogFetchedAt}
        reviewsFetchedAt={reviewsFetchedAt}
      />

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-navy/15 bg-white px-4 text-sm font-medium text-navy transition hover:border-navy/30 hover:bg-beige/40"
      >
        로그아웃
      </button>
    </div>
  );
}
