/** Meta description 중복 감사 — 읽기 전용 */
import fs from "node:fs";
import path from "node:path";

const MANIFEST = path.join(process.cwd(), "scripts/output/seo-landing-manifest.json");
const OUT = path.join(process.cwd(), "reports/seo/meta-descriptions.json");

type Entry = { path?: string; description?: string; metaDescription?: string };

function main() {
  if (!fs.existsSync(MANIFEST)) {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify({ error: "manifest missing" }, null, 2));
    return;
  }
  const raw = JSON.parse(fs.readFileSync(MANIFEST, "utf8")) as
    | Entry[]
    | { pages?: Entry[] };
  const pages = Array.isArray(raw) ? raw : (raw.pages ?? []);
  const byDesc = new Map<string, string[]>();
  const templateHits: { path: string; reason: string }[] = [];
  for (const p of pages) {
    const d = (p.metaDescription || p.description || "").trim();
    if (!d) continue;
    const list = byDesc.get(d) ?? [];
    list.push(p.path || "?");
    byDesc.set(d, list);
    if (/비용·절차·준비서류/.test(d)) {
      templateHits.push({ path: p.path || "?", reason: "비용·절차·준비서류 반복" });
    }
  }
  const duplicates = [...byDesc.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([description, paths]) => ({
      description: description.slice(0, 120),
      count: paths.length,
      paths: paths.slice(0, 10),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40);

  const report = {
    generatedAt: new Date().toISOString(),
    duplicateExactDescriptions: duplicates.length,
    duplicates: duplicates.slice(0, 20),
    templatePhraseHits: templateHits.length,
    templateSample: templateHits.slice(0, 30),
    policy: "Champion description 자동 일괄변경 금지. 명백한 오류만 CAUTION.",
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote", OUT);
}

main();
