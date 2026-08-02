#!/usr/bin/env node
/**
 * GSC 색인 생성 요청용 1순위 배치 리스트
 *   node scripts/generate-gsc-index-priority-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectSitemapEntries } from "./lib/sitemap/collect.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const HUMAN = "https://다옴법무사사무소.kr";
const TODAY = new Date().toISOString().slice(0, 10);
const OUT = path.join(ROOT, `scripts/output/gsc-index-priority-batch1-${TODAY}.txt`);

/** Tier1/2 이후 추가로 요청할 고의도 경로 (존재할 때만 포함) */
const EXTRA_PATHS = [
  "/부산법무사추천",
  "/부산법무사상담",
  "/부산법무사무소",
  "/부산법무사비용",
  "/부산상속법무사",
  "/부산상속포기",
  "/부산한정승인",
  "/센텀법무사",
  "/해운대상속등기",
  "/blog/busan-lawyer-recommend-office-consult",
];

function humanUrl(routePath) {
  return routePath === "/" ? `${HUMAN}/` : `${HUMAN}${routePath}`;
}

function main() {
  const { entries } = collectSitemapEntries();
  const byPath = new Map(entries.map((e) => [e.path, e]));

  const t1 = entries.filter((e) => e.tier === 1);
  const t2 = entries.filter((e) => e.tier === 2);
  const extras = EXTRA_PATHS.map((p) => byPath.get(p))
    .filter(Boolean)
    .filter((e) => e.tier > 2);

  const lines = [];
  lines.push("# Google Search Console — 1순위 색인 요청 리스트");
  lines.push(`# 작성: ${new Date().toISOString()}`);
  lines.push(`# 속성: ${HUMAN}/`);
  lines.push("# sitemap 발견: 1,519 (성공) — 다음은 '색인 생성 요청' 우선순위");
  lines.push("#");
  lines.push("# 사용법");
  lines.push("# 1) GSC 상단 URL 검사 → URL 붙여넣기 → 실제 URL 테스트 → 색인 생성 요청");
  lines.push("# 2) 하루 할당량 있으면 BATCH A(18) 먼저, 다음날 BATCH B → C");
  lines.push("# 3) 발견(Discovered) ≠ 색인(Indexed). 이 파일은 색인 우선 요청용");
  lines.push("#");
  lines.push(
    `# BATCH A = Tier1 ${t1.length} | BATCH B = Tier2 ${t2.length} | BATCH C = 고의도 ${extras.length}`,
  );
  lines.push("");

  function section(title, list) {
    lines.push("=".repeat(72));
    lines.push(title);
    lines.push("=".repeat(72));
    list.forEach((e, i) => {
      lines.push(`${i + 1}. ${humanUrl(e.path)}`);
    });
    lines.push("");
  }

  section(`## BATCH A — 즉시 (Tier 1 핵심, ${t1.length}개)`, t1);
  section(`## BATCH B — 이번 주 (Tier 2 허브, ${t2.length}개)`, t2);
  if (extras.length) {
    section(`## BATCH C — 고의도 보강 (Tier3+, ${extras.length}개)`, extras);
  }

  lines.push("## 경로만 (스프레드시트·자동화용)");
  lines.push("--- A ---");
  t1.forEach((e) => lines.push(e.path));
  lines.push("--- B ---");
  t2.forEach((e) => lines.push(e.path));
  if (extras.length) {
    lines.push("--- C ---");
    extras.forEach((e) => lines.push(e.path));
  }
  lines.push("");
  lines.push("# END");

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${OUT}`);
  console.log({
    batchA: t1.length,
    batchB: t2.length,
    batchC: extras.length,
    extras: extras.map((e) => e.path),
  });
}

main();
