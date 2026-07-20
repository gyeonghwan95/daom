#!/usr/bin/env node
/**
 * IndexNow — 이전 스냅샷 대비 신규·수정 URL만 제출 (Google 미사용, Naver/Bing/Yandex)
 *
 *   npm run indexnow
 *   npm run indexnow -- --dry-run
 *   npm run indexnow -- --endpoint=naver
 *   npm run indexnow:deploy
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
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
const MANIFEST = path.join(ROOT, "scripts/output/sitemap-manifest.json");
const SNAPSHOT = path.join(ROOT, "scripts/output/indexnow-snapshot.json");

/** Google은 IndexNow 미지원 — global(Bing 중계) 대신 Naver 기본 */
const DEFAULT_ENDPOINT = "naver";

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    soft: false,
    waitForKey: false,
    full: false,
    limit: null,
    endpoint: DEFAULT_ENDPOINT,
    retries: 24,
    retryDelaySec: 15,
  };
  for (const arg of argv) {
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--soft") opts.soft = true;
    else if (arg === "--wait-for-key") opts.waitForKey = true;
    else if (arg === "--full") opts.full = true;
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
    fail(`키 파일 내용이 키와 다릅니다.\n  expected: ${INDEXNOW_KEY}\n  got: ${content}`);
  }
}

function loadCurrentEntries() {
  if (!fs.existsSync(MANIFEST)) {
    fail("sitemap-manifest.json 없음 — npm run sitemap:generate 먼저 실행");
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  return manifest.entries.map((e) => ({
    path: e.path,
    loc: e.loc,
    lastmod: e.lastmod ?? null,
  }));
}

function loadSnapshot() {
  if (!fs.existsSync(SNAPSHOT)) return null;
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
  } catch {
    return null;
  }
}

function saveSnapshot(entries) {
  fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
  const map = Object.fromEntries(
    entries.map((e) => [e.path, { loc: e.loc, lastmod: e.lastmod }]),
  );
  fs.writeFileSync(
    SNAPSHOT,
    `${JSON.stringify({ siteUrl: SITE_URL, updatedAt: new Date().toISOString(), urls: map }, null, 2)}\n`,
    "utf8",
  );
}

function computeDiff(current, previous, full) {
  if (full || !previous?.urls) {
    return {
      added: current,
      changed: [],
      removed: [],
      mode: full ? "full" : "initial",
    };
  }

  const prev = previous.urls;
  const added = [];
  const changed = [];
  const removed = [];

  for (const entry of current) {
    const prior = prev[entry.path];
    if (!prior) {
      added.push(entry);
    } else if (entry.lastmod && prior.lastmod && entry.lastmod !== prior.lastmod) {
      changed.push(entry);
    } else if (entry.loc !== prior.loc) {
      changed.push(entry);
    }
  }

  for (const pathKey of Object.keys(prev)) {
    if (!current.some((e) => e.path === pathKey)) {
      removed.push({ path: pathKey, loc: prev[pathKey].loc });
    }
  }

  return { added, changed, removed, mode: "diff" };
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
        console.log(`[indexnow] 키 파일 확인 OK (attempt ${attempt}/${retries})`);
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
    if (attempt < retries) await sleep(retryDelaySec * 1000);
  }
  return false;
}

async function submit(endpointUrl, payload) {
  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await response.text().catch(() => "");
  return { status: response.status, ok: response.ok, text };
}

async function submitWithRetry(endpointUrl, payload, retries, retryDelaySec) {
  let last = { status: 0, text: "" };
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    last = await submit(endpointUrl, payload);
    if (last.status === 200 || last.status === 202) return last;
    const retriable =
      last.status === 403 || last.status === 422 || last.status === 429 || last.status >= 500;
    console.warn(`[indexnow] 제출 응답 HTTP ${last.status} (attempt ${attempt}/${retries})`);
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

  if (opts.endpoint === "google" || opts.endpoint === "global") {
    console.warn(
      "[indexnow] Google은 IndexNow를 지원하지 않습니다. endpoint=naver 또는 bing 를 사용합니다.",
    );
    opts.endpoint = DEFAULT_ENDPOINT;
  }

  const endpointUrl =
    INDEXNOW_ENDPOINTS[opts.endpoint] ??
    (opts.endpoint.startsWith("http") ? opts.endpoint : null);
  if (!endpointUrl) {
    fail(`알 수 없는 endpoint: ${opts.endpoint} (naver|bing|yandex|URL)`, opts.soft);
  }

  const host = getIndexNowHost(SITE_URL);
  const keyLocation = getIndexNowKeyLocation(SITE_URL);
  const current = loadCurrentEntries();
  const previous = loadSnapshot();
  const diff = computeDiff(current, previous, opts.full);

  const toSubmit = [...diff.added, ...diff.changed];
  let urlList = toSubmit.map((e) => e.loc);

  if (opts.limit != null && Number.isFinite(opts.limit) && opts.limit > 0) {
    urlList = urlList.slice(0, opts.limit);
  }

  console.log(`[indexnow] site: ${SITE_URL}`);
  console.log(`[indexnow] mode: ${diff.mode}`);
  console.log(`[indexnow] added: ${diff.added.length}, changed: ${diff.changed.length}, removed: ${diff.removed.length}`);
  console.log(`[indexnow] submit: ${urlList.length} URLs → ${opts.endpoint}`);

  if (diff.removed.length > 0) {
    console.log(
      `[indexnow] removed ${diff.removed.length} URLs (IndexNow 삭제 알림 미지원 — Search Console에서 확인 권장)`,
    );
    for (const r of diff.removed.slice(0, 10)) {
      console.log(`  - ${r.loc}`);
    }
    if (diff.removed.length > 10) {
      console.log(`  ... 외 ${diff.removed.length - 10}건`);
    }
  }

  if (urlList.length === 0) {
    console.log("[indexnow] 제출할 변경 URL 없음 — 스냅샷만 갱신합니다.");
    if (!opts.dryRun) saveSnapshot(current);
    return;
  }

  const payload = { host, key: INDEXNOW_KEY, keyLocation, urlList };

  if (opts.dryRun) {
    console.log("[indexnow] dry-run — 제출하지 않습니다.");
    console.log(JSON.stringify({ ...payload, urlList: urlList.slice(0, 5) }, null, 2));
    if (urlList.length > 5) console.log(`... 외 ${urlList.length - 5}개 URL`);
    return;
  }

  if (opts.waitForKey) {
    const ready = await waitForLiveKey(keyLocation, opts.retries, opts.retryDelaySec);
    if (!ready) {
      fail(`키 URL이 아직 준비되지 않았습니다: ${keyLocation}`, opts.soft);
      return;
    }
  }

  const result = await submitWithRetry(
    endpointUrl,
    payload,
    opts.waitForKey ? Math.min(opts.retries, 8) : 1,
    opts.retryDelaySec,
  );

  if (result.status === 200 || result.status === 202) {
    console.log(`[indexnow] OK — ${urlList.length} URLs submitted (HTTP ${result.status})`);
    saveSnapshot(current);
    return;
  }

  if (result.status === 429) {
    fail(`Rate limited (429). 잠시 후 다시 시도하세요.\n${result.text}`, opts.soft);
    return;
  }

  fail(`제출 실패 HTTP ${result.status}\n${result.text || "(empty body)"}`, opts.soft);
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err), false);
});
