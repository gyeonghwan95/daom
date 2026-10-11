"use client";

import Link from "next/link";
import { useState } from "react";
import { trackCTA } from "@/lib/analytics/track-cta";
import { KakaoIcon, NaverIcon } from "@/components/consultation/ConsultationIcons";

type ResourceInquiryProps = {
  slug: string;
  button: string;
  intent: string;
  message: string;
  facts: string[];
  /** 복사 양식 첫 줄에 넣을 자료 이름 */
  topic: string;
  kakaoHref: string;
  naverTalkHref: string;
  /** 본문 중간(mid)·하단(end) — 집계 구분용 */
  placement: "mid" | "end";
};

/**
 * 자료별 목적형 문의 영역. 기존 문의 폼·카카오톡·네이버 톡톡을 그대로 쓴다.
 * 문의 문구 복사는 독자가 직접 붙여넣도록 돕는 것이며, 전송된 것으로 표시하지 않는다.
 */
export function ResourceInquiry({ slug, button, intent, message, facts, topic, kakaoHref, naverTalkHref, placement }: ResourceInquiryProps) {
  const [copied, setCopied] = useState("");
  const from = `resources-${slug}-${placement}`;
  const href = `/contact/inquiry?intent=${encodeURIComponent(intent)}&from=${encodeURIComponent(from)}`;
  const template = [`[${topic}] 문의`, ...facts.map((f) => `- ${f}: `)].join("\n");
  const track = (kind: string, to?: string) => trackCTA(`resource-${kind}`, `resources/${slug}`, to);

  async function copyMessage() {
    track("copy-message");
    try {
      await navigator.clipboard.writeText(template);
      setCopied("양식을 복사했습니다. 문의 창에 붙여넣고 아는 내용만 채워 보내세요.");
    } catch {
      setCopied("복사하지 못했습니다. 위 항목을 직접 적어 보내세요.");
    }
  }

  return (
    <aside className="rounded-2xl border border-navy/15 bg-cream/70 p-4 md:p-5 print:hidden" aria-label={button}>
      <p className="text-sm font-semibold text-navy-light">처음 문의할 때는 이 정도면 충분합니다</p>
      <p className="mt-1.5 text-[0.98rem] leading-relaxed text-navy">{message}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {facts.map((f) => (
          <li key={f} className="rounded-full border border-navy/15 bg-white px-2.5 py-1 text-sm text-navy">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-xs text-navy/60">모르는 항목은 ‘모름’이라고 적으셔도 됩니다. 서류를 다 갖춘 뒤에 문의하지 않으셔도 됩니다.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={href} className="btn-primary inline-flex min-h-11 items-center justify-center px-4" onClick={() => track("inquiry", href)}>
          {button}
        </Link>
        <button
          type="button"
          onClick={copyMessage}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-navy/20 bg-white px-3.5 text-sm font-semibold text-navy hover:bg-cream"
        >
          문의 양식 복사
        </button>
        <a
          href={kakaoHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("kakao", kakaoHref)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#FEE500] px-3.5 text-sm font-semibold text-[#191919]"
        >
          <KakaoIcon className="h-4 w-4" /> 카카오톡
          <span className="sr-only"> (새 창)</span>
        </a>
        <a
          href={naverTalkHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("naver-talk", naverTalkHref)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#03C75A] px-3.5 text-sm font-semibold text-white"
        >
          <NaverIcon className="h-4 w-4" /> 네이버 톡톡
          <span className="sr-only"> (새 창)</span>
        </a>
      </div>
      <p className="mt-1 min-h-5 text-sm text-navy" role="status" aria-live="polite">
        {copied}
      </p>
    </aside>
  );
}
