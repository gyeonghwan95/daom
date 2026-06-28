#!/usr/bin/env node
/**
 * 중앙 pageData 기준 SEO 페이지 manifest 생성 (prebuild·check-seo)
 */
import { createJiti } from "jiti";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "scripts/output");
const MANIFEST = path.join(OUT_DIR, "seo-pages-manifest.json");
const PATHS_ONLY = path.join(OUT_DIR, "seo-paths.json");

function fail(message) {
  console.error(`[generate-seo-pages] ${message}`);
  process.exit(1);
}

try {
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    alias: {
      "@": path.join(ROOT, "src"),
    },
  });

  const mod = jiti("./export-seo-pages.ts");
  const parsed = mod.default ?? mod;

  if (!parsed?.ok || !Array.isArray(parsed.pages)) {
    fail("invalid export payload from export-seo-pages.ts");
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  fs.writeFileSync(
    MANIFEST,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: parsed.total,
        paths: parsed.paths,
        pages: parsed.pages,
      },
      null,
      2,
    ),
    "utf8",
  );

  fs.writeFileSync(
    PATHS_ONLY,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: parsed.total,
        paths: parsed.paths,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    `[generate-seo-pages] OK — ${parsed.total} SEO pages → ${path.relative(ROOT, MANIFEST)}`,
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
