#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const targets = [
  "/부산상속법무사",
  "/부산등기법무사",
  "/부산법인등기",
  "/해운대법무사",
  "/업무사례/울산상속등기법무사",
  "/부산보상등기",
];

const files = [
  path.join("public", "sitemap.xml"),
  ...fs.readdirSync("public/sitemaps").map((f) => path.join("public/sitemaps", f)),
];

for (const t of targets) {
  const enc = encodeURI(t);
  const found = files.filter((f) => {
    const xml = fs.readFileSync(f, "utf8");
    return xml.includes(enc) || xml.includes(t);
  });
  console.log(t, found.length ? found.map((x) => path.basename(x)).join(",") : "MISSING");
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

for (const url of targets) {
  const p = path.join("out", `${url.slice(1)}.html`);
  const html = fs.readFileSync(p, "utf8");
  const title = (html.match(/<title[^>]*>([^<]*)/i) || [])[1];
  const h1 = strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "");
  const desc =
    (html.match(/name=["']description["'][^>]*content=["']([^"']*)/i) || [])[1] ||
    "";
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  const body = strip(main);
  console.log("\n==", url);
  console.log("T:", title);
  console.log("H:", h1);
  console.log("D:", desc.slice(0, 140));
  console.log("chars:", body.length);
}
