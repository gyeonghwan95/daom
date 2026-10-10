#!/usr/bin/env node
/**
 * out/ 전체에서 '관련 콘텐츠' 캐러셀(data-related-content="carousel")을 점검한다.
 * - 페이지별 캐러셀 수·카드 수·이미지 중복·자기 링크·noindex 대상 링크·이미지 없는 카드
 * - 쓰인 이미지 파일의 크기(px)·용량(KB)·비율
 * 결과: carousel-audit.json, 콘솔 요약
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { listRoutes, parsePage } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");
const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
const routes = listRoutes();
const robots = new Map();
const carousels = [];
for (const { route, file } of routes) {
  const h = fs.readFileSync(file, "utf8");
  robots.set(route, parsePage(h).robots);
  let i = h.indexOf('data-related-content="carousel"');
  while (i >= 0) {
    const end = h.indexOf("</section>", i);
    const seg = h.slice(i, end);
    const heading = (seg.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
    const cards = [...seg.matchAll(/<li\b[\s\S]*?<\/li>/g)].map((m) => {
      const li = m[0];
      const href = decode((li.match(/href="([^"]+)"/) || [])[1] ?? "");
      const img = (li.match(/<img[^>]*?src="([^"]+)"/) || [])[1] ?? "";
      const alt = (li.match(/<img[^>]*?alt="([^"]*)"/) || [])[1] ?? null;
      const title = li.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
      return { href, img: decode(img), alt, title };
    });
    carousels.push({ route, heading, cards });
    i = h.indexOf('data-related-content="carousel"', end);
  }
}
const imgKey = (src) => {
  const u = src.match(/[?&]url=([^&]+)/);
  return decode(u ? u[1] : src).split("?")[0];
};
const issues = { noImage: [], dupImageInCarousel: [], selfLink: [], noindexTarget: [], fewCards: [], emptyAlt: 0 };
const imageUse = new Map();
for (const c of carousels) {
  const keys = c.cards.map((x) => imgKey(x.img));
  c.cards.forEach((x, k) => {
    if (!x.img) issues.noImage.push(`${c.route} :: ${x.title}`);
    if (x.alt === "") issues.emptyAlt++;
    if (x.href.split("#")[0] === c.route) issues.selfLink.push(`${c.route} :: ${c.heading}`);
    const target = x.href.split("#")[0].split("?")[0];
    if (/noindex/.test(robots.get(target) ?? "")) issues.noindexTarget.push(`${c.route} -> ${target}`);
    if (keys[k]) imageUse.set(keys[k], (imageUse.get(keys[k]) ?? 0) + 1);
  });
  const dup = keys.filter((k, n) => k && keys.indexOf(k) !== n);
  if (dup.length) issues.dupImageInCarousel.push(`${c.route} :: ${c.heading} :: ${[...new Set(dup)].join(",")}`);
  if (c.cards.length < 3) issues.fewCards.push(`${c.route} :: ${c.heading} (${c.cards.length})`);
}
const files = [];
for (const [src, uses] of imageUse) {
  const local = path.join(ROOT, "public", src.replace(/^\//, ""));
  if (!fs.existsSync(local)) { files.push({ src, uses, missing: true }); continue; }
  const meta = await sharp(local).metadata();
  files.push({ src, uses, w: meta.width, h: meta.height, kb: Math.round(fs.statSync(local).size / 1024), ratio: +(meta.width / meta.height).toFixed(2) });
}
const pagesWith = new Set(carousels.map((c) => c.route)).size;
const ratios = {};
for (const f of files) if (!f.missing) ratios[f.ratio] = (ratios[f.ratio] ?? 0) + 1;
fs.writeFileSync(path.join(DIR, "carousel-audit.json"), JSON.stringify({ carousels: carousels.length, pagesWith, issues, files: files.sort((a, b) => b.uses - a.uses) }, null, 1));
console.log(`pages=${routes.length} pagesWithCarousel=${pagesWith} carousels=${carousels.length} cards=${carousels.reduce((s, c) => s + c.cards.length, 0)} uniqueImages=${files.length}`);
console.log(`noImage=${issues.noImage.length} dupImageInCarousel=${issues.dupImageInCarousel.length} selfLink=${issues.selfLink.length} noindexTarget=${issues.noindexTarget.length} fewCards(<3)=${issues.fewCards.length} emptyAlt=${issues.emptyAlt}`);
console.log(`missingFiles=${files.filter((f) => f.missing).length} ratios=${JSON.stringify(ratios)} heavy(>300KB)=${files.filter((f) => f.kb > 300).length} small(<600px)=${files.filter((f) => f.w && f.w < 600).length}`);
console.log("most reused:", files.slice(0, 6).map((f) => `${f.src.split("/").pop()}×${f.uses}`).join(" "));
