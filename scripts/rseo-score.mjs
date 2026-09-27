#!/usr/bin/env node
/**
 * REGIONAL SEO — registry 기반 기회점수·수요 proxy·keyword→URL·remote matrix CSV.
 *   node scripts/rseo-score.mjs
 * (Node 24: .ts 타입 제거로 registry/matrix를 직접 import)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATE = process.env.RSEO_DATE || "2026-09-27";
const OUT = path.join(ROOT, "reports", "regional-seo", DATE);
fs.mkdirSync(OUT, { recursive: true });

const { REGION_CONTENT_REGISTRY, regionScoreTotal } = await import(
  pathToFileURL(path.join(ROOT, "src/data/regionContentRegistry.ts")).href
);
const { REGIONAL_REMOTE_SERVICES } = await import(
  pathToFileURL(path.join(ROOT, "src/data/remoteServiceMatrix.ts")).href
);

const paths = new Set(
  JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/output/seo-paths.json"), "utf8")).paths.map((p) =>
    decodeURIComponent(p),
  ),
);

const esc = (v) => {
  const s = Array.isArray(v) ? v.join(" / ") : String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (name, head, rows) => {
  const body = [head.join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
  fs.writeFileSync(path.join(OUT, name), `\uFEFF${body}\n`);
  console.log(`[rseo-score] ${name} rows=${rows.length}`);
};

const sorted = [...REGION_CONTENT_REGISTRY].sort((a, b) => regionScoreTotal(b) - regionScoreTotal(a));

writeCsv(
  "05-region-opportunity.csv",
  ["region", "group", "regionType", "representativeUrl", "exists", "A_existing25", "B_size15", "C_busanLink15", "D_remote15", "E_gap10", "F_authority10", "G_unique10", "total100", "aBasis", "action", "batch", "familyCourt", "uniqueAngle", "defect"],
  sorted.map((e) => [
    e.region, e.group, e.regionType, e.representativeUrl, paths.has(e.representativeUrl) ? "Y" : "N",
    e.scores.A, e.scores.B, e.scores.C, e.scores.D, e.scores.E, e.scores.F, e.scores.G, regionScoreTotal(e),
    e.aBasis, e.action, e.batch ?? "", e.familyCourt, e.uniqueAngle, e.defect ?? "",
  ]),
);

const DEMAND_BASIS = {
  HIGH_DEMAND_PROXY: "광역시·특례시급 인구 규모(내부 tier). 검색량 숫자 미사용",
  MEDIUM: "인구 30만~100만 tier. 검색량 숫자 미사용",
  LOW: "인구 30만 미만 tier. 검색량 숫자 미사용",
  UNKNOWN: "근거 없음",
};
writeCsv(
  "06-demand-proxy.csv",
  ["region", "group", "demandProxy", "basis", "serpSampled", "serpPosition", "note"],
  sorted.map((e) => [
    e.region, e.group, e.demandProxy, DEMAND_BASIS[e.demandProxy], e.serp ? "Y" : "N",
    e.serp ? (e.serp.position ?? "absent") : "", e.serp?.note ?? "",
  ]),
);

const kwRows = [];
const add = (query, intent, owner, role, observed, note = "") =>
  kwRows.push([query, intent, owner, paths.has(owner) ? "Y" : "N", role, observed, note]);
for (const e of sorted) {
  const observed = e.serp ? e.serp.shown.join(" ") : "UNSAMPLED";
  add(e.targetIntent, "지역 상속등기 대표", e.representativeUrl, "PRIMARY", observed);
  for (const q of e.secondaryQueries) {
    const sub =
      /비용/.test(q) ? `/업무사례/${e.region}상속등기비용`
      : /포기/.test(q) ? (paths.has(`/업무사례/${e.region}상속포기한정승인`) ? `/업무사례/${e.region}상속포기한정승인` : `/업무사례/${e.region}상속포기법무사`)
      : /아파트/.test(q) && paths.has(`/업무사례/${e.region}아파트상속등기`) ? `/업무사례/${e.region}아파트상속등기`
      : e.representativeUrl;
    add(q, sub === e.representativeUrl ? "지역 상속등기 대표(보조 질의)" : "하위 의도", sub, sub === e.representativeUrl ? "SECONDARY" : "SUBTOPIC", observed,
      e.serp && sub === e.representativeUrl && e.serp.shown[0] && e.serp.shown[0] !== sub ? `관찰 1순위 URL이 다름: ${e.serp.shown[0]}` : "");
  }
  if (e.hubUrl && /법무사업무$/.test(e.hubUrl)) add(`${e.region} 법무사`, "지역 업무 전체 허브", e.hubUrl, "HUB", "", "상속 대표 URL과 역할 분리(허브→상속 대표 링크 유지)");
}
add("전국 상속등기", "전국 허브", "/전국상속등기", "PRIMARY", "", "");
add("타지역 상속등기", "전국 허브", "/전국상속등기", "SECONDARY", "", "");
add("비대면 상속등기", "전국 허브", "/전국상속등기", "SECONDARY", "", "/업무사례/전국상속등기법무사와 의도 중복 — REPOSITION_CANDIDATE(승인 필요)");
add("전국 상속등기 법무사", "전국 허브", "/전국상속등기", "PRIMARY", "", "/업무사례/전국상속등기법무사(내부 링크 다수)와 경합 — REPOSITION_CANDIDATE");
writeCsv("15-keyword-to-url.csv", ["query", "intent", "ownerUrl", "exists", "role", "observedSerpUrls", "note"], kwRows);

writeCsv(
  "07-remote-service-matrix.csv",
  ["id", "label", "matrixId", "remoteFitScore", "remoteStart", "remoteCompletion", "jurisdiction", "legalBasis", "originalsRequired", "visitMayBeRequired", "visitRisk", "safeMarketingPhrase", "verifiedAt"],
  REGIONAL_REMOTE_SERVICES.map((s) => [
    s.id, s.label, s.matrixId ?? "", s.remoteFitScore, s.remoteStart ? "Y" : "N", s.remoteCompletion, s.jurisdiction,
    s.legalBasis, s.originalsRequired, s.visitMayBeRequired, s.visitRisk, s.safeMarketingPhrase, s.verifiedAt,
  ]),
);

fs.writeFileSync(
  path.join(ROOT, ".cache", "regional-seo", "score.json"),
  JSON.stringify(sorted.map((e) => ({ ...e, total: regionScoreTotal(e), exists: paths.has(e.representativeUrl) })), null, 2),
);
