/**
 * lecture-100 검색어를 seo/keyword-map.json에 추가한다.
 * 기존 owner가 다르면 실패한다.
 */
import fs from "node:fs";
import path from "node:path";
import {
  LECTURE_100_TARGETS,
  LECTURE_EXTRA_INFLOW,
} from "../src/data/seo/lecture-100-champions";

const file = path.join(process.cwd(), "seo/keyword-map.json");
const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
  queries: Record<
    string,
    { owner: string; intent?: string; supporting?: string[]; aliasOf?: string }
  >;
};

const errors: string[] = [];
let added = 0;
let kept = 0;

for (const row of [...LECTURE_100_TARGETS, ...LECTURE_EXTRA_INFLOW]) {
  const existing = data.queries[row.query];
  if (!existing) {
    data.queries[row.query] = {
      owner: row.champion,
      intent: "lecture-hiring",
      supporting: ["/강의문의"],
    };
    added += 1;
    continue;
  }
  const owner = existing.aliasOf
    ? data.queries[existing.aliasOf]?.owner ?? existing.owner
    : existing.owner;
  if (owner !== row.champion) {
    errors.push(`${row.query}: existing owner ${owner} ≠ ${row.champion}`);
    continue;
  }
  kept += 1;
}

if (errors.length) {
  for (const error of errors) console.error(`[fail] ${error}`);
  process.exit(1);
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(`OK keyword-map lecture merge added=${added} kept=${kept}`);
