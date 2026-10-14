#!/usr/bin/env node
/** Do not report indexing success while production still serves an older commit. */
import { getSiteUrl } from "./lib/site-url.mjs";

const expected = process.env.GITHUB_SHA?.trim();
if (!expected) {
  console.error("[deploy-verify] GITHUB_SHA is required.");
  process.exit(1);
}

const siteUrl = getSiteUrl().replace(/\/$/, "");
const retries = 40;
const retryDelayMs = 20_000;

for (let attempt = 1; attempt <= retries; attempt += 1) {
  try {
    const url = `${siteUrl}/deploy-version.json?check=${Date.now()}`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "cache-control": "no-cache" },
      signal: AbortSignal.timeout(15_000),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.commit === expected) {
        console.log(`[deploy-verify] Production matches ${expected} (attempt ${attempt}/${retries}).`);
        process.exit(0);
      }
      console.log(`[deploy-verify] Waiting for ${expected}; live is ${data.commit ?? "unknown"} (attempt ${attempt}/${retries}).`);
    } else {
      console.log(`[deploy-verify] HTTP ${response.status} (attempt ${attempt}/${retries}).`);
    }
  } catch (error) {
    console.log(`[deploy-verify] ${error instanceof Error ? error.message : error} (attempt ${attempt}/${retries}).`);
  }
  if (attempt < retries) {
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }
}

console.error(`[deploy-verify] Production did not reach ${expected} within the wait window.`);
process.exit(1);
