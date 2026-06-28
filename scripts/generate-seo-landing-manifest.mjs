#!/usr/bin/env node
/**
 * SEO 자동 생성 랜딩 manifest (prebuild)
 */
import { createJiti } from "jiti";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "scripts/output");
const MANIFEST = path.join(OUT_DIR, "seo-landing-manifest.json");

function fail(message) {
  console.error(`[generate-seo-landing-manifest] ${message}`);
  process.exit(1);
}

try {
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    alias: {
      "@": path.join(ROOT, "src"),
    },
  });

  const mod = jiti("./export-seo-landing-paths.ts");
  const parsed = mod.default ?? mod;

  if (!parsed?.ok || !Array.isArray(parsed.paths)) {
    fail("invalid export payload");
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    MANIFEST,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: parsed.paths.length,
        paths: parsed.paths,
        stats: parsed.stats,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    `[generate-seo-landing-manifest] OK — ${parsed.paths.length} SEO landing paths → ${path.relative(ROOT, MANIFEST)}`,
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
