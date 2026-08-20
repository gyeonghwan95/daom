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
  // Pages Functions용 공용 로직 동기화 (src → functions/_lib)
  const coreSrc = path.join(ROOT, "src/lib/quick-inquiry/core");
  const coreDest = path.join(ROOT, "functions/_lib/quick-inquiry");
  if (fs.existsSync(coreSrc)) {
    fs.mkdirSync(coreDest, { recursive: true });
    fs.cpSync(coreSrc, coreDest, { recursive: true });
  }

  const nextDir = path.join(ROOT, ".next");
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
  }

  // Cloudflare Pages: Next 16 기본 Turbopack이 대량 라우트(~1800)에서
  // "Creating an optimized production build" 이후 로그 없이 행(hang)되는 사례가 있음.
  // → 프로덕션 정적 export는 webpack 강제. 리다이렉트는 public/_redirects.
  console.log(
    "\n[build-static] next build --webpack 시작 (STATIC_EXPORT=true, output: export)",
  );
  console.log(
    "[build-static] CF에서 Turbopack hang 회피 — 컴파일 후 Generating static pages (~1800) 진행\n",
  );

  execSync("npx --yes next build --webpack", {
    stdio: "inherit",
    cwd: ROOT,
    env: {
      ...process.env,
      STATIC_EXPORT: "true",
      NEXT_TELEMETRY_DISABLED: "1",
      // CF Pages 등 메모리 여유 확보 (OOM으로 로그 없이 끊기는 경우 완화)
      NODE_OPTIONS:
        process.env.NODE_OPTIONS?.includes("max-old-space-size")
          ? process.env.NODE_OPTIONS
          : [process.env.NODE_OPTIONS, "--max-old-space-size=4096"]
              .filter(Boolean)
              .join(" "),
    },
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

  execSync("node scripts/validate-sitemap.mjs --out", {
    stdio: "inherit",
    cwd: ROOT,
  });

  execSync("node scripts/seo-validate.mjs", {
    stdio: "inherit",
    cwd: ROOT,
  });
} finally {
  restoreApiRoutes();
}
