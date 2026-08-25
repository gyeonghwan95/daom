import fs from "node:fs";

const html = fs.readFileSync("out/index.html", "utf8");
for (const t of [
  "footer",
  "<footer",
  "h1",
  "<h1",
  "<main",
  "부산 법무사",
  "불러오는",
  "page-skeleton",
]) {
  console.log(t, html.indexOf(t));
}

const textOrder = (() => {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const f = stripped.search(/<\/?footer\b/i);
  const h = stripped.search(/<\/?h1\b/i);
  return { f, h, footerBefore: f >= 0 && h >= 0 && f < h };
})();
console.log("textOrder", textOrder);

// list Korean dirs
import path from "node:path";
const names = fs.readdirSync("out").filter((n) => /법무|상속|등기/.test(n));
console.log("dirs sample", names.slice(0, 20));
