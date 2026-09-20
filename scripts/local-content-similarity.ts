/**
 * 지역명 정규화 후 MAIN 유사도. 내부 QA. 네이버 threshold 아님.
 * 실행: npx --yes tsx scripts/local-content-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";

const OUT = path.join(process.cwd(), "seo/non-inheritance/local-content-similarity.csv");
const INHERITANCE_PATH = /상속|포기|한정승인|대습|유류분|유언/;

const PLACE_NAMES = [
  "해운대구",
  "해운대",
  "센텀시티",
  "센텀",
  "연제구",
  "연산동",
  "거제동",
  "수영구",
  "광안리",
  "광안동",
  "민락동",
  "망미동",
  "남천동",
  "동래구",
  "사직동",
  "온천동",
  "명륜동",
  "부산진구",
  "서면",
  "부전동",
  "전포동",
  "남구",
  "대연동",
  "용호동",
  "문현동",
  "북구",
  "화명동",
  "덕천동",
  "금정구",
  "사상구",
  "사하구",
  "중구",
  "서구",
  "동구",
  "영도구",
  "강서구",
  "기장군",
  "기장읍",
  "재송동",
  "반여동",
  "우동",
  "좌동",
  "중동",
  "명지",
  "정관",
  "하단",
].sort((a, b) => b.length - a.length);

function csvEscape(v: string | number): string {
  const text = String(v ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalize(text: string): string {
  let out = text;
  for (const name of PLACE_NAMES) out = out.split(name).join("REGION");
  return out.replace(/\s+/g, " ").trim();
}

function tokens(text: string): Set<string> {
  return new Set(
    normalize(text)
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : Number((inter / union).toFixed(3));
}

function main() {
  const hubs = getAllPageData().filter((p) => {
    if (INHERITANCE_PATH.test(p.path) || INHERITANCE_PATH.test(p.slug)) return false;
    return /법무사$/.test(p.path) && !p.path.includes("services");
  });
  const sample = hubs.slice(0, 40);
  const rows = ["page_a,page_b,semantic_similarity,risk"];
  for (let i = 0; i < sample.length; i += 1) {
    for (let j = i + 1; j < sample.length; j += 1) {
      const a = sample[i]!;
      const b = sample[j]!;
      const bodyA = [a.intro, ...a.introParagraphs, ...a.sections.map((s) => s.body)].join(" ");
      const bodyB = [b.intro, ...b.introParagraphs, ...b.sections.map((s) => s.body)].join(" ");
      const sim = jaccard(tokens(bodyA), tokens(bodyB));
      const risk = sim >= 0.75 ? "TEMPLATE_RISK_HIGH" : sim >= 0.6 ? "TEMPLATE_RISK" : "OK";
      if (sim < 0.45) continue;
      rows.push([a.path, b.path, sim, risk].map(csvEscape).join(","));
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${rows.join("\n")}\n`, "utf8");
  console.log(`pairs_reported=${rows.length - 1} -> ${OUT}`);
}

main();
