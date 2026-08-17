"use client";

import { useEffect } from "react";
import { getContactInfo, getPhoneHref } from "@/lib/contact";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const { phone } = getContactInfo();
  const phoneHref = phone ? getPhoneHref(phone) : "tel:";

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[global-error]", error);
    }
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          fontFamily:
            '"Noto Sans KR", "Apple SD Gothic Neo", Malgun Gothic, sans-serif',
          color: "#1e3a5f",
          background: "#faf8f5",
        }}
      >
        <main
          style={{
            maxWidth: "40rem",
            margin: "0 auto",
            padding: "4rem 1.25rem",
          }}
          role="alert"
        >
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
            일시적인 오류가 발생했습니다
          </h1>
          <p style={{ lineHeight: 1.7, color: "rgba(30,58,95,0.75)" }}>
            화면을 다시 불러오거나 전화로 문의해 주세요. 상담 작성 내용은
            가능한 경우 유지됩니다.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: "44px",
                padding: "0 1.25rem",
                border: 0,
                borderRadius: "0.5rem",
                background: "#1e3a5f",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              다시 시도
            </button>
            {/* global-error는 루트 레이아웃이 내려가 next/link를 쓸 수 없습니다. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                minHeight: "44px",
                padding: "0 1.25rem",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "0.5rem",
                border: "1px solid #d4cfc4",
                background: "#fff",
                color: "#1e3a5f",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              홈으로
            </a>
            {phone ? (
              <a
                href={phoneHref}
                style={{
                  minHeight: "44px",
                  padding: "0 1.25rem",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "0.5rem",
                  border: "1px solid #d4cfc4",
                  background: "#fff",
                  color: "#1e3a5f",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                전화 {phone}
              </a>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
