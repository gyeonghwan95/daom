#!/usr/bin/env node
/**
 * public/image/logo.png → app/icon, apple-icon, public/favicon.ico 동기화
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "public/image/logo.png");
const TARGETS = [
  path.join(ROOT, "src/app/icon.png"),
  path.join(ROOT, "src/app/apple-icon.png"),
  path.join(ROOT, "public/favicon.ico"),
];

if (!fs.existsSync(SOURCE)) {
  console.error("[sync-favicon] missing:", SOURCE);
  process.exit(1);
}

for (const target of TARGETS) {
  fs.copyFileSync(SOURCE, target);
}

console.log("[sync-favicon] synced logo.png → app icons + public/favicon.ico");
