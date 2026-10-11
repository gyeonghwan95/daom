/**
 * 전국 지역·업무 목록(regions.csv)과 네이버 조사 질의(queries.csv) 생성.
 *   npx tsx audit/build-lists.ts
 * 지역 원본: 광역 16(공식 현행 명칭) + 사이트에 공개된 nationwide/gyeongnam/southeast 지역 페이지 + 요청 시드 90.
 */
import fs from "node:fs";
import path from "node:path";
import { getPublishedNationwideCaseDefs } from "../src/lib/nationwide-cases";
import { getPublishedGyeongnamDefs } from "../src/lib/gyeongnam-cases";
import { getPublishedSoutheastDefs } from "../src/lib/southeast-cases";

const OUT = path.join(__dirname);
const CASE = "/업무사례/";

// 광역 — 공식 현행 명칭(전북특별자치도 2024.1.18, 강원특별자치도 2023.6.11, 제주특별자치도, 세종특별자치시)
const METROS: { id: string; label: string; official: string; aliases: string[] }[] = [
  { id: "seoul", label: "서울", official: "서울특별시", aliases: ["서울시"] },
  { id: "gyeonggi", label: "경기", official: "경기도", aliases: ["경기도"] },
  { id: "incheon", label: "인천", official: "인천광역시", aliases: ["인천시"] },
  { id: "daegu", label: "대구", official: "대구광역시", aliases: [] },
  { id: "daejeon", label: "대전", official: "대전광역시", aliases: [] },
  { id: "gwangju", label: "광주", official: "광주광역시", aliases: ["광주광역시"] },
  { id: "ulsan", label: "울산", official: "울산광역시", aliases: [] },
  { id: "sejong", label: "세종", official: "세종특별자치시", aliases: ["세종시"] },
  { id: "gyeongnam", label: "경남", official: "경상남도", aliases: ["경상남도"] },
  { id: "gyeongbuk", label: "경북", official: "경상북도", aliases: ["경상북도"] },
  { id: "jeonnam", label: "전남", official: "전라남도", aliases: ["전라남도"] },
  { id: "jeonbuk", label: "전북", official: "전북특별자치도", aliases: ["전라북도"] },
  { id: "chungnam", label: "충남", official: "충청남도", aliases: ["충청남도"] },
  { id: "chungbuk", label: "충북", official: "충청북도", aliases: ["충청북도"] },
  { id: "gangwon", label: "강원", official: "강원특별자치도", aliases: ["강원도"] },
  { id: "jeju", label: "제주", official: "제주특별자치도", aliases: ["제주도"] },
];

const SEED = `강남구, 서초구, 송파구, 마포구, 용산구, 영등포구, 성동구, 강서구, 노원구, 은평구,
수원, 성남, 분당, 용인, 고양, 일산, 화성, 동탄, 부천, 안양, 안산, 평택, 김포, 남양주, 하남, 파주, 의정부, 광명,
송도, 청라, 부평구, 남동구, 영종도, 강화도, 창원, 김해, 양산, 진주, 거제, 울산남구, 울주군,
대구수성구, 대구달서구, 포항, 구미, 경산, 경주, 대전유성구, 천안, 아산, 청주, 충주, 전주, 익산, 군산, 순천, 여수, 목포,
원주, 춘천, 강릉, 제주시, 서귀포, 시흥, 경기광주, 판교, 광교, 이천, 구리, 양주, 강동구, 관악구, 구로구, 대전서구,
당진, 제천, 속초, 광양, 군포, 의왕·과천, 오산·안성, 여주·양평, 포천·동두천, 가평, 서산·보령, 공주, 나주·정읍, 남원, 동해·삼척, 홍천`
  .split(/[,\n]/)
  .map((s) => s.trim())
  .filter(Boolean);

/** 기본 6업무 — 지원 여부: 상속포기·한정승인은 피상속인 최후 주소지 가정법원 관할(법무사는 서류 작성·제출 지원) → conditional */
const SERVICES: { id: string; label: string; support: "supported" | "conditional"; hub: string }[] = [
  { id: "inherit-reg", label: "상속등기", support: "supported", hub: "/전국상속등기" },
  { id: "renounce", label: "상속포기", support: "conditional", hub: "/전국상속등기" },
  { id: "qualified", label: "한정승인", support: "conditional", hub: "/전국상속등기" },
  { id: "corp-setup", label: "법인설립", support: "supported", hub: "/전국업무" },
  { id: "corp-reg", label: "법인등기", support: "supported", hub: "/전국업무" },
  { id: "hq-move", label: "본점이전", support: "supported", hub: "/전국법인본점이전등기" },
];

