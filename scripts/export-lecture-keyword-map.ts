import fs from "node:fs";
import { lectureKeywordUniverse } from "../src/data/lectures/lecture-keyword-to-url-map.ts";

const headers = [
  "keyword",
  "cluster",
  "search_intent",
  "owner_url",
  "secondary_url",
  "status",
  "impressions",
  "clicks",
  "ctr",
  "notes",
];

function esc(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

const lines = [headers.join(",")];
for (const r of lectureKeywordUniverse) {
  lines.push(
    [
      r.keyword,
      r.cluster,
      r.search_intent,
      r.owner_url,
      r.secondary_url || "",
      r.status,
      "",
      "",
      "",
      r.notes,
    ]
      .map(esc)
      .join(","),
  );
}

fs.writeFileSync("seo/lecture-keyword-map.csv", `${lines.join("\n")}\n`);
fs.writeFileSync(
  "seo/lecture-keyword-map.json",
  `${JSON.stringify(lectureKeywordUniverse, null, 2)}\n`,
);
console.log(`exported ${lectureKeywordUniverse.length}`);
