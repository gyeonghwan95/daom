// 변경 전후 매핑 CSV: og-audit-before/after(전 페이지 OG) + 현장·서류 사진 매핑(본문 대표 그림)
import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../../..");
const D = path.join(ROOT, "reports/image-2026-10-11");
const read = (f) => {
  const [h, ...rows] = fs.readFileSync(path.join(D, f), "utf8").replace(/^﻿/, "").trim().split("\n");
  const head = h.split(",");
  return rows.map((l) => Object.fromEntries((l.match(/"([^"]*)"/g) || []).map((v, i) => [head[i], v.slice(1, -1)])));
};
const before = new Map(read("og-audit-before.csv").map((r) => [r.route, r]));
const after = read("og-audit-after.csv");
const src = fs.readFileSync(path.join(ROOT, "src/data/seo/field-photo-visuals.ts"), "utf8");
const field = new Map();
for (const m of src.matchAll(/url: "([^"]+)", \.\.\.(\w+)/g)) field.set(m[1], m[2]);
const consts = {};
for (const m of src.matchAll(/const (\w+) = \{\s*src: "([^"]+)",\s*alt: "([^"]+)",\s*caption: "[^"]+",\s*width: (\d+),\s*height: (\d+),\s*source: "([^"]+)"/g)) consts[m[1]] = { src: m[2], alt: m[3], size: `${m[4]}x${m[5]}`, source: m[6] };
for (const m of src.matchAll(/url: "([^"]+)",\s*src: "([^"]+)",\s*alt: "([^"]+)",\s*caption: "[^"]+",\s*width: (\d+),\s*height: (\d+),\s*source: "([^"]+)"/g)) consts["__" + m[1]] = { src: m[2], alt: m[3], size: `${m[4]}x${m[5]}`, source: m[6] };
const rows = [];
for (const a of after) {
  const b = before.get(a.route);
  const fv = field.has(a.route) ? consts[field.get(a.route)] : consts["__" + a.route];
  if (fv) {
    rows.push([a.route, "본문 대표 그림(figure img)", "(없음 또는 표지 배너)", fv.src, "on-page", fv.alt, `${fv.size} 비율 유지, 그림 틀이 실제 비율을 따름`, "사진 속 기관·서류가 페이지 주제와 같은 실제 촬영본", fv.source]);
  }
  if (b && b.og !== a.og) {
    rows.push([
      a.route,
      "og:image·twitter:image·primaryImageOfPage",
      b.og,
      a.og,
      "search/share",
      a.og_alt,
      `${a.actual} ${a.type} ${a.kb}KB (선언 ${b.declared}→${a.declared})`,
      fv ? "실제 현장·업무 사진으로 교체" : b.og_double_encoded === "true" ? "이중 인코딩 404 정정 + 같은 사진의 1200px OG 파생본" : "실제 파일과 크기 일치",
      fv ? fv.source : "기존 동일 사진",
    ]);
  }
}
const head = ["page_url", "use_position", "old_src", "new_src", "search_share_onpage", "alt", "size_crop", "reason", "original_source"];
fs.writeFileSync(path.join(D, "image-mapping.csv"), "﻿" + [head.join(","), ...rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))].join("\n") + "\n");
console.log("mapping rows", rows.length, "field rows", rows.filter((r) => r[4] === "on-page").length);
