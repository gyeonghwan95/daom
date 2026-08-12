/**
 * page-inventory → compact path→title map for admin UI (display only).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src/generated/page-inventory.json");
const out = join(root, "src/generated/admin-page-titles.json");

const inventory = JSON.parse(readFileSync(src, "utf8"));
const titles = {};

for (const row of inventory) {
  const url = String(row.url || "").split("?")[0].split("#")[0] || "/";
  let path = url.startsWith("/") ? url : `/${url}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep */
  }
  const title = String(row.title || "").trim();
  if (path && title) titles[path] = title;
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      total: Object.keys(titles).length,
      titles,
    },
    null,
    0,
  ),
);

console.log(`admin-page-titles: ${Object.keys(titles).length} paths → ${out}`);
