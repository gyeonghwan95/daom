"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PublicFloatingNotice } from "@/lib/admin-ops/types";
import { formatNoticePublishedAt } from "@/lib/notices/dismiss";

export function PublicNoticeDetail() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [notice, setNotice] = useState<PublicFloatingNotice | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!id) {
      setState("missing");
      return;
    }
    let cancelled = false;
    fetch(`/api/notices/item?id=${encodeURIComponent(id)}`, {
      credentials: "same-origin",
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setState("missing");
          return;
        }
        if (!res.ok) throw new Error("fail");
        const json = (await res.json()) as { notice?: PublicFloatingNotice };
        if (!json.notice) {
          setState("missing");
          return;
        }
        setNotice(json.notice);
        setState("ok");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state === "loading") {
    return <p className="body-text text-navy/60">불러오는 중…</p>;
  }

  if (state === "missing") {
    return (
      <div>
        <p className="body-text text-navy/70">
          요청하신 공지를 찾을 수 없거나 공개되지 않은 공지입니다.
        </p>
        <Link href="/공지사항" className="mt-4 inline-flex min-h-11 items-center text-navy underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (state === "error" || !notice) {
    return (
      <div>
        <p className="body-text text-navy/70">
          공지를 일시적으로 불러오지 못했습니다.
        </p>
        <Link href="/공지사항" className="mt-4 inline-flex min-h-11 items-center text-navy underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <article>
      <h2 className="section-heading">{notice.title}</h2>
      <p className="public-notice-detail__date">
        게시일 {formatNoticePublishedAt(notice.publishedAt)}
      </p>
      <div className="public-notice-detail__body">{notice.message}</div>
      {notice.ctaLabel && notice.ctaUrl ? (
        <p className="mt-6">
          <Link
            href={notice.ctaUrl}
            className="inline-flex min-h-11 items-center rounded-md bg-navy px-4 text-sm font-semibold text-white"
          >
            {notice.ctaLabel}
          </Link>
        </p>
      ) : null}
      <p className="mt-8">
        <Link
          href="/공지사항"
          className="inline-flex min-h-11 items-center text-navy underline"
        >
          목록으로 돌아가기
        </Link>
      </p>
    </article>
  );
}
