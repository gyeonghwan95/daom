#!/usr/bin/env node
/**
 * 대상 URL의 before/after 정규화 유사도 — 같은 기준(스냅샷 main text)으로 비교.
 *   SNAP_TARGETS=... node scripts/rseo-simcheck.mjs
 * rseo-audit.mjs를 import하므로 audit도 after 기준으로 다시 실행된다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeRegion } from "./rseo-audit.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache", "regional-seo");
const TARGETS = (process.env.SNAP_TARGETS || "").split(",").filter(Boolean);

const tokens = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s[\]]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
const shingles = (text, n = 3) => {
  const t = tokens(text);
  const set = new Set();
  for (let i = 0; i + n <= t.length; i++) set.add(t.slice(i, i + n).join(" "));
  return set;
};
const jaccard = (A, B) => {
  if (!A.size || !B.size) return 0;
  let inter = 0;
  const [s, l] = A.size < B.size ? [A, B] : [B, A];
  for (const t of s) if (l.has(t)) inter++;
  return inter / (A.size + B.size - inter);
};

const audit = JSON.parse(fs.readFileSync(path.join(CACHE, "audit.json"), "utf8"));
const regionUrls = audit.rows.map((r) => r.url);
const load = (phase) => {
  const raw = JSON.parse(fs.readFileSync(path.join(CACHE, phase, "raw.json"), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.join(CACHE, phase, "manifest.json"), "utf8"));
  return { raw, manifest };
};
const first700 = (text, h1) => {
  const i = h1 ? text.indexOf(h1.split(" | ")[0]) : -1;
  return text.slice(i >= 0 ? i : 0, (i >= 0 ? i : 0) + 700);
};

const result = {};
for (const phase of ["before", "after"]) {
  const { raw, manifest } = load(phase);
  const body = new Map();
  const first = new Map();
  for (const u of regionUrls) {
    const text = raw[u]?.mainText;
    if (!text) continue;
    body.set(u, shingles(normalizeRegion(text)));
    first.set(u, shingles(normalizeRegion(first700(text, manifest.pages[u]?.h1))));
  }
  for (const t of TARGETS) {
    if (!body.has(t)) continue;
    let best = { v: 0, u: "" };
    let bestF = { v: 0, u: "" };
    for (const [u, s] of body) {
      if (u === t) continue;
      const v = jaccard(body.get(t), s);
      if (v > best.v) best = { v, u };
      const f = jaccard(first.get(t), first.get(u));
      if (f > bestF.v) bestF = { v: f, u };
    }
    result[t] ??= {};
    result[t][phase] = {
      maxBody: +best.v.toFixed(4),
      maxBodyWith: best.u,
      maxFirst700: +bestF.v.toFixed(4),
      maxFirst700With: bestF.u,
      chars: raw[t].mainText.length,
    };
  }
  if (phase === "after") {
    const pairs = [];
    for (let i = 0; i < TARGETS.length; i++)
      for (let j = i + 1; j < TARGETS.length; j++)
        if (body.has(TARGETS[i]) && body.has(TARGETS[j]))
          pairs.push([TARGETS[i], TARGETS[j], +jaccard(body.get(TARGETS[i]), body.get(TARGETS[j])).toFixed(4)]);
    result._targetPairs = pairs;
  }
}
fs.writeFileSync(path.join(CACHE, "simcheck.json"), `${JSON.stringify(result, null, 2)}\n`);
for (const t of TARGETS) {
  const r = result[t];
  if (!r) continue;
  console.log(
    `${t}\n  before body=${r.before?.maxBody} (${r.before?.maxBodyWith}) first700=${r.before?.maxFirst700}\n  after  body=${r.after?.maxBody} (${r.after?.maxBodyWith}) first700=${r.after?.maxFirst700} (${r.after?.maxFirst700With})`,
  );
}
console.log("target pairs max:", Math.max(...result._targetPairs.map((p) => p[2])));
