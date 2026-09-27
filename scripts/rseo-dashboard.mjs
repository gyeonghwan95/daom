#!/usr/bin/env node
// dashboard-rows.json + template → reports/regional-seo/<date>/dashboard.html
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATE = process.env.RSEO_DATE || "2026-09-27";
const rows = fs.readFileSync(path.join(ROOT, ".cache/regional-seo/dashboard-rows.json"), "utf8");
const template = fs.readFileSync(path.join(ROOT, "scripts/rseo-dashboard.template.html"), "utf8");
const out = path.join(ROOT, "reports/regional-seo", DATE, "dashboard.html");
fs.writeFileSync(out, template.replaceAll("__DATE__", DATE).replace("__ROWS__", rows.replace(/</g, "\\u003c")));
console.log(`[rseo-dashboard] ${path.relative(ROOT, out)}`);
