// out 디렉터리에서 대상 href로 가는 <a> 앵커 문구를 집계(본문 main 밖 포함)
import fs from "node:fs";
import path from "node:path";
const [, , outDir, label] = process.argv;
const TARGETS = ["/부산상속포기", "/부산상속법무사", "/부산상속전문법무사", "/부산한정승인", "/공탁채권회수", "/부산공탁"];
const enc = Object.fromEntries(TARGETS.map((t) => [encodeURI(t), t]));
const tally = Object.fromEntries(TARGETS.map((t) => [t, {}]));
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!e.name.startsWith("_next")) walk(f); } else if (e.name.endsWith(".html")) scan(fs.readFileSync(f, "utf8")); } };
function scan(h) {
  const body = h.replace(/<script[\s\S]*?<\/script>/g, "");
  for (const m of body.matchAll(/<a\b[^>]*href="([^"#?]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
    const t = enc[m[1]] || (TARGETS.includes(m[1]) ? m[1] : null);
    if (!t) continue;
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 50);
    tally[t][text] = (tally[t][text] || 0) + 1;
  }
}
walk(outDir);
fs.writeFileSync(`reports/naver-7kw-2026-10-11/anchors-${label}.json`, JSON.stringify(tally, null, 1));
for (const t of TARGETS) { const e = Object.entries(tally[t]).sort((a, b) => b[1] - a[1]); console.log(t, "total", e.reduce((s, x) => s + x[1], 0)); for (const [k, v] of e.slice(0, 6)) console.log("   ", v, k); }
