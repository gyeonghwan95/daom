#!/usr/bin/env node
/**
 * SEO DOM diff gate — 같은 사이트의 두 정적 빌드(out/)를 페이지별 SEO 지문으로 비교한다.
 *
 * 쓰임: UI·전환 작업 전후로 "색인된 글에 영향이 없는지"를 확인한다.
 *   1) 작업 전 상태를 빌드해 out 폴더를 보관(예: git worktree로 기준 커밋을 따로 빌드)
 *   2) 작업 후 빌드
 *   3) node scripts/seo-dom-diff.mjs <기준 out> <작업 후 out> [--report 결과.json]
 *
 * 지문: title · meta description · canonical · robots · og:image · JSON-LD · H1 · H2 · 내부 링크 · 본문 문구 조각 · 이미지 alt.
 *
 * 판정
 *  - FAIL(종료 코드 1): 모든 페이지에서 title/description/canonical/robots/og:image/JSON-LD/H1/H2가 달라지거나 내부 링크가 사라진 경우,
 *    보호 URL(config/seo-query-champions.json·seo-protected-pages.json)에서 본문 문구가 사라진 경우, 페이지가 없어진 경우
 *  - WARN: 본문 문구가 추가됨(보호 URL), 이미지 alt·개수가 바뀜
 * 버튼 라벨의 "(새 창)" 표기·구분점("·")만 다른 것은 화면 표기 차이로 보고 무시한다.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const [beforeDir, afterDir, ...rest] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error("사용법: node scripts/seo-dom-diff.mjs <기준 out> <작업 후 out> [--report 결과.json]");
  process.exit(2);
}
const reportPath = rest.includes("--report") ? rest[rest.indexOf("--report") + 1] : null;

const sha = (s) => createHash("sha1").update(s).digest("hex").slice(0, 10);
const nfc = (s) => s.normalize("NFC");
const dec = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
  } catch {
    return null;
  }
}

/** 보호 URL — 질의별 대표·보조 URL과 보호 페이지 챔피언 */
function loadProtected() {
  const set = new Set();
  const queries = readJson("config/seo-query-champions.json")?.queries ?? {};
  for (const v of Object.values(queries)) {
    if (v.primary) set.add(nfc(v.primary));
    for (const s of v.supporting ?? []) set.add(nfc(s));
  }
  const pages = readJson("config/seo-protected-pages.json");
  for (const c of Object.values(pages?.champions ?? {})) if (c.path) set.add(nfc(c.path));
  if (pages?.champion?.path) set.add(nfc(pages.champion.path));
  return set;
}

function listHtml(dir) {
  const out = new Map();
  (function walk(d, rel) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) {
        if (rel === "" && ["_next", "image", "images", "_img", "generated", "data"].includes(e.name)) continue;
        walk(path.join(d, e.name), r);
      } else if (e.name.endsWith(".html") && !["/404.html", "/_not-found.html"].includes(r)) {
        const p = r === "/index.html" ? "/" : r.replace(/\/index\.html$/, "").replace(/\.html$/, "");
        out.set(nfc(p), path.join(d, e.name));
      }
    }
  })(dir, "");
  return out;
}

const pick = (html, re) => {
  const m = html.match(re);
  return m ? dec(m[1]).trim() : "";
};

