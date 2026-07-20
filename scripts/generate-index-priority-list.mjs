#!/usr/bin/env node
/**
 * 색인 우선순위 URL 전체 목록 생성
 *   npm run sitemap:generate 후 또는 함께 실행
 *   → scripts/output/index-priority-urls.txt
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectSitemapEntries } from "./lib/sitemap/collect.mjs";
import { getSiteUrl } from "./lib/site-url.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "scripts/output/index-priority-urls.txt");
const SITE = getSiteUrl().replace(/\/$/, "");

const TIER_LABELS = {
  1: "Tier 1 — 즉시 (핵심 전환·허브)",
  2: "Tier 2 — 1주차 (지역·전국 허브)",
  3: "Tier 3 — 2주차 (광역·비용·자가진단·도구)",
  4: "Tier 4 — 3~4주차 (구·군·시·부산 업무사례)",
  5: "Tier 5 — 2개월 (동·생활권·경남·크로스)",
  6: "Tier 6 — 순차 (기타 키워드 랜딩)",
  7: "Tier 7 — 후순위 (블로그)",
  8: "Tier 8 — 후순위 (언론·강의)",
};

function main() {
  const { entries, excluded } = collectSitemapEntries();
  const tierCounts = {};

  for (const e of entries) {
    tierCounts[e.tier] = (tierCounts[e.tier] ?? 0) + 1;
  }

  const lines = [];
  lines.push("# 다옴법무사사무소 — 색인 우선순위 URL 전체 목록");
  lines.push(`# 생성: ${new Date().toISOString()}`);
  lines.push(`# 사이트: ${SITE}`);
  lines.push(`# 총 URL: ${entries.length} (제외 ${excluded.length})`);
  lines.push("#");
  lines.push("# 형식: [Tier] URL\\tpath");
  for (const [tier, count] of Object.entries(tierCounts).sort((a, b) => a[0] - b[0])) {
    lines.push(`# ${TIER_LABELS[tier] ?? `Tier ${tier}`}: ${count}개`);
  }
  lines.push("");
  lines.push("=".repeat(72));

  let currentTier = null;
  for (const { tier, loc, path: routePath } of entries) {
    if (tier !== currentTier) {
      currentTier = tier;
      lines.push("");
      lines.push(`${"─".repeat(72)}`);
      lines.push(`${TIER_LABELS[tier] ?? `Tier ${tier}`} (${tierCounts[tier]}개)`);
      lines.push(`${"─".repeat(72)}`);
    }
    lines.push(`[T${tier}] ${loc}\t${routePath}`);
  }

  if (excluded.length > 0) {
    lines.push("");
    lines.push("=".repeat(72));
    lines.push(`# 제외 (${excluded.length})`);
    for (const { path: routePath, reason } of excluded) {
      lines.push(`# [EXCLUDED:${reason}] ${routePath}`);
    }
  }

  lines.push("");
  lines.push("=".repeat(72));
  lines.push("# END");

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${lines.join("\n")}\n`, "utf8");

  console.log(`Wrote ${entries.length} URLs → ${OUT}`);
  console.log("Tier counts:", tierCounts);
}

main();
