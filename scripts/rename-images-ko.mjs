#!/usr/bin/env node
/**
 * public/image/ 파일명을 한글 표준명으로 변경하고 하위 폴더 잔여 파일을 정리합니다.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IMAGE_ROOT = path.join(ROOT, "public/image");

/** 이전 파일명(영문·구경로) → 한글 표준명 */
const RENAME_MAP = {
  "logo.png": "로고.png",
  "office-exterior.jpg": "사무소-전경.jpg",
  "home-trust.png": "홈-신뢰안내.png",
  "office-nameplate.png": "사무소-명판.png",
  "office-nameplate-horizontal.jpg": "사무소-명판가로.jpg",
  "office-interior.jpg": "사무소-내부.jpg",
  "office-documents.jpg": "사무소-서류.jpg",
  "office-location-map.png": "사무소-위치지도.png",
  "location-header-map.png": "오시는길-지도.png",
  "office-direction-step-1.png": "사무소-찾아오는길1.png",
  "office-direction-step-2.png": "사무소-찾아오는길2.png",
  "office-parking.png": "사무소-주차.png",
  "office-name-badge.png": "사무소-명패.png",
  "activity-bar-association-award.jpg": "활동-법무사협회표창.jpg",
  "activity-youth-budget-advisory.jpg": "활동-청년예산자문단.jpg",
  "activity-busan-youth-policy.jpg": "활동-부산청년정책위원.jpg",
  "activity-haeundae-policy.jpg": "활동-해운대정책자문.jpg",
  "activity-peace-unification.jpg": "활동-민주평통자문.jpg",
  "activity-citizen-jury.jpg": "활동-시민배심원단.jpg",
  "contact-consultation-hero.jpg": "상담-메인.jpg",
  "contact-phone-consult.png": "상담-전화.png",
  "contact-in-person-consult.png": "상담-대면.png",
  "contact-on-site-consult.png": "상담-출장.png",
  "press-busan-ilbo-20260608.jpg": "언론-부산일보-260608.jpg",
  "press-kukje-sinmun-20260603.jpg": "언론-국제신문-260603.jpg",
  "press-beopryul-sinmun-20260602.png": "언론-법률신문-260602.png",
  "stock-legal-documents.jpg": "썸네일-서류등기.jpg",
  "stock-legal-consultation.jpg": "썸네일-상담협의.jpg",
  "stock-legal-contract.jpg": "썸네일-계약임원.jpg",
  "stock-legal-office.jpg": "썸네일-사무실.jpg",
  "stock-legal-courthouse.jpg": "썸네일-법원절차.jpg",
  // 구 폴더 잔여 → 한글명 (중복이면 스킵)
  "about/profile.jpg": "사무소-전경.jpg",
  "about/명판.png": "사무소-명판.png",
  "about/policy/bar-association-award.jpg": "활동-법무사협회표창.jpg",
  "about/policy/youth-budget-advisory.jpg": "활동-청년예산자문단.jpg",
  "about/policy/busan-youth-policy.jpg": "활동-부산청년정책위원.jpg",
  "about/policy/haewoondae-policy.jpg": "활동-해운대정책자문.jpg",
  "about/policy/peace-unification.jpg": "활동-민주평통자문.jpg",
  "about/policy/citizen-jury.jpg": "활동-시민배심원단.jpg",
  "contact/상담_top.jpg": "상담-메인.jpg",
  "contact/전화상담.png": "상담-전화.png",
  "contact/대면상담.png": "상담-대면.png",
  "contact/출장상담.png": "상담-출장.png",
  "location/지도.png": "오시는길-지도.png",
  "office/명판가로.jpg": "사무소-명판가로.jpg",
  "office/doc.jpg": "사무소-서류.jpg",
  "office/office.jpg": "사무소-내부.jpg",
  "press/부산일보260608.jpg": "언론-부산일보-260608.jpg",
  "press/국제신문260603.jpg": "언론-국제신문-260603.jpg",
  "press/법률신문260602.png": "언론-법률신문-260602.png",
};

function walkFiles(dir, base = "", acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, rel, acc);
    else acc.push({ rel: rel.replace(/\\/g, "/"), full });
  }
  return acc;
}

function main() {
  const files = walkFiles(IMAGE_ROOT);
  const targetTaken = new Set(
    files
      .filter((f) => !f.rel.includes("/"))
      .map((f) => f.rel)
      .filter((name) => Object.values(RENAME_MAP).includes(name) || name === "위촉장.jpg" || name === "오브제.jpg"),
  );

  for (const { rel, full } of files) {
    const baseName = rel.includes("/") ? rel : path.basename(rel);
    const mapped =
      RENAME_MAP[rel] ?? RENAME_MAP[baseName] ?? (rel.includes("/") ? null : null);

    if (!mapped) continue;
    if (mapped === rel || mapped === baseName) continue;

    const dest = path.join(IMAGE_ROOT, mapped);
    if (fs.existsSync(dest)) {
      console.log(`[rename-images-ko] skip duplicate ${rel} → ${mapped} (exists)`);
      fs.unlinkSync(full);
      continue;
    }

    fs.renameSync(full, dest);
    console.log(`[rename-images-ko] ${rel} → ${mapped}`);
    targetTaken.add(mapped);
  }

  // 빈 하위 폴더 제거
  for (const entry of fs.readdirSync(IMAGE_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(IMAGE_ROOT, entry.name);
    fs.rmSync(full, { recursive: true, force: true });
    console.log(`[rename-images-ko] removed folder ${entry.name}/`);
  }

  const remaining = fs.readdirSync(IMAGE_ROOT).sort();
  console.log(`[rename-images-ko] Done — ${remaining.length} files:`);
  remaining.forEach((name) => console.log(`  ${name}`));
}

main();
