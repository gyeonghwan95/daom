#!/usr/bin/env node
/**
 * IndexNow API URL 제출
 *
 * 사용:
 *   npm run indexnow              # 색인 대상 전체 제출 (dry-run 아님)
 *   npm run indexnow -- --dry-run # 요청 본문만 출력
 *   npm run indexnow -- --limit=20
 *   npm run indexnow -- --endpoint=naver
 *
 * 사전 조건:
 *   public/{key}.txt 가 배포되어
 *   https://다옴법무사사무소.kr/{key}.txt 에서 키 문자열이 보여야 합니다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
import { getIndexablePaths } from "./lib/indexable-paths.mjs";
import {
  INDEXNOW_KEY,
  INDEXNOW_ENDPOINT,
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
    limit: null,
    endpoint: "global",
  };
  for (const arg of argv) {
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg.startsWith("--limit=")) {
      opts.limit = Number(arg.slice("--limit=".length));
    } else if (arg.startsWith("--endpoint=")) {
      opts.endpoint = arg.slice("--endpoint=".length);
    }
  }
  return opts;
}

function fail(message) {
  console.error(`[indexnow] ${message}`);
  process.exit(1);
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

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  assertKeyFile();

  const endpointUrl =
    INDEXNOW_ENDPOINTS[opts.endpoint] ??
    (opts.endpoint.startsWith("http") ? opts.endpoint : null);
  if (!endpointUrl) {
    fail(
      `알 수 없는 endpoint: ${opts.endpoint} (global|bing|naver|yandex|URL)`,
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
    console.log(JSON.stringify({ ...payload, urlList: urlList.slice(0, 5) }, null, 2));
    if (urlList.length > 5) {
      console.log(`... 외 ${urlList.length - 5}개 URL`);
    }
    return;
  }

  // 키 파일이 라이브에 있는지 사전 확인 (배포 후 권장)
  try {
    const keyRes = await fetch(keyLocation, {
      method: "GET",
      redirect: "follow",
    });
    const keyBody = (await keyRes.text()).trim();
    if (!keyRes.ok) {
      console.warn(
        `[indexnow] 경고: 키 URL HTTP ${keyRes.status} — 배포 후 다시 실행하세요.`,
      );
    } else if (keyBody !== INDEXNOW_KEY) {
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

  const result = await submit(endpointUrl, payload);

  // IndexNow: 200 OK, 202 Accepted 가 성공
  if (result.status === 200 || result.status === 202) {
    console.log(
      `[indexnow] OK — ${urlList.length} URLs submitted (HTTP ${result.status})`,
    );
    return;
  }

  if (result.status === 429) {
    fail(`Rate limited (429). 잠시 후 다시 시도하세요.\n${result.text}`);
  }

  fail(`제출 실패 HTTP ${result.status}\n${result.text || "(empty body)"}`);
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});
