/**
 * URL display layer tests — run: npx tsx scripts/test-admin-url-display.ts
 */
import assert from "node:assert/strict";
import {
  formatPagePath,
  getPageDisplayName,
  safeDecodePathname,
} from "../src/lib/admin/url-display";

assert.equal(
  safeDecodePathname("/%ED%98%91%EC%97%85%EB%AC%B8%EC%9D%98"),
  "/협업문의",
);
assert.equal(
  formatPagePath("/%EB%B6%80%EC%82%B0%EB%B2%95%EB%AC%B4%EC%82%AC"),
  "/부산법무사",
);
assert.equal(formatPagePath("/협업문의"), "/협업문의");
assert.equal(safeDecodePathname("/%E0%A4%A"), "/%E0%A4%A");

const name = getPageDisplayName("/%ED%98%91%EC%97%85%EB%AC%B8%EC%9D%98");
assert.ok(name);

console.log("admin url-display: OK");
