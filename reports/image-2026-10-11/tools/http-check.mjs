// 로컬 정적 서버(out/) 기준 실제 GET으로 이미지 응답 확인 → http-check.csv
//   node reports/image-2026-10-11/tools/http-check.mjs http://localhost:4789 <route>...
// 각 페이지의 og:image, twitter:image, JSON-LD 이미지, 본문 <img> src·srcset을 모두 요청하고 200 + image/* 인지 본다.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../../..");
const [base, ...routes] = process.argv.slice(2);
const toLocal = (u) => u.replace(/^https?:\/\/[^/]+/, base);
const urls = new Map();
for (const r of routes) {
  const html = await (await fetch(base + encodeURI(r))).text();
  const add = (u, kind) => {
    if (!u || u.startsWith("data:")) return;
    const abs = u.startsWith("/") ? base + u : toLocal(u);
    if (!urls.has(abs)) urls.set(abs, new Set());
    urls.get(abs).add(`${r}:${kind}`);
  };
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)="(og:image|twitter:image)"[^>]*content="([^"]+)"/g)) add(m[2].replace(/&amp;/g, "&"), m[1]);
  for (const m of html.matchAll(/<script[^>]+ld\+json[^>]*>([\s\S]*?)<\/script>/g))
    for (const x of m[1].matchAll(/"(https?:\/\/[^"]+\.(?:jpe?g|png|webp))"/g)) add(x[1], "jsonld");
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const src = (m[0].match(/ src="([^"]+)"/) || [])[1];
    add(src?.replace(/&amp;/g, "&"), "img");
    const set = (m[0].match(/srcSet="([^"]+)"/) || [])[1];
    if (set) for (const part of set.replace(/&amp;/g, "&").split(",")) add(part.trim().split(/\s+/)[0], "srcset");
  }
}
const rows = [];
const list = [...urls];
for (let i = 0; i < list.length; i += 4) {
  await Promise.all(
    list.slice(i, i + 4).map(async ([u, where]) => {
      try {
        const res = await fetch(u);
        const buf = Buffer.from(await res.arrayBuffer());
        rows.push({ url: decodeURI(u.replace(base, "")), status: res.status, type: res.headers.get("content-type") ?? "", bytes: buf.length, where: [...where].slice(0, 3).join(" ") });
      } catch (e) {
        rows.push({ url: u, status: 0, type: String(e.message), bytes: 0, where: [...where].join(" ") });
      }
    }),
  );
}
const bad = rows.filter((r) => r.status !== 200 || !/^image\//.test(r.type));
fs.writeFileSync(path.join(ROOT, "reports/image-2026-10-11/http-check.csv"), "﻿url,status,type,bytes,where\n" + rows.map((r) => [r.url, r.status, r.type, r.bytes, r.where].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
console.log(`pages ${routes.length} · image URLs ${rows.length} · not 200 image/* ${bad.length}`);
for (const b of bad.slice(0, 10)) console.log("BAD", b.status, b.type, b.url, b.where);
