// 등기와 무관한 업무(상속포기·한정승인·회생·파산) 페이지에 등기·법인 공통 문장이 섞였는지 out/에서 집계 → intent-mix.csv
import fs from "node:fs";
const sm = JSON.parse(fs.readFileSync(new URL("./live-sitemap.json", import.meta.url))).urls.map(([p]) => p);
const NONREG = /상속포기|한정승인|개인회생|파산|회생/;
const OFF = [
  ["근저당 체크", /당사자·권리관계·근저당 유무를 확인한 뒤|근저당·전세권·가압류 유무는 본등기/],
  ["잔금·결의", /잔금·결의·상속 개시처럼|잔금·상속 개시·법인 변경일이 겹친다면/],
  ["계약서 서류", /등기부등본·계약서·협의서 등 사건 관련 핵심 서류/],
  ["부동산·법인 소재지 관할", /관할 등기소와 법원이 다를 수 있어 부동산·법인 소재지 기준 확인이 우선|부동산 주소·법인 본점 주소만 있어도 1차 목록/],
  ["대출·매매 연동", /진행 중인 대출·매매가 있으면 연동 순서/],
];
const rows = []; const cnt = {}; let pages = 0, affected = 0;
for (const p of sm) {
  if (!NONREG.test(p)) continue;
  const f = ["out" + p + ".html", "out" + p + "/index.html"].find((x) => fs.existsSync(x));
  if (!f) continue;
  pages++;
  const main = ((fs.readFileSync(f, "utf8").match(/<main[\s\S]*<\/main>/) || [""])[0]).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  const hits = OFF.filter(([, re]) => re.test(main)).map(([k]) => k);
  if (hits.length) { affected++; for (const k of hits) cnt[k] = (cnt[k] || 0) + 1; rows.push(`${p},"${hits.join("|")}"`); }
}
fs.writeFileSync(new URL("./intent-mix.csv", import.meta.url), "﻿path,off_intent\n" + rows.join("\n") + "\n");
console.log({ nonRegistrationPagesInSitemap: pages, affected, cnt });
