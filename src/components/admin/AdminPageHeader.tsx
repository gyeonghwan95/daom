"use client";

import type { ReactNode } from "react";

type Props = {
  title: string;
  generatedAt?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  children?: ReactNode;
};

export function AdminPageHeader({
  title,
  generatedAt,
  onRefresh,
  refreshing,
  children,
}: Props) {
  return (
    <header className="admin-page-header">
      <div>
        <h1 className="admin-page-header__title">{title}</h1>
        {generatedAt ? (
          <p className="admin-page-header__meta">
            Asia/Seoul · 마지막 갱신{" "}
            {new Date(generatedAt).toLocaleString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        ) : null}
      </div>
      <div className="admin-page-header__actions">
        {children}
        {onRefresh ? (
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? "갱신 중…" : "새로고침"}
          </button>
        ) : null}
      </div>
    </header>
  );
}
