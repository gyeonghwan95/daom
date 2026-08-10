/** Title 패턴 반복률 감사 — 읽기 전용 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST = path.join(ROOT, "scripts/output/seo-landing-manifest.json");
const OUT = path.join(ROOT, "reports/seo/title-patterns.json");

type Entry = { path?: string; title?: string; metaTitle?: string };

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.warn("Missing", MANIFEST, "— run generate:seo-pages first if needed");
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(
      OUT,
      JSON.stringify({ error: "manifest missing", generatedAt: new Date().toISOString() }, null, 2),
    );
    return;
  }
  const raw = JSON.parse(fs.readFileSync(MANIFEST, "utf8")) as
    | Entry[]
    | { pages?: Entry[] };
  const pages = Array.isArray(raw) ? raw : (raw.pages ?? []);
  const patterns: Record<string, number> = {};
  for (const p of pages) {
    const t = p.metaTitle || p.title || "";
    const norm = t
      .replace(/부산\s*/g, "부산 ")
      .replace(/｜.*/, "｜…")
      .replace(/\|.*/, "|…")
      .replace(/\s+/g, " ")
      .trim();
    const key = norm.includes("｜") || norm.includes("|")
      ? norm.replace(/[^｜|가-힣A-Za-z\s]/g, "").slice(0, 40)
      : "other";
    patterns[key] = (patterns[key] ?? 0) + 1;
  }
  const sorted = Object.entries(patterns).sort((a, b) => b[1] - a[1]).slice(0, 30);
  const report = {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    topPatterns: sorted.map(([pattern, count]) => ({
      pattern,
      count,
      share: pages.length ? Math.round((count / pages.length) * 1000) / 10 : 0,
    })),
    note: "성과 가능 title은 자동수정 금지. Champion title KEEP.",
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote", OUT);
}

main();
