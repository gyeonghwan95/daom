/**
 * SEO 회복 회귀 테스트 — 정적 export 결과(out/)를 검사한다.
 * 먼저 `npm run build`로 out/을 만든 뒤 `npm test`로 실행한다.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  OUT,
  scanAll,
  readSitemapUrls,
  readRedirectSources,
  readRobotsDisallow,
  isBlockedByRobots,
  isIndexable,
  canonicalPath,
  routeToFile,
} from "../scripts/lib/seo-recovery/scan-out.mjs";
import {
  FACT_RULES,
  SCOPE_RULES,
  findRuleHits,
  isViolation,
} from "../scripts/lib/seo-recovery/content-rules.mjs";

if (!fs.existsSync(OUT)) {
  throw new Error("out/ 폴더가 없습니다. npm run build 후 실행하세요.");
}

const CORE_URLS = [
  "/",
  "/about",
  "/location",
  "/부산법무사",
  "/부산상속등기",
  "/상속등기비용",
  "/부산상속포기",
  "/부산한정승인",
  "/부산부동산등기",
  "/부산법인등기",
  "/부산개인회생",
  "/services/inheritance-registration",
  "/services/inheritance-renunciation",
];

const pages = scanAll();
const all = [...pages.values()];
const indexable = all.filter(isIndexable);
const indexableSelf = indexable.filter((p) => canonicalPath(p.canonical) === p.route);

const redirects = readRedirectSources();
const redirectFrom = new Set(redirects.filter((r) => !r.from.includes("*")).map((r) => r.from));
const redirectPrefixes = redirects.filter((r) => r.from.endsWith("/*")).map((r) => r.from.slice(0, -1));
const isRedirect = (p: string) => redirectFrom.has(p) || redirectPrefixes.some((x) => p.startsWith(x));
const isAssetPath = (p: string) =>
  /^\/(admin|api)(\/|$)/.test(p) ||
  p.startsWith("/_next/") ||
  /\.(xml|txt|json|png|jpg|jpeg|webp|gif|svg|ico|pdf|rss|mp4|webm|woff2?)$/i.test(p);

const sample = (items: string[]) => items.slice(0, 10).join(", ");

function duplicateGroups(values: { route: string; value: string }[]) {
  const map = new Map<string, string[]>();
  for (const { route, value } of values) {
    if (!value) continue;
    const list = map.get(value) ?? [];
    list.push(route);
    map.set(value, list);
  }
  return [...map.entries()].filter(([, routes]) => routes.length > 1);
}

test("1. 핵심 URL에 noindex가 없다", () => {
  const missing = CORE_URLS.filter((r) => !pages.has(r));
  assert.deepEqual(missing, [], `out/에 없는 핵심 URL: ${sample(missing)}`);
  const noindex = CORE_URLS.filter((r) => !isIndexable(pages.get(r)!));
  assert.deepEqual(noindex, [], `noindex 핵심 URL: ${sample(noindex)}`);
});

test("2. 핵심 URL의 canonical이 자기 자신을 가리킨다", () => {
  const wrong = CORE_URLS.filter((r) => canonicalPath(pages.get(r)!.canonical) !== r);
  assert.deepEqual(wrong, [], `canonical 불일치: ${sample(wrong)}`);
});

test("3. 색인 대상 페이지끼리 title이 중복되지 않는다", () => {
  const dups = duplicateGroups(indexableSelf.map((p) => ({ route: p.route, value: p.title })));
  assert.equal(dups.length, 0, dups.slice(0, 5).map(([v, r]) => `${v} → ${r.join(", ")}`).join("\n"));
});

test("4. 색인 대상 페이지끼리 description이 중복되지 않는다", () => {
  const dups = duplicateGroups(indexableSelf.map((p) => ({ route: p.route, value: p.description })));
  assert.equal(dups.length, 0, dups.slice(0, 5).map(([v, r]) => `${v} → ${r.join(", ")}`).join("\n"));
});

test("5. H1이 두 개 이상인 페이지가 없다", () => {
  const multi = all.filter((p) => p.h1s.length > 1).map((p) => p.route);
  assert.deepEqual(multi, [], `H1 2개 이상: ${sample(multi)}`);
  const coreNoH1 = CORE_URLS.filter((r) => pages.get(r)!.h1s.length !== 1);
  assert.deepEqual(coreNoH1, [], `H1이 1개가 아닌 핵심 URL: ${sample(coreNoH1)}`);
});

const sitemap = readSitemapUrls();

test("6. sitemap의 모든 URL이 실제 페이지(200)이고 리다이렉트가 아니다", () => {
  assert.ok(sitemap.length > 0, "sitemap URL이 비어 있습니다");
  const notFound: string[] = [];
  const redirected: string[] = [];
  for (const u of sitemap) {
    const p = canonicalPath(u.loc) ?? u.loc;
    if (!pages.has(p)) notFound.push(p);
    if (isRedirect(p)) redirected.push(p);
  }
  assert.deepEqual(notFound, [], `sitemap에 있으나 페이지 없음: ${sample(notFound)}`);
  assert.deepEqual(redirected, [], `sitemap에 리다이렉트 URL: ${sample(redirected)}`);
});

test("7. sitemap에 noindex·비자기 canonical URL이 없다", () => {
  const noindex: string[] = [];
  const nonSelf: string[] = [];
  for (const u of sitemap) {
    const p = canonicalPath(u.loc) ?? u.loc;
    const page = pages.get(p);
    if (!page) continue;
    if (!isIndexable(page)) noindex.push(p);
    const cp = canonicalPath(page.canonical);
    if (cp && cp !== p) nonSelf.push(p);
  }
  assert.deepEqual(noindex, [], `sitemap의 noindex URL: ${sample(noindex)}`);
  assert.deepEqual(nonSelf, [], `sitemap의 비자기 canonical URL: ${sample(nonSelf)}`);
});

test("8. robots.txt가 핵심 경로를 막지 않는다 (Yeti·전체)", () => {
  for (const agent of ["Yeti", "*"]) {
    const disallow = readRobotsDisallow(agent);
    const blocked = CORE_URLS.filter((r) => isBlockedByRobots(r, disallow));
    assert.deepEqual(blocked, [], `${agent} 차단 핵심 URL: ${sample(blocked)}`);
  }
});

test("9. 내부 링크가 깨지지 않는다", () => {
  const broken = new Map<string, string>();
  for (const p of all) {
    for (const { href } of p.links) {
      const target = href.split("?")[0];
      if (isAssetPath(target) || pages.has(target) || isRedirect(target) || routeToFile(target)) continue;
      if (!broken.has(target)) broken.set(target, p.route);
    }
  }
  const list = [...broken.entries()].map(([t, from]) => `${t} (from ${from})`);
  assert.deepEqual(list, [], `깨진 내부 링크: ${sample(list)}`);
});

test("10. JSON-LD가 모두 파싱된다", () => {
  const errors = all.filter((p) => p.jsonldErrors.length > 0).map((p) => p.route);
  assert.deepEqual(errors, [], `JSON-LD 파싱 오류: ${sample(errors)}`);
});

const factHits = all.flatMap((p) =>
  findRuleHits(p.mainText, FACT_RULES)
    .filter(isViolation)
    .map((h) => ({ route: p.route, ...h })),
);

test("11. '상속등기 6개월 신청기한' 단정 문구가 없다", () => {
  const hits = factHits.filter((h) => h.rule === "inheritance-registration-6month-deadline");
  assert.deepEqual(
    hits.map((h) => `${h.route}: ${h.context}`),
    [],
  );
});

test("12. '상속등기 늦으면 과태료'·'3개월 내 신고·등기 원칙' 단정 문구가 없다", () => {
  const hits = factHits.filter(
    (h) => h.rule === "inheritance-registration-penalty" || h.rule === "inheritance-3month-registration",
  );
  assert.deepEqual(
    hits.map((h) => `${h.route}: ${h.context}`),
    [],
  );
});

test("13. 법무사가 소송대리·형사변론을 하는 것처럼 보이는 문구가 없다", () => {
  const hits = all.flatMap((p) =>
    findRuleHits(p.mainText, SCOPE_RULES)
      .filter(isViolation)
      .filter((h) => ["litigation-agency", "trial-agency", "criminal-defense", "pleading"].includes(h.rule))
      .map((h) => `${p.route}: ${h.context}`),
  );
  assert.deepEqual(hits.slice(0, 20), [], `업무범위 오인 문구 ${hits.length}건`);
});
