"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PublicNoticeListItem } from "@/lib/admin-ops/types";
import { formatNoticePublishedAt } from "@/lib/notices/dismiss";

export function PublicNoticeList() {
  const [notices, setNotices] = useState<PublicNoticeListItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/notices/list", { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) throw new Error("fail");
        const json = (await res.json()) as {
          notices?: PublicNoticeListItem[];
        };
        if (!cancelled) setNotices(json.notices || []);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setNotices([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (notices == null) {
    return <p className="body-text text-navy/60">공지사항을 불러오는 중…</p>;
  }

  if (error) {
    return (
      <p className="body-text text-navy/70">
        공지사항을 일시적으로 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (notices.length === 0) {
    return (
      <p className="body-text text-navy/70">
        등록된 공개 공지사항이 없습니다.
      </p>
    );
  }

  return (
    <ul className="public-notice-list">
      {notices.map((n) => (
        <li key={n.id}>
          <Link href={`/공지사항/보기?id=${encodeURIComponent(n.id)}`}>
            <p className="public-notice-list__title">{n.title}</p>
            <p className="public-notice-list__meta">
              게시일 {formatNoticePublishedAt(n.publishedAt)}
              {n.status === "active" ? " · 게시중" : " · 지난 공지"}
            </p>
            {n.summary ? (
              <p className="public-notice-list__summary">{n.summary}</p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