type Landing = { slug: string; region: string; parent?: string; keyword: string; source: string; kind: string };
const landings: Landing[] = [
  ...getPublishedNationwideCaseDefs().map((d) => ({ slug: d.slug, region: d.regionName, parent: d.parentRegion, keyword: d.primaryKeyword, source: "nationwide", kind: d.kind })),
  ...getPublishedGyeongnamDefs().map((d) => ({ slug: d.slug, region: d.regionName, parent: d.parentRegion, keyword: d.primaryKeyword, source: "gyeongnam", kind: d.pageType })),
  ...getPublishedSoutheastDefs().map((d) => ({ slug: d.slug, region: d.regionName, parent: d.parentRegion, keyword: d.primaryKeyword, source: "southeast", kind: d.pageType })),
];

const norm = (s: string) => s.replace(/[\s·]/g, "");
function serviceMatch(keyword: string, svc: string): boolean {
  const k = norm(keyword);
  if (svc === "상속등기") return /상속등기|유증|상속(?!포기)/.test(k) && !/포기|한정/.test(k);
  if (svc === "상속포기") return /상속포기/.test(k);
  if (svc === "한정승인") return /한정승인/.test(k);
  if (svc === "법인설립") return /법인설립/.test(k);
  if (svc === "법인등기") return /법인등기|임원/.test(k);
  if (svc === "본점이전") return /본점이전/.test(k);
  return false;
}
function landingsFor(name: string): Landing[] {
  const n = norm(name);
  return landings.filter((l) => norm(l.region) === n || norm(l.region).includes(n) || n.includes(norm(l.region)) && norm(l.region).length >= 2);
}
function targetFor(name: string, svc: (typeof SERVICES)[number], metroLabel?: string): { url: string; how: string } {
  const own = landingsFor(name).find((l) => serviceMatch(l.keyword, svc.label));
  if (own) return { url: CASE + own.slug, how: "region-service" };
  const regionAny = landingsFor(name).find((l) => /상속/.test(l.keyword) && svc.id.startsWith("inherit"));
  if (regionAny) return { url: CASE + regionAny.slug, how: "region-inheritance" };
  if (metroLabel) {
    const m = landingsFor(metroLabel).find((l) => serviceMatch(l.keyword, svc.label)) ?? landingsFor(metroLabel).find((l) => /상속/.test(l.keyword) && svc.id !== "corp-setup" && svc.id !== "corp-reg" && svc.id !== "hq-move");
    if (m) return { url: CASE + m.slug, how: "metro-hub" };
  }
  return { url: svc.hub, how: "service-hub" };
}

const csv = (rows: (string | number | null)[][]) =>
  rows.map((r) => r.map((v) => (v === null || v === undefined ? "" : `"${String(v).replace(/"/g, '""')}"`)).join(",")).join("\n") + "\n";

// regions.csv
const regionRows: (string | number | null)[][] = [["region_id", "region_label", "admin_level", "aliases", "existing_urls", "mapping_status", "supported_services", "note"]];
for (const m of METROS) {
  const urls = landingsFor(m.label).map((l) => CASE + l.slug);
  regionRows.push([m.id, m.label, "광역", [m.official, ...m.aliases].join("|"), urls.join(" "), urls.length ? "has-landing" : "service-hub", SERVICES.map((s) => `${s.label}:${s.support}`).join("|"), ""]);
}
regionRows.push(["busan", "부산", "광역(보호·비교군)", "부산광역시", "/부산법무사 /부산상속등기 /부산법인등기", "protected", "전체", "실제 사무소 소재지"]);
const seen = new Set(METROS.map((m) => norm(m.label)));
const extra = [...new Set([...SEED, ...landings.map((l) => l.region)])].filter((r) => !seen.has(norm(r)));
for (const r of extra) {
  const urls = [...new Set(landingsFor(r).map((l) => CASE + l.slug))];
  const note = /강서구|남구|서구|동구|북구|중구/.test(r) && !/울산|대구|대전|서울/.test(r) ? "동명이칭: 다른 광역의 같은 이름 구 구분 필요" : r === "경기광주" ? "광주광역시와 구분" : "";
  regionRows.push([`r-${norm(r)}`, r, r.includes("·") ? "복합(개별 검색어로 분리)" : "시군구·생활권", r.includes("·") ? r.split("·").join("|") : "", urls.join(" "), urls.length ? "has-landing" : "metro-or-service-hub", "상속등기:supported", note]);
}
fs.writeFileSync(path.join(OUT, "regions.csv"), "﻿" + csv(regionRows));

