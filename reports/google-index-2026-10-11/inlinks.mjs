// 사이트맵 URL별 초기 HTML 내부 유입 링크 수(다른 페이지의 a[href], 고유 출발 페이지 기준) → inlinks.csv
// 공통 헤더·푸터 링크도 포함되므로, '공통 영역 제외' 수(main 안 링크만)도 함께 센다.
import fs from "node:fs";
import path from "node:path";

const sm = JSON.parse(fs.readFileSync(new URL("./live-sitemap.json", import.meta.url))).urls.map(([p]) => p);
const smSet = new Set(sm);
const norm = (h) => {
  try {
    return decodeURI(new URL(h, "https://x.kr").pathname).normalize("NFC").replace(/(.)\/$/, "$1");
  } catch {
    return null;
  }
};
const walk = (d, acc = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith("_")) walk(f, acc);
    } else if (e.name.endsWith(".html")) acc.push(f);
  }
  return acc;
};
const all = new Map();
const inMain = new Map();
for (const f of walk("out")) {
  let from = "/" + path.relative("out", f).split(path.sep).join("/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  if (from === "/") from = "/";
  from = from.replace(/(.)\/$/, "$1");
  const h = fs.readFileSync(f, "utf8");
  const main = (h.match(/<main[\s\S]*<\/main>/) || [""])[0];
  const add = (map, html) => {
    for (const m of html.matchAll(/<a\b[^>]*href="([^"#?]+)/g)) {
      if (!m[1].startsWith("/")) continue;
      const to = norm(m[1]);
      if (!to || to === from || !smSet.has(to)) continue;
      if (!map.has(to)) map.set(to, new Set());
      map.get(to).add(from);
    }
  };
  add(all, h);
  add(inMain, main);
}
const rows = sm.map((p) => [p, all.get(p)?.size || 0, inMain.get(p)?.size || 0]);
fs.writeFileSync(new URL("./inlinks.csv", import.meta.url), "﻿path,inlinks_all,inlinks_main\n" + rows.map((r) => r.join(",")).join("\n") + "\n");
const bucket = (i) => {
  const c = { 0: 0, "1": 0, "2-4": 0, "5+": 0 };
  for (const r of rows) c[r[i] === 0 ? 0 : r[i] === 1 ? "1" : r[i] <= 4 ? "2-4" : "5+"]++;
  return c;
};
console.log("sitemap URLs", rows.length, "\n전체 링크 기준", bucket(1), "\n본문(main) 링크 기준", bucket(2));
