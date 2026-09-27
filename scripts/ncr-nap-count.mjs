import fs from "node:fs";
import path from "node:path";

const needles = {
  centumBexco: "센텀시티역·벡스코 인근",
  officialAccess: "동해선 재송역, 센텀역 도보 5분",
  changjo: "창조관",
  awardSchema: '"award"',
  hasCredential: '"hasCredential"',
};
const counts = Object.fromEntries(Object.keys(needles).map((k) => [k, 0]));
const pages = Object.fromEntries(Object.keys(needles).map((k) => [k, []]));
let total = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) {
      total += 1;
      const html = fs.readFileSync(full, "utf8");
      for (const [key, needle] of Object.entries(needles)) {
        if (html.includes(needle)) {
          counts[key] += 1;
          pages[key].push(path.relative("out", full).replace(/\\/g, "/"));
        }
      }
    }
  }
}

walk("out");
console.log(JSON.stringify({ total, ...counts }));
for (const [key, list] of Object.entries(pages)) {
  if (list.length && list.length <= 20) console.log(key, list.join(" "));
}
