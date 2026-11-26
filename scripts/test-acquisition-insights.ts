/**
 * 유입 분석 인사이트·포털/AI 묶음 단위 테스트
 * Usage: npx --yes tsx scripts/test-acquisition-insights.ts
 */
import {
  buildAcquisitionInsights,
  buildChannelSubBreakdown,
  groupReferrersByLabel,
} from "../src/lib/admin/acquisition-view.ts";
import type {
  AcquisitionChannelRow,
  AcquisitionDimensionRow,
  AcquisitionMetrics,
  AcquisitionReport,
  AcquisitionTotals,
} from "../src/lib/admin-ops/types.ts";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
  }
}

function m(partial: Partial<AcquisitionMetrics> & Pick<AcquisitionMetrics, "s">): AcquisitionMetrics {
  return {
    s: partial.s,
    pv: partial.pv ?? partial.s,
    eng: partial.eng ?? 0,
    cv: partial.cv ?? 0,
    m: partial.m ?? 0,
    phone: partial.phone ?? 0,
    kakao: partial.kakao ?? 0,
    talk: partial.talk ?? 0,
    reserve: partial.reserve ?? 0,
    place: partial.place ?? 0,
    submit: partial.submit ?? 0,
    cta: partial.cta ?? 0,
    start: partial.start ?? partial.s,
    contacts: partial.contacts ?? 0,
  };
}

function channel(
  id: string,
  sessions: number,
  prevSessions: number,
  metrics: AcquisitionMetrics,
): AcquisitionChannelRow {
  return {
    id,
    sessions,
    prevSessions,
    prevConverted: null,
    prevAcqSessions: prevSessions,
    ...metrics,
  };
}

function dim(
  key: string,
  metrics: AcquisitionMetrics,
  extra: Partial<AcquisitionDimensionRow> & { prevSessions: number },
): AcquisitionDimensionRow {
  return { key, ...metrics, prevSessions: extra.prevSessions, mix: extra.mix };
}

const totals: AcquisitionTotals = {
  ...m({ s: 100, eng: 40, cv: 8, m: 70, pv: 180, contacts: 10, phone: 4, kakao: 3, talk: 1, reserve: 1, submit: 1, cta: 5, place: 2 }),
  sessions: 100,
  internalSessions: 0,
  pageViews: 180,
  acqSessions: 100,
};

const prevTotals: AcquisitionTotals = {
  ...m({ s: 80, eng: 30, cv: 6, m: 50, pv: 140, contacts: 7, phone: 3, kakao: 2, talk: 1, submit: 1, cta: 3, place: 1 }),
  sessions: 80,
  internalSessions: 0,
  pageViews: 140,
  acqSessions: 80,
};

const report: AcquisitionReport = {
  generatedAt: "2026-11-26T00:00:00.000Z",
  timezone: "Asia/Seoul",
  storageConfigured: true,
  periods: [1, 7, 14, 30, 90],
  range: { start: "2026-11-19", end: "2026-11-26", days: 7 },
  compareRange: { start: "2026-11-12", end: "2026-11-18" },
  coverage: { days: 7, acqDays: 7, firstAcqDate: "2026-10-01" },
  totals,
  prevTotals,
  channels: [
    channel("naver", 70, 60, m({ s: 70, eng: 28, cv: 6, m: 50, pv: 120 })),
    channel("ai", 12, 0, m({ s: 12, eng: 5, cv: 2, m: 4, pv: 20 })),
    channel("direct", 18, 20, m({ s: 18, eng: 7, cv: 0, m: 10, pv: 30 })),
    channel("internal", 0, 0, m({ s: 0 })),
  ],
  referrers: [
    {
      ...dim("m.search.naver.com", m({ s: 36, eng: 12, cv: 3 }), { prevSessions: 20 }),
      host: "m.search.naver.com",
      channel: "naver",
    },
    {
      ...dim("search.naver.com", m({ s: 20, eng: 10, cv: 3 }), { prevSessions: 22 }),
      host: "search.naver.com",
      channel: "naver",
    },
    {
      ...dim("blog.naver.com", m({ s: 14, eng: 4, cv: 0 }), { prevSessions: 10 }),
      host: "blog.naver.com",
      channel: "naver",
    },
    {
      ...dim("chatgpt.com", m({ s: 8, eng: 3, cv: 2 }), { prevSessions: 0 }),
      host: "chatgpt.com",
      channel: "ai",
    },
    {
      ...dim("perplexity.ai", m({ s: 4, eng: 2, cv: 0 }), { prevSessions: 0 }),
      host: "perplexity.ai",
      channel: "ai",
    },
  ],
  landings: [
    {
      ...dim("/blog/weak", m({ s: 20, eng: 2, cv: 0, pv: 22 }), {
        prevSessions: 10,
        mix: { naver: 20 },
      }),
      path: "/blog/weak",
    },
  ],
  campaigns: [],
  daily: [],
  weekHour: Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0)),
  devices: { mobile: 120, desktop: 40, unknown: 0 },
};

const grouped = groupReferrersByLabel(report.referrers, "naver");
assert(grouped[0]?.label === "네이버 검색", "네이버 검색이 1위");
assert(grouped[0]?.sessions === 56, `모바일+PC 합산 56 (got ${grouped[0]?.sessions})`);
assert(grouped[0]?.hosts.length === 2, "검색 호스트 2개");

const aiGroups = buildChannelSubBreakdown(report, "ai");
assert(aiGroups[0]?.label === "ChatGPT", "AI 1위는 ChatGPT");
assert(aiGroups[1]?.label === "Perplexity", "AI 2위는 Perplexity");

const insights = buildAcquisitionInsights(report, { days: 7 });
assert(
  insights.some((i) => i.id === "top-channel" && i.detail.includes("네이버 검색")),
  "top-channel에 검색 비중",
);
assert(
  insights.some((i) => i.id === "ai-channel" && i.title.includes("ChatGPT")),
  "AI 인사이트에 엔진명",
);
assert(
  insights.some((i) => i.id === "weak-landing" && i.href?.includes("landing=")),
  "약한 랜딩 href",
);
assert(
  insights.every((i) => !i.href || i.href.startsWith("/admin/analytics?days=7")),
  "인사이트 기간 유지",
);

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("OK acquisition insights");
