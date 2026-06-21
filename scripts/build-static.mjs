#!/usr/bin/env node
/**
 * Static export build (no API routes). Admin features require `npm run build` instead.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(ROOT, "src/app/api");
const backupDir = path.join(ROOT, "src/app/_api_static_backup");
let movedApi = false;

if (fs.existsSync(apiDir)) {
  fs.renameSync(apiDir, backupDir);
  movedApi = true;
}

try {
  execSync("next build", {
    stdio: "inherit",
    cwd: ROOT,
    env: { ...process.env, STATIC_EXPORT: "true" },
  });
} finally {
  if (movedApi && fs.existsSync(backupDir)) {
    fs.renameSync(backupDir, apiDir);
  }
}
