#!/usr/bin/env node
/**
 * 빌드된 HTML을 기준으로 사이트맵에서 noindex·비자기 canonical 페이지를 뺀다.
 *
 * 왜: 사이트맵 생성기(prebuild)는 TS 설정을 정규식으로 읽어 색인 제외 대상을 추정한다. 그런데 일부 페이지는
 * 실행 중 규칙(예: 같은 동 이름의 대표 페이지가 있으면 /업무사례/부산○○동법무사 를 noindex·canonical 처리)으로
 * 제외돼 추정에서 빠졌고, 사이트맵에 "대표가 아닌 주소" 28개가 제출되고 있었다(2026-11-14, 테스트 7번).
 *
 * 하는 일:
 *   1) out/**\/*.html 의 robots·canonical을 읽어 제외 목록 scripts/lib/sitemap/rendered-exclusions.json 을 만든다
 *   2) 목록이 바뀌었으면 사이트맵을 다시 만들고(public/), out/ 에도 복사한다
 * 다음 빌드부터는 prebuild 단계에서도 이 목록을 쓴다(indexable-paths.mjs).
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const LIST = path.join(ROOT, "scripts/lib/sitemap/rendered-exclusions.json");

function routeOf(file) {
  const rel = path.relative(OUT, file).split(path.sep).join("/").replace(/\.html$/, "");
  if (rel === "index") return "/";
  return `/${rel.replace(/\/index$/, "")}`.normalize("NFC");
}

function canonicalRoute(href) {
  try {
    const u = new URL(href.replace(/&amp;/g, "&"));
    const p = decodeURIComponent(u.pathname).replace(/\/$/, "") || "/";
    return p.normalize("NFC");
  } catch {
    return null;
  }
}

const excluded = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!/^(_next|_img|admin|image|images|video|fonts|generated|resources)$/.test(e.name)) walk(full);
    } else if (e.name.endsWith(".html") && e.name !== "404.html") {
      const head = fs.readFileSync(full, "utf8").slice(0, 20000);
      const route = routeOf(full);
      const robots = (head.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
      const canonical = (head.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
      const noindex = /noindex/i.test(robots);
      const cp = canonical ? canonicalRoute(canonical) : null;
      if (noindex || (cp && cp !== route)) excluded.push(route);
    }
  }
}

if (!fs.existsSync(OUT)) {
  console.error("[sitemap-sync] out/ 이 없습니다.");
  process.exit(1);
}
walk(OUT);
excluded.sort((a, b) => a.localeCompare(b, "ko"));

const prev = fs.existsSync(LIST) ? JSON.parse(fs.readFileSync(LIST, "utf8")) : [];
const changed = JSON.stringify(prev) !== JSON.stringify(excluded);
fs.writeFileSync(LIST, `${JSON.stringify(excluded, null, 1)}\n`, "utf8");
console.log(`[sitemap-sync] 렌더링 기준 제외 ${excluded.length}개${changed ? " (변경됨 → 사이트맵 재생성)" : ""}`);

if (changed) {
  execSync("node scripts/generate-sitemaps.mjs", { stdio: "inherit", cwd: ROOT });
  for (const name of ["sitemap.xml"]) {
    fs.copyFileSync(path.join(ROOT, "public", name), path.join(OUT, name));
  }
  fs.cpSync(path.join(ROOT, "public/sitemaps"), path.join(OUT, "sitemaps"), { recursive: true });
}
