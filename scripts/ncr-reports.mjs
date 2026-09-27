#!/usr/bin/env node
/** NAVER CRITICAL RECOVERY — CSV/TXT reports from cached JSON. node scripts/ncr-reports.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache", "naver-critical-recovery");
const BASE = path.join(ROOT, "reports", "naver-critical-recovery");
const DIR = path.join(BASE, "2026-09-27");
const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";
fs.mkdirSync(DIR, { recursive: true });

const read = (f) => JSON.parse(fs.readFileSync(path.join(CACHE, f), "utf8"));
const esc = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (file, header, rows) =>
  fs.writeFileSync(path.join(DIR, file), "\uFEFF" + [header, ...rows].map((r) => r.map(esc).join(",")).join("\n") + "\n");

const live = read("live-check.json");
const before = read("before/manifest.json").pages;
const after = read("after/manifest.json").pages;
const domBefore = read("dom-before.json");
const domAfter = read("dom-after.json");
const diagBefore = read("diagnose-before.json");
const diagAfter = read("diagnose-after.json");
const qa = read("qa.json");
const beforeSitemap = read("before/sitemap-manifest.json").entries;

const KEY = { "/부산상속전문법무사": "specialist", "/부산상속포기": "renunciation", "/해운대법무사": "haeundae" };
const TARGETS = Object.keys(KEY);

// 01 index diagnosis
const classify = {
  "/부산상속전문법무사": "INDEX_OK (technical) + CONTENT_RELEVANCE_RISK (H1·first700 did not answer provider-selection query; consult panel before H1) + LOW_INTERNAL_DISCOVERABILITY (7 linking pages) + NEW_URL (2026-09-26, no sitemap lastmod)",
  "/부산상속포기": "INDEX_OK + CONTENT_RELEVANCE_RISK (consult panel before H1; 17 H2 with repeated 3개월/처분 blocks)",
  "/해운대법무사": "INDEX_OK + CONTENT_RELEVANCE_RISK (nationwide block H2 at +413 chars after H1; inheritance-biased og image/404; consult panel before H1)",
};
csv(
  "01-index-diagnosis.csv",
  ["url", "check", "result", "evidence"],
  TARGETS.flatMap((u) => {
    const t = live.targets.find((x) => x.path === u);
    const b = before[u];
    const sm = beforeSitemap.find((e) => decodeURIComponent(e.path) === u);
    return [
      [u, "A exists (out/*.html + seo-paths)", "OK", "static HTML present"],
      [u, "B HTTP status (browser/Yeti/Googlebot)", `${t.browser.status}/${t.yeti.status}/${t.googlebot.status}`, "live fetch 2026-09-27"],
      [u, "C robots.txt", "ALLOWED", "User-Agent Yeti/Googlebot/* Allow: / (only /admin,/api,/search,/blog/external disallowed)"],
      [u, "D meta robots", b.robots, "before build"],
      [u, "E X-Robots-Tag", t.browser.xRobots || "(none)", "live header"],
      [u, "F canonical", decodeURIComponent(b.canonical) === `${SITE}${u}` ? "SELF" : "OTHER", b.canonical],
      [u, "G sitemap", sm ? `tier ${sm.tier} lastmod ${sm.lastmod ?? "null"}` : "MISSING", "before sitemap-manifest"],
      [u, "H initial HTML main content", domBefore[u].mainChars > 1500 ? "STATIC" : "THIN", `main chars ${domBefore[u].mainChars}; loadingPlaceholder=${domBefore[u].loadingPlaceholder}`],
      [u, "I title", b.title, ""],
      [u, "J description", b.description, ""],
      [u, "K H1", `${b.h1} (count ${b.h1Count})`, ""],
      [u, "L duplicate/near-duplicate URL", "NONE_EXACT", "no other URL shares title/H1; see 03-internal-competition.csv"],
      [u, "M Yeti/WAF challenge", t.yeti.challenge ? "CHALLENGE" : "NO_CHALLENGE", `cf-mitigated=${t.yeti.cfMitigated || "none"}`],
      [u, "N host/slash/protocol variants", `slash ${t.variants.trailingSlash.status}, http ${t.variants.http.status}, www ${t.variants.www.status === -1 ? "no DNS" : t.variants.www.status}, .html ${t.variants.htmlSuffix.status}`, "slash/.html 308 Location header is raw UTF-8 (not percent-encoded) — minor client risk, reported"],
      [u, "CLASSIFICATION", classify[u], `consult words before H1: ${domBefore[u].consultWordsBeforeH1.join("/")}`],
    ];
  }),
);

// 03 internal competition
const compRows = [];
for (const [phase, diag] of [["before", diagBefore], ["after", diagAfter]]) {
  for (const [key, c] of Object.entries(diag.competition)) {
    const others = c.top.filter((r) => r.url !== c.representative).slice(0, 5);
    for (const [i, r] of others.entries()) {
      compRows.push([phase, c.query, c.representative, c.representativeRank, i + 1, r.url, r.score, r.title, r.bodyPhraseHits, "SUPPORTING_OR_DIFFERENT_INTENT — no canonical/noindex/redirect; CANNIBALIZATION_APPROVAL_REQUIRED only if Naver shows it for the query"]);
    }
    void key;
  }
}
csv("03-internal-competition.csv", ["phase", "query", "representative", "rep_rank", "rank", "candidate", "score", "title", "body_phrase_hits", "action"], compRows);

// 04 before audit
csv(
  "04-before-audit.csv",
  ["url", "title", "description", "h1", "h2_count", "main_chars", "text_before_h1_chars", "consult_words_before_h1", "nationwide_block_position", "og_image", "inbound_pages"],
  TARGETS.map((u) => [
    u,
    before[u].title,
    before[u].description,
    before[u].h1,
    domBefore[u].h2Count,
    domBefore[u].mainChars,
    domBefore[u].textBeforeH1_afterHeader_chars,
    domBefore[u].consultWordsBeforeH1.join("/"),
    u === "/해운대법무사" ? "H2 '부산에 방문하지 않아도…' at +413 chars after H1" : "none detected",
    domBefore[u].ogImage,
    diagBefore.inbound[KEY[u]].linkingPages,
  ]),
);

// 09 similarity
csv(
  "09-content-similarity.csv",
  ["a", "b", "first700", "gate_first700", "body", "gate_body", "brief_gate", "pass"],
  qa.similarity.map((s) => [s.a, s.b, s.first700, s.gateFirst700, s.body, s.gateBody, s.briefGate, s.pass]),
);

// 10 intent entropy
csv(
  "10-intent-entropy.csv",
  ["url", "role", "selection", "procedure", "local", "cost", "consult", "normalized_entropy", "dominant", "role_match"],
  qa.targets.map((t) => [t.url, t.role, t.intentDistribution.selection, t.intentDistribution.procedure, t.intentDistribution.local, t.intentDistribution.cost, t.intentDistribution.consult, t.intentEntropy, t.dominantIntent, t.gates.TARGET_ROLE_CLEAR]),
);

// 13 changes
csv(
  "13-changes.csv",
  ["file", "type", "scope", "change"],
  [
    ["src/data/seoIntentOwners.ts", "added", "internal", "Query→URL lock, TITLE_FROZEN=true, target title/H1/description source of truth, decoded path check"],
    ["src/lib/naver-recovery/types.ts", "added", "target-only", "Spec types (blocks, evidence status VERIFIED_HANDLED/VERIFIED_CONSULTED/EXAMPLE)"],
    ["src/lib/naver-recovery/specialist.ts", "added", "/부산상속전문법무사", "Provider-selection content, portrait og/body image, 7 contextual links"],
    ["src/lib/naver-recovery/renunciation.ts", "added", "/부산상속포기", "Action page rebuilt to 7 sections + FAQ/CTA; legal points checked against 민법·가사소송법·2020그42"],
    ["src/lib/naver-recovery/haeundae.ts", "added", "/해운대법무사", "Local provider content, balanced 4-service structure, office nameplate og/body image, official NAP"],
    ["src/lib/local-landing/naver-recovery-targets.ts", "added", "target-only", "Spec index (slug map) — also drives sitemap lastmod for the 3 targets only"],
    ["src/components/naver-recovery/NaverRecoveryTargetView.tsx", "added", "target-only", "Lean layout: breadcrumb → main > article > H1 → answer; no sidebar consult panel; single late CTA; remote note at bottom; WebPage+BreadcrumbList JSON-LD"],
    ["src/app/[landingSlug]/page.tsx", "modified", "target-only branch", "getNaverRecoveryTarget() branch for metadata + view; other slugs unchanged"],
    ["public/image/og/haeundae-office-nameplate.jpg", "added", "/해운대법무사", "1200x630 resize of real office nameplate photo (no text/overlay added)"],
    ["public/image/og/haeundae-office-nameplate-4x3.jpg", "added", "/해운대법무사", "1200x900 body image of the same photo"],
    ["scripts/lib/sitemap/lastmod-pins.json", "modified", "sitemap", "Pin /업무사례 lastmod 2026-09-02 (page.tsx is its lastmod source)"],
    ["scripts/ncr-*.mjs", "added", "tooling", "snapshot/compare, live check, DOM audit, diagnose, QA, og check, reports, static server"],
  ],
);

// 20 after audit
csv(
  "20-after-audit.csv",
  ["url", "title", "h1", "description", "desc_chars", "body_chars", "h2_count", "contextual_links", "text_before_h1_chars", "consult_before_h1", "remote_note_position", "og_image", "sitemap_lastmod", ...Object.keys(qa.targets[0].gates), "all_pass"],
  qa.targets.map((t) => [
    t.url,
    t.title,
    t.h1,
    t.description,
    t.descriptionChars,
    t.bodyChars,
    t.h2Count,
    t.contextualLinkCount,
    t.textBeforeH1Chars,
    t.consultBeforeH1.join("/") || "none",
    t.remoteNotePosition,
    t.ogImage.url,
    t.sitemap?.lastmod,
    ...Object.values(t.gates),
    t.allGatesPass,
  ]),
);

// IndexNow + Naver submit targets
const indexnow = TARGETS.map((u) => `${SITE}/${encodeURIComponent(u.slice(1))}`).join("\n") + "\n";
fs.writeFileSync(path.join(DIR, "17-indexnow-targets.txt"), indexnow);
fs.writeFileSync(path.join(BASE, "indexnow-targets.txt"), indexnow);

console.log("reports written:", fs.readdirSync(DIR).join(", "));
void domAfter;
void after;
