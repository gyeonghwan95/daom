#!/usr/bin/env node
/**
 * public/image 하위 폴더의 이미지를 public/image/ 루트로 통합.
 * 동일 파일(해시)은 하나의 표준 파일명으로 합칩니다.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const IMAGE_ROOT = path.join(ROOT, "public/image");

/** hash prefix → canonical filename (31 unique assets) */
const CANONICAL_BY_HASH_PREFIX = {
  efe804f53839: "logo.png",
  dd635bee3c2d: "office-exterior.jpg",
  "0cedc2ab2ee0": "home-trust.png",
  a4488893e0da: "office-nameplate.png",
  ebb90884c222: "office-nameplate-horizontal.jpg",
  bd439ee96589: "office-interior.jpg",
  "71791cae9c51": "office-documents.jpg",
  "8c1f69e87142": "office-location-map.png",
  "09a6f2136b44": "location-header-map.png",
  ae0bb069d20a: "office-direction-step-1.png",
  ed66ae4d75b5: "office-direction-step-2.png",
  "0285b4d9633a": "office-parking.png",
  "0c45327b7762": "office-name-badge.png",
  f9e093a818a7: "activity-bar-association-award.jpg",
  f7065d68b872: "activity-youth-budget-advisory.jpg",
  "1f3dd06e76cc": "activity-busan-youth-policy.jpg",
  cbf01b6d1259: "activity-haeundae-policy.jpg",
  e1f6242aa9c4: "activity-peace-unification.jpg",
  "036d35084355": "activity-citizen-jury.jpg",
  c76a5a34ad94: "contact-consultation-hero.jpg",
  "41d8c8644437": "contact-phone-consult.png",
  a1ecd6a3e0f2: "contact-in-person-consult.png",
  a823a89e6ecb: "contact-on-site-consult.png",
  "50d7429b82ec": "press-busan-ilbo-20260608.jpg",
  ebc7887b2e22: "press-kukje-sinmun-20260603.jpg",
  d2961e4b146d: "press-beopryul-sinmun-20260602.png",
  a6d973e4c0f2: "stock-legal-documents.jpg",
  "22ab10b6219a": "stock-legal-consultation.jpg",
  "921a716d1a69": "stock-legal-contract.jpg",
  "6588a67150a5": "stock-legal-office.jpg",
  "7c721a8cf6d8": "stock-legal-courthouse.jpg",
};

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function walkFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function main() {
  if (!fs.existsSync(IMAGE_ROOT)) {
    console.error("[consolidate-images] public/image not found");
    process.exit(1);
  }

  const files = walkFiles(IMAGE_ROOT);
  const hashToSource = new Map();
  const hashToCanonical = new Map();

  for (const file of files) {
    const hash = hashFile(file);
    const prefix = hash.slice(0, 12);
    const canonical = CANONICAL_BY_HASH_PREFIX[prefix];
    if (!canonical) {
      console.error(`[consolidate-images] Unknown file (no canonical name): ${file}`);
      process.exit(1);
    }
    if (!hashToSource.has(hash)) {
      hashToSource.set(hash, file);
      hashToCanonical.set(hash, canonical);
    }
  }

  const staging = path.join(ROOT, ".image-consolidate-staging");
  if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true });
  fs.mkdirSync(staging, { recursive: true });

  for (const [hash, source] of hashToSource) {
    const canonical = hashToCanonical.get(hash);
    const dest = path.join(staging, canonical);
    fs.copyFileSync(source, dest);
    console.log(`[consolidate-images] ${canonical} ← ${path.relative(ROOT, source)}`);
  }

  for (const entry of fs.readdirSync(IMAGE_ROOT, { withFileTypes: true })) {
    const full = path.join(IMAGE_ROOT, entry.name);
    if (entry.isDirectory()) fs.rmSync(full, { recursive: true, force: true });
    else fs.unlinkSync(full);
  }

  for (const file of fs.readdirSync(staging)) {
    fs.renameSync(path.join(staging, file), path.join(IMAGE_ROOT, file));
  }
  fs.rmdirSync(staging);

  const finalCount = fs.readdirSync(IMAGE_ROOT).length;
  console.log(`[consolidate-images] Done — ${finalCount} files in public/image/`);
}

main();
