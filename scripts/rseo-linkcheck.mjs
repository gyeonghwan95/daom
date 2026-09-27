#!/usr/bin/env node
// 16-internal-link-map.csv의 target이 실제 URL(seo-paths 또는 out/*.html)인지 확인
import fs from "node:fs";
import path from "node:path";

const DATE = process.env.RSEO_DATE || "2026-09-27";
const csv = fs.readFileSync(path.join("reports/regional-seo", DATE, "16-internal-link-map.csv"), "utf8").replace(/^\uFEFF/, "");
const paths = new Set(JSON.parse(fs.readFileSync("scripts/output/seo-paths.json", "utf8")).paths.map((p) => decodeURIComponent(p)));
const exists = (u) =>
  paths.has(u) || fs.existsSync(path.join("out", `${u.slice(1)}.html`)) || fs.existsSync(path.join("out", u.slice(1), "index.html"));
const rows = csv.trim().split("\n").slice(1).map((l) => l.split(","));
const bad = rows.filter((r) => r[1]?.startsWith("/") && !exists(r[1]));
const hub = rows.filter((r) => r[3] === "HUB_TO_CITY");
console.log(`links=${rows.length} hubToCity=${hub.length} missing=${bad.length}`);
for (const r of bad) console.log("MISSING", r[0], "->", r[1]);
