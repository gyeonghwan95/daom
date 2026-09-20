/**
 * 업무와 무관한 generic 변수가 복사됐는지 검사. 네이버 공식 기준 아님.
 * 실행: npx --yes tsx scripts/template-leakage-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";

const OUT = path.join(process.cwd(), "seo/inheritance-final/template-leakage.csv");

const RULES: { id: string; pathRe: RegExp; leakRe: RegExp }[] = [
  {
    id: "renunciation-has-registry-tax",
    pathRe: /상속포기/,
    leakRe: /취득세|국민주택채권|등기신청수수료|법인 규모/,
  },
  {
    id: "corporate-has-inheritance",
    pathRe: /법인(설립|등기|해산|증자|임원)/,
    leakRe: /상속포기 3개월|후순위 상속/,
  },
];

function csvEscape(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function main() {
  const rows = ["url,issue,snippet"];
  for (const page of getAllPageData()) {
    const blob = [
      page.intro,
      ...page.introParagraphs,
      ...page.sections.map((s) => `${s.title} ${s.body}`),
    ].join("\n");
    for (const rule of RULES) {
      if (!rule.pathRe.test(page.path) && !rule.pathRe.test(page.slug)) continue;
      if (/^\/(업무사례|services\/cases)\//.test(page.path)) continue;
      const m = blob.match(rule.leakRe);
      if (!m) continue;
      const idx = blob.search(rule.leakRe);
      const window = blob.slice(Math.max(0, idx - 48), idx + 80);
      if (
        /구조가 아닙니다|구조와는 다릅니다|별도 기준|등기 비용과 신고 실비를 섞지 않습니다/.test(
          window,
        )
      ) {
        continue;
      }
      rows.push(
        [page.path, rule.id, window.replace(/\s+/g, " ")]
          .map(csvEscape)
          .join(","),
      );
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${rows.join("\n")}\n`, "utf8");
  console.log(`leaks=${rows.length - 1} -> ${OUT}`);
}

main();
