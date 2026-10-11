// 대상 업무(상속포기·한정승인·개인회생·개인파산) seo-landing 페이지의 본문에서 등기·법인 관련 단어가 든 문장을 모아
// 문장별 등장 페이지 수를 센다 → inventory.csv (분류는 사람이 판단)
import fs from "node:fs";

const TARGET = new Set(["inheritance-renunciation", "qualified-acceptance", "personal-rehabilitation", "bankruptcy"]);
const specs = JSON.parse(fs.readFileSync(new URL("./specs.json", import.meta.url))).filter((s) => TARGET.has(s.serviceId));
const TERMS = /근저당|가압류|등기필|전자등기|본등기|등기소|잔금|매매|계약서|결의|법인|본점|공동명의|인도일|권리관계|저당권|말소|대출/;
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const counts = new Map();
for (const s of specs) {
  const f = ["out" + s.path + ".html"].find((x) => fs.existsSync(x));
  if (!f) continue;
  const main = ((fs.readFileSync(f, "utf8").match(/<main[\s\S]*<\/main>/) || [""])[0]).replace(/<script[\s\S]*?<\/script>/g, "");
  const parts = main
    .replace(/<(br|\/p|\/li|\/h[1-6]|\/div|\/td|\/dd|\/summary)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split(/\n+/)
    .flatMap((x) => decode(x).replace(/\s+/g, " ").trim().split(/(?<=[.다요])\s+/))
    .map((x) => x.trim())
    .filter((x) => x.length > 6 && TERMS.test(x));
  for (const p of new Set(parts.map((x) => x.replace(new RegExp(s.regionLabel || "@@", "g"), "{지역}")))) {
    const k = `${s.serviceId}\t${p}`;
    counts.set(k, (counts.get(k) || 0) + 1);
  }
}
const rows = [...counts].sort((a, b) => b[1] - a[1]);
fs.writeFileSync(new URL("./inventory.csv", import.meta.url), "﻿service,pages,sentence\n" + rows.map(([k, n]) => { const [svc, s] = k.split("\t"); return `${svc},${n},"${s.replace(/"/g, '""')}"`; }).join("\n") + "\n");
console.log("target pages", specs.length, "distinct sentences", rows.length);
for (const [k, n] of rows) console.log(n, k.replace("\t", " | ").slice(0, 190));
