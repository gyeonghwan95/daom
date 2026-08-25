/**
 * Detect Footer-before-H1 and loading phrase in out/ HTML.
 * Run after npm run build: node scripts/check-seo-dom-order.mjs
 *
 * Next static export emits `slug.html` (not always `slug/index.html`).
 */
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const OUT = path.join(rootDir, "out");

const SAMPLES = [
  "index.html",
  "부산법무사.html",
  "부산법무사추천.html",
  "부산법무사상담.html",
  "부산상속법무사.html",
  "부산상속포기.html",
  "부산등기법무사.html",
  "상속.html",
];

function resolveSample(rel) {
  const direct = path.join(OUT, rel);
  if (fs.existsSync(direct)) return direct;
  const asIndex = path.join(OUT, rel.replace(/\.html$/, ""), "index.html");
  if (fs.existsSync(asIndex)) return asIndex;
  return null;
}

let fail = 0;
for (const rel of SAMPLES) {
  const file = resolveSample(rel);
  if (!file) {
    console.error(`[seo-dom] MISSING ${rel}`);
    fail += 1;
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const f = html.search(/<footer\b/i);
  const h = html.search(/<h1\b/i);
  const m = html.search(/<main\b/i);
  const loading = html.includes("페이지를 불러오는 중입니다");
  const footerBeforeH1 = f >= 0 && h >= 0 && f < h;
  const footerBeforeMain = f >= 0 && m >= 0 && f < m;
  if (footerBeforeH1 || footerBeforeMain || loading) {
    console.error(
      `[seo-dom] FAIL ${rel} footerBeforeH1=${footerBeforeH1} footerBeforeMain=${footerBeforeMain} loadingPhrase=${loading}`,
    );
    fail += 1;
  } else {
    console.log(`[seo-dom] OK ${rel}`);
  }
}

if (fail) {
  console.error(`\n[seo-dom] ${fail} failures`);
  process.exit(1);
}
console.log("\n[seo-dom] all samples OK");
