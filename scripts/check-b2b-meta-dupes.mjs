import fs from "node:fs";
import path from "node:path";

const dir = path.join("src/lib/b2b/pages");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));
const titles = [];
const descs = [];
const h1s = [];

for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  const slug = t.match(/slug:\s*"([^"]+)"/)?.[1];
  const mt = t.match(/metaTitle:\s*"([^"]+)"/)?.[1];
  const md = t.match(/metaDescription:\s*\n?\s*"([^"]+)"/)?.[1];
  const h1 = t.match(/h1:\s*"([^"]+)"/)?.[1];
  if (mt) titles.push([slug, mt]);
  if (md) descs.push([slug, md]);
  if (h1) h1s.push([slug, h1]);
}

function dups(arr, label) {
  const m = new Map();
  for (const [s, v] of arr) {
    if (!m.has(v)) m.set(v, []);
    m.get(v).push(s);
  }
  const bad = [...m.entries()].filter(([, a]) => a.length > 1);
  console.log(label + ":", bad.length ? JSON.stringify(bad, null, 2) : "none");
}

dups(titles, "dup titles");
dups(descs, "dup descs");
dups(h1s, "dup h1");
console.log("pages", titles.length);
