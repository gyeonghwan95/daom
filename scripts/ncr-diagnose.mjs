#!/usr/bin/env node
/**
 * NAVER CRITICAL RECOVERY — inbound links + internal competition (before build).
 *   node scripts/ncr-diagnose.mjs [--phase=before|after]
 * Output: .cache/naver-critical-recovery/diagnose-<phase>.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CACHE = path.join(ROOT, ".cache", "naver-critical-recovery");
const phase = (process.argv.find((a) => a.startsWith("--phase=")) || "--phase=before").split("=")[1];

const TARGETS = {
  specialist: { url: "/부산상속전문법무사", query: "부산 상속전문 법무사", terms: ["부산", "상속", "전문", "법무사"], phrases: ["상속전문 법무사", "상속전문법무사", "상속 전문 법무사"] },
  renunciation: { url: "/부산상속포기", query: "부산 상속포기 법무사", terms: ["부산", "상속포기", "법무사"], phrases: ["상속포기 법무사", "상속포기법무사", "부산 상속포기"] },
  haeundae: { url: "/해운대법무사", query: "해운대구 법무사", terms: ["해운대", "법무사"], phrases: ["해운대구 법무사", "해운대 법무사", "해운대구법무사", "해운대법무사"] },
};

function normalizePath(p) {
  let s = String(p || "/").split("?")[0].split("#")[0];
  try { s = decodeURIComponent(s); } catch { /* raw */ }
  s = s.replace(/^https?:\/\/[^/]+/, "");
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

function htmlPathForUrl(urlPath) {
  const clean = normalizePath(urlPath);
  if (clean === "/") return path.join(OUT, "index.html");
  const flat = path.join(OUT, `${clean.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(OUT, ...clean.slice(1).split("/"), "index.html");
}

const strip = (h) =>
  String(h || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const manifest = JSON.parse(fs.readFileSync(path.join(CACHE, phase, "manifest.json"), "utf8")).pages;
const raw = JSON.parse(fs.readFileSync(path.join(CACHE, phase, "raw.json"), "utf8"));
const urls = Object.keys(manifest);

const inbound = Object.fromEntries(Object.keys(TARGETS).map((k) => [k, { pages: [], anchors: {}, inMainPages: 0 }]));
for (const u of urls) {
  const file = htmlPathForUrl(u);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const mainHtml = html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? "";
  for (const [key, t] of Object.entries(TARGETS)) {
    if (u === t.url) continue;
    let found = false;
    let inMain = false;
    for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      if (normalizePath(m[1]) !== t.url) continue;
      found = true;
      const text = strip(m[2]).slice(0, 60) || "(no text)";
      inbound[key].anchors[text] = (inbound[key].anchors[text] || 0) + 1;
      if (mainHtml.includes(m[0])) inMain = true;
    }
    if (found) inbound[key].pages.push(u);
    if (inMain) inbound[key].inMainPages += 1;
  }
}

const coverage = (text, terms) => terms.filter((w) => text.includes(w)).length / terms.length;
const phraseHits = (text, phrases) => phrases.reduce((n, p) => n + (text.split(p).length - 1), 0);

const competition = {};
for (const [key, t] of Object.entries(TARGETS)) {
  const rows = urls.map((u) => {
    const m = manifest[u];
    const title = m.title || "";
    const h1 = Array.isArray(m.h1) ? m.h1.join(" ") : m.h1 || "";
    const desc = m.description || "";
    const body = raw[u]?.mainText || "";
    const slug = u;
    const score =
      coverage(title, t.terms) * 3 +
      coverage(typeof h1 === "string" ? h1 : String(h1), t.terms) * 2 +
      coverage(desc, t.terms) +
      coverage(slug, t.terms) * 1.5 +
      Math.min(phraseHits(title + " " + h1, t.phrases), 2) * 1.5 +
      Math.min(phraseHits(body, t.phrases), 10) / 10;
    return { url: u, score: Number(score.toFixed(2)), title, h1: typeof h1 === "string" ? h1 : String(h1), bodyPhraseHits: phraseHits(body, t.phrases) };
  });
  rows.sort((a, b) => b.score - a.score);
  const repRank = rows.findIndex((r) => r.url === t.url) + 1;
  competition[key] = { query: t.query, representative: t.url, representativeRank: repRank, top: rows.slice(0, 8) };
}

const result = {
  phase,
  inbound: Object.fromEntries(
    Object.entries(inbound).map(([k, v]) => [
      k,
      {
        linkingPages: v.pages.length,
        linkingPagesInMain: v.inMainPages,
        anchors: Object.entries(v.anchors).sort((a, b) => b[1] - a[1]).slice(0, 15),
        sample: v.pages.slice(0, 25),
      },
    ]),
  ),
  competition,
};
fs.writeFileSync(path.join(CACHE, `diagnose-${phase}.json`), JSON.stringify(result, null, 2));
for (const [k, v] of Object.entries(result.inbound)) console.log(k, "inbound pages", v.linkingPages, "inMain", v.linkingPagesInMain, "topAnchors", JSON.stringify(v.anchors.slice(0, 5)));
for (const [k, v] of Object.entries(competition)) {
  console.log(`\n== ${v.query} (rep rank ${v.representativeRank})`);
  for (const r of v.top) console.log(r.score, r.url, "|", r.title);
}
