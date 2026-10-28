import fs from "node:fs";
export function boots(h) {
  const out = [];
  const re = /\.bootstrap\(document\.getElementById\("[^"]+"\),\s*/g;
  let m;
  while ((m = re.exec(h))) {
    let i = re.lastIndex, depth = 0, inStr = false, esc = false, start = i;
    for (; i < h.length; i++) {
      const c = h[i];
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true; else if (c === "{" || c === "[") depth++; else if (c === "}" || c === "]") { depth--; if (depth === 0) { i++; break; } }
    }
    try { out.push({ pos: m.index, obj: JSON.parse(h.slice(start, i)) }); } catch (e) { out.push({ pos: m.index, err: e.message }); }
  }
  return out;
}
if (process.argv[1]?.endsWith("boot.mjs") && process.argv[2]) {
  const h = fs.readFileSync(process.argv[2], "utf8");
  for (const b of boots(h)) {
    if (b.err) { console.log("ERR", b.err); continue; }
    const s = JSON.stringify(b.obj);
    console.log(b.obj?.refs?.blockId, b.obj?.body?.templateId, s.length, s.slice(0, Number(process.argv[3]||300)));
  }
}
