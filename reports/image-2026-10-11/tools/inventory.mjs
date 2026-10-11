// public/image 전체 inventory + 빌드(out/) 참조 집계 → inventory.csv
// 열: path, tracked, format, width, height, kb, ratio, sha1, dhash, dup_group, refs_out_pages, ref_kinds, exif_gps
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../../..");
const IMG = path.join(ROOT, "public/image");
const OUT = path.join(ROOT, "out");
const outCsv = path.join(ROOT, "reports/image-2026-10-11/inventory.csv");

const tracked = new Set(
  execFileSync("git", ["ls-files", "-z", "public/image"], { cwd: ROOT, encoding: "utf8" })
    .split("\0")
    .filter(Boolean)
    .map((p) => p.normalize("NFC")),
);
const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(e.name)) files.push(f);
  }
};
walk(IMG);

// out/의 이미지 참조: /image/... 와 /_img/image/...{w}.webp 를 원본 경로로 환원
const refs = new Map(); // "/image/.." → {pages:Set, kinds:Set}
const pageFiles = [];
const walkOut = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith("_")) walkOut(f);
    } else if (e.name.endsWith(".html")) pageFiles.push(f);
  }
};
walkOut(OUT);
const toOrig = (u) => {
  let p = u.replace(/^https?:\/\/[^/]+/, "");
  try {
    p = decodeURI(p);
  } catch {}
  p = p.normalize("NFC");
  const m = p.match(/^\/_img(\/image\/.+)\.(\d+\.webp|og\.jpg)$/);
  return m ? m[1] : p;
};
for (const f of pageFiles) {
  const html = fs.readFileSync(f, "utf8");
  const page = "/" + path.relative(OUT, f).split(path.sep).join("/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  const kinds = [
    ["img", /<img\b[^>]*>/g],
    ["og", /<meta[^>]+property="og:image"[^>]*>/g],
    ["jsonld", /<script[^>]+ld\+json[^>]*>[\s\S]*?<\/script>/g],
  ];
  for (const [kind, re] of kinds) {
    for (const m of html.matchAll(re)) {
      for (const u of m[0].matchAll(/(?:https?:\/\/[^"'\s,]+)?\/(?:_img\/)?image\/[^"'\s,)\\]+/g)) {
        const o = toOrig(u[0].replace(/&amp;/g, "&"));
        if (!refs.has(o)) refs.set(o, { pages: new Set(), kinds: new Set() });
        refs.get(o).pages.add(page);
        refs.get(o).kinds.add(kind);
      }
    }
  }
}

const rows = [];
for (const f of files) {
  const rel = path.relative(ROOT, f).split(path.sep).join("/").normalize("NFC");
  const web = "/" + rel.replace(/^public\//, "");
  const buf = fs.readFileSync(f);
  let meta = {};
  let dhash = "";
  try {
    meta = await sharp(buf).metadata();
    const px = await sharp(buf).rotate().greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
    let bits = "";
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += px[y * 9 + x] > px[y * 9 + x + 1] ? "1" : "0";
    dhash = BigInt("0b" + bits).toString(16).padStart(16, "0");
  } catch {}
  const w = meta.orientation >= 5 ? meta.height : meta.width;
  const h = meta.orientation >= 5 ? meta.width : meta.height;
  const r = refs.get(web);
  rows.push({
    path: web,
    tracked: tracked.has(rel) ? "tracked" : "untracked",
    format: meta.format ?? path.extname(f).slice(1),
    width: w ?? "",
    height: h ?? "",
    kb: Math.round(buf.length / 1024),
    ratio: w && h ? (w / h).toFixed(2) : "",
    sha1: crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12),
    dhash,
    refs_out_pages: r ? r.pages.size : 0,
    ref_kinds: r ? [...r.kinds].join("|") : "",
    exif: meta.exif ? "exif" : "",
  });
}
// 유사 이미지 묶음(dhash 해밍거리 ≤ 6)
const ham = (a, b) => {
  let x = BigInt("0x" + a) ^ BigInt("0x" + b);
  let c = 0;
  while (x) {
    c += Number(x & 1n);
    x >>= 1n;
  }
  return c;
};
let g = 0;
const group = new Map();
for (let i = 0; i < rows.length; i++) {
  if (!rows[i].dhash || group.has(i)) continue;
  const members = [i];
  for (let j = i + 1; j < rows.length; j++) if (rows[j].dhash && !group.has(j) && ham(rows[i].dhash, rows[j].dhash) <= 6) members.push(j);
  if (members.length > 1) {
    g++;
    for (const m of members) group.set(m, `G${g}`);
  }
}
rows.forEach((r, i) => (r.dup_group = group.get(i) ?? ""));
const head = ["path", "tracked", "format", "width", "height", "kb", "ratio", "sha1", "dhash", "dup_group", "refs_out_pages", "ref_kinds", "exif"];
fs.writeFileSync(outCsv, "﻿" + [head.join(","), ...rows.map((r) => head.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(","))].join("\n") + "\n");
// 변환본(/_img/…{w}.webp, …og.jpg)은 원래 확장자가 빠지므로 확장자를 뺀 이름으로 원본 존재를 확인한다
const bases = new Set(rows.map((r) => r.path.replace(/\.[a-z0-9]+$/i, "")));
const missing = [...refs.keys()].filter((k) => {
  const base = k.replace(/\.og$/, "").replace(/\.[a-z0-9]+$/i, "");
  return !fs.existsSync(path.join(ROOT, "public", k)) && !bases.has(base) && !bases.has(k) && !fs.existsSync(path.join(OUT, k));
});
fs.writeFileSync(path.join(ROOT, "reports/image-2026-10-11/missing-refs.txt"), missing.map((m) => `${m}\t${[...refs.get(m).kinds].join("|")}\t${refs.get(m).pages.size}`).join("\n") + "\n");
console.log(`images ${rows.length} (untracked ${rows.filter((r) => r.tracked === "untracked").length}), referenced ${rows.filter((r) => r.refs_out_pages).length}, dup groups ${g}, out refs pointing to missing files ${missing.length}`);
