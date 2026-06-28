#!/usr/bin/env node
/**
 * SEO 검색 의도 DB 검증 (prebuild)
 * slug 중복·id 중복·참조 무결성 확인
 */
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`[validate-seo-intent-db] ${message}`);
  process.exit(1);
}

try {
  const output = execSync("npx --yes jiti scripts/run-validate-seo-intent-db.ts", {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const lastLine = output.trim().split("\n").filter(Boolean).pop();
  if (!lastLine) {
    fail("no validation output");
  }

  const parsed = JSON.parse(lastLine);
  if (!parsed.ok) {
    fail("validation returned not ok");
  }

  console.log(
    `[validate-seo-intent-db] OK — ${parsed.total} entities (regions ${parsed.stats.regions}, services ${parsed.stats.services}, intents ${parsed.stats.intents}, institutions ${parsed.stats.institutions}, special ${parsed.stats.specialKeywords})`,
  );
} catch (error) {
  const stderr =
    error && typeof error === "object" && "stderr" in error
      ? String(error.stderr)
      : "";
  const stdout =
    error && typeof error === "object" && "stdout" in error
      ? String(error.stdout)
      : "";
  fail((stderr || stdout || String(error)).trim() || "validation failed");
}
