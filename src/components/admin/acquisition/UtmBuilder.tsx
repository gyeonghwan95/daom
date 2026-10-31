"use client";

import { useId, useState } from "react";
import { buildUtmUrl, UTM_PRESETS } from "@/lib/admin/acquisition-view";
import { getSiteUrl } from "@/lib/site-url";

/** 블로그·QR·문자에 붙일 추적 링크. 들어온 세션은 아래 캠페인 표에 집계된다. */
export function UtmBuilder({ suggestedPaths }: { suggestedPaths: string[] }) {
  const id = useId();
  const [path, setPath] = useState("/");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [copied, setCopied] = useState(false);

  const url = buildUtmUrl({ origin: getSiteUrl(), path, source, medium, campaign });

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="admin-acq-utm">
      <div className="admin-acq-utm__presets" role="group" aria-label="자주 쓰는 출처">
        {UTM_PRESETS.map((p) => (
          <button
            key={p.source}
            type="button"
            aria-pressed={source === p.source && medium === p.medium}
            onClick={() => {
              setSource(p.source);
              setMedium(p.medium);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="admin-acq-utm__fields">
        <label>
          <span>연결할 페이지</span>
          <input
            className="admin-input"
            value={path}
            list={`${id}-paths`}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/"
          />
          <datalist id={`${id}-paths`}>
            {suggestedPaths.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>
        <label>
          <span>출처 utm_source *</span>
          <input
            className="admin-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="naver_blog"
          />
        </label>
        <label>
          <span>매체 utm_medium</span>
          <input
            className="admin-input"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="blog"
          />
        </label>
        <label>
          <span>캠페인 utm_campaign</span>
          <input
            className="admin-input"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="2026-11-상속등기"
          />
        </label>
      </div>
      <div className="admin-acq-utm__out">
        <input
          className="admin-input"
          readOnly
          value={url ?? ""}
          placeholder="출처(utm_source)를 입력하면 링크가 만들어집니다"
          aria-label="생성된 추적 링크"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button type="button" className="admin-btn admin-btn--primary" disabled={!url} onClick={() => void copy()}>
          {copied ? "복사됨" : "복사"}
        </button>
        {url ? (
          <a className="admin-btn admin-btn--ghost" href={url} target="_blank" rel="noopener noreferrer">
            열기
          </a>
        ) : null}
      </div>
      <p className="admin-acq-utm__help">
        같은 캠페인은 항상 같은 이름으로 쓰세요(영문 소문자 권장). 전화번호·이름 등 개인정보는 넣지
        마세요 — 8자리 이상 숫자는 저장되지 않습니다. 관리자 로그인 상태로 열면 집계에서 제외됩니다.
      </p>
    </div>
  );
}
