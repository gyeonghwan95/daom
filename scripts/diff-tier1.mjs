import { readFileSync } from "node:fs";

const live = await fetch(
  "https://xn--2j1br1na42lvxja38mk8r.kr/sitemaps/tier-1-core.xml",
).then((r) => r.text());
const local = readFileSync("public/sitemaps/tier-1-core.xml", "utf8");

let diffs = 0;
const la = live.split(/\r?\n/);
const lb = local.split(/\r?\n/);
for (let i = 0; i < Math.max(la.length, lb.length); i++) {
  if (la[i] !== lb[i]) {
    console.log(`line ${i + 1}:`);
    console.log(`  live:  ${JSON.stringify(la[i])}`);
    console.log(`  local: ${JSON.stringify(lb[i])}`);
    if (++diffs >= 10) break;
  }
}
console.log(`total lines live=${la.length} local=${lb.length} diffs_shown=${diffs}`);

// http/https redirect chain
for (const u of [
  "http://xn--2j1br1na42lvxja38mk8r.kr/",
  "http://다옴법무사사무소.kr/",
]) {
  const r = await fetch(u, { redirect: "manual" });
  console.log(`${u} -> ${r.status} ${r.headers.get("location") || ""}`);
}
