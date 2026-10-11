// 빌드(out/) 전 페이지의 og:image·JSON-LD 이미지 감사 → og-audit.csv
// - URL을 한 번만 디코드해 public/(또는 out/)의 실제 파일로 찾는다. %25(이중 인코딩)가 남으면 운영에서 404.
// - 선언한 og:image:width/height와 실제 파일 크기 비교, 본문 <img>(원본 또는 /_img 변환본)에 같은 이미지가 있는지 확인.
//   node reports/image-2026-10-11/tools/og-audit.mjs [label]
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../../..");
const OUT = path.join(ROOT, "out");
const label = process.argv[2] ?? "current";
const pages = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith("_")) walk(f);
    } else if (e.name.endsWith(".html")) pages.push(f);
  }
};
walk(OUT);

const dimCache = new Map();
async function fileInfo(urlPath) {
  if (dimCache.has(urlPath)) return dimCache.get(urlPath);
  let decoded = urlPath;
  try {
    decoded = decodeURI(urlPath);
  } catch {}
  const candidates = [path.join(OUT, decoded), path.join(ROOT, "public", decoded)];
  const f = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  let info = { exists: false };
  if (f && !/%25/.test(urlPath)) {
    const m = await sharp(f).metadata().catch(() => ({}));
    const rot = m.orientation >= 5;
    info = { exists: true, width: rot ? m.height : m.width, height: rot ? m.width : m.height, format: m.format, bytes: fs.statSync(f).size };
  }
  dimCache.set(urlPath, info);
  return info;
}
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1] ?? "";
const metaVal = (head, prop) => {
  const tag = (head.match(new RegExp(`<meta[^>]+property="${prop}"[^>]*>`)) || [""])[0];
  return attr(tag, "content").replace(/&amp;/g, "&");
};
const norm = (u) => {
  let p = u.replace(/^https?:\/\/[^/]+/, "");
  try {
    p = decodeURI(p);
  } catch {}
  return p.normalize("NFC");
};
const variantBase = (p) => p.replace(/^\/_img(\/.+)\.\d+\.webp$/, "$1").replace(/\.(jpe?g|png|webp)$/i, "");

const rows = [];
for (const f of pages) {
  const html = fs.readFileSync(f, "utf8");
  const route = "/" + path.relative(OUT, f).split(path.sep).join("/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  const head = (html.match(/<head[\s\S]*?<\/head>/) || [""])[0];
  if (/name="robots" content="noindex/.test(head)) continue;
  const og = metaVal(head, "og:image");
  if (!og) continue;
  const ogPath = og.replace(/^https?:\/\/[^/]+/, "");
  const info = await fileInfo(ogPath);
  const declW = +metaVal(head, "og:image:width") || null;
  const declH = +metaVal(head, "og:image:height") || null;
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => variantBase(norm(attr(m[0], "src").replace(/&amp;/g, "&"))));
  const onPage = imgs.includes(variantBase(norm(og)));
  const ld = [...html.matchAll(/<script[^>]+ld\+json[^>]*>([\s\S]*?)<\/script>/g)].flatMap((m) => [...m[1].matchAll(/"(?:image|url|contentUrl)":"(https?:\/\/[^"]+\.(?:jpe?g|png|webp))"/g)].map((x) => x[1]));
  let ldBroken = 0;
  for (const u of new Set(ld)) if (!(await fileInfo(u.replace(/^https?:\/\/[^/]+/, ""))).exists) ldBroken++;
  rows.push({
    route,
    og: norm(og),
    og_exists: info.exists,
    og_double_encoded: /%25/.test(og),
    declared: declW ? `${declW}x${declH}` : "",
    actual: info.exists ? `${info.width}x${info.height}` : "",
    dims_match: info.exists && declW === info.width && declH === info.height,
    type: info.format ?? "",
    kb: info.bytes ? Math.round(info.bytes / 1024) : "",
    ratio_ok: info.exists ? Math.max(info.width, info.height) / Math.min(info.width, info.height) <= 3 : "",
    naver_min_ok: info.exists ? info.width > 150 && info.height > 150 && info.bytes > 5000 : "",
    og_alt: metaVal(head, "og:image:alt"),
    on_page_img: onPage,
    jsonld_images: new Set(ld).size,
    jsonld_broken: ldBroken,
  });
}
const head = Object.keys(rows[0]);
fs.writeFileSync(
  path.join(ROOT, `reports/image-2026-10-11/og-audit-${label}.csv`),
  "﻿" + [head.join(","), ...rows.map((r) => head.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(","))].join("\n") + "\n",
);
const c = (fn) => rows.filter(fn).length;
const byOg = {};
for (const r of rows) byOg[r.og] = (byOg[r.og] || 0) + 1;
console.log(
  JSON.stringify({
    indexablePages: rows.length,
    ogMissingFile: c((r) => !r.og_exists),
    ogDoubleEncoded: c((r) => r.og_double_encoded),
    dimsMismatch: c((r) => r.og_exists && !r.dims_match),
    naverMinFail: c((r) => r.og_exists && !r.naver_min_ok),
    ratioOver3: c((r) => r.og_exists && !r.ratio_ok),
    ogNotOnPage: c((r) => !r.on_page_img),
    pagesWithBrokenJsonldImage: c((r) => r.jsonld_broken > 0),
    distinctOgImages: Object.keys(byOg).length,
  }),
);
console.log("top og images:", Object.entries(byOg).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${v} ${k}`).join(" | "));
