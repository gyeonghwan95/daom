import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join("c:/workspace/daom/public/image");

async function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp|avif|gif)$/i.test(ent.name)) out.push(p);
  }
  return out;
}

const files = await walk(root);
const rows = [];
for (const f of files) {
  const st = fs.statSync(f);
  let meta = { width: 0, height: 0, format: "?" };
  try {
    const m = await sharp(f).metadata();
    meta = { width: m.width || 0, height: m.height || 0, format: m.format || "?" };
  } catch (e) {
    meta.error = String(e.message || e);
  }
  const rel = path.relative(path.join("c:/workspace/daom/public"), f).split(path.sep).join("/");
  rows.push({
    path: `/${rel}`,
    file: path.basename(f),
    bytes: st.size,
    kb: Math.round(st.size / 1024),
    ...meta,
    ratio: meta.width && meta.height ? Number((meta.width / meta.height).toFixed(3)) : null,
  });
}

fs.mkdirSync("c:/workspace/daom/scripts/output", { recursive: true });
fs.writeFileSync(
  "c:/workspace/daom/scripts/output/image-inventory-raw.json",
  JSON.stringify(rows, null, 2),
);
console.log("count", rows.length);
console.log("totalMB", (rows.reduce((a, r) => a + r.bytes, 0) / 1024 / 1024).toFixed(2));