// queries.csv
type Q = { query: string; region_id: string; region_label: string; service: string; intent: string; target_url: string; priority: number };
const qs: Q[] = [];
const add = (q: Q) => { if (!qs.some((x) => x.query === q.query)) qs.push(q); };
for (const m of METROS) for (const s of SERVICES) {
  const t = targetFor(m.label, s);
  add({ query: `${m.label} ${s.label}`, region_id: m.id, region_label: m.label, service: s.label, intent: "지역+업무", target_url: t.url, priority: 1 });
  add({ query: `${m.label} ${s.label} 법무사`, region_id: m.id, region_label: m.label, service: s.label, intent: "지역+업무+법무사", target_url: t.url, priority: 1 });
}
for (const m of METROS) for (const [suffix, svc, intent] of [["상속", "상속등기", "지역+상속"], ["상속 법무사", "상속등기", "지역+상속+법무사"], ["상속전문 법무사", "상속등기", "전문 표현"], ["법인 법무사", "법인등기", "지역+법인+법무사"], ["법무사", "전체", "지역+법무사"]] as const) {
  const svcDef = SERVICES.find((s) => s.label === svc);
  const t = svcDef ? targetFor(m.label, svcDef) : { url: "/전국업무", how: "hub" };
  add({ query: `${m.label} ${suffix}`, region_id: m.id, region_label: m.label, service: svc, intent, target_url: t.url, priority: 2 });
}
const inherit = SERVICES[0];
for (const r of extra) {
  const parts = r.includes("·") ? r.split("·") : [r];
  for (const p of parts) {
    const t = targetFor(r, inherit);
    add({ query: `${p} 상속등기`, region_id: `r-${norm(r)}`, region_label: p, service: "상속등기", intent: "지역+업무", target_url: t.url, priority: SEED.includes(r) ? 2 : 3 });
    add({ query: `${p} 상속등기 법무사`, region_id: `r-${norm(r)}`, region_label: p, service: "상속등기", intent: "지역+업무+법무사", target_url: t.url, priority: SEED.includes(r) ? 2 : 3 });
  }
}
for (const [q, t] of [["전국 상속등기", "/전국상속등기"], ["비대면 상속등기", "/전국상속등기"], ["원거리 상속등기", "/전국상속등기"], ["여러 지역 상속등기", "/여러지역상속부동산등기"], ["해외 상속인 상속등기", "/해외거주상속인"], ["전국 법인등기", "/전국업무"], ["비대면 법인설립", "/전국업무"], ["전국 본점이전등기", "/전국법인본점이전등기"], ["전국 유증등기", "/전국유증등기"]] as const) {
  add({ query: q, region_id: "nationwide", region_label: "전국", service: q.replace(/^(전국|비대면|원거리|여러 지역|해외 상속인) /, ""), intent: "비지역", target_url: t, priority: 1 });
}
const PROTECTED = ["부산 법인전문 법무사", "부산 법인 법무사", "부산 법인설립 법무사", "부산 법인등기 법무사", "부산 상속 법무사", "부산 상속전문 법무사", "부산 상속포기 법무사", "부산 한정승인 법무사", "부산 법무사 상속", "부산 등기 법무사", "부산 등기전문 법무사", "부산 법무사", "부산 법무사 추천", "부산 법무사 상담", "부산 공탁 법무사", "부산 기관 법무사", "부산 법률상담", "부산 상속", "부산 상속등기", "부산 상속포기", "부산 한정승인", "부산 법인설립", "부산 법인등기", "부산 공탁"];
for (const q of PROTECTED) add({ query: q, region_id: "busan", region_label: "부산", service: "보호", intent: "부산 보호군", target_url: "", priority: 1 });

const qRows: (string | number | null)[][] = [["query_id", "query", "region_id", "region_label", "service", "intent", "target_url", "priority", "status"]];
qs.forEach((q, i) => qRows.push([`Q${String(i + 1).padStart(4, "0")}`, q.query, q.region_id, q.region_label, q.service, q.intent, q.target_url, q.priority, "UNCHECKED"]));
fs.writeFileSync(path.join(OUT, "queries.csv"), "﻿" + csv(qRows));
const by = (p: number) => qs.filter((q) => q.priority === p).length;
console.log(`landings ${landings.length} regions ${regionRows.length - 1} queries ${qs.length} (p1 ${by(1)} p2 ${by(2)} p3 ${by(3)}) core192 ${METROS.length * SERVICES.length * 2}`);