function fingerprint(html) {
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1].trim()).sort();
  const mainM = html.match(/<main[\s\S]*?<\/main>/);
  const main = (mainM ? mainM[0] : html).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const heads = (tag) =>
    [...main.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g"))].map((m) => dec(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim());
  const hrefs = [...new Set([...html.matchAll(/<a[^>]+href="([^"#][^"]*)"/g)].map((m) => dec(m[1])).filter((h) => h.startsWith("/") || h.includes("xn--")))].sort();
  const segs = main
    .replace(/<(?:br|\/p|\/li|\/h\d|\/div|\/section|\/tr|\/a|\/button|\/span)[^>]*>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((s) => dec(s).replace(/\s+/g, " ").replace(/\s*\(새 창\)\s*$/, "").trim())
    .filter((s) => s && s !== "·" && s !== "(새 창)");
  return {
    title: pick(html, /<title[^>]*>([\s\S]*?)<\/title>/),
    desc: pick(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/) || pick(html, /<meta[^>]+content="([^"]*)"[^>]+name="description"/),
    canonical: pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/),
    robots: pick(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/),
    ogImage: pick(html, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/),
    jsonld: sha(jsonld.join("|")),
    h1: heads("h1").join("|"),
    h2: heads("h2").join("|"),
    hrefs,
    alts: [...main.matchAll(/<img[^>]+alt="([^"]*)"/g)].map((m) => dec(m[1])),
    imgs: (main.match(/<img\b/g) || []).length,
    segs,
  };
}

const protectedUrls = loadProtected();
const before = listHtml(beforeDir);
const after = listHtml(afterDir);
const HARD = ["title", "desc", "canonical", "robots", "ogImage", "jsonld", "h1", "h2"];

const fails = [];
const warns = [];
const summary = { compared: 0, identical: 0, protectedCompared: 0 };

for (const p of before.keys()) {
  if (!after.has(p)) {
    fails.push({ path: p, kind: "페이지 없어짐" });
    continue;
  }
  summary.compared++;
  const isProt = protectedUrls.has(p);
  if (isProt) summary.protectedCompared++;
  const b = fingerprint(fs.readFileSync(before.get(p), "utf8"));
  const a = fingerprint(fs.readFileSync(after.get(p), "utf8"));
  let changed = false;

  for (const k of HARD) {
    if (b[k] !== a[k]) {
      fails.push({ path: p, protected: isProt, kind: `${k} 변경`, before: String(b[k]).slice(0, 80), after: String(a[k]).slice(0, 80) });
      changed = true;
    }
  }
  const lost = b.hrefs.filter((h) => !a.hrefs.includes(h));
  if (lost.length) {
    fails.push({ path: p, protected: isProt, kind: "내부 링크 사라짐", detail: lost.slice(0, 5) });
    changed = true;
  }
  const as = new Set(a.segs);
  const bs = new Set(b.segs);
  // 문구가 더 긴 문구 안에 그대로 남아 있으면(예: "후기" → "후기 5.0(13건)") 사라진 것이 아니라 확장된 것으로 본다
  const removed = b.segs.filter((s) => !as.has(s) && !a.segs.some((x) => x.includes(s)));
  const added = a.segs.filter((s) => !bs.has(s));
  if (removed.length) {
    (isProt ? fails : warns).push({ path: p, protected: isProt, kind: "본문 문구 사라짐", detail: removed.slice(0, 4) });
    changed = true;
  }
  if (added.length) {
    if (isProt) warns.push({ path: p, protected: true, kind: "본문 문구 추가", detail: added.slice(0, 4) });
    changed = true;
  }
  if (b.alts.join("|") !== a.alts.join("|") || b.imgs !== a.imgs) {
    if (isProt) warns.push({ path: p, protected: true, kind: "이미지 alt·개수 변경", detail: [`개수 ${b.imgs}→${a.imgs}`] });
    changed = true;
  }
  if (!changed) summary.identical++;
}
for (const p of after.keys()) if (!before.has(p)) warns.push({ path: p, kind: "새 페이지" });

const count = (list, kind) => list.filter((x) => x.kind === kind).length;
console.log(`비교 ${summary.compared}쪽(보호 URL ${summary.protectedCompared}쪽) · 변화 없음 ${summary.identical}쪽`);
console.log(`FAIL ${fails.length}건 · WARN ${warns.length}건`);
for (const kind of [...new Set(fails.map((f) => f.kind))]) console.log(`  FAIL ${kind}: ${count(fails, kind)}`);
for (const kind of [...new Set(warns.map((f) => f.kind))]) console.log(`  WARN ${kind}: ${count(warns, kind)}`);
for (const f of fails.slice(0, 12)) console.log(`  ✗ ${f.path} — ${f.kind}${f.protected ? " [보호]" : ""} ${JSON.stringify(f.detail ?? f.before ?? "")}`.slice(0, 220));
for (const w of warns.filter((x) => x.protected).slice(0, 8)) console.log(`  △ ${w.path} — ${w.kind} ${JSON.stringify(w.detail ?? "")}`.slice(0, 220));

if (reportPath) fs.writeFileSync(reportPath, JSON.stringify({ summary, fails, warns }, null, 1));
process.exit(fails.length ? 1 : 0);
