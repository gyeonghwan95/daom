#!/usr/bin/env node
/**
 * Naver DataLab integrated search trend fetch (server-side only).
 * Never uses NEXT_PUBLIC_*.
 *
 * Env: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
 * Usage: node scripts/fetch-naver-search-trends.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "reports", "seo", "naver-datalab-trends.json");

function loadEnvFile(file) {
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

const clientId = process.env.NAVER_CLIENT_ID?.trim();
const clientSecret = process.env.NAVER_CLIENT_SECRET?.trim();

const GROUPS = [
  {
    groupName: "상속등기",
    keywords: ["상속등기", "부산 상속등기", "상속등기 비용"],
  },
  {
    groupName: "상속포기",
    keywords: ["상속포기", "부산 상속포기", "상속포기 3개월"],
  },
  {
    groupName: "한정승인",
    keywords: ["한정승인", "특별한정승인", "부산 한정승인"],
  },
  {
    groupName: "법인등기",
    keywords: ["법인등기", "임원변경등기", "법인설립"],
  },
  {
    groupName: "부동산등기",
    keywords: ["소유권이전등기", "근저당 말소", "임차권등기명령"],
  },
];

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  if (!clientId || !clientSecret) {
    const payload = {
      generatedAt: new Date().toISOString(),
      status: "TREND_DATA_UNAVAILABLE",
      reason:
        "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET not set. No fabricated volumes.",
      note: "Relative trendIndex only when API succeeds. Never invent monthly search counts.",
      api: "https://openapi.naver.com/v1/datalab/search",
      groupsPrepared: GROUPS,
      results: [],
    };
    fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
    console.log(JSON.stringify({ status: payload.status, out: OUT }, null, 2));
    return;
  }

  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - 1);
  const fmt = (d) => d.toISOString().slice(0, 10);

  // API max 5 groups per call
  const body = {
    startDate: fmt(start),
    endDate: fmt(end),
    timeUnit: "month",
    keywordGroups: GROUPS,
  };

  const res = await fetch("https://openapi.naver.com/v1/datalab/search", {
    method: "POST",
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    status: res.ok ? "OK" : "API_ERROR",
    httpStatus: res.status,
    metricType: "trendIndex_relative_max100",
    request: body,
    response: json,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(
    JSON.stringify({ status: payload.status, http: res.status, out: OUT }, null, 2),
  );
  if (!res.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
