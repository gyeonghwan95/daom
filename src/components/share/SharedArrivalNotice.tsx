"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackCtaEvent } from "@/lib/admin-ops/track-client";
import { getShareCopy, isShareAudience, SHARE_PARAM, type ShareAudience } from "@/lib/share/page-share";

/**
 * 공유 링크(?from=family|work|share)로 들어온 사람에게만 보이는 떠 있는 안내 — "가족이 보내 준 안내입니다" + 문의 버튼.
 * 화면 위에 떠 있어 본문을 밀지 않는다(레이아웃 이동 없음). 휴대폰은 하단 상담 바 바로 위, PC는 왼쪽 아래.
 * 본 뒤에는 주소에서 ?from=을 지워, 받은 사람이 다시 공유할 때 같은 표시가 겹치지 않게 한다.
 */
export function SharedArrivalNotice() {
  const [audience, setAudience] = useState<ShareAudience | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const from = url.searchParams.get(SHARE_PARAM);
    if (!isShareAudience(from)) return;
    // 주소창 정리는 화면에 영향이 없다. 도착 표시는 공유 링크로 들어온 첫 화면에서 한 번만 정한다
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState(window.history.state, "", url.pathname + (url.search || "") + url.hash);
    trackCtaEvent(`share-arrival-${from}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAudience(from);
  }, []);

  if (!audience) return null;
  const copy = getShareCopy(window.location.pathname);
  const title = audience === "family" ? "가족이 보내 준 안내입니다" : audience === "work" ? "함께 일하는 분이 보내 준 안내입니다" : copy.arrivalTitle;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 z-[55] mx-auto max-w-md rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_18px_44px_-16px_rgba(30,58,95,0.5)] max-lg:bottom-[calc(var(--mobile-cta-reserve)+env(safe-area-inset-bottom,0px)+0.5rem)] lg:bottom-6 lg:left-6 lg:right-auto lg:mx-0 lg:w-[22rem] print:hidden"
      data-shared-arrival={audience}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white" aria-hidden>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.95rem] font-bold text-navy">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-navy/70">
            읽어 보시고 궁금한 점은 안윤정 법무사에게 바로 물어보세요. 같은 사건이면 보내 주신 분과 함께 안내해 드립니다.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/contact/inquiry?from=shared-${audience}`}
              onClick={() => trackCtaEvent(`share-arrival-inquiry-${audience}`, undefined, "/contact/inquiry")}
              className="inline-flex min-h-11 items-center rounded-xl bg-navy px-4 text-sm font-semibold text-white no-underline transition hover:bg-navy-dark"
            >
              궁금한 점 물어보기
            </Link>
            <button
              type="button"
              onClick={() => setAudience(null)}
              className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-navy/60 hover:text-navy"
            >
              먼저 읽어볼게요
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
