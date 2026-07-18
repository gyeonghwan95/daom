#!/usr/bin/env node
/**
 * 기존 URL baseline 유지 검사.
 * scripts/output/existing-routes-baseline.json 의 publishedPaths가
 * 현재 getAllPublishedPaths()에 모두 포함되는지 확인한다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";
import { normalizeRouteSlug } from "./lib/published-paths.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = path.join(ROOT, "scripts/output/existing-routes-baseline.json");

const REQUIRED_NEW = [
  "/partners",
  "/부산법무사복대리",
  "/부산부동산협력법무사",
  "/협업문의",
  "/부산집단등기",
  "/부산부동산등기복대리",
  "/부산법인등기복대리",
  "/부산등기접수협업",
  "/부산등기보정업무",
  "/부산등기소현지업무",
  "/부산원거리등기협업",
  "/부산잔금등기협업",
  "/부산건축사등기협업",
  "/부산시행사등기",
  "/부산건설사등기",
  "/부산분양등기",
  "/부산법인등기아웃소싱",
];

function fail(message) {
  console.error(`[check-existing-routes] ERROR: ${message}`);
  process.exit(1);
}

function main() {
  if (!fs.existsSync(BASELINE)) {
    fail(
      `baseline 없음: ${BASELINE}\n먼저 baseline을 생성하세요.`,
    );
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
  const baselinePaths = (baseline.publishedPaths ?? []).map((p) =>
    normalizeRouteSlug(p),
  );
  const current = new Set(
    getAllPublishedPaths().map((p) => normalizeRouteSlug(p)),
  );

  const missing = baselinePaths.filter((p) => !current.has(p));
  if (missing.length > 0) {
    fail(
      `기존 URL ${missing.length}개가 사라졌습니다.\n` +
        missing.slice(0, 20).join("\n") +
        (missing.length > 20 ? `\n... 외 ${missing.length - 20}개` : ""),
    );
  }

  const missingNew = REQUIRED_NEW.filter((p) => !current.has(normalizeRouteSlug(p)));
  if (missingNew.length > 0) {
    fail(`필수 신규/유지 URL 누락: ${missingNew.join(", ")}`);
  }

  console.log(
    `[check-existing-routes] OK — baseline ${baselinePaths.length}개 유지, 현재 ${current.size}개, 신규 B2B URL 확인`,
  );
}

main();
