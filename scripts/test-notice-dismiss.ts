/**
 * Notice dismiss KST day boundary tests.
 * Run: npx tsx scripts/test-notice-dismiss.ts
 */
import assert from "node:assert/strict";
import { getKstDateYmd } from "../src/lib/notices/dismiss";

const ymd = getKstDateYmd(new Date("2026-08-12T14:30:00Z"));
assert.equal(ymd, "2026-08-12");

const nextDay = getKstDateYmd(new Date("2026-08-12T15:30:00Z"));
assert.equal(nextDay, "2026-08-13");

console.log("notice dismiss KST: OK");
