"use client";

import { useEffect } from "react";
import Link from "next/link";
import { getContactInfo, getPhoneHref } from "@/lib/contact";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const { phone } = getContactInfo();
  const phoneHref = phone ? getPhoneHref(phone) : "/contact";

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[route-error]", error);
    }
  }, [error]);

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16"
      role="alert"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy/50">
        일시적인 오류
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-navy">
        페이지를 불러오지 못했습니다
      </h1>
      <p className="mt-3 text-[1.015rem] leading-relaxed text-navy/75">
        네트워크 상태나 일시적인 문제로 화면을 표시하지 못했습니다. 작성 중이던
        상담 내용은 브라우저에 남아 있을 수 있으니, 다시 시도해 보거나 전화로
        문의해 주세요.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className="btn-primary min-h-11" onClick={reset}>
          다시 시도
        </button>
        <button
          type="button"
          className="btn-secondary min-h-11"
          onClick={() => window.history.back()}
        >
          이전 페이지
        </button>
        <Link href="/" className="btn-secondary min-h-11 inline-flex items-center">
          홈으로
        </Link>
        <a href={phoneHref} className="btn-secondary min-h-11 inline-flex items-center">
          전화 문의{phone ? ` ${phone}` : ""}
        </a>
      </div>
    </main>
  );
}
