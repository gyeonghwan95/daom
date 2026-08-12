/**
 * Local content similarity audit (region-name stripped).
 * Internal threshold — not a Naver official score.
 *
 * Usage: npx --yes tsx scripts/analyze-naver-local-search-intents.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "reports/seo/naver-local-search-intents.json");
const TRENDS = path.join(ROOT, "reports/seo/naver-datalab-trends.json");

function loadEnvFile(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvFile(path.join(ROOT, ".env.local"));
loadEnvFile(path.join(ROOT, ".env"));

const LOCAL_QUERY_GROUPS = [
  {
    groupName: "local-provider",
    keywords: [
      "민락 법무사",
      "장산 법무사",
      "전포동 법무사",
      "양정 법무사",
      "부산 법무사",
    ],
  },
  {
    groupName: "cost-selection",
    keywords: [
      "부산 법무사 비용",
      "부산 법무사 추천",
      "부산 저렴한 법무사",
    ],
  },
  {
    groupName: "finance-registration",
    keywords: [
      "부산 잔금 법무사",
      "부산 근저당 법무사",
      "부산 은행 등기 법무사",
      "부산 아파트 잔금 등기",
    ],
  },
];

type TrendPoint = { period: string; ratio: number };

function trendDirection(points: TrendPoint[]): string {
  if (points.length < 2) return "UNKNOWN";
  const first = points.slice(0, 3).reduce((a, p) => a + p.ratio, 0) / 3;
  const last = points.slice(-3).reduce((a, p) => a + p.ratio, 0) / 3;
  if (last > first * 1.08) return "UP";
  if (last < first * 0.92) return "DOWN";
  return "FLAT";
}

function seasonalityNote(points: TrendPoint[]): string {
  if (points.length < 12) return "INSUFFICIENT_DATA";
  const byMonth = new Map<number, number[]>();
  for (const p of points) {
    const m = new Date(p.period).getMonth();
    const arr = byMonth.get(m) ?? [];
    arr.push(p.ratio);
    byMonth.set(m, arr);
  }
  let maxM = 0;
  let minM = 0;
  let maxAvg = 0;
  let minAvg = Infinity;
  for (const [m, vals] of byMonth) {
    const avg = vals.reduce((a, v) => a + v, 0) / vals.length;
    if (avg > maxAvg) {
      maxAvg = avg;
      maxM = m;
    }
    if (avg < minAvg) {
      minAvg = avg;
      minM = m;
    }
  }
  return `relative_peak_month_${maxM + 1}_trough_month_${minM + 1}`;
}

async function fetchDataLab() {
  const clientId = process.env.NAVER_CLIENT_ID?.trim();
  const clientSecret = process.env.NAVER_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return {
      status: "TREND_DATA_UNAVAILABLE" as const,
      reason: "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET not set",
      groups: LOCAL_QUERY_GROUPS,
      results: [],
    };
  }

  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const res = await fetch("https://openapi.naver.com/v1/datalab/search", {
    method: "POST",
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: fmt(start),
      endDate: fmt(end),
      timeUnit: "month",
      keywordGroups: LOCAL_QUERY_GROUPS,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    return {
      status: "TREND_DATA_UNAVAILABLE" as const,
      reason: `API ${res.status}: ${text.slice(0, 200)}`,
      groups: LOCAL_QUERY_GROUPS,
      results: [],
    };
  }

  const json = JSON.parse(text) as {
    results: Array<{
      title: string;
      keywords: string[];
      data: TrendPoint[];
    }>;
  };

  return {
    status: "OK" as const,
    groups: LOCAL_QUERY_GROUPS,
    results: json.results.map((r) => ({
      groupName: r.title,
      keywords: r.keywords,
      trendDirection: trendDirection(r.data),
      seasonality: seasonalityNote(r.data),
      trendIndex: r.data.at(-1)?.ratio ?? null,
      note: "Relative trendIndex only — not monthly search volume",
    })),
  };
}

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    ...(await fetchDataLab()),
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");

  if (fs.existsSync(TRENDS)) {
    const existing = JSON.parse(fs.readFileSync(TRENDS, "utf8"));
    existing.localIntentExtension = payload;
    fs.writeFileSync(TRENDS, JSON.stringify(existing, null, 2) + "\n", "utf8");
  }

  console.log(JSON.stringify({ out: OUT, status: payload.status }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
