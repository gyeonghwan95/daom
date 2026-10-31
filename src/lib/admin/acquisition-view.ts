/**
 * 유입 분석 화면용 표시·계산 계층. 집계 키는 서버(functions/_lib/admin-ops/acquisition.ts)와 같다.
 */

import { getSourceColor } from "@/lib/admin/source-breakdown";
import { getPageDisplayName, normalizeDisplayPath } from "@/lib/admin/url-display";
import { getSourceLabel } from "@/lib/analytics/referrer";
import type {
  AcquisitionMetrics,
  AcquisitionReport,
} from "@/lib/admin-ops/types";

export const CHANNEL_HINTS: Record<string, string> = {
  naver: "네이버 검색·블로그·카페·지도",
  google: "Google 검색·지도",
  daum: "다음 검색·카카오맵·카카오 채널",
  bing: "Bing 검색",
  ai: "ChatGPT·Perplexity·Gemini 등 AI 답변",
  sns: "인스타그램·유튜브·X·밴드 등",
  external: "다른 웹사이트의 링크",
  campaign: "UTM이 붙은 링크 (QR·문자 등)",
  direct: "주소 입력·즐겨찾기·앱 내 브라우저",
  internal: "새 탭 등 사이트 안에서 다시 시작",
};

export function channelLabel(id: string): string {
  return getSourceLabel(id);
}

export function channelColor(id: string): string {
  return getSourceColor(id);
}

/* ── 유입처 호스트 이름 풀이 ─────────────────────────────── */

type HostRule = { match: (h: string) => boolean; label: string };

const under = (domain: string) => (h: string) => h === domain || h.endsWith(`.${domain}`);
const exact = (...hosts: string[]) => (h: string) => hosts.includes(h);

const HOST_RULES: HostRule[] = [
  { match: exact("search.naver.com", "m.search.naver.com"), label: "네이버 검색" },
  { match: exact("blog.naver.com", "m.blog.naver.com"), label: "네이버 블로그" },
  { match: exact("cafe.naver.com", "m.cafe.naver.com"), label: "네이버 카페" },
  {
    match: (h) =>
      ["map.naver.com", "m.map.naver.com"].includes(h) || under("place.naver.com")(h),
    label: "네이버 지도·플레이스",
  },
  { match: under("booking.naver.com"), label: "네이버 예약" },
  { match: exact("kin.naver.com", "m.kin.naver.com"), label: "네이버 지식iN" },
  { match: exact("in.naver.com"), label: "네이버 인플루언서" },
  { match: under("news.naver.com"), label: "네이버 뉴스" },
  { match: exact("talk.naver.com"), label: "네이버 톡톡" },
  { match: exact("naver.com", "m.naver.com"), label: "네이버 메인" },
  { match: under("naver.com"), label: "네이버 (기타)" },
  { match: under("gemini.google.com"), label: "Gemini" },
  { match: (h) => /^maps\.google\./.test(h), label: "Google 지도" },
  { match: (h) => /(^|\.)google\.[a-z.]+$/.test(h), label: "Google 검색" },
  { match: exact("search.daum.net", "m.search.daum.net"), label: "다음 검색" },
  { match: under("cafe.daum.net"), label: "다음 카페" },
  { match: exact("daum.net", "m.daum.net"), label: "다음 메인" },
  { match: (h) => under("map.kakao.com")(h), label: "카카오맵" },
  { match: exact("pf.kakao.com"), label: "카카오톡 채널" },
  { match: under("story.kakao.com"), label: "카카오스토리" },
  { match: under("bing.com"), label: "Bing 검색" },
  { match: (h) => under("chatgpt.com")(h) || under("chat.openai.com")(h), label: "ChatGPT" },
  { match: under("perplexity.ai"), label: "Perplexity" },
  { match: under("copilot.microsoft.com"), label: "Microsoft Copilot" },
  { match: under("claude.ai"), label: "Claude" },
  { match: under("wrtn.ai"), label: "뤼튼" },
  { match: under("liner.com"), label: "Liner" },
  { match: under("deepseek.com"), label: "DeepSeek" },
  { match: under("grok.com"), label: "Grok" },
  { match: under("genspark.ai"), label: "Genspark" },
  { match: (h) => under("instagram.com")(h), label: "Instagram" },
  { match: (h) => under("facebook.com")(h) || under("fb.com")(h), label: "Facebook" },
  { match: (h) => ["t.co", "x.com", "twitter.com"].some((d) => under(d)(h)), label: "X(트위터)" },
  { match: (h) => under("youtube.com")(h) || h === "youtu.be", label: "YouTube" },
  { match: (h) => under("threads.net")(h) || under("threads.com")(h), label: "Threads" },
  { match: under("band.us"), label: "네이버 밴드" },
  { match: under("tistory.com"), label: "티스토리 블로그" },
  { match: under("brunch.co.kr"), label: "브런치" },
  { match: under("kjaa.or.kr"), label: "대한법무사협회" },
  { match: exact("xn--v92b7y13glcu4ce1d19f.kr"), label: "안심상속법무사.kr (상속 전용 사이트)" },
];

