#!/usr/bin/env node
/**
 * Static export build → out/ (Cloudflare Pages 등).
 * API routes are temporarily stashed because `output: export` does not support them.
 * Server build with admin API: `npm run build:server`
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(ROOT, "src/app/api");
const backupDir = path.join(ROOT, "src/app/_api_static_backup");
let stashedApi = false;

function sleepSync(ms) {
  try {
    if (process.platform === "win32") {
      execSync(`ping -n ${Math.max(2, Math.ceil(ms / 1000) + 1)} 127.0.0.1 >nul`, {
        stdio: "ignore",
      });
    } else {
      execSync(`sleep ${Math.max(1, Math.ceil(ms / 1000))}`, { stdio: "ignore" });
    }
  } catch {
    // ignore
  }
}

function removeDirWithRetry(target, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      }
      if (!fs.existsSync(target)) return true;
    } catch {
      // Windows dev lock 등
    }
    sleepSync(400 * (attempt + 1));
  }
  return !fs.existsSync(target);
}

function stashApiRoutes() {
  if (!fs.existsSync(apiDir)) return;

  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }

  fs.cpSync(apiDir, backupDir, { recursive: true });

  if (removeDirWithRetry(apiDir)) {
    stashedApi = true;
    return;
  }

  try {
    fs.renameSync(apiDir, backupDir);
    stashedApi = true;
    return;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error ? error.code : "";
    if (code === "EPERM" || code === "EBUSY") {
      console.error(
        "\n[build-static] API 폴더를 임시 이동할 수 없습니다. `npm run dev`를 중지한 뒤 다시 빌드해 주세요.\n",
      );
    }
    throw error;
  }
}

function restoreApiRoutes() {
  if (!stashedApi) return;

  if (fs.existsSync(backupDir)) {
    if (fs.existsSync(apiDir)) {
      removeDirWithRetry(apiDir);
    }

    if (!fs.existsSync(apiDir)) {
      try {
        fs.renameSync(backupDir, apiDir);
      } catch {
        fs.cpSync(backupDir, apiDir, { recursive: true });
        removeDirWithRetry(backupDir);
      }
    } else {
      fs.cpSync(backupDir, apiDir, { recursive: true });
      removeDirWithRetry(backupDir);
    }
  }

  stashedApi = false;
}

stashApiRoutes();

try {
  const nextDir = path.join(ROOT, ".next");
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
  }

  execSync("next build", {
    stdio: "inherit",
    cwd: ROOT,
    env: { ...process.env, STATIC_EXPORT: "true" },
  });

  const outDir = path.join(ROOT, "out");
  if (!fs.existsSync(outDir)) {
    console.error("\n[build-static] 빌드는 완료됐지만 out/ 폴더가 없습니다.\n");
    process.exit(1);
  }

  execSync("node scripts/validate-out-routes.mjs", {
    stdio: "inherit",
    cwd: ROOT,
  });

  execSync("node scripts/validate-sitemap.mjs", {
    stdio: "inherit",
    cwd: ROOT,
  });
} finally {
  restoreApiRoutes();
}
