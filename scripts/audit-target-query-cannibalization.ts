/**
 * Target-query cannibalization audit for high-intent clusters.
 * Run: npx --yes tsx scripts/audit-target-query-cannibalization.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  HIGH_INTENT_QUERIES,
  PROTECTED_GENERAL_CHAMPIONS,
} from "../src/data/seo/high-intent-query-map";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "reports/seo/target-query-cannibalization.json");
const TITLES = path.join(ROOT, "src/generated/admin-page-titles.json");

type TitleMap = Record<string, string>;

function loadTitles(): TitleMap {
  if (!fs.existsSync(TITLES)) return {};
  const raw = JSON.parse(fs.readFileSync(TITLES, "utf8")) as {
    titles?: TitleMap;
  };
  return raw.titles ?? {};
}

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function relevance(text: string, query: string): number {
  const q = tokens(query);
  if (!q.length || !text) return 0;
  const hay = text.toLowerCase();
  let hit = 0;
  for (const t of q) if (hay.includes(t)) hit += 1;
  return Math.round((hit / q.length) * 100);
}

function main() {
  const titles = loadTitles();
  const rows = HIGH_INTENT_QUERIES.map((row) => {
    const candidates = [
      ...new Set([row.primaryChampion, ...row.supporting, ...row.competing]),
    ];
    const scored = candidates.map((url) => {
      const title = titles[url] ?? "";
      return {
        url,
        title,
        titleRelevance: relevance(title, row.query),
        role:
          url === row.primaryChampion
            ? "primary"
            : row.competing.includes(url)
              ? "competing"
              : "supporting",
      };
    });
    const competingHigh = scored.filter(
      (s) => s.role !== "primary" && s.titleRelevance >= 80,
    );
    return {
      query: row.query,
      cluster: row.cluster,
      intent: row.intent,
      primaryChampion: row.primaryChampion,
      coverage: row.coverage,
      cannibalization: row.cannibalization,
      action: row.action,
      rankingObservation: row.rankingObservation,
      candidates: scored,
      competingTitleRisk: competingHigh.map((s) => s.url),
      conflictsWithGeneralChampion: [
        PROTECTED_GENERAL_CHAMPIONS.BUSAN_GENERAL,
        PROTECTED_GENERAL_CHAMPIONS.BUSAN_CORPORATE,
      ].some((c) => c === row.primaryChampion),
    };
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    trendData: "TREND_DATA_UNAVAILABLE",
    queryCount: rows.length,
    highCannibalization: rows.filter((r) => r.cannibalization === "high").map((r) => r.query),
    watch: rows.filter((r) => r.cannibalization === "watch").map((r) => r.query),
    newUrlsCreated: 0,
    protectedGeneralUntouched: true,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ summary, rows }, null, 2) + "\n", "utf8");
  console.log(`[audit-target-query-cannibalization] ${rows.length} queries → ${OUT}`);
  console.log(`  high: ${summary.highCannibalization.length}, watch: ${summary.watch.length}`);
}

main();
