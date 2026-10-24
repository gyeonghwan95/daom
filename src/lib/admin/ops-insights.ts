import type { DashboardPayload } from "@/lib/admin-ops/types";
import {
  classifyAdminPath,
  mixByIntent,
  type AdminPathIntent,
} from "@/lib/admin/path-intent";
import { getPageDisplayName, normalizeDisplayPath } from "@/lib/admin/url-display";

export type OpsInsight = {
  id: string;
  level: "critical" | "warning" | "info";
  title: string;
  detail: string;
  href?: string;
};

function rate(num: number, den: number): number | null {
  if (!den) return null;
  return Math.round((num / den) * 1000) / 10;
}

export function buildDashboardInsights(data: DashboardPayload): OpsInsight[] {
  const out: OpsInsight[] = [];
  const k = data.kpis;
  const visits = k.visitsToday ?? 0;
  const submits = k.consultSubmitToday ?? 0;
  const cta = k.ctaToday ?? 0;

  if (data.storageConfigured && visits === 0) {
    out.push({
      id: "no-visits",
      level: "info",
      title: "오늘 공개 페이지뷰가 아직 없습니다",
      detail:
        "관리자 세션·봇은 집계에서 빠집니다. 아침에 수치가 0인 것은 정상일 수 있습니다.",
    });
  }

  if (visits >= 8 && submits === 0) {
    out.push({
      id: "views-no-submit",
      level: "warning",
      title: "방문은 있는데 문의 제출이 없습니다",
      detail: `오늘 페이지뷰 ${visits} · CTA ${cta} · 제출 0. 전화·카카오는 전환 페이지에서 채널별로 확인하세요.`,
      href: "/admin/conversions",
    });
  }

  const funnel = data.funnelToday;
  if (funnel && funnel.pageViews >= 20) {
    const viewToCta = rate(funnel.cta, funnel.pageViews);
    if (viewToCta != null && viewToCta < 2) {
      out.push({
        id: "low-cta",
        level: "info",
        title: "페이지뷰 대비 CTA가 낮습니다",
        detail: `오늘 조회 ${funnel.pageViews}건 중 버튼 클릭 ${funnel.cta}건(${viewToCta}%). 상담이 필요한 페이지인지부터 가리세요.`,
        href: "/admin/conversions",
      });
    }
  }

  const mix = mixByIntent(
    (data.topPathsToday || []).map((row) => ({
      path: row.path,
      visits: row.visits,
    })),
  );
  const lecture = mix.find((row) => row.intent === "lecture");
  if (lecture && lecture.visits > 0) {
    out.push({
      id: "lecture-traffic",
      level: "info",
      title: `오늘 TOP 페이지 중 특강 유입 ${lecture.visits}회`,
      detail:
        lecture.share != null
          ? `상위 페이지의 ${lecture.share}%가 강의·특강입니다. 섭외 문의는 강의문의 페이지에서 확인하세요.`
          : "특강 페이지 방문이 있습니다.",
      href: "/admin/pages",
    });
  }

  const inheritance = mix.find((row) => row.intent === "inheritance");
  if (inheritance && inheritance.visits > 0 && submits === 0 && visits >= 5) {
    out.push({
      id: "inheritance-no-lead",
      level: "info",
      title: "상속 페이지 방문이 있으나 제출이 없습니다",
      detail:
        "상속 유입은 전화·카카오 상담으로 이어지는 경우가 많습니다. 전환 분석에서 채널별 클릭을 같이 보세요.",
      href: "/admin/conversions",
    });
  }

  const peak = data.hourlyInsights?.peakHourToday;
  if (peak != null && (data.hourlyInsights?.peakViewsToday || 0) > 0) {
    out.push({
      id: "peak-hour",
      level: "info",
      title: `오늘 방문이 몰린 시각은 ${peak}시입니다`,
      detail: `이 시간대 페이지뷰 ${data.hourlyInsights?.peakViewsToday ?? "—"}회. 전화 응대 가능 여부를 맞춰 두면 놓치는 상담이 줄어듭니다.`,
    });
  }

  return out.slice(0, 6);
}

