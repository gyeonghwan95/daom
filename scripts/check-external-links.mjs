#!/usr/bin/env node
/**
 * Soft check for SmartPlace URL SSOT.
 * Does not fail the build if Naver blocks bots.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const EXPECTED = "https://naver.me/58j9SzPA";
const configPath = join(ROOT, "src/config/external-links.ts");

function main() {
  if (!existsSync(configPath)) {
    console.warn("[check-external-links] missing external-links.ts");
    process.exit(0);
  }
  const src = readFileSync(configPath, "utf8");
  if (!src.includes(EXPECTED)) {
    console.error(
      `[check-external-links] expected SmartPlace URL ${EXPECTED} in config`,
    );
    process.exit(1);
  }

  // Spot-check hardcoded ticket URLs should not reappear as defaults
  const contactPath = join(ROOT, "src/lib/contact.ts");
  if (existsSync(contactPath)) {
    const contact = readFileSync(contactPath, "utf8");
    if (contact.includes("placePath=/ticket")) {
      console.warn(
        "[check-external-links] WARNING: legacy /ticket URL still present in contact.ts — prefer SmartPlace SSOT",
      );
    }
  }

  console.log(`[check-external-links] OK — SmartPlace SSOT ${EXPECTED}`);
}

main();
