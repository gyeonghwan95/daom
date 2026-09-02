/**
 * KV hot-path audit — static call graph (no live Cloudflare metrics).
 * Usage: npx --yes tsx scripts/kv-hotpath-audit.ts
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["functions", "src", "wrangler.toml"];
const OP_RE =
  /\b(getWithMetadata|\.get\(|\.put\(|\.delete\(|\.list\(|getJson\(|putJson\(|listNotices|recordAnalyticsEvent|bumpIngest|appendEmailLog|appendAudit|getDaily|getHourly|buildDashboard|buildPagesReport|buildMonitoring)\b/g;

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules" || name.name === ".next" || name.name === "out") continue;
      walk(p, out);
    } else if (/\.(ts|tsx|js|mjs|toml)$/.test(name.name)) {
      out.push(p);
    }
  }
  return out;
}

function classify(file: string, line: string): {
  public_path: boolean;
  estimated_hotness: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
} {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const publicFn =
    rel.startsWith("functions/api/analytics/") ||
    rel.startsWith("functions/api/notices/") ||
    rel.startsWith("functions/api/quick-inquiry");
  const adminFn = rel.includes("/admin");
  const isWrite =
    line.includes(".put(") ||
    line.includes("putJson") ||
    line.includes("recordAnalyticsEvent") ||
    line.includes("bumpIngest") ||
    line.includes("appendEmailLog");
  if (rel.includes("collect.ts") && isWrite) {
    return { public_path: true, estimated_hotness: "CRITICAL" };
  }
  if (publicFn && isWrite) return { public_path: true, estimated_hotness: "HIGH" };
  if (publicFn) return { public_path: true, estimated_hotness: "HIGH" };
  if (adminFn && line.includes("buildDashboard")) {
    return { public_path: false, estimated_hotness: "HIGH" };
  }
  if (adminFn) return { public_path: false, estimated_hotness: "MEDIUM" };
  return { public_path: false, estimated_hotness: "LOW" };
}

function operationOf(line: string): string {
  if (line.includes(".list(") || line.includes("kv.list")) return "LIST";
  if (line.includes(".put(") || line.includes("putJson") || line.includes("saveNotices")) return "PUT";
  if (line.includes(".delete(")) return "DELETE";
  if (
    line.includes(".get(") ||
    line.includes("getJson") ||
    line.includes("listNotices") ||
    line.includes("getDaily") ||
    line.includes("getHourly")
  ) {
    return "GET";
  }
  if (line.includes("recordAnalyticsEvent")) return "GET+PUT";
  return "CALL";
}

function main() {
  const files = [
    join(ROOT, "wrangler.toml"),
    ...walk(join(ROOT, "functions")),
    ...walk(join(ROOT, "src")),
  ].filter((p) => existsSync(p));

  const rows: string[][] = [
    [
      "namespace",
      "file",
      "line",
      "operation",
      "route",
      "public_path",
      "estimated_hotness",
      "snippet",
    ],
  ];
  let publicHot = 0;
  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    const text = readFileSync(file, "utf8");
    if (!text.includes("ADMIN_KV") && !text.includes("getJson") && !text.includes("kv_namespaces")) {
      if (!rel.startsWith("functions/_lib/admin-ops/") && !rel.startsWith("functions/api/")) continue;
    }
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!OP_RE.test(line) && !line.includes("ADMIN_KV") && !line.includes("kv.get") && !line.includes("kv.put")) {
        OP_RE.lastIndex = 0;
        return;
      }
      OP_RE.lastIndex = 0;
      if (
        !/\b(ADMIN_KV|getJson|putJson|kv\.get|kv\.put|recordAnalyticsEvent|bumpIngest|listNotices|buildDashboard|buildPagesReport|buildMonitoring|appendEmailLog)\b/.test(
          line,
        )
      ) {
        return;
      }
      const { public_path, estimated_hotness } = classify(file, line);
      if (public_path && (estimated_hotness === "CRITICAL" || estimated_hotness === "HIGH")) {
        publicHot += 1;
      }
      const route = rel.startsWith("functions/api/")
        ? "/" + rel.replace(/^functions/, "").replace(/\.ts$/, "").replace("/[[path]]", "/*")
        : "";
      rows.push([
        "ADMIN_KV",
        rel,
        String(i + 1),
        operationOf(line),
        route,
        public_path ? "yes" : "no",
        estimated_hotness,
        line.trim().slice(0, 160).replace(/,/g, ";"),
      ]);
    });
  }

  const dir = join(ROOT, "audit/kv");
  mkdirSync(dir, { recursive: true });
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  writeFileSync(join(dir, "hotpath-scan.csv"), csv, "utf8");
  console.log(`kv-hotpath-audit rows=${rows.length - 1} public_high_or_critical_lines=${publicHot}`);
  console.log(`wrote audit/kv/hotpath-scan.csv`);
}

main();
