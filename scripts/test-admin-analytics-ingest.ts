import {
  classifyReferrer,
  isOwnAnalyticsHost,
} from "../src/lib/admin-ops/utils.ts";
import { sanitizeOutboundHref } from "../src/lib/admin-ops/outbound-href.ts";

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exitCode = 1;
  }
}

assert(classifyReferrer(undefined) === "direct", "empty → direct");
assert(classifyReferrer("search.naver.com") === "naver", "naver search");
assert(classifyReferrer("www.google.com") === "google", "google");
assert(
  classifyReferrer("xn--2j1br1na42lvxja38mk8r.kr") === "internal",
  "punycode own host → internal",
);
assert(classifyReferrer("다옴법무사사무소.kr") === "internal", "korean own host → internal");
assert(
  classifyReferrer("www.다옴법무사사무소.kr") === "internal",
  "www korean own host → internal",
);
assert(
  classifyReferrer("daom.pages.dev", "daom.pages.dev") === "internal",
  "same preview host → internal",
);
assert(classifyReferrer("example.com") === "external", "unknown → external");
assert(isOwnAnalyticsHost("www.xn--2j1br1na42lvxja38mk8r.kr"), "www punycode is own");

assert(sanitizeOutboundHref("tel:010-0000-0000") === "tel:", "tel stripped");
assert(sanitizeOutboundHref("/contact/inquiry?name=x") === "/contact/inquiry", "query stripped");
assert(
  sanitizeOutboundHref("https://pf.kakao.com/abc", "https://example.com") ===
    "pf.kakao.com/abc",
  "external host+path",
);
assert(sanitizeOutboundHref("#documents") === "#documents", "hash dest");

if (!process.exitCode) console.log("admin analytics ingest checks passed");