export function buildPageWatchlist(
  rows: Array<{
    path: string;
    visitsToday: number;
    visits30d: number;
    consultSubmit: number;
    cta: number;
  }>,
): Array<{
  path: string;
  title: string;
  intent: AdminPathIntent;
  visits30d: number;
  cta: number;
  reason: string;
}> {
  return rows
    .filter((row) => {
      const intent = classifyAdminPath(row.path);
      if (intent === "lecture" || intent === "tools" || intent === "other") {
        return false;
      }
      return row.visits30d >= 8 && row.consultSubmit === 0;
    })
    .sort((a, b) => b.visits30d - a.visits30d)
    .slice(0, 8)
    .map((row) => ({
      path: normalizeDisplayPath(row.path),
      title: getPageDisplayName(row.path) || normalizeDisplayPath(row.path),
      intent: classifyAdminPath(row.path),
      visits30d: row.visits30d,
      cta: row.cta,
      reason:
        row.cta > 0
          ? "클릭은 있으나 문의 제출이 없습니다"
          : "조회만 있고 상담 행동이 없습니다",
    }));
}

export function conversionCopy(funnel: {
  pageViews: number;
  cta: number;
  consultStart: number;
  consultSubmit: number;
}): string | null {
  if (funnel.pageViews === 0) return null;
  const viewToCta = rate(funnel.cta, funnel.pageViews);
  const ctaToSubmit = rate(funnel.consultSubmit, funnel.cta || 0);
  const parts = [
    `조회 ${funnel.pageViews} → CTA ${funnel.cta}${viewToCta != null ? ` (${viewToCta}%)` : ""}`,
    `제출 ${funnel.consultSubmit}${ctaToSubmit != null ? ` · CTA 대비 ${ctaToSubmit}%` : ""}`,
  ];
  return parts.join(" · ");
}

export function withShare<T extends { count: number }>(
  rows: T[],
): Array<T & { share: number | null }> {
  const sum = rows.reduce((acc, row) => acc + (row.count || 0), 0);
  return rows.map((row) => ({
    ...row,
    share: sum > 0 ? Math.round((row.count / sum) * 1000) / 10 : null,
  }));
}

export function buildConversionInsights(input: {
  funnel?: {
    pageViews: number;
    cta: number;
    consultStart: number;
    consultSubmit: number;
    mailSuccess?: number | null;
  } | null;
  pages?: Array<{
    path: string;
    visits: number;
    cta: number;
    consultSubmit: number;
    phone: number;
    kakao: number;
  }>;
}): OpsInsight[] {
  const out: OpsInsight[] = [];
  const funnel = input.funnel;
  if (funnel && funnel.pageViews >= 8 && funnel.cta === 0) {
    out.push({
      id: "no-cta",
      level: "warning",
      title: "조회는 있으나 버튼 클릭이 없습니다",
      detail:
        "전화·카카오·문의 버튼이 안 보이거나, 정보만 읽고 나가는 방문일 수 있습니다.",
    });
  }
  if (funnel && funnel.cta >= 3 && funnel.consultSubmit === 0) {
    out.push({
      id: "cta-no-submit",
      level: "info",
      title: "버튼은 눌렸지만 양식 제출이 없습니다",
      detail:
        "전화·카카오는 제출 없이 연결됩니다. 실제 상담은 전화 클릭을 같이 보세요.",
    });
  }
  const pages = input.pages || [];
  const phone = pages.reduce((sum, row) => sum + (row.phone || 0), 0);
  const kakao = pages.reduce((sum, row) => sum + (row.kakao || 0), 0);
  if (phone + kakao >= 3) {
    out.push({
      id: "channel-mix",
      level: "info",
      title:
        phone >= kakao
          ? `오늘 상담 클릭은 전화 ${phone} · 카카오 ${kakao}`
          : `오늘 상담 클릭은 카카오 ${kakao} · 전화 ${phone}`,
      detail:
        phone >= kakao
          ? "전화가 더 많습니다. 피크 시간대에 바로 받을 수 있는지가 전환을 가릅니다."
          : "카카오가 더 많습니다. 알림음·읽지 않은 채팅부터 확인하세요.",
    });
  }
  const clickOnly = pages
    .filter((row) => row.cta > 0 && row.consultSubmit === 0)
    .sort((a, b) => b.cta - a.cta)
    .slice(0, 3);
  if (clickOnly.length) {
    out.push({
      id: "click-pages",
      level: "info",
      title: "클릭만 있고 제출이 없는 페이지가 있습니다",
      detail: clickOnly
        .map((row) => `${getPageDisplayName(row.path) || row.path} CTA ${row.cta}`)
        .join(" · "),
      href: "/admin/pages",
    });
  }
  return out;
}

