// 404 자산 경로(원문·퍼센트 인코딩)가 src/·out/의 어디에 남았는지 순수 Node로 집계 → asset-refs.csv
import fs from "node:fs";
import path from "node:path";

const list = fs.readFileSync(new URL("./asset-404.txt", import.meta.url), "utf8").trim().split(/\r?\n/);
const slash = (f) => f.split(path.sep).join("/");
const walk = (d, exts, acc = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules") walk(f, exts, acc);
    } else if (exts.some((x) => e.name.endsWith(x))) acc.push(f);
  }
  return acc;
};
const srcFiles = walk("src", [".ts", ".tsx", ".json", ".mdx", ".md"]).map((f) => [slash(f), fs.readFileSync(f, "utf8")]);
const outFiles = walk("out", [".html", ".txt", ".js", ".json", ".xml"]).map((f) => [slash(f), fs.readFileSync(f, "utf8")]);

const rows = [];
for (const p of list) {
  const name = p.split("/").pop();
  const needles = [...new Set([p, encodeURI(p), name, encodeURI(name)])];
  const hit = (files) => files.filter(([, s]) => needles.some((n) => s.includes(n))).map(([f]) => f);
  const s = hit(srcFiles);
  const o = hit(outFiles);
  const htmlFiles = o.filter((x) => x.endsWith(".html"));
  let imgTag = 0;
  let dataOnly = 0;
  for (const f of htmlFiles.slice(0, 80)) {
    const t = outFiles.find(([g]) => g === f)[1];
    const tags = [...t.matchAll(/<img\b[^>]*>|<link\b[^>]*rel="preload"[^>]*>|<meta\b[^>]*og:image[^>]*>/g)];
    if (tags.some((m) => needles.some((n) => m[0].includes(n)))) imgTag++;
    else dataOnly++;
  }
  rows.push({ p, src: s.length, srcEx: s[0] || "", out: o.length, html: htmlFiles.length, txt: o.filter((x) => x.endsWith(".txt")).length, imgTag, dataOnly, outEx: (o[0] || "").replace(/^out\//, "") });
}
const head = "path,src_files,src_example,out_files,html,rsc_txt,html_img_preload_og,html_data_only,out_example";
fs.writeFileSync(
  new URL("./asset-refs.csv", import.meta.url),
  "﻿" + head + "\n" + rows.map((r) => [r.p, r.src, r.srcEx, r.out, r.html, r.txt, r.imgTag, r.dataOnly, r.outEx].map((v) => `"${v}"`).join(",")).join("\n") + "\n",
);
for (const r of rows) {
  console.log(r.p.padEnd(62), "src", r.src, (r.srcEx.split("/").pop() || "").padEnd(24), "| out", r.out, "html", r.html, "txt", r.txt, "| img태그", r.imgTag, "데이터만", r.dataOnly);
}
