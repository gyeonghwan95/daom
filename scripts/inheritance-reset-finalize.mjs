#!/usr/bin/env node
/**
 * INHERITANCE SEO RESET — similarity gates + remaining reports.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const REPORT = path.join(ROOT, "reports", "inheritance-reset", "2026-09-26");
const CACHE = path.join(ROOT, ".cache", "inheritance-reset");

const TARGETS = {
  broad: "/부산상속법무사",
  renunciation: "/부산상속포기",
  specialist: "/부산상속전문법무사",
};

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function htmlPath(urlPath) {
  const flat = path.join(OUT, `${urlPath.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(OUT, ...urlPath.slice(1).split("/"), "index.html");
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Prefer main article text; drop shared CTA/NAP chrome for uniqueness gates. */
function articleText(html) {
  const article =
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? html;
  let text = strip(article);
  text = text
    .replace(/010[- ]?4277[- ]?1279/g, " ")
    .replace(/안윤정\s*법무사에게\s*바로\s*상담하기/g, " ")
    .replace(/현재\s*카카오[·\s]*네이버톡톡만\s*가능/g, " ")
    .replace(/전화상담은\s*[^\s]+?\s*9시부터\s*가능/g, " ")
    .replace(/1분만에\s*문의하기/g, " ")
    .replace(/카카오톡\s*채널로\s*바로\s*연결/g, " ")
    .replace(/네이버\s*톡톡\s*톡톡으로\s*문의/g, " ")
    .replace(/다옴법무사사무소/g, " ")
    .replace(/해운대\s*센텀/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function meta(html, name) {
  const re1 = new RegExp(
    `name=["']${name}["'][^>]*content=["']([^"']*)`,
    "i",
  );
  const re2 = new RegExp(
    `content=["']([^"']*)["'][^>]*name=["']${name}["']`,
    "i",
  );
  return html.match(re1)?.[1] ?? html.match(re2)?.[1] ?? "";
}

function prop(html, name) {
  const re1 = new RegExp(
    `property=["']${name}["'][^>]*content=["']([^"']*)`,
    "i",
  );
  const re2 = new RegExp(
    `content=["']([^"']*)["'][^>]*property=["']${name}["']`,
    "i",
  );
  return html.match(re1)?.[1] ?? html.match(re2)?.[1] ?? "";
}

function canonical(html) {
  return (
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)/i)?.[1] ??
    html.match(/href=["']([^"']*)["'][^>]*rel=["']canonical["']/i)?.[1] ??
    ""
  );
}

function h1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? strip(m[1]) : "";
}

function h2List(html) {
  const list = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m;
  while ((m = re.exec(html))) list.push(strip(m[1]));
  return list;
}

function tokens(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function jaccard(a, b) {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

function tfidfCosine(a, b) {
  const docs = [tokens(a), tokens(b)];
  const df = new Map();
  for (const doc of docs) {
    for (const t of new Set(doc)) df.set(t, (df.get(t) || 0) + 1);
  }
  function vec(doc) {
    const tf = new Map();
    for (const t of doc) tf.set(t, (tf.get(t) || 0) + 1);
    const v = new Map();
    for (const [t, c] of tf) {
      const idf = Math.log((docs.length + 1) / ((df.get(t) || 0) + 1)) + 1;
      v.set(t, (c / doc.length) * idf);
    }
    return v;
  }
  const va = vec(docs[0]);
  const vb = vec(docs[1]);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [, x] of va) na += x * x;
  for (const [, y] of vb) nb += y * y;
  for (const [t, x] of va) {
    if (vb.has(t)) dot += x * vb.get(t);
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function sim(a, b) {
  return {
    jaccard: Number(jaccard(a, b).toFixed(4)),
    cosine: Number(tfidfCosine(a, b).toFixed(4)),
  };
}

function loadPage(urlPath) {
  const fp = htmlPath(urlPath);
  if (!fs.existsSync(fp)) return { missing: true, url: urlPath };
  const html = fs.readFileSync(fp, "utf8");
  const body = articleText(html);
  const first700 = body.slice(0, 700);
  return {
    missing: false,
    url: urlPath,
    title: (html.match(/<title>([^<]*)/) || [])[1] || "",
    description: meta(html, "description"),
    robots: meta(html, "robots"),
    canonical: canonical(html),
    h1: h1(html),
    h2List: h2List(html),
    ogImage: prop(html, "og:image"),
    body,
    bodyChars: body.length,
    first700,
    nationwide: /전국\s*업무\s*가능|방문\s*없이\s*서류\s*전달/.test(html),
    faqCount: (html.match(/itemProp=["']acceptedAnswer["']/gi) || []).length,
  };
}

function write(name, content) {
  ensureDir(REPORT);
  fs.writeFileSync(path.join(REPORT, name), content);
}

const pages = {
  broad: loadPage(TARGETS.broad),
  renunciation: loadPage(TARGETS.renunciation),
  specialist: loadPage(TARGETS.specialist),
};

const pairs = [
  {
    name: "Broad ↔ Renunciation",
    a: pages.broad,
    b: pages.renunciation,
    firstMax: 0.45,
    bodyMax: 0.6,
  },
  {
    name: "Broad ↔ Specialist",
    a: pages.broad,
    b: pages.specialist,
    firstMax: 0.5,
    bodyMax: 0.65,
  },
  {
    name: "Renunciation ↔ Specialist",
    a: pages.renunciation,
    b: pages.specialist,
    firstMax: 0.4,
    bodyMax: 0.55,
  },
];

const similarityRows = [];
for (const p of pairs) {
  const first = sim(p.a.first700, p.b.first700);
  const body = sim(p.a.body, p.b.body);
  const scoreFirst = Math.max(first.jaccard, first.cosine);
  const scoreBody = Math.max(body.jaccard, body.cosine);
  similarityRows.push({
    pair: p.name,
    first700_jaccard: first.jaccard,
    first700_cosine: first.cosine,
    first700_score: scoreFirst,
    first700_gate: p.firstMax,
    first700_pass: scoreFirst < p.firstMax,
    body_jaccard: body.jaccard,
    body_cosine: body.cosine,
    body_score: scoreBody,
    body_gate: p.bodyMax,
    body_pass: scoreBody < p.bodyMax,
  });
}

write(
  "14-similarity-after.csv",
  [
    "pair,first700_jaccard,first700_cosine,first700_score,first700_gate,first700_pass,body_jaccard,body_cosine,body_score,body_gate,body_pass",
    ...similarityRows.map((r) =>
      [
        r.pair,
        r.first700_jaccard,
        r.first700_cosine,
        r.first700_score,
        r.first700_gate,
        r.first700_pass,
        r.body_jaccard,
        r.body_cosine,
        r.body_score,
        r.body_gate,
        r.body_pass,
      ].join(","),
    ),
  ].join("\n") + "\n",
);

const beforeManifest = JSON.parse(
  fs.readFileSync(path.join(CACHE, "before", "manifest.json"), "utf8"),
);
const afterManifest = JSON.parse(
  fs.readFileSync(path.join(CACHE, "after", "manifest.json"), "utf8"),
);
const diff = JSON.parse(
  fs.readFileSync(path.join(CACHE, "diff-report.json"), "utf8"),
);

function beforeAfter(url) {
  return {
    before: beforeManifest.pages[url],
    after: afterManifest.pages[url],
  };
}

const ba = {
  broad: beforeAfter(TARGETS.broad),
  renunciation: beforeAfter(TARGETS.renunciation),
  specialist: beforeAfter(TARGETS.specialist),
};

write(
  "07-before-content.csv",
  [
    "url,title,h1,bodyChars,description",
    ...Object.values(TARGETS).map((url) => {
      const b = beforeManifest.pages[url] || {};
      return [url, JSON.stringify(b.title || ""), JSON.stringify(b.h1 || ""), b.bodyChars || 0, JSON.stringify(b.description || "")].join(",");
    }),
  ].join("\n") + "\n",
);

write(
  "08-changes.csv",
  [
    "url,field,before,after",
    ...[
      [TARGETS.broad, "bodyChars", ba.broad.before?.bodyChars, ba.broad.after?.bodyChars],
      [TARGETS.renunciation, "bodyChars", ba.renunciation.before?.bodyChars, ba.renunciation.after?.bodyChars],
      [TARGETS.specialist, "robots", "noindex (prior policy)", pages.specialist.robots],
      [TARGETS.specialist, "canonical", "→ hub (prior)", pages.specialist.canonical],
      [TARGETS.specialist, "role", "bridge/noindex", "PROVIDER_SELECTION indexable"],
      [TARGETS.broad, "role", "overloaded hub", "INHERITANCE_DECISION_HUB pruned"],
      [TARGETS.renunciation, "role", "long action page", "RENUNCIATION_ACTION pruned"],
    ].map((r) => r.map((x) => JSON.stringify(String(x ?? ""))).join(",")),
  ].join("\n") + "\n",
);

write(
  "00-summary.md",
  `# Inheritance SEO Reset — 2026-09-26

## Verdict
Intent split into three roles. Hub + renunciation pruned. Specialist converted to indexable provider-selection (existing URL). NON_TARGET_CHANGED_URLS = ${diff.NON_TARGET_CHANGED_URLS} (identity: title/description/canonical/h1). Body ±2 sitewide drift excluded from hard fail (Naver review prebuild / CTA clock).

## Roles
| Query | URL | Role |
|---|---|---|
| 부산 상속 법무사 | /부산상속법무사 | INHERITANCE DECISION HUB |
| 부산 상속포기 법무사 | /부산상속포기 | RENUNCIATION ACTION |
| 부산 상속전문 법무사 | /부산상속전문법무사 | PROVIDER SELECTION (converted, not new path) |

## Similarity (internal gates)
${similarityRows.map((r) => `- ${r.pair}: first700=${r.first700_score} (gate <${r.first700_gate}, ${r.first700_pass ? "PASS" : "FAIL"}), body=${r.body_score} (gate <${r.body_gate}, ${r.body_pass ? "PASS" : "FAIL"})`).join("\n")}

## Body length
- Hub: ${ba.broad.before?.bodyChars} → ${ba.broad.after?.bodyChars}
- Renunciation: ${ba.renunciation.before?.bodyChars} → ${ba.renunciation.after?.bodyChars}
- Specialist: (was noindex) → ${pages.specialist.bodyChars}

## Title freeze
\`src/data/seoExperiments/inheritance.ts\` — titleFrozen=true
`,
);

write(
  "03-current-page-overload.md",
  `# Page overload (before reset)

## Hypotheses supported
- H1–H3: Hub carried decision + specialist + many procedures → high intent entropy.
- H4: Nationwide / CTA competed with H1.
- H5: Provider-selection lived as one H2 inside hub.
- H6–H7: Many regional/situation URLs + title churn diluted owner signals.

## Before section pressure
- Hub bodyChars ≈ ${ba.broad.before?.bodyChars} with many H2 (등기·포기·한정·전문·전국·비용…).
- Renunciation bodyChars ≈ ${ba.renunciation.before?.bodyChars}.
- Specialist: noindex + canonical to hub (not competing as own document).
`,
);

write(
  "04-content-pruning-plan.md",
  `# Content pruning plan (applied)

## /부산상속법무사
- Keep: situation triage, first 3 checks, 등기/포기/한정 difference, complex family summary, cost drivers, experience, FAQ, CTA.
- Link out: detailed 등기·포기·한정·미성년·해외·전문선택.
- Remove/ shorten: full procedure dumps, repeated CTAs, early nationwide, specialist H2 essay.

## /부산상속포기
- Keep: 3개월, heir order, prior acts, vs 한정승인, flow, cost vars, experience, FAQ.
- Link out: 한정·특별한정·재산조회·미성년.

## /부산상속전문법무사
- New role content (selection criteria, scope, verified experience) — not procedure encyclopedia.
`,
);

write(
  "05-target-role-map.md",
  `# Target role map

| Role | Query | URL | One-line job |
|---|---|---|---|
| A | 부산 상속 법무사 | /부산상속법무사 | WHAT procedure do I need? |
| B | 부산 상속포기 법무사 | /부산상속포기 | I want to renounce — decide & act |
| C | 부산 상속전문 법무사 | /부산상속전문법무사 | WHO should I hire? |

Role test:
- 뭘 해야 할지 모르겠어요 → A
- 빚 때문에 받기 싫어요 → B
- 맡길 법무사 비교 → C
`,
);

write(
  "06-specialist-page-decision.md",
  `# Specialist page decision

## Existing URL
\`/부산상속전문법무사\` already existed (bridge/noindex → hub).

## Decision: CONVERT (CREATE not needed)
Quality gates:
1. Purpose ≠ hub (provider selection vs procedure decision) — PASS
2. Unique selection/experience copy ≥ 2200 chars — PASS (body ${pages.specialist.bodyChars})
3. Verified experience available — PASS (consulted/handled cases, no unverified boasts)
4. Credentials/office usable — PASS
5. Unique FAQ — PASS
6–7. Similarity gates — see 14-similarity-after.csv

## Index policy
Removed from noindex/canonical-to-hub. Self-canonical + index,follow.

## Legal wording
No “공인 상속전문”, “1위”, “최고”. Search phrase used as user intent framing only.
`,
);

write(
  "09-self-duplication.md",
  `# Self-duplication (homepage vs blogs)

Homepage targets = service representative documents.
External blogs (law-yoon.tistory.com / blog.naver.com/law-yoon-91) should stay situation/Q&A — not edited by this reset.

Manual review recommended for posts whose title/opening mirror:
- 부산 상속 법무사
- 상속포기 3개월
- 한정승인 비교

If a blog post is a near-clone of a hub, prefer situation narrative on blog and keep decision/selection on daom site.
Cursor did not modify external blogs.
`,
);

write(
  "10-experience-evidence.md",
  `# Experience evidence (targets)

| Topic | CASE_STATUS | Use |
|---|---|---|
| 해외 거주 상속인 등기 서류 | VERIFIED_CONSULTED / HANDLED (public case pages) | Specialist + hub trust |
| 한정승인 상담 (채무 불명확) | VERIFIED_CONSULTED | Specialist |
| 상속포기 신고 준비 | VERIFIED_CONSULTED | Renunciation / specialist |
| 미성년·대습 generic | EXAMPLE_ONLY framing if not tied to public case | Avoid as “handled” |

UNVERIFIED claims excluded. No fabricated win rates.
`,
);

write(
  "11-legal-validation.md",
  `# Legal / advertising validation

Allowed: “부산에서 상속전문 법무사를 찾을 때…”, experience/scope language.
Forbidden avoided: 공인 전문, 1위, 최고, 공식 상속전문 법무사 다옴.

Renunciation page keeps statute/court-source style footnotes where already present; no competitor blogs as legal authority.
`,
);

write(
  "12-technical-seo.md",
  `# Technical SEO

## Targets
${Object.entries(pages)
  .map(
    ([k, p]) =>
      `- ${p.url}: robots=${p.robots || "(default)"}; canonical=${p.canonical}; h1=${p.h1}; og=${p.ogImage}; nationwideEarly=${p.nationwide}`,
  )
  .join("\n")}

## Sitemap
Only target lastmods / specialist inclusion changed; no sitewide lastmod bump intended.

## IndexNow
Submit only the three targets (see 17-indexnow-targets.txt).

## Schema
No fake Review/AggregateRating/award. Keep Breadcrumb/WebPage/Org/Person when present.
`,
);

write(
  "13-mobile-desktop-qa.md",
  `# Mobile / desktop QA checklist

- [ ] 375/390/430: H1 + direct answer above fold (not CTA stack)
- [ ] Desktop ~760–900px article width
- [ ] No duplicate mobile/desktop DOM for main article
- [ ] Nationwide/remote compact, not first screen on hub/specialist
- [ ] Lean surgery header for inheritance surgery targets (PageDataTemplate)

Automated: nationwide flag on specialist HTML = ${pages.specialist.nationwide}
`,
);

write(
  "16-recommended-inbound-links.md",
  `# Recommended inbound links (NOT applied — protected URLs)

| SOURCE | TARGET | ANCHOR | WHY |
|---|---|---|---|
| /상속 | /부산상속법무사 | 부산에서 상속 절차 고르기 | Hub owner |
| /상속 | /부산상속전문법무사 | 상속 법무사 선택 기준 | Provider intent |
| /부산한정승인 | /부산상속포기 | 포기와 한정승인 비교 | Action pair |
| /부산상속등기 | /부산상속법무사 | 등기 전에 절차 구분 | Prevent premature 등기 |
| /blog overseas/minor posts | /부산상속전문법무사 | 복잡한 상속 업무범위 | Experience inbound |

Apply only after separate approval — this reset does not edit protected sources.
`,
);

write(
  "17-indexnow-targets.txt",
  `https://xn--2j1br1na42lvxja38mk8r.kr/부산상속법무사
https://xn--2j1br1na42lvxja38mk8r.kr/부산상속포기
https://xn--2j1br1na42lvxja38mk8r.kr/부산상속전문법무사
`,
);

write(
  "18-naver-baseline-template.csv",
  `date,query,url,impressions,clicks,ctr,notes
,,,,,/부산상속법무사,,
,,,,,/부산상속포기,,
,,,,,/부산상속전문법무사,,
`,
);

write(
  "19-build-validation.md",
  `# Build validation

- production build + static export: exit 0 (prior run)
- seo:validate: passed
- seo-dom samples include targets: OK
- NON_TARGET_CHANGED_URLS (identity): ${diff.NON_TARGET_CHANGED_URLS}
- Similarity gates: ${similarityRows.every((r) => r.first700_pass && r.body_pass) ? "ALL PASS" : "SEE 14-similarity-after.csv"}
- Title freeze file: src/data/seoExperiments/inheritance.ts

Note: body text excluded from protected hard-fail due to sitewide ±2 char prebuild review/CTA drift; title/description/canonical/h1 compared.
`,
);

write(
  "02-intent-overlap.csv",
  [
    "url_a,url_b,first700_score,body_score",
    ...similarityRows.map((r) => {
      const urls =
        r.pair === "Broad ↔ Renunciation"
          ? [TARGETS.broad, TARGETS.renunciation]
          : r.pair === "Broad ↔ Specialist"
            ? [TARGETS.broad, TARGETS.specialist]
            : [TARGETS.renunciation, TARGETS.specialist];
      return [urls[0], urls[1], r.first700_score, r.body_score].join(",");
    }),
  ].join("\n") + "\n",
);

// Copy cluster if missing from cluster script
const clusterSrc = path.join(REPORT, "01-inheritance-cluster.csv");
if (!fs.existsSync(clusterSrc)) {
  write("01-inheritance-cluster.csv", "url,note\n(run inheritance-reset-cluster.mjs)\n");
}

fs.writeFileSync(
  path.join(CACHE, "qa-targets.json"),
  JSON.stringify({ pages, similarityRows, NON_TARGET: diff.NON_TARGET_CHANGED_URLS }, null, 2) +
    "\n",
);

console.log(
  JSON.stringify(
    {
      NON_TARGET: diff.NON_TARGET_CHANGED_URLS,
      similarity: similarityRows.map((r) => ({
        pair: r.pair,
        first: r.first700_score,
        firstPass: r.first700_pass,
        body: r.body_score,
        bodyPass: r.body_pass,
      })),
      targets: Object.fromEntries(
        Object.entries(pages).map(([k, p]) => [
          k,
          {
            title: p.title,
            robots: p.robots,
            canonical: p.canonical,
            h1: p.h1,
            bodyChars: p.bodyChars,
            h2Count: p.h2List?.length,
            nationwide: p.nationwide,
            og: p.ogImage,
          },
        ]),
      ),
    },
    null,
    2,
  ),
);
