#!/usr/bin/env node
/**
 * IndexNow API URL 제출
 *
 * 사용:
 *   npm run indexnow
 *   npm run indexnow -- --dry-run
 *   npm run indexnow -- --limit=20
 *   npm run indexnow -- --endpoint=naver
 *   npm run indexnow:deploy   # 배포 후용: 키 URL 대기 + 재시도 + soft-fail
 *
 * 사전 조건:
 *   public/{key}.txt 가 프로덕션에 배포되어
 *   https://다옴법무사사무소.kr/{key}.txt 에서 키 문자열이 보여야 합니다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
import { getIndexablePaths } from "./lib/indexable-paths.mjs";
import {
  INDEXNOW_KEY,
  INDEXNOW_ENDPOINTS,
  getIndexNowHost,
  getIndexNowKeyLocation,
  pathToIndexNowUrl,
} from "./lib/indexnow.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = getSiteUrl().replace(/\/$/, "");
const KEY_FILE = path.join(ROOT, "public", `${INDEXNOW_KEY}.txt`);

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    soft: false,
    waitForKey: false,
    limit: null,
    endpoint: "global",
    retries: 24,
    retryDelaySec: 15,
  };
  for (const arg of argv) {
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--soft") opts.soft = true;
    else if (arg === "--wait-for-key") opts.waitForKey = true;
    else if (arg.startsWith("--limit=")) {
      opts.limit = Number(arg.slice("--limit=".length));
    } else if (arg.startsWith("--endpoint=")) {
      opts.endpoint = arg.slice("--endpoint=".length);
    } else if (arg.startsWith("--retries=")) {
      opts.retries = Number(arg.slice("--retries=".length));
    } else if (arg.startsWith("--retry-delay=")) {
      opts.retryDelaySec = Number(arg.slice("--retry-delay=".length));
    }
  }
  return opts;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fail(message, soft) {
  console.error(`[indexnow] ${message}`);
  process.exit(soft ? 0 : 1);
}

function assertKeyFile() {
  if (!fs.existsSync(KEY_FILE)) {
    fail(`키 파일 없음: public/${INDEXNOW_KEY}.txt`);
  }
  const content = fs.readFileSync(KEY_FILE, "utf8").trim();
  if (content !== INDEXNOW_KEY) {
    fail(
      `키 파일 내용이 키와 다릅니다.\n  expected: ${INDEXNOW_KEY}\n  got: ${content}`,
    );
  }
}

async function fetchKeyBody(keyLocation) {
  const keyRes = await fetch(keyLocation, {
    method: "GET",
    redirect: "follow",
    headers: { "cache-control": "no-cache" },
  });
  const keyBody = (await keyRes.text()).trim();
  return { ok: keyRes.ok, status: keyRes.status, body: keyBody };
}

async function waitForLiveKey(keyLocation, retries, retryDelaySec) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const { ok, status, body } = await fetchKeyBody(keyLocation);
      if (ok && body === INDEXNOW_KEY) {
        console.log(
          `[indexnow] 키 파일 확인 OK (attempt ${attempt}/${retries})`,
        );
        return true;
      }
      console.log(
        `[indexnow] 키 대기 중… HTTP ${status} bodyMatch=${body === INDEXNOW_KEY} (${attempt}/${retries})`,
      );
    } catch (err) {
      console.log(
        `[indexnow] 키 대기 중… ${err instanceof Error ? err.message : err} (${attempt}/${retries})`,
      );
    }
    if (attempt < retries) {
      await sleep(retryDelaySec * 1000);
    }
  }
  return false;
}

async function submit(endpointUrl, payload) {
  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text().catch(() => "");
  return { status: response.status, ok: response.ok, text };
}

async function submitWithRetry(endpointUrl, payload, retries, retryDelaySec) {
  let last = { status: 0, text: "" };
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    last = await submit(endpointUrl, payload);
    if (last.status === 200 || last.status === 202) {
      return last;
    }
    // 키 배포 직후·검증 대기 중
    const retriable =
      last.status === 403 ||
      last.status === 422 ||
      last.status === 429 ||
      last.status >= 500;
    console.warn(
      `[indexnow] 제출 응답 HTTP ${last.status} (attempt ${attempt}/${retries})`,
    );
    if (!retriable || attempt === retries) break;
    await sleep(retryDelaySec * 1000);
  }
  return last;
}

async function main() {
  if (process.env.INDEXNOW_DISABLED === "1") {
    console.log("[indexnow] INDEXNOW_DISABLED=1 — 건너뜁니다.");
    return;
  }

  const opts = parseArgs(process.argv.slice(2));
  assertKeyFile();

  const endpointUrl =
    INDEXNOW_ENDPOINTS[opts.endpoint] ??
    (opts.endpoint.startsWith("http") ? opts.endpoint : null);
  if (!endpointUrl) {
    fail(
      `알 수 없는 endpoint: ${opts.endpoint} (global|bing|naver|yandex|URL)`,
      opts.soft,
    );
  }

  const host = getIndexNowHost(SITE_URL);
  const keyLocation = getIndexNowKeyLocation(SITE_URL);
  let paths = getIndexablePaths();
  if (opts.limit != null && Number.isFinite(opts.limit) && opts.limit > 0) {
    paths = paths.slice(0, opts.limit);
  }

  const urlList = paths.map((p) => pathToIndexNowUrl(SITE_URL, p));
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList,
  };

  console.log(`[indexnow] site: ${SITE_URL}`);
  console.log(`[indexnow] host: ${host}`);
  console.log(`[indexnow] keyLocation: ${keyLocation}`);
  console.log(`[indexnow] endpoint: ${endpointUrl}`);
  console.log(`[indexnow] urls: ${urlList.length}`);

  if (opts.dryRun) {
    console.log("[indexnow] dry-run — 제출하지 않습니다.");
    console.log(
      JSON.stringify({ ...payload, urlList: urlList.slice(0, 5) }, null, 2),
    );
    if (urlList.length > 5) {
      console.log(`... 외 ${urlList.length - 5}개 URL`);
    }
    return;
  }

  if (opts.waitForKey) {
    const ready = await waitForLiveKey(
      keyLocation,
      opts.retries,
      opts.retryDelaySec,
    );
    if (!ready) {
      fail(
        `키 URL이 아직 준비되지 않았습니다: ${keyLocation}\n배포 완료 후 다시 실행하세요.`,
        opts.soft,
      );
      return;
    }
  } else {
    try {
      const { ok, status, body } = await fetchKeyBody(keyLocation);
      if (!ok) {
        console.warn(
          `[indexnow] 경고: 키 URL HTTP ${status} — 배포 후 다시 실행하세요.`,
        );
      } else if (body !== INDEXNOW_KEY) {
        console.warn(
          `[indexnow] 경고: 키 URL 내용이 일치하지 않습니다 (배포·CDN 캐시 확인).`,
        );
      } else {
        console.log(`[indexnow] 키 파일 확인 OK`);
      }
    } catch (err) {
      console.warn(
        `[indexnow] 경고: 키 URL 확인 실패 (${err instanceof Error ? err.message : err})`,
      );
    }
  }

  const result = await submitWithRetry(
    endpointUrl,
    payload,
    opts.waitForKey ? Math.min(opts.retries, 8) : 1,
    opts.retryDelaySec,
  );

  if (result.status === 200 || result.status === 202) {
    console.log(
      `[indexnow] OK — ${urlList.length} URLs submitted (HTTP ${result.status})`,
    );
    return;
  }

  if (result.status === 429) {
    fail(`Rate limited (429). 잠시 후 다시 시도하세요.\n${result.text}`, opts.soft);
    return;
  }

  fail(
    `제출 실패 HTTP ${result.status}\n${result.text || "(empty body)"}`,
    opts.soft,
  );
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err), false);
});
