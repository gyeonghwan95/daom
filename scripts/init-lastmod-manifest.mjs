#!/usr/bin/env node
/**
 * lastmod manifest 초기화(1회용, 로컬 전용) — 2026-10-11 mtime 기반 lastmod를 걷어내며 만든 기록용 스크립트.
 *
 *   npm run build
 *   node scripts/init-lastmod-manifest.mjs --changed reports/.../allowed.txt --changed-date 2026-10-11 \
 *     --report reports/google-index-2026-10-11/lastmod-init.csv
 *
 * URL별로 검증 가능한 날짜 후보를 모아 가장 최근 값을 쓴다. 근거가 없으면 생략한다.
 *  1) lastmod-pins.json — 이전 작업에서 '본문이 바뀌지 않았다'고 명시해 고정한 값
 *  2) 스펙 dateModified — ship-seo·metro-remote·priority-seo 페이지 데이터의 실제 본문 수정일
 *  3) MDX(블로그·FAQ·사례) — 페이지당 파일 하나이므로 그 파일의 Git 생성일과 본문·제목·설명이 바뀐 커밋일.
 *     frontmatter date/updated는 그 파일이 저장소에 생긴 날 이후일 때만 인정한다(이전 사이트 이관 기록이 없음).
 *  4) 언론(/media/slug) — 기사 publishedAt과 press-articles.ts에 그 slug가 처음 추가된 커밋일 중 늦은 날
 *  5) 2026-10-09~10-11 빌드 스냅샷 비교에서 확인된 페이지별 변경(30% 넘게 바뀐 공통 변경 단계는 본문 근거에서 제외)
 *  6) --changed 목록(이번 수정으로 본문이 바뀐 URL) — --changed-date
 * 공유 소스 파일 하나의 수정일을 여러 URL에 복사하지 않는다. 파일 mtime을 쓰지 않는다.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { LASTMOD_MANIFEST_FILE, todayKst, validateLastmod } from "./lib/sitemap/lastmod.mjs";
import { buildFingerprints, extractPageText } from "./lib/sitemap/page-fingerprint.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const FINGERPRINT_FILE = path.join(ROOT, "scripts/lib/sitemap/lastmod-fingerprints.json");
const args = process.argv.slice(2);
const arg = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
const today = todayKst();
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const sitemapRoutes = [...fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const p = decodeURI(new URL(m[1]).pathname).normalize("NFC");
  return p.length > 1 ? p.replace(/\/$/, "") : "/";
});
const routeSet = new Set(sitemapRoutes);
const candidates = new Map(); // route → [{date, source}]
const add = (route, date, source) => {
  if (!routeSet.has(route) || !validateLastmod(date, today)) return;
  if (!candidates.has(route)) candidates.set(route, []);
  candidates.get(route).push({ date, source });
};

// 1) pins
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/lib/sitemap/lastmod-pins.json"), "utf8")).pins ?? {};
for (const [r, d] of Object.entries(pins)) add(r.normalize("NFC"), d, "pin");

// 2) 스펙 dateModified
for (const rel of ["src/lib/ship-seo/pages", "src/lib/ship-seo/existing", "src/lib/metro-remote/pages", "src/lib/priority-seo/pages", "src/lib/priority-seo/existing"]) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    const date = (text.match(/dateModified:\s*"(\d{4}-\d{2}-\d{2})"/) || [])[1];
    if (!date) continue;
    for (const m of text.matchAll(/slug:\s*"([^"]+)"/g)) {
      add(`/${m[1]}`, date, `dateModified:${rel}`);
      add(`/업무사례/${m[1]}`, date, `dateModified:${rel}`);
    }
  }
}

// 3) MDX
const MDX = { blog: "/blog/", faq: "/faq/", cases: "/services/cases/" };
const MEANINGFUL_FM = /^[+-](title|seoTitle|description):/;
const FM_LINE = /^[+-](\s{2,}-\s|[A-Za-z]+:|---\s*$)/;
const mdxRows = [];
for (const [dir, prefix] of Object.entries(MDX)) {
  const abs = path.join(ROOT, "src/content", dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter((x) => x.endsWith(".mdx") && !x.startsWith("_"))) {
    const rel = `src/content/${dir}/${f}`;
    const fm = matter(fs.readFileSync(path.join(ROOT, rel), "utf8")).data;
    const route = prefix + String(fm.slug ?? f.replace(/\.mdx$/, ""));
    const SEP = "COMMIT";
    const log = git("log", "--follow", `--format=${SEP}%cs`, "-p", "--", rel);
    const commits = log.split(SEP).filter((c) => c.trim()).map((chunk) => {
      const [first, ...rest] = chunk.split("\n");
      const changed = rest.filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---\s)/.test(l));
      const meaningful = changed.some((l) => MEANINGFUL_FM.test(l) || !FM_LINE.test(l));
      return { date: first.trim(), meaningful };
    });
    const created = commits.at(-1)?.date;
    const gitDates = commits.filter((c, i) => c.meaningful || i === commits.length - 1).map((c) => c.date);
    const fmDate = [fm.updated, fm.modified, fm.date].map((d) => (d ? new Date(String(d)).toISOString().slice(0, 10) : null)).find(Boolean);
    for (const d of gitDates) add(route, d, "git:mdx");
    if (fmDate && created && fmDate >= created) add(route, fmDate, "frontmatter");
    mdxRows.push({ route, fmDate, created, fmAccepted: Boolean(fmDate && created && fmDate >= created) });
  }
}

// 4) 언론
const pressFile = "src/lib/press-articles.ts";
const pressText = fs.readFileSync(path.join(ROOT, pressFile), "utf8");
for (const m of pressText.matchAll(/slug:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"([^"]+)"/g)) {
  const route = `/media/${m[1]}`;
  if (!routeSet.has(route)) continue;
  const first = git("log", "--reverse", "--format=%cs", `-S${`slug: "${m[1]}"`}`, "--", pressFile).trim().split("\n")[0];
  const published = new Date(m[2]).toISOString().slice(0, 10);
  if (first) add(route, first, "git:press-added");
  if (first && published >= first) add(route, published, "publishedAt");
}

// 5) 스냅샷 체인(같은 형식: title·h1·description·mainHash·mainLen)
const CHAIN = [
  ["reports/seo-recovery-2026-10-09/baseline.json", null],
  ["reports/seo-recovery-2026-10-09/after.json", "2026-10-09"],
  ["reports/naver-14-2026-10-09/after.json", "2026-10-09"],
  ["reports/busan-lawyer-rank-2026-10-10/after.json", "2026-10-10"],
  ...Array.from({ length: 17 }, (_, i) => [`reports/busan-lawyer-rank-2026-10-10/after${i + 2}.json`, "2026-10-10"]),
  ...Array.from({ length: 10 }, (_, i) => [`reports/busan-lawyer-rank-2026-10-10/after${i + 19}.json`, "2026-10-11"]),
];
let prev = null;
const globalSteps = [];
for (const [file, date] of CHAIN) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) continue;
  const snap = JSON.parse(fs.readFileSync(abs, "utf8"));
  if (prev && date) {
    const changed = [];
    for (const [r, b] of Object.entries(snap)) {
      const a = prev[r];
      if (!a) continue;
      const route = r.normalize("NFC");
      if (a.title !== b.title || a.description !== b.description || JSON.stringify(a.h1) !== JSON.stringify(b.h1)) add(route, date, `snapshot-meta:${path.basename(file)}`);
      if (a.mainHash !== b.mainHash) {
        changed.push([route]);
      }
    }
    // 전 페이지의 30% 넘게 바뀐 단계는 공통 블록(상담·신뢰 패널 등) 변경이라 페이지별 본문 변경과 구분할 수 없으므로
    // 본문 변경 근거로 쓰지 않는다(제목·설명·H1 변경은 위에서 따로 반영).
    const global = changed.length > Object.keys(snap).length * 0.3;
    globalSteps.push(`${path.basename(file)}:${changed.length}${global ? "(공통·제외)" : ""}`);
    if (!global) for (const [route] of changed) add(route, date, `snapshot-main:${path.basename(file)}`);
  }
  prev = snap;
}

// 6) 이번 수정 URL
const changedFile = arg("--changed");
const changedDate = arg("--changed-date");
if (changedFile && changedDate) {
  for (const r of fs.readFileSync(changedFile, "utf8").split(/\r?\n/).map((s) => s.trim().normalize("NFC")).filter(Boolean)) add(r, changedDate, "content-fix");
}

// 결정
const routes = {};
const rows = [];
for (const r of sitemapRoutes) {
  const c = (candidates.get(r) ?? []).sort((a, b) => (a.date < b.date ? 1 : -1));
  if (c.length) routes[r] = c[0].date;
  rows.push([r, c[0]?.date ?? "", c[0]?.source ?? "생략(근거 없음)", c.map((x) => `${x.date}@${x.source}`).join(" ")]);
}
const sortObj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
fs.writeFileSync(
  LASTMOD_MANIFEST_FILE,
  JSON.stringify(
    {
      note: "URL별 lastmod. Cloudflare 빌드는 이 값만 읽는다(파일 mtime·빌드 시각 사용 안 함). 없는 URL은 lastmod 생략. 갱신: docs/sitemap-lastmod.md",
      routes: sortObj(routes),
    },
    null,
    1,
  ) + "\n",
);
const pages = {};
for (const r of sitemapRoutes) {
  const cands = r === "/" ? ["index.html"] : [`${r.slice(1)}.html`, `${r.slice(1)}/index.html`];
  const f = cands.map((c) => path.join(OUT, c)).find((x) => fs.existsSync(x));
  if (f) pages[r] = extractPageText(fs.readFileSync(f, "utf8"));
}
fs.writeFileSync(FINGERPRINT_FILE, JSON.stringify({ fingerprints: sortObj(buildFingerprints(pages)) }, null, 0) + "\n");

const report = arg("--report");
if (report) {
  fs.writeFileSync(report, "﻿route,lastmod,source,all_candidates\n" + rows.map((x) => x.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
  fs.writeFileSync(report.replace(/\.csv$/, "-mdx.csv"), "﻿route,frontmatter_date,git_created,frontmatter_accepted\n" + mdxRows.map((x) => [x.route, x.fmDate ?? "", x.created ?? "", x.fmAccepted].join(",")).join("\n") + "\n");
}
const bySource = {};
for (const x of rows) bySource[x[2].split(":")[0]] = (bySource[x[2].split(":")[0]] || 0) + 1;
console.log(`sitemap routes ${sitemapRoutes.length} · with lastmod ${Object.keys(routes).length} · omitted ${sitemapRoutes.length - Object.keys(routes).length}`);
console.log("winning source:", bySource);
console.log("snapshot steps:", globalSteps.join(" "));
