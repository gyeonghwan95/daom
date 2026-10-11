// 사이트맵 URL의 본문(main)에서 공통 문장(전체 페이지의 20% 이상에 나오는 문장)을 빼고,
// 지역명을 가린 뒤 '다른 페이지에 없는 문장' 비율을 계산 → uniqueness.csv. 검색엔진 기준이 아닌 내부 비교 지표.
import fs from "node:fs";
const sm = JSON.parse(fs.readFileSync(new URL("./live-sitemap.json", import.meta.url))).urls.map(([p]) => p);
const mask = (s) => s.replace(/[가-힣A-Za-z0-9·]{1,8}(특별시|광역시|구|동|역|군|시|읍|면|권)(?=[\s·,은는이가의에을를도]|$)/g, "◇").replace(/\d+/g, "#");
const pages = [];
for (const p of sm) {
  const f = ["out" + p + ".html", "out" + p + "/index.html"].find((x) => fs.existsSync(x));
  if (!f) continue;
  const main = ((fs.readFileSync(f, "utf8").match(/<main[\s\S]*<\/main>/) || [""])[0]).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<(nav|footer|aside)[\s\S]*?<\/\1>/g, "");
  const sents = [...new Set(main.replace(/<[^>]+>/g, "\n").split(/\n+|(?<=[.?!다요])\s+/).map((s) => s.trim()).filter((s) => s.length >= 20).map(mask))];
  pages.push({ p, sents });
}
const df = new Map();
for (const { sents } of pages) for (const s of sents) df.set(s, (df.get(s) || 0) + 1);
const common = Math.ceil(pages.length * 0.2);
const fam = (p) => p.startsWith("/업무사례/") ? (/상속등기법무사$/.test(p) ? "업무사례/지역상속등기" : "업무사례/기타") : /^\/(blog|faq|glossary|situations|services|tools|resources|media|강의이력)/.test(p) ? p.split("/")[1] : /(구|동|역|군)(법무사|상속|법인|부동산|임원|한정|소유|전세|재개발|재건축|선박|개인)/.test(p) ? "부산 지역×업무" : "기타 단일";
const rows = []; const agg = {};
for (const { p, sents } of pages) {
  const body = sents.filter((s) => df.get(s) < common);
  const uniq = body.filter((s) => df.get(s) === 1).length;
  const ratio = body.length ? uniq / body.length : 0;
  const f = fam(p);
  rows.push([p, f, body.length, uniq, ratio.toFixed(2)]);
  (agg[f] ||= []).push(ratio);
}
fs.writeFileSync(new URL("./uniqueness.csv", import.meta.url), "﻿path,family,body_sentences,unique_sentences,unique_ratio\n" + rows.map((r) => r.join(",")).join("\n") + "\n");
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
console.log("pages", pages.length, "commonThreshold", common);
for (const [f, a] of Object.entries(agg).sort((x, y) => y[1].length - x[1].length)) console.log(f.padEnd(22), "n=" + a.length, "median=" + med(a).toFixed(2), "<0.2:" + a.filter((x) => x < 0.2).length);