export function describeReferrerHost(host: string): { label: string; known: boolean } {
  if (host === "(other)") return { label: "기타 (상한 초과 합계)", known: false };
  const h = host.toLowerCase();
  const rule = HOST_RULES.find((r) => r.match(h));
  return rule ? { label: rule.label, known: true } : { label: h, known: false };
}

/* ── 지표 계산 ──────────────────────────────────────────── */

/** 비율(%). 분모가 작으면 null — 1~2세션짜리 100%는 의미가 없다. */
export function ratio(num: number, den: number, minDen = 1): number | null {
  if (!den || den < minDen) return null;
  return Math.min(100, (num / den) * 100);
}

export function engagementRate(m: Pick<AcquisitionMetrics, "eng" | "s">, minDen = 1) {
  return ratio(m.eng, m.s, minDen);
}

export function conversionRate(m: Pick<AcquisitionMetrics, "cv" | "s">, minDen = 1) {
  return ratio(m.cv, m.s, minDen);
}

export function pagesPerSession(m: Pick<AcquisitionMetrics, "pv" | "s">): number | null {
  return m.s ? m.pv / m.s : null;
}

export type Delta = { text: string; direction: "up" | "down" | "flat" | "na" };

export function deltaCount(current: number, previous: number | null | undefined): Delta {
  if (previous == null) return { text: "비교 없음", direction: "na" };
  if (previous === 0) {
    return current > 0
      ? { text: `신규 +${current.toLocaleString("ko-KR")}`, direction: "up" }
      : { text: "변화 없음", direction: "flat" };
  }
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 0.5) return { text: "±0%", direction: "flat" };
  return {
    text: `${pct > 0 ? "▲" : "▼"} ${Math.abs(pct).toFixed(pct >= 100 || pct <= -100 ? 0 : 1)}%`,
    direction: pct > 0 ? "up" : "down",
  };
}

/** 비율 지표의 증감은 %p로 표시한다. */
export function deltaPoints(current: number | null, previous: number | null): Delta {
  if (current == null || previous == null) return { text: "비교 없음", direction: "na" };
  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return { text: "±0%p", direction: "flat" };
  return {
    text: `${diff > 0 ? "▲" : "▼"} ${Math.abs(diff).toFixed(1)}%p`,
    direction: diff > 0 ? "up" : "down",
  };
}

export function formatRate(value: number | null, digits = 1): string {
  return value == null ? "—" : `${value.toFixed(digits)}%`;
}

export function formatCount(value: number | null | undefined): string {
  return value == null ? "—" : value.toLocaleString("ko-KR");
}

export function formatDecimal(value: number | null, digits = 1): string {
  return value == null ? "—" : value.toFixed(digits);
}

export function contactBreakdown(m: AcquisitionMetrics): Array<{ key: string; label: string; count: number }> {
  return [
    { key: "phone", label: "전화", count: m.phone },
    { key: "kakao", label: "카카오", count: m.kakao },
    { key: "talk", label: "톡톡", count: m.talk },
    { key: "reserve", label: "예약", count: m.reserve },
    { key: "submit", label: "문의", count: m.submit },
  ].filter((row) => row.count > 0);
}

