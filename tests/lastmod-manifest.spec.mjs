/**
 * 사이트맵 lastmod manifest — Cloudflare 재빌드(새 clone·shallow checkout)에서 날짜가 바뀌지 않는지,
 * 실제 콘텐츠가 바뀐 URL만 갱신되는지 확인한다.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveLastmod, validateLastmod } from "../scripts/lib/sitemap/lastmod.mjs";
import { applyFingerprintUpdate, buildFingerprints, extractPageText } from "../scripts/lib/sitemap/page-fingerprint.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LASTMOD_MODULE = path.join(ROOT, "scripts/lib/sitemap/lastmod.mjs");

test("잘못된 날짜·미래 날짜·2000년 이전 값은 거부한다", () => {
  assert.equal(validateLastmod("2026-10-11", "2026-10-11"), "2026-10-11");
  assert.equal(validateLastmod("2026-10-12", "2026-10-11"), null);
  assert.equal(validateLastmod("2026-13-01", "2026-10-11"), null);
  assert.equal(validateLastmod("2026-02-30", "2026-10-11"), null);
  assert.equal(validateLastmod("1999-12-31", "2026-10-11"), null);
  assert.equal(validateLastmod("2026-10-11T00:00:00Z", "2026-10-11"), null);
});

test("manifest에 없는 URL은 lastmod를 생략한다", () => {
  const routes = { "/a": "2026-10-01" };
  assert.equal(resolveLastmod(routes, "/a", "2026-10-11"), "2026-10-01");
  assert.equal(resolveLastmod(routes, "/b", "2026-10-11"), null);
});

test("생성기는 파일 mtime·Git·빌드 시각을 읽지 않는다(새 clone·shallow checkout에서도 같은 결과)", () => {
  const src = fs.readFileSync(LASTMOD_MODULE, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  assert.doesNotMatch(src, /statSync|mtime|child_process|execFileSync|execSync|Date\.now\(\)/);
});

test("소스 파일 mtime이 바뀌어도 같은 URL의 lastmod는 그대로다", async () => {
  const load = async () => (await import(`${pathToFileURL(LASTMOD_MODULE).href}?t=${Math.random()}`)).getLastmodForPath;
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/lib/sitemap/lastmod-manifest.json"), "utf8")).routes;
  const sample = Object.keys(manifest).slice(0, 20);
  const before = await load();
  const values = sample.map((r) => before(r));
  const target = path.join(ROOT, "src/lib/seo-landing/content.ts");
  const stat = fs.statSync(target);
  try {
    fs.utimesSync(target, new Date(), new Date());
    const after = await load();
    assert.deepEqual(sample.map((r) => after(r)), values);
  } finally {
    fs.utimesSync(target, stat.atime, stat.mtime);
  }
});

const page = (title, own, common) =>
  `<html><head><title>${title}</title><meta name="description" content="${title} 설명"></head><body><nav>메뉴</nav><main><h1>${title}</h1><p>${own}</p><p>${common}</p></main><footer>© 2026</footer></body></html>`;

test("공통 블록(전 페이지 같은 문장)만 바뀌면 지문이 그대로다", () => {
  const make = (common) => {
    const pages = {};
    for (let i = 0; i < 10; i++) pages[`/p${i}`] = extractPageText(page(`페이지${i}`, `고유 문장 ${i}`, common));
    return buildFingerprints(pages);
  };
  assert.deepEqual(make("공통 상담 안내 A"), make("공통 상담 안내 B"));
});

test("본문이 바뀐 URL만 날짜가 갱신되고, 새 URL은 날짜 없이 지문만 기록된다", () => {
  const build = (changeP3) => {
    const pages = {};
    for (let i = 0; i < 10; i++) pages[`/p${i}`] = extractPageText(page(`페이지${i}`, i === 3 && changeP3 ? "고친 문장" : `고유 문장 ${i}`, "공통"));
    return buildFingerprints(pages);
  };
  const previous = build(false);
  const routes = { "/p1": "2026-10-01", "/p3": "2026-10-01" };
  const same = applyFingerprintUpdate({ previous, routes, current: build(false), date: "2026-10-11" });
  assert.deepEqual(same.changed, []);
  assert.deepEqual(same.routes, routes);

  const current = { ...build(true), "/new": "abc" };
  const res = applyFingerprintUpdate({ previous, routes, current, date: "2026-10-11" });
  assert.deepEqual(res.changed, ["/p3"]);
  assert.equal(res.routes["/p3"], "2026-10-11");
  assert.equal(res.routes["/p1"], "2026-10-01");
  assert.deepEqual(res.added, ["/new"]);
  assert.equal(res.routes["/new"], undefined);
  assert.equal(res.fingerprints["/new"], "abc");
});
