#!/usr/bin/env node
/**
 * 가독성 점검 — 색인 페이지 전체(<main> 기준).
 * - 평균 문장 길이(자), 80자 넘는 문장 비율, 가장 긴 <p> 문단 길이, 소제목(H2/H3) 1개당 본문 글자 수
 * - 본문 이미지 수, alt 없는/빈 이미지(카드·장식 제외 안 함 → 따로 표기), 첫 이미지 파일 용량
 * 결과 readability-audit.json, 콘솔 요약 + 기준 초과 상위 페이지
 */
import fs from "node:fs";
import path from "node:path";
import { listRoutes } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
const rows = [];
for (const { route, file } of listRoutes()) {
  const h = fs.readFileSync(file, "utf8");
  if (/name="robots" content="noindex/.test(h)) continue;
  const a = h.indexOf("<main"), b = h.lastIndexOf("</main>");
  if (a < 0) continue;
  const main = h.slice(a, b);
  const text = strip(main);
  const sents = text.split(/(?<=[.?!다요])\s+/).filter((s) => s.length >= 8);
  const avgSent = sents.length ? Math.round(sents.reduce((s, x) => s + x.length, 0) / sents.length) : 0;
  const longSentPct = sents.length ? Math.round((100 * sents.filter((s) => s.length > 80).length) / sents.length) : 0;
  const paras = [...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => strip(m[1]).length);
  const maxPara = paras.length ? Math.max(...paras) : 0;
  const headings = (main.match(/<h[23]\b/g) || []).length;
  const imgs = [...main.matchAll(/<img\b([^>]*)>/g)].map((m) => ({ alt: (m[1].match(/\balt="([^"]*)"/) || [])[1], src: (m[1].match(/\bsrc="([^"]+)"/) || [])[1] ?? "" }));
  const firstSrc = imgs[0]?.src ?? "";
  const u = firstSrc.match(/[?&]url=([^&]+)/);
  const firstPath = decode(u ? u[1] : firstSrc).split("?")[0];
  const local = firstPath.startsWith("/") ? path.join(ROOT, "public", firstPath.slice(1)) : null;
  const firstKb = local && fs.existsSync(local) ? Math.round(fs.statSync(local).size / 1024) : null;
  rows.push({ route, chars: text.length, avgSent, longSentPct, maxPara, charsPerHeading: headings ? Math.round(text.length / headings) : text.length, imgs: imgs.length, noAlt: imgs.filter((i) => i.alt === undefined).length, emptyAlt: imgs.filter((i) => i.alt === "").length, firstImg: firstPath.split("/").pop(), firstKb });
}
fs.writeFileSync(path.join(DIR, "readability-audit.json"), JSON.stringify(rows, null, 1));
const pct = (f) => Math.round((100 * rows.filter(f).length) / rows.length);
const med = (k) => { const v = rows.map((r) => r[k]).sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };
console.log(`pages=${rows.length} median: chars=${med("chars")} avgSent=${med("avgSent")} longSent%=${med("longSentPct")} maxPara=${med("maxPara")} charsPerHeading=${med("charsPerHeading")}`);
console.log(`pages with avgSent>60: ${pct((r) => r.avgSent > 60)}% | maxPara>400: ${pct((r) => r.maxPara > 400)}% | charsPerHeading>900: ${pct((r) => r.charsPerHeading > 900)}%`);
console.log(`images: pages with img missing alt attr: ${rows.filter((r) => r.noAlt).length} | first image >300KB: ${rows.filter((r) => r.firstKb > 300).length} | first image >150KB: ${rows.filter((r) => r.firstKb > 150).length}`);
const worst = (k, n = 6) => [...rows].sort((x, y) => y[k] - x[k]).slice(0, n).map((r) => `${r.route}(${r[k]})`).join(" ");
console.log("longest paragraph:", worst("maxPara"));
console.log("longest avg sentence:", worst("avgSent"));
console.log("heaviest first image:", [...rows].filter((r) => r.firstKb).sort((x, y) => y.firstKb - x.firstKb).slice(0, 6).map((r) => `${r.route}(${r.firstImg} ${r.firstKb}KB)`).join(" "));
console.log("missing alt attr:", rows.filter((r) => r.noAlt).slice(0, 8).map((r) => `${r.route}(${r.noAlt})`).join(" "));