export function pageLabel(path: string): string {
  const display = normalizeDisplayPath(path);
  const name = getPageDisplayName(path);
  return name && name !== display.slice(1) ? name : display;
}

/* ── 자동 인사이트 ──────────────────────────────────────── */

export type AcquisitionInsight = {
  id: string;
  level: "critical" | "warning" | "info";
  title: string;
  detail: string;
};

const MIN_SESSIONS_FOR_RATE = 15;

export function buildAcquisitionInsights(report: AcquisitionReport): AcquisitionInsight[] {
  const out: AcquisitionInsight[] = [];
  const t = report.totals;
  const prev = report.prevTotals;
  const external = report.channels.filter((c) => c.id !== "internal");
  const overallCv = conversionRate({ cv: t.cv, s: t.acqSessions }, MIN_SESSIONS_FOR_RATE);

  if (prev && prev.sessions >= 10) {
    const change = ((t.sessions - prev.sessions) / prev.sessions) * 100;
    if (Math.abs(change) >= 15) {
      out.push({
        id: "sessions-trend",
        level: change > 0 ? "info" : "warning",
        title: `외부 유입 세션 ${change > 0 ? "증가" : "감소"} ${Math.abs(change).toFixed(0)}%`,
        detail: `이전 기간 ${prev.sessions.toLocaleString("ko-KR")} → 이번 기간 ${t.sessions.toLocaleString("ko-KR")}세션.${
          change < 0 ? " 검색 순위나 색인 상태를 Search Console·서치어드바이저에서 확인하세요." : ""
        }`,
      });
    }
  }

  const top = external[0];
  if (top && t.sessions > 0) {
    out.push({
      id: "top-channel",
      level: "info",
      title: `${channelLabel(top.id)} 유입이 ${((top.sessions / t.sessions) * 100).toFixed(0)}%로 가장 큽니다`,
      detail: `${top.sessions.toLocaleString("ko-KR")}세션. ${CHANNEL_HINTS[top.id] || ""}`.trim(),
    });
  }

  const ranked = external
    .map((c) => ({ c, rate: conversionRate(c, MIN_SESSIONS_FOR_RATE) }))
    .filter((r): r is { c: (typeof external)[number]; rate: number } => r.rate != null)
    .sort((a, b) => b.rate - a.rate);
  const best = ranked[0];
  if (best && overallCv != null && best.rate > 0 && best.rate >= overallCv * 1.3) {
    out.push({
      id: "best-converting",
      level: "info",
      title: `${channelLabel(best.c.id)} 유입의 상담 연결률이 가장 높습니다 (${best.rate.toFixed(1)}%)`,
      detail: `전체 평균 ${overallCv.toFixed(1)}%의 ${(best.rate / Math.max(overallCv, 0.1)).toFixed(1)}배. 이 채널로 들어오는 페이지를 우선 보강하세요.`,
    });
  }

  const movers = external
    .filter((c) => c.prevSessions != null && c.prevSessions >= 5)
    .map((c) => ({ c, diff: c.sessions - (c.prevSessions || 0) }))
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const mover = movers[0];
  if (mover && Math.abs(mover.diff) >= Math.max(5, (mover.c.prevSessions || 0) * 0.3)) {
    out.push({
      id: "channel-mover",
      level: mover.diff > 0 ? "info" : "warning",
      title: `${channelLabel(mover.c.id)} 유입 ${mover.diff > 0 ? "+" : ""}${mover.diff.toLocaleString("ko-KR")}세션`,
      detail: `이전 ${mover.c.prevSessions?.toLocaleString("ko-KR")} → ${mover.c.sessions.toLocaleString("ko-KR")}. 채널 증감 중 가장 큰 변화입니다.`,
    });
  }

  const ai = external.find((c) => c.id === "ai");
  if (ai && ai.sessions > 0) {
    out.push({
      id: "ai-channel",
      level: "info",
      title: `AI 검색에서 ${ai.sessions.toLocaleString("ko-KR")}세션 유입`,
      detail:
        ai.prevSessions === 0
          ? "이번 기간에 처음 나타났습니다. ChatGPT·Perplexity 등이 사무소 페이지를 답변 출처로 인용하고 있습니다."
          : "ChatGPT·Perplexity 등 AI 답변이 사무소 페이지를 출처로 보여주고 있습니다.",
    });
  }

  const weakLanding = report.landings
    .filter((l) => l.key !== "(other)" && l.s >= MIN_SESSIONS_FOR_RATE)
    .map((l) => ({ l, rate: engagementRate(l) ?? 0 }))
    .filter((r) => r.rate < 25)
    .sort((a, b) => b.l.s - a.l.s)[0];
  if (weakLanding) {
    out.push({
      id: "weak-landing",
      level: "warning",
      title: `랜딩 "${pageLabel(weakLanding.l.path)}" 참여율 ${weakLanding.rate.toFixed(0)}%`,
      detail: `${weakLanding.l.s}세션이 들어왔지만 대부분 다른 행동 없이 나갔습니다. 첫 화면의 요약·상담 버튼을 점검하세요.`,
    });
  }

  const silentLanding = report.landings
    .filter((l) => l.key !== "(other)" && l.s >= 30 && l.cv === 0)
    .sort((a, b) => b.s - a.s)[0];
  if (silentLanding && silentLanding.key !== weakLanding?.l.key) {
    out.push({
      id: "silent-landing",
      level: "warning",
      title: `"${pageLabel(silentLanding.path)}" 진입 ${silentLanding.s}세션, 상담 연결 0`,
      detail: "유입은 꾸준하지만 연락 행동으로 이어지지 않습니다. 본문 중간 CTA와 연락 수단 노출을 확인하세요.",
    });
  }

  const newRef = report.referrers
    .filter((r) => r.prevSessions === 0 && r.s >= 5 && r.key !== "(other)")
    .sort((a, b) => b.s - a.s)[0];
  if (newRef) {
    out.push({
      id: "new-referrer",
      level: "info",
      title: `새 유입처: ${describeReferrerHost(newRef.host).label}`,
      detail: `${newRef.host}에서 ${newRef.s}세션. 이전 기간에는 없던 링크입니다.`,
    });
  }

  const devTotal = report.devices.mobile + report.devices.desktop;
  if (devTotal >= 50) {
    const mobileShare = (report.devices.mobile / devTotal) * 100;
    if (mobileShare >= 70) {
      out.push({
        id: "mobile-heavy",
        level: "info",
        title: `페이지뷰의 ${mobileShare.toFixed(0)}%가 모바일`,
        detail: "모바일 첫 화면에서 전화·카카오 버튼이 바로 보이는지가 전환에 가장 큰 영향을 줍니다.",
      });
    }
  }

  return out.slice(0, 6);
}

