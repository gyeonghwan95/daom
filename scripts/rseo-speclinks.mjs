#!/usr/bin/env node
// node scripts/rseo-speclinks.mjs gyeongju jinju ...  → 지역 스펙 안의 내부 링크가 실제 URL인지 확인
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const paths = new Set(JSON.parse(fs.readFileSync("scripts/output/seo-paths.json", "utf8")).paths.map((p) => decodeURIComponent(p)));
const exists = (u) =>
  paths.has(u) || fs.existsSync(path.join("out", `${u.slice(1)}.html`)) || fs.existsSync(path.join("out", u.slice(1), "index.html"));

function collect(node, out) {
  if (Array.isArray(node)) node.forEach((n) => collect(n, out));
  else if (node && typeof node === "object") {
    if (typeof node.href === "string" && node.href.startsWith("/")) out.push(node.href.split("?")[0]);
    Object.values(node).forEach((v) => collect(v, out));
  }
}

let missing = 0;
for (const key of process.argv.slice(2)) {
  const mod = await import(pathToFileURL(path.resolve(`src/lib/regional-inheritance/${key}.ts`)).href);
  const spec = Object.values(mod)[0];
  const links = [];
  collect(spec.sections, links);
  collect(spec.cta, links);
  const bad = links.filter((l) => !l.startsWith("/contact") && !exists(l));
  missing += bad.length;
  console.log(`${key}: links=${links.length} missing=${bad.length}${bad.length ? " " + bad.join(" ") : ""}`);
}
process.exitCode = missing ? 1 : 0;
