// 404 후보 자산: 운영 응답(상태·형식) + 로컬 public/ 존재 + src/out 참조 위치 → asset-check.csv
import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";
const list = fs.readFileSync(new URL("./asset-404.txt", import.meta.url), "utf8").trim().split(/\r?\n/);
const head = async (p) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), 15000); try { const r = await fetch(SITE + encodeURI(p), { signal: c.signal }); const b = Buffer.from(await r.arrayBuffer()); return `${r.status} ${(r.headers.get("content-type") || "").split(";")[0]} ${b.length}`; } catch (e) { return "ERR " + e.message; } finally { clearTimeout(t); } };
const rg = (pat, dir) => { try { return execFileSync("rg", ["-l", "-F", pat, dir, "-g", "!*.map"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean); } catch { return []; } };
const rows = [];
for (let i = 0; i < list.length; i += 4) {
  const chunk = list.slice(i, i + 4);
  const res = await Promise.all(chunk.map(head));
  chunk.forEach((p, k) => {
    const local = fs.existsSync(path.join("public", p)) ? "public있음" : "public없음";
    const src = rg(p, "src").concat(rg(p.split("/").pop(), "src")).filter((v, j, a) => a.indexOf(v) === j);
    const out = rg(p, "out");
    rows.push({ p, live: res[k], local, srcRefs: src.length, srcEx: src.slice(0, 2).join(" "), outRefs: out.length, outEx: out.slice(0, 2).join(" ") });
  });
}
fs.writeFileSync(new URL("./asset-check.csv", import.meta.url), "﻿path,live,local,src_refs,src_example,out_refs,out_example\n" + rows.map((r) => [r.p, r.live, r.local, r.srcRefs, r.srcEx, r.outRefs, r.outEx].map((v) => `"${v}"`).join(",")).join("\n") + "\n");
for (const r of rows) console.log(r.p, "|", r.live, "|", r.local, "| src", r.srcRefs, r.srcEx.slice(0, 70), "| out", r.outRefs, r.outEx.slice(0, 60));
