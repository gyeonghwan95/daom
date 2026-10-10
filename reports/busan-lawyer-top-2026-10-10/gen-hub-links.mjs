#!/usr/bin/env node
/**
 * 고아 색인 페이지 연결 계획 생성.
 * - 제외(noindex,follow): 다른 지역 형제와 본문 유사도 ≥0.90인 고아 페이지, 동의어 쌍(유사도 ≥0.75)의 약한 쪽
 * - 연결: 나머지 고아 페이지를 이름 규칙으로 정한 상위 허브에 링크
 * /부산임차권등기명령·/부산증여등기는 전용 화면이라 하위 링크 섹션이 없어 상위 허브(/임대차전세·/부산부동산등기)로 연결한다.
 * 출력: src/data/seo/hub-child-links.ts (상위 경로 → 링크 목록), plan-final.json (제외·연결·미배정)
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");
const S = JSON.parse(fs.readFileSync(path.join(DIR, "../busan-lawyer-rank-2026-10-10/after3.json"), "utf8"));
const orphanSim = JSON.parse(fs.readFileSync(path.join(DIR, "orphan-sim.json"), "utf8"));
const syn = JSON.parse(fs.readFileSync(path.join(DIR, "pairs-inbound.json"), "utf8"));
const fam = JSON.parse(fs.readFileSync(path.join(DIR, "orphans.json"), "utf8"));
const indexable = (r) => S[r] && !/noindex/.test(S[r].robots || "") && S[r].canonical === r;

// 1) 제외 목록
const exclude = new Map(); // route -> {reason, canonical?}
// 2026-10-10 후속: 지역 페이지는 지역 검색에 필요해 제외하지 않는다(지역별 접수처 섹션으로 차별화).
for (const p of syn) {
  if (!/기간\/기한|필요서류\/준비서류/.test(p.family) || p.sim < 0.75) continue;
  const weakIsB = p.ia >= p.ib; // 링크 수 같으면 '기한'·'준비서류'(b) 제외
  const weak = weakIsB ? p.b : p.a;
  const strong = weakIsB ? p.a : p.b;
  exclude.set(weak, { reason: `동의어 쌍 본문 유사도 ${p.sim}`, canonical: strong });
}

// 2) 상위 허브 규칙
const SERVICE_OWNER = {
  개인파산: "/부산개인파산", 개인회생: "/부산개인회생", 근저당말소: "/부산근저당말소등기", 법인등기: "/부산법인등기",
  법인설립등기: "/부산법인설립등기", 본점이전등기: "/부산본점이전등기", 부동산등기: "/부산부동산등기", 상속등기: "/부산상속등기",
  상속포기: "/부산상속포기", 선박등기: "/부산선박등기", 소유권이전등기: "/부산소유권이전등기", 임원변경등기: "/부산임원변경등기",
  임차권등기명령: "/임대차전세", 재개발등기: "/부산재개발등기", 재건축등기: "/부산재건축등기", 전세권설정: "/부산전세권설정등기",
  증여등기: "/부산부동산등기", 한정승인: "/부산한정승인",
};
const DISTRICT = [["해운대구", "/해운대법무사"], ["부산진구", "/부산진구법무사"], ["영도구", "/영도구법무사"], ["동래구", "/동래구법무사"], ["사하구", "/사하구법무사"], ["금정구", "/금정구법무사"], ["강서구", "/강서구법무사"], ["연제구", "/연제구법무사"], ["수영구", "/수영구법무사"], ["사상구", "/사상구법무사"], ["기장군", "/기장군법무사"], ["중구", "/중구법무사"], ["서구", "/서구법무사"], ["동구", "/동구법무사"], ["남구", "/남구법무사"], ["북구", "/북구법무사"]];
const AREA = [
  [/^(광안동|광안역)/, "/수영구법무사"], [/^(대연동|문현동|문현금융단지)/, "/남구법무사"], [/^덕천동/, "/북구법무사"], [/^(명례산업단지|정관|기장)/, "/기장군법무사"],
  [/^사상역/, "/사상구법무사"], [/^(사직동|온천동)/, "/동래구법무사"], [/^(연산동|연산역)/, "/연제구법무사"],
  [/^(전포동|부전동|서면)/, "/서면법무사"], [/^(녹산국가산단|에코델타시티|명지)/, "/명지법무사"],
  [/^(재송동)/, "/재송동법무사"],
  [/^민락동/, "/수영구법무사"], [/^반여동/, "/반여동법무사"], [/^(부곡동|장전동)/, "/금정구법무사"], [/^부산역/, "/동구법무사"],
  [/^양정동/, "/부산진구법무사"], [/^중동/, "/해운대법무사"], [/^화명동/, "/북구법무사"], [/^북부산등기소/, "/북부산등기소법무사"], [/^동부지원/, "/부산지방법원동부지원등기과법무사"], [/^(센텀시티역)/, "/센텀법무사"], [/^(송정동|우동|좌동|반송동|해운대역|해운대상가)/, "/해운대법무사"],
  [/^부산지방법원등기국/, "/부산지방법원등기국법무사"], [/^부산지방법원동부지원/, "/부산지방법원동부지원등기과법무사"],
  [/^부산지방법원(상속등기|법무사)?/, "/부산지방법원법무사"], [/^부산가정법원/, "/부산가정법원상속"],
  [/^중부산등기소/, "/중부산등기소법무사"], [/^남부산등기소/, "/남부산등기소법무사"], [/^부산진등기소/, "/부산진등기소법무사"],
  [/상담$|^서류가없어도상담가능|^전화가어려울때법률상담/, "/부산법무사상담"],
  [/^(사회적기업과법인설립차이|사회적협동조합과사단법인차이|협동조합과주식회사차이|협동조합임원변경등기|협동조합해산청산등기|복지단체사단법인설립|환경단체사단법인설립|사단법인목적변경등기|사단법인주사무소이전등기)/, "/부산사단법인설립"],
  [/^(재단법인과공익법인차이|재단법인기본재산변경등기|경남재단법인설립)/, "/부산재단법인설립"],
  [/^재건축조합임원변경등기/, "/부산재건축등기"],
];
const COURT_HUB_PARENT = { "/부산지방법원등기국법무사": "/부산지방법원법무사", "/부산지방법원동부지원등기과법무사": "/부산지방법원법무사", "/부산가정법원법무사": "/부산가정법원상속", "/반송동법무사": "/해운대법무사", "/해운대역법무사": "/해운대법무사" };

function parentOf(r) {
  if (COURT_HUB_PARENT[r]) return COURT_HUB_PARENT[r];
  if (r.startsWith("/업무사례/")) return "/업무사례/지역별";
  const s = r.slice(1);
  const synM = s.match(/^(.+?)(기간|기한|필요서류|준비서류|과태료|비용|자가진단)$/);
  if (synM && SERVICE_OWNER[synM[1]]) return SERVICE_OWNER[synM[1]];
  for (const [re, p] of AREA) if (re.test(s)) return p;
  for (const [d, p] of DISTRICT) if (s.startsWith(d)) return p;
  return null;
}
const label = (r) => {
  const t = (S[r]?.title || r).replace(/\s*\|\s*다옴법무사사무소\s*$/, "");
  return t.split("｜")[0].split(" | ")[0].trim().slice(0, 40);
};

const allOrphans = Object.values(fam).flat();
const byParent = {};
const unassigned = [];
for (const r of allOrphans) {
  if (exclude.has(r)) continue;
  const p = parentOf(r);
  if (!p || !indexable(p) || exclude.has(p)) { unassigned.push({ r, parent: p }); continue; }
  (byParent[p] ??= []).push({ href: r, label: label(r) });
}
for (const v of Object.values(byParent)) v.sort((a, b) => a.label.localeCompare(b.label, "ko"));

const ts = `/**
 * 상위 허브 → 하위 상세 안내 링크 (내부 링크가 없던 색인 페이지 연결).
 * 생성: reports/busan-lawyer-top-2026-10-10/gen-hub-links.mjs (2026-10-10). 손으로 고치면 생성기도 함께 고친다.
 */
export const HUB_CHILD_LINKS: Record<string, readonly { href: string; label: string }[]> = ${JSON.stringify(byParent, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, "src/data/seo/hub-child-links.ts"), ts);
fs.writeFileSync(path.join(DIR, "plan-final.json"), JSON.stringify({ exclude: Object.fromEntries(exclude), byParent, unassigned }, null, 1));
console.log(`orphans=${allOrphans.length} exclude=${exclude.size} linked=${Object.values(byParent).flat().length} parents=${Object.keys(byParent).length} unassigned=${unassigned.length}`);
console.log("unassigned:", unassigned.map((u) => `${u.r}->${u.parent ?? "?"}`).join(" "));
console.log("parents:", Object.entries(byParent).map(([p, v]) => `${p}(${v.length})`).join(" "));
