/**
 * PRIMARY local keyword → one owner URL.
 * Fails if the same canonical keyword is assigned to two owners,
 * or if an indexable page title/H1 claims another page's local PRIMARY.
 *
 * Usage: npx --yes tsx scripts/keyword-owner-check.ts
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();

function main() {
  const mapPath = path.join(ROOT, "seo/local-keyword-map.json");
  if (!fs.existsSync(mapPath)) {
    console.log("local-keyword-map.json missing — running local-seo-audit first");
    const audit = spawnSync("npx", ["--yes", "tsx", "scripts/local-seo-audit.ts"], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    if (audit.status !== 0) process.exit(audit.status ?? 1);
  }

  const localMap = JSON.parse(fs.readFileSync(mapPath, "utf8")) as {
    owners: Record<string, string>;
  };
  const keywordMap = JSON.parse(
    fs.readFileSync(path.join(ROOT, "seo/keyword-map.json"), "utf8"),
  ) as {
    queries: Record<string, { owner: string; aliasOf?: string; intent?: string }>;
  };

  const errors: string[] = [];
  const ownerByCanonical = new Map<string, string>();

  for (const [query, row] of Object.entries(keywordMap.queries)) {
    if (row.intent && row.intent !== "local" && !query.endsWith("법무사")) {
      continue;
    }
    const canonical = row.aliasOf ?? query;
    const owner = row.aliasOf
      ? keywordMap.queries[row.aliasOf]?.owner ?? row.owner
      : row.owner;
    const prev = ownerByCanonical.get(canonical);
    if (prev && prev !== owner) {
      errors.push(
        `COLLISION ${canonical}: ${prev} vs ${owner} (query=${query})`,
      );
    }
    ownerByCanonical.set(canonical, owner);
  }

  for (const [query, owner] of Object.entries(localMap.owners)) {
    const mapped = keywordMap.queries[query];
    if (!mapped) continue;
    const expected = mapped.aliasOf
      ? keywordMap.queries[mapped.aliasOf]?.owner ?? mapped.owner
      : mapped.owner;
    if (expected !== owner) {
      errors.push(
        `MAP MISMATCH ${query}: local-keyword-map=${owner} keyword-map=${expected}`,
      );
    }
  }

  console.log("=== Keyword owner check (local) ===");
  const ownership = spawnSync("npx", ["--yes", "tsx", "scripts/check-keyword-ownership.ts"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  if (ownership.status !== 0) process.exit(ownership.status ?? 1);
  console.log(`canonical local queries: ${ownerByCanonical.size}`);
  console.log("OK — no local owner collisions");
}

main();
