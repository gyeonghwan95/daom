"use client";

import Link from "next/link";
import { useEffect } from "react";

type StaticRedirectProps = {
  targetPath: string;
  message?: string;
};

/**
 * output: export 환경에서 next/navigation redirect() 대신 사용.
 * Cloudflare Pages 등 정적 호스팅에서도 동작합니다.
 */
export function StaticRedirect({
  targetPath,
  message = "잠시 후 자동으로 이동합니다.",
}: StaticRedirectProps) {
  useEffect(() => {
    window.location.replace(targetPath);
  }, [targetPath]);

  return (
    <div className="card-surface mx-auto max-w-lg p-8 text-center">
      <p className="text-base leading-relaxed text-navy/80">{message}</p>
      <Link
        href={targetPath}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-navy px-6 py-2 text-sm font-semibold text-white hover:bg-navy/90"
      >
        바로 이동하기
      </Link>
    </div>
  );
}
