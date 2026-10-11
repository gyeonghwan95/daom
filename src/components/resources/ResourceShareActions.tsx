"use client";

import { useEffect, useState } from "react";
import { trackCTA } from "@/lib/analytics/track-cta";

type ResourceShareActionsProps = {
  slug: string;
  title: string;
  pageUrl: string;
  pngHref: string;
  pdfHref: string;
  fileBase: string;
};

const btn =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-navy/20 bg-white px-3.5 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

/**
 * 이미지 저장·PDF 받기·인쇄·링크 복사·공유. 클릭 종류만 집계하고 사건 내용·개인정보는 보내지 않는다.
 * 공유는 지원 환경에서만 보이며(마운트 후 확인), 취소·미지원은 오류로 다루지 않는다.
 */
export function ResourceShareActions({ slug, title, pageUrl, pngHref, pdfHref, fileBase }: ResourceShareActionsProps) {
  const [canShare, setCanShare] = useState(false);
  const [status, setStatus] = useState("");
  const track = (kind: string, href?: string) => trackCTA(`resource-${kind}`, `resources/${slug}`, href);

  useEffect(() => {
    // 공유 지원 여부는 브라우저에서만 알 수 있어 마운트 뒤에 반영한다(초기 HTML과 일치).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  async function copyLink() {
    track("copy-link");
    try {
      await navigator.clipboard.writeText(pageUrl);
      setStatus("링크를 복사했습니다. 가족·담당자에게 붙여넣어 보내세요.");
    } catch {
      setStatus(`복사하지 못했습니다. 주소를 직접 복사하세요: ${pageUrl}`);
    }
  }

  async function share() {
    track("share");
    try {
      let files: File[] | undefined;
      try {
        const blob = await (await fetch(pngHref)).blob();
        const file = new File([blob], `${fileBase}.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) files = [file];
      } catch {
        files = undefined;
      }
      await navigator.share(files ? { title, text: `${title}\n${pageUrl}`, files } : { title, url: pageUrl });
      setStatus("");
    } catch (e) {
      if ((e as DOMException)?.name !== "AbortError") {
        setStatus("이 기기에서는 공유 창을 열 수 없습니다. 링크 복사나 이미지 저장을 이용하세요.");
      }
    }
  }

  return (
    <div className="print:hidden">
      <div className="flex flex-wrap gap-2">
        <a href={pngHref} download={`${fileBase}.png`} className={btn} onClick={() => track("png", pngHref)}>
          이미지 저장 <span className="text-xs font-normal text-navy/60">PNG</span>
        </a>
        <a href={pdfHref} download={`${fileBase}.pdf`} className={btn} onClick={() => track("pdf", pdfHref)}>
          PDF 받기 <span className="text-xs font-normal text-navy/60">A4</span>
        </a>
        <button
          type="button"
          className={btn}
          onClick={() => {
            track("print");
            window.print();
          }}
        >
          인쇄
        </button>
        <button type="button" className={btn} onClick={copyLink}>
          링크 복사
        </button>
        {canShare ? (
          <button type="button" className={btn} onClick={share}>
            공유하기
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-navy/60">
        휴대폰에서 저장이 안 되면{" "}
        <a href={pngHref} target="_blank" rel="noopener" className="underline underline-offset-2" onClick={() => track("png-open", pngHref)}>
          이미지를 열고
        </a>{" "}
        길게 눌러 저장하세요.
      </p>
      <p className="mt-1 min-h-5 text-sm text-navy" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
