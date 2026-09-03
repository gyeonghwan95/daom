/**
 * 한국어 템플릿 아티팩트 검사. 네이버 공식 기준이 아님.
 * 실행: npx --yes tsx scripts/korean-content-quality.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");
const OUT = path.join(process.cwd(), "seo/master/korean-quality.csv");

const PATTERNS: { id: string; re: RegExp }[] = [
  { id: "부산 부산", re: /부산 부산/ },
  { id: "톡톡톡톡", re: /톡톡톡톡/ },
  { id: "과(와)", re: /과\(와\)/ },
  { id: "은(는)", re: /은\(는\)/ },
  { id: "이(가)", re: /이\(가\)/ },
  { id: "undefined", re: /\bundefined\b/ },
  { id: "검색어에", re: /검색어에/ },
  { id: "로 검색한 경우", re: /로 검색한 경우/ },
  { id: "검색어 연결", re: /검색어 연결/ },
];

function walk(dir: string, acc: string[]): string[] {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "generated" || name === "node_modules") continue;
      walk(full, acc);
    } else if (/\.(ts|tsx|mdx)$/.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function main() {
  const files = walk(ROOT, []);
  const rows = ["file,issue,snippet"];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const pat of PATTERNS) {
      if (!pat.re.test(text)) continue;
      const idx = text.search(pat.re);
      const snippet = text.slice(Math.max(0, idx - 20), idx + 40).replace(/\s+/g, " ");
      rows.push([file.replace(`${process.cwd()}\\`, "").replace(`${process.cwd()}/`, ""), pat.id, snippet].map(csvEscape).join(","));
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${rows.join("\n")}\n`, "utf8");
  console.log(`flags=${rows.length - 1} -> ${OUT}`);
}

main();
