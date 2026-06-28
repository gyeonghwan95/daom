#!/usr/bin/env node
/**
 * 중앙 pageData 레지스트리 검증 + path manifest 생성 (prebuild)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getAllPublishedPaths,
  normalizeRouteSlug,
} from "./lib/published-paths.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "scripts/output");
const MANIFEST_PATH = path.join(OUT_DIR, "page-manifest.json");

function fail(message) {
  console.error(`[validate-page-data] ${message}`);
  process.exit(1);
}

function readSlugsFromConfig(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, "utf8");
  return [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) =>
    normalizeRouteSlug(m[1]),
  );
}

function validateDuplicatePaths(paths) {
  const seen = new Map();
  const duplicates = [];

  for (const routePath of paths) {
    const key = normalizeRouteSlug(routePath);
    if (seen.has(key)) {
      duplicates.push({ path: routePath, existing: seen.get(key) });
    } else {
      seen.set(key, routePath);
    }
  }

  if (duplicates.length > 0) {
    fail(
      `duplicate path detected:\n${duplicates
        .map((d) => `  ${d.path} (conflicts with ${d.existing})`)
        .join("\n")}`,
    );
  }
}

function validateKoreanSlugOverlap() {
  const landing = [
    ...new Set([
      ...readSlugsFromConfig(
        path.join(ROOT, "src/lib/local-landing/config.ts"),
      ),
      ...readSlugsFromConfig(
        path.join(
          ROOT,
          "src/lib/local-landing/expansion/config-expansion.ts",
        ),
      ),
    ]),
  ];
  const hubs = [
    ...new Set(
      readSlugsFromConfig(path.join(ROOT, "src/lib/topic-hubs/config.ts")),
    ),
  ];

  const hubSet = new Set(hubs);
  const overlap = landing.filter((slug) => hubSet.has(slug));

  if (overlap.length > 0) {
    fail(`duplicate korean slug (landing ∩ topic hub): ${overlap.join(", ")}`);
  }

  const landingSet = new Set(landing);
  const duplicateLanding = landing.filter(
    (slug, index) => landing.indexOf(slug) !== index,
  );
  if (duplicateLanding.length > 0) {
    fail(`duplicate local landing slug: ${[...new Set(duplicateLanding)].join(", ")}`);
  }

  const duplicateHubs = hubs.filter(
    (slug, index) => hubs.indexOf(slug) !== index,
  );
  if (duplicateHubs.length > 0) {
    fail(`duplicate topic hub slug: ${[...new Set(duplicateHubs)].join(", ")}`);
  }
}

function writeManifest(paths) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: paths.length,
        paths,
      },
      null,
      2,
    ),
    "utf8",
  );
}

function main() {
  const paths = getAllPublishedPaths();

  validateDuplicatePaths(paths);
  validateKoreanSlugOverlap();

  writeManifest(paths);

  console.log(`[validate-page-data] OK — ${paths.length} paths registered`);
  console.log(`[validate-page-data] manifest → scripts/output/page-manifest.json`);
  console.log("");
  for (const routePath of paths) {
    console.log(routePath);
  }
}

main();
