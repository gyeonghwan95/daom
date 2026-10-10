#!/usr/bin/env node
/**
 * 전환(예약·문의) 경로 점검 — out/ 정적 HTML.
 * 페이지별: 전화(tel:)·카카오·톡톡·네이버 예약·문의 폼·지도 링크 유무, 본문 시작부터 첫 상담 링크까지 글자 수,
 * 전화번호 종류, 상담 링크 총수. 사이트 전체: 전화번호 일관성, 문의 폼 필수 입력.
 */
import fs from "node:fs";
import path from "node:path";
import { listRoutes, routeToFile } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const SAMPLE = [
  "/", "/부산법무사", "/부산법무사상담", "/부산법무사추천", "/부산법무사비용",
  "/부산상속법무사", "/부산상속전문법무사", "/부산상속포기", "/부산한정승인", "/부산상속등기",
  "/부산법인법무사", "/부산법인등기", "/부산법인설립등기", "/부산등기법무사", "/부산부동산등기", "/부산소유권이전등기",
  "/부산개인회생", "/부산개인파산", "/부산공탁", "/부산가압류취소", "/부산상속재산파산",
  "/해운대법무사", "/센텀법무사", "/업무사례/울산상속등기법무사", "/업무사례/대구상속포기한정승인", "/업무사례/서울상속등기법무사",
  "/상속", "/services/inheritance-registration", "/blog/busan-inheritance-consultation-prep", "/location", "/contact",
];
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const CTA = {
  tel: /href="tel:([^"]+)"/g,
  kakao: /href="https?:\/\/pf\.kakao\.com[^"]*"/g,
  talk: /href="https?:\/\/talk\.naver\.com[^"]*"/g,
  booking: /href="https?:\/\/(m\.)?booking\.naver\.com[^"]*"/g,
  inquiry: /href="\/contact(\/inquiry)?[^"]*"/g,
  map: /href="https?:\/\/(naver\.me|map\.naver\.com)[^"]*"/g,
};
const rows = [];
const phones = new Map();
for (const r of SAMPLE) {
  const f = routeToFile(r);
  if (!f) { rows.push({ r, missing: true }); continue; }
  const h = fs.readFileSync(f, "utf8");
  const body = h.slice(h.indexOf("<body"));
  const mainStart = body.indexOf("<main");
  const main = mainStart >= 0 ? body.slice(mainStart, body.lastIndexOf("</main>")) : body;
  const counts = {};
  for (const [k, re] of Object.entries(CTA)) counts[k] = (body.match(re) || []).length;
  for (const m of body.matchAll(CTA.tel)) phones.set(m[1], (phones.get(m[1]) ?? 0) + 1);
  // 본문(H1 이후)에서 첫 상담 링크까지의 텍스트 길이
  const h1At = main.search(/<h1\b/);
  const afterH1 = h1At >= 0 ? main.slice(h1At) : main;
  const firstCta = afterH1.search(/href="(tel:|https?:\/\/pf\.kakao|https?:\/\/talk\.naver|https?:\/\/(m\.)?booking\.naver|\/contact)/);
  const charsToFirstCta = firstCta >= 0 ? strip(afterH1.slice(0, firstCta)).length : null;
  rows.push({ r, ...counts, charsToFirstCta, mainChars: strip(main).length });
}
// 문의 폼
const formFile = routeToFile("/contact/inquiry");
let form = null;
if (formFile) {
  const h = fs.readFileSync(formFile, "utf8");
  form = {
    inputs: (h.match(/<(input|textarea|select)\b/g) || []).length,
    required: (h.match(/\brequired\b/g) || []).length,
    privacy: /개인정보/.test(strip(h)),
  };
}
fs.writeFileSync(path.join(DIR, "conversion-audit.json"), JSON.stringify({ rows, phones: Object.fromEntries(phones), form }, null, 1));
console.log("page | tel kakao talk booking inquiry map | chars→1st CTA | main");
for (const x of rows) {
  if (x.missing) { console.log(x.r, "MISSING"); continue; }
  const flag = [x.tel ? "" : "!tel", x.kakao ? "" : "!kakao", x.talk ? "" : "!talk", x.booking ? "" : "!booking", x.inquiry ? "" : "!inquiry"].filter(Boolean).join(" ");
  console.log(`${x.r} | ${x.tel} ${x.kakao} ${x.talk} ${x.booking} ${x.inquiry} ${x.map} | ${x.charsToFirstCta} | ${x.mainChars} ${flag}`);
}
console.log("phones:", JSON.stringify(Object.fromEntries(phones)));
console.log("inquiry form:", JSON.stringify(form));
