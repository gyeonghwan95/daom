#!/usr/bin/env node
/** node scripts/rseo-links.mjs /path [/path2 ...] [--filter=regex] — list internal links inside <main>. */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const filterArg = args.find((a) => a.startsWith("--filter="));
const filter = filterArg ? new RegExp(filterArg.slice(9)) : null;
for (const u of args.filter((a) => a.startsWith("/"))) {
  const file = path.join("out", `${u.slice(1)}.html`);
  const html = fs.readFileSync(file, "utf8");
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? "";
  const links = [...main.matchAll(/<a\b[^>]*href="([^"#?]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => {
      let href = m[1];
      try {
        href = decodeURIComponent(href);
      } catch {}
      return { href, text: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 40) };
    })
    .filter((l) => l.href.startsWith("/") && (!filter || filter.test(l.href)));
  const seen = new Set();
  console.log(`== ${u} (${links.length})`);
  for (const l of links) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    console.log(`  ${l.href} | ${l.text}`);
  }
}
