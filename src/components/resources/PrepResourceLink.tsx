"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type PrepResourceLinkProps = {
  /** 업무 글 경로 → 준비자료 { href, title } */
  byPath: Record<string, { href: string; title: string }>;
};

function normalize(pathname: string): string {
  try {
    return decodeURIComponent(pathname).replace(/\/$/, "") || "/";
  } catch {
    return pathname;
  }
}

/** 관련 업무 글 끝 신뢰 블록에 붙는 '의뢰 전 준비자료' 한 줄(해당 글에만 표시) */
export function PrepResourceLink({ byPath }: PrepResourceLinkProps) {
  const item = byPath[normalize(usePathname() ?? "/")];
  if (!item) return null;
  return (
    <p className="mt-4 rounded-xl border border-navy/15 bg-white px-4 py-3 text-[0.95rem] leading-relaxed text-navy">
      <span className="font-semibold text-navy-light">의뢰 전 준비자료 · </span>
      <Link href={item.href} className="font-semibold underline underline-offset-2" data-cta="prep-resource">
        {item.title}
      </Link>
      <span className="text-navy/60"> — 가족·담당자와 공유할 PNG·PDF</span>
    </p>
  );
}
