import {
  classifyReferrer,
  isExcludedAnalyticsPath,
  isOwnAnalyticsHost,
} from "../src/lib/admin-ops/utils.ts";
import { sanitizeOutboundHref } from "../src/lib/admin-ops/outbound-href.ts";
import { omitExcludedAnalyticsPaths } from "../functions/_lib/admin-ops/store.ts";

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

assert(isExcludedAnalyticsPath("/admin"), "/admin excluded");
assert(isExcludedAnalyticsPath("/admin/analytics"), "/admin/* excluded");
assert(isExcludedAnalyticsPath("/admin/"), "/admin/ excluded");
assert(isExcludedAnalyticsPath("/api/analytics/collect"), "/api/* excluded");
assert(!isExcludedAnalyticsPath("/부산법무사"), "public path counted");
assert(!isExcludedAnalyticsPath("/contact/inquiry"), "inquiry counted");

const cleaned = omitExcludedAnalyticsPaths({
  visits: 10,
  cta: 3,
  consultStart: 1,
  consultSubmit: 1,
  naverPlace: 1,
  devices: { mobile: 4, desktop: 6, unknown: 0 },
  paths: {
    "/admin": {
      visits: 3,
      cta: 1,
      consultStart: 0,
      consultSubmit: 0,
      naverPlace: 0,
      mobile: 1,
      desktop: 2,
    },
    "/admin/analytics": {
      visits: 2,
      cta: 0,
      consultStart: 0,
      consultSubmit: 0,
      naverPlace: 0,
      mobile: 0,
      desktop: 2,
    },
    "/부산법무사": {
      visits: 5,
      cta: 2,
      consultStart: 1,
      consultSubmit: 1,
      naverPlace: 1,
      mobile: 3,
      desktop: 2,
    },
  },
});
assert(!cleaned.paths["/admin"], "admin path omitted from report");
assert(!cleaned.paths["/admin/analytics"], "admin child omitted from report");
assert(cleaned.paths["/부산법무사"]?.visits === 5, "public path kept");
assert(cleaned.visits === 5, "admin visits subtracted from day total");
assert(cleaned.cta === 2, "admin cta subtracted from day total");
assert(cleaned.devices.mobile === 3, "admin mobile subtracted");
assert(cleaned.devices.desktop === 2, "admin desktop subtracted");

if (!process.exitCode) console.log("admin analytics ingest checks passed");