export type OpsAction = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  tone: "critical" | "warning" | "info" | "ok";
};

export type OpsStat = {
  label: string;
  value: string;
  note?: string;
};

function hourBucket(hours: Array<{ hour: number; pageViews: number }> | undefined) {
  let office = 0;
  let after = 0;
  for (const row of hours || []) {
    if (row.hour >= 9 && row.hour < 18) office += row.pageViews || 0;
    else after += row.pageViews || 0;
  }
  return { office, after, total: office + after };
}

export function buildOpsBriefing(data: DashboardPayload): {
  actions: OpsAction[];
  stats: OpsStat[];
} {
  const k = data.kpis;
  const visits = k.visitsToday ?? 0;
  const yesterday = k.visitsYesterday ?? null;
  const visits7d = k.visits7d ?? null;
  const avg7 = visits7d != null && visits7d > 0 ? Math.round((visits7d / 7) * 10) / 10 : null;
  const devices = data.devicesToday;
  const deviceTotal =
    (devices?.mobile || 0) + (devices?.desktop || 0) + (devices?.unknown || 0);
  const mobileShare =
    devices && deviceTotal > 0
      ? Math.round((devices.mobile / deviceTotal) * 1000) / 10
      : null;
  const buckets = hourBucket(data.hourlyToday);
  const officeShare =
    buckets.total > 0
      ? Math.round((buckets.office / buckets.total) * 1000) / 10
      : null;
  const nowHour = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    hour12: false,
  });
  const currentHour = Number.parseInt(nowHour, 10);
  const peak = data.hourlyInsights?.peakHourToday;
  const vsY =
    yesterday != null && yesterday > 0 && visits != null
      ? Math.round(((visits - yesterday) / yesterday) * 1000) / 10
      : null;
  const vsAvg =
    avg7 != null && avg7 > 0
      ? Math.round(((visits - avg7) / avg7) * 1000) / 10
      : null;

  const sources = data.sourcesToday || [];
  const sourceTotal = sources.reduce((sum, row) => sum + row.count, 0);
  const naver = sources.find((row) => /naver|네이버/i.test(row.source));
  const naverShare =
    naver && sourceTotal > 0
      ? Math.round((naver.count / sourceTotal) * 1000) / 10
      : null;

  const consultPages = (data.topPathsToday || []).filter((row) => {
    const intent = classifyAdminPath(row.path);
    return (
      intent === "inheritance" ||
      intent === "corporate" ||
      intent === "consult" ||
      intent === "jeonse" ||
      intent === "insolvency" ||
      intent === "local" ||
      intent === "home"
    );
  });
  const unanswered = consultPages
    .filter((row) => row.visits >= 2 && (row.consultSubmit ?? 0) === 0)
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 3);
  const hottest = [...consultPages].sort((a, b) => b.visits - a.visits)[0];

  const stats: OpsStat[] = [
    {
      label: "어제 대비",
      value:
        vsY == null ? "—" : `${vsY > 0 ? "+" : ""}${vsY}%`,
      note: yesterday != null ? `어제 ${yesterday}회` : "비교 데이터 부족",
    },
    {
      label: "7일 평균 대비",
      value: vsAvg == null ? "—" : `${vsAvg > 0 ? "+" : ""}${vsAvg}%`,
      note: avg7 != null ? `하루 평균 ${avg7}회` : "비교 데이터 부족",
    },
    {
      label: "업무시간 방문",
      value: officeShare != null ? `${officeShare}%` : "—",
      note: "09–18시 · 나머지는 시간 외",
    },
    {
      label: "모바일 비중",
      value: mobileShare != null ? `${mobileShare}%` : "—",
      note:
        mobileShare != null && mobileShare >= 60
          ? "전화·카카오 버튼이 더 중요합니다"
          : "화면 너비 768px 기준",
    },
    {
      label: "네이버 유입",
      value: naverShare != null ? `${naverShare}%` : "—",
      note: "오늘 TOP 유입 기준",
    },
  ];

  const actions: OpsAction[] = [];

  if ((k.emailFailedToday ?? 0) > 0) {
    actions.push({
      id: "mail",
      tone: "critical",
      title: "문의 알림이 실패했습니다",
      detail: `오늘 ${k.emailFailedToday}건. 사이트에 문의는 남았지만 메일·텔레그램이 안 갔습니다.`,
      href: "/admin/email",
    });
  }

  if (peak != null && (data.hourlyInsights?.peakViewsToday || 0) > 0) {
    const nearPeak = peak - currentHour <= 1 && peak - currentHour >= -1;
    actions.push({
      id: "peak",
      tone: nearPeak ? "warning" : "info",
      title: nearPeak
        ? `지금이 피크 시간대입니다 (${peak}시)`
        : `오늘 피크는 ${peak}시입니다`,
      detail: nearPeak
        ? "전화 가능한 상태를 유지하세요. 모바일 방문이면 카카오보다 전화가 먼저입니다."
        : `이 시각 페이지뷰 ${data.hourlyInsights?.peakViewsToday ?? "—"}회. 응대 가능 시간을 맞춰 두면 놓치는 상담이 줄어듭니다.`,
    });
  }

  if (hottest && hottest.visits > 0) {
    actions.push({
      id: "hot-page",
      tone: "info",
      title: `오늘 수임 유입 1위 · ${getPageDisplayName(hottest.path) || hottest.path}`,
      detail: `페이지뷰 ${hottest.visits} · CTA ${hottest.cta} · 제출 ${hottest.consultSubmit ?? 0}. 이 페이지 문의부터 확인하세요.`,
      href: "/admin/pages",
    });
  }

  if (unanswered.length) {
    actions.push({
      id: "unanswered",
      tone: "warning",
      title: "상담 페이지 방문은 있는데 제출이 없습니다",
      detail: unanswered
        .map(
          (row) =>
            `${getPageDisplayName(row.path) || row.path} ${row.visits}회`,
        )
        .join(" · "),
      href: "/admin/conversions",
    });
  }

  if (mobileShare != null && mobileShare >= 70 && (k.ctaToday ?? 0) > 0) {
    actions.push({
      id: "mobile-cta",
      tone: "info",
      title: "오늘 방문의 대부분이 모바일입니다",
      detail:
        "전환 분석에서 전화·카카오 클릭을 먼저 보세요. 양식 제출만 보면 실제 상담을 놓칩니다.",
      href: "/admin/conversions",
    });
  }

  if (officeShare != null && officeShare < 40 && buckets.total >= 8) {
    actions.push({
      id: "after-hours",
      tone: "info",
      title: "시간 외 방문 비중이 큽니다",
      detail:
        "아침 첫 확인 때 전날 밤 문의를 우선 보세요. 카카오·메일 알림이 켜져 있는지가 핵심입니다.",
      href: "/admin/email",
    });
  }

  if (!actions.length && visits === 0) {
    actions.push({
      id: "quiet",
      tone: "ok",
      title: "지금은 대기 구간입니다",
      detail: "공개 페이지뷰가 없으면 아침·휴일은 정상일 수 있습니다. 수집 상태는 모니터링에서 확인하세요.",
      href: "/admin/monitoring",
    });
  }

  return { actions: actions.slice(0, 4), stats };
}

export function buildRisingPages(
  rows: Array<{
    path: string;
    visitsToday: number;
    visits7d: number;
    trend: string;
    consultSubmit: number;
  }>,
) {
  return rows
    .filter((row) => row.trend === "up" && row.visitsToday > 0)
    .sort((a, b) => b.visitsToday - a.visitsToday)
    .slice(0, 6)
    .map((row) => ({
      path: normalizeDisplayPath(row.path),
      visitsToday: row.visitsToday,
      visits7d: row.visits7d,
      consultSubmit: row.consultSubmit,
    }));
}

export function buildLeadPages(
  rows: Array<{
    path: string;
    visits30d: number;
    consultSubmit: number;
    conversionRate: number | null;
    cta: number;
  }>,
) {
  return rows
    .filter((row) => row.consultSubmit > 0)
    .sort((a, b) => b.consultSubmit - a.consultSubmit || (b.conversionRate || 0) - (a.conversionRate || 0))
    .slice(0, 6);
}