/* ── 내보내기·링크 ──────────────────────────────────────── */

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | null>>) {
  const escape = (v: string | number | null) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([`﻿${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildUtmUrl(input: {
  origin: string;
  path: string;
  source: string;
  medium: string;
  campaign: string;
}): string | null {
  const source = input.source.trim();
  if (!source) return null;
  let path = input.path.trim() || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  let url: URL;
  try {
    url = new URL(path, input.origin);
  } catch {
    return null;
  }
  url.searchParams.set("utm_source", source);
  if (input.medium.trim()) url.searchParams.set("utm_medium", input.medium.trim());
  if (input.campaign.trim()) url.searchParams.set("utm_campaign", input.campaign.trim());
  return url.toString();
}

export const UTM_PRESETS: Array<{ label: string; source: string; medium: string }> = [
  { label: "네이버 블로그 글", source: "naver_blog", medium: "blog" },
  { label: "QR (명함·전단)", source: "qr", medium: "offline" },
  { label: "카카오톡 채널", source: "kakao_channel", medium: "social" },
  { label: "스마트플레이스 소개", source: "smartplace", medium: "referral" },
  { label: "안심상속법무사.kr", source: "inherit_site", medium: "referral" },
  { label: "문자·알림톡", source: "sms", medium: "message" },
];
