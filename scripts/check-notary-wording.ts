/**
 * 공증 표현 검수 — 법무사가 공증을 직접 수행하는 것처럼 읽히는 문구를 차단.
 * 실행: npx --yes tsx scripts/check-notary-wording.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = [
  "src/lib/corporate-intent",
  "src/lib/local-landing/company-establishment-busan.ts",
  "src/components/corporate",
];

/** 다옴이 공증을 수행하는 것처럼 오인될 수 있는 표현 */
const FORBIDDEN = [
  /공증\s*전문\s*법무사/,
  /법무사\s*공증(?!\s*준비|\s*문의|\s*전|\s*후|\s*여부|\s*관련)/,
  /공증\s*대행/,
  /공증\s*직접/,
  /공증\s*맡기기/,
  /공증\s*신청하기/,
  /공증\s*서비스/,
  /공증까지\s*원스톱/,
  /공증\s*전문\s*사무소/,
  /공증\s*업무를\s*직접/,
  /공증\s*자격\s*보유/,
  /공증\s*접수(?!\s*전|\s*후)/,
];

/** 허용되는 정보성 표현 근처에서 수행 주체가 명시됐는지 보조 검사 */
const NEEDS_BOUNDARY_HINT =
  /정관\s*공증|의사록\s*공증|법인\s*공증|공증\s*준비/;

const BOUNDARY_OK =
  /공증인|공증기관|공증인가|공증\s*자체는|인증\s*자체는|법무사가\s*공증을\s*대신|법무사가\s*공증을\s*직접/;

type Hit = { file: string; line: number; text: string; kind: "error" | "warn" };

function walk(path: string, out: string[]) {
  const st = statSync(path);
  if (st.isFile()) {
    if (/\.(ts|tsx|mjs|js)$/.test(path)) out.push(path);
    return;
  }
  for (const name of readdirSync(path)) {
    if (name === "node_modules" || name === ".next") continue;
    walk(join(path, name), out);
  }
}

function collectFiles(): string[] {
  const files: string[] = [];
  for (const entry of SCAN_DIRS) {
    const abs = join(ROOT, entry);
    try {
      walk(abs, files);
    } catch {
      // skip missing
    }
  }
  return files;
}

function main() {
  const hits: Hit[] = [];
  for (const file of collectFiles()) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const re of FORBIDDEN) {
        if (re.test(line)) {
          hits.push({
            file: rel,
            line: i + 1,
            text: line.trim().slice(0, 160),
            kind: "error",
          });
        }
      }
      if (NEEDS_BOUNDARY_HINT.test(line) && !BOUNDARY_OK.test(line)) {
        // slug·href·label·keyword 메타 라인은 문맥 검수에서 제외
        if (
          /^\s*(slug|href|label|primaryKeyword|secondaryKeywords|title|metaTitle):/.test(
            line,
          ) ||
          /href:\s*"\/법인/.test(line) ||
          /label:\s*"/.test(line)
        ) {
          continue;
        }
        const window = lines
          .slice(Math.max(0, i - 3), Math.min(lines.length, i + 4))
          .join("\n");
        if (!BOUNDARY_OK.test(window)) {
          hits.push({
            file: rel,
            line: i + 1,
            text: line.trim().slice(0, 160),
            kind: "warn",
          });
        }
      }
    }
  }

  const errors = hits.filter((h) => h.kind === "error");
  const warns = hits.filter((h) => h.kind === "warn");

  console.log("=== Notary Wording Check ===");
  console.log(`errors: ${errors.length}, warns: ${warns.length}`);
  for (const h of errors) {
    console.log(`[error] ${h.file}:${h.line} ${h.text}`);
  }
  for (const h of warns) {
    console.log(`[warn] ${h.file}:${h.line} ${h.text}`);
  }

  if (errors.length > 0) process.exitCode = 1;
}

main();
