/**
 * 내부 owner QA. 네이버 순위가 아님.
 * 실행: npx --yes tsx scripts/non-inheritance-owner-qa.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import { INHERITANCE_QUERY_RE, NON_INHERITANCE_SEEDS } from "./non-inheritance-seeds";

const OUT_DIR = path.join(process.cwd(), "seo/non-inheritance");

function csvEscape(v: string | number): string {
  const text = String(v ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function compact(s: string): string {
  return s.replace(/\s+/g, "");
}

function score(
  page: { path: string; metaTitle: string; h1: string; intro: string },
  query: string,
): number {
  const hay = `${page.metaTitle}\n${page.h1}\n${page.intro}\n${page.path}`;
  const hayC = compact(hay);
  const qC = compact(query);
  let n = 0;
  if (hayC.includes(qC)) n += 80;
  if (compact(page.metaTitle).includes(qC)) n += 40;
  if (compact(page.h1).includes(qC)) n += 30;
  if (page.path !== "/" && qC.includes(compact(page.path.slice(1)))) n += 20;
  for (const token of query.split(/\s+/).filter((t) => t.length > 1)) {
    n += Math.min(hay.split(token).length - 1, 6) * 4;
  }
  if (isNoIndexPath(page.path)) n -= 50;
  return n;
}

function main() {
  const leaked = NON_INHERITANCE_SEEDS.filter((s) => INHERITANCE_QUERY_RE.test(s.keyword));
  if (leaked.length) {
    throw new Error(`inheritance query leaked: ${leaked.map((s) => s.keyword).join(", ")}`);
  }

  const pages = getAllPageData().map((p) => ({
    path: p.path,
    metaTitle: p.metaTitle || p.title,
    h1: p.h1,
    intro: p.intro,
  }));

  const qaRows = ["keyword,expected_owner,rank,url,score,pass"];
  const top5Rows = ["keyword,rank,url,score"];
  let fail = 0;

  for (const seed of NON_INHERITANCE_SEEDS) {
    const ranked = pages
      .map((p) => ({ ...p, s: score(p, seed.keyword) }))
      .sort((a, b) => b.s - a.s || a.path.localeCompare(b.path, "ko"))
      .slice(0, 5);
    const first = ranked[0];
    const pass = first?.path === seed.owner;
    if (!pass) fail += 1;
    qaRows.push(
      [
        seed.keyword,
        seed.owner,
        1,
        first?.path ?? "",
        first?.s ?? 0,
        pass ? "PASS" : "MISS",
      ]
        .map(csvEscape)
        .join(","),
    );
    ranked.forEach((row, i) => {
      top5Rows.push(
        [seed.keyword, i + 1, row.path, row.s].map(csvEscape).join(","),
      );
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "owner-qa.csv"), `${qaRows.join("\n")}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "owner-top5.csv"), `${top5Rows.join("\n")}\n`, "utf8");

  const owners: Record<string, string> = {};
  for (const seed of NON_INHERITANCE_SEEDS) owners[seed.keyword] = seed.owner;
  fs.writeFileSync(
    path.join(OUT_DIR, "owner-map.json"),
    JSON.stringify(
      {
        updated: "2026-09-20",
        note: "PRIMARY owner 하나. 신규 doorway 없음. 네이버 순위 아님.",
        owners,
      },
      null,
      2,
    ),
    "utf8",
  );

  const rankInput = ["keyword,device,observed_rank,observed_url,observed_date,source"];
  const tracker = [
    "keyword,owner,baseline_rank_pc,baseline_rank_mobile,day14_pc,day14_mobile,day30_pc,day30_mobile,day60_pc,day60_mobile,notes",
  ];
  for (const seed of NON_INHERITANCE_SEEDS) {
    rankInput.push(
      [seed.keyword, "pc", "", "", "", "UNKNOWN"].map(csvEscape).join(","),
    );
    rankInput.push(
      [seed.keyword, "mobile", "", "", "", "UNKNOWN"].map(csvEscape).join(","),
    );
    tracker.push(
      [seed.keyword, seed.owner, "", "", "", "", "", "", "", "", "SERP_UNVERIFIED"].map(csvEscape).join(
        ",",
      ),
    );
  }
  fs.writeFileSync(path.join(process.cwd(), "seo/rank-input.csv"), `${rankInput.join("\n")}\n`, "utf8");
  fs.writeFileSync(
    path.join(process.cwd(), "seo/non-inheritance-rank-tracker.csv"),
    `${tracker.join("\n")}\n`,
    "utf8",
  );
  console.log(`seeds=${NON_INHERITANCE_SEEDS.length} owner_miss=${fail} -> ${OUT_DIR}`);
}

main();
