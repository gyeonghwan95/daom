/**
 * 검토용: 히어로 사진 배정 결과를 지역·업무 규칙별로 센다(오매칭 찾기).
 * Usage: node scripts/premium-thumbnails/hero-pick-report.mjs [키워드]
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { pickHeroPhoto } from "./hero-sources.mjs";

const rows = JSON.parse(readFileSync(path.join(process.cwd(), "scripts/premium-thumbnails/page-og.json"), "utf8"));
const filter = process.argv[2];
const byPhoto = {};
for (const r of rows) {
  const photo = pickHeroPhoto(r.url, "(office)");
  if (filter && !r.url.includes(filter) && !photo.includes(filter)) continue;
  (byPhoto[photo] ??= []).push(r.url);
}
for (const [photo, urls] of Object.entries(byPhoto).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${String(urls.length).padStart(4)}  ${photo}`);
  if (filter || photo !== "(office)") console.log(`      ${urls.slice(0, filter ? 400 : 12).join(" ")}`);
}
