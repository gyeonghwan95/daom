#!/usr/bin/env node
/**
 * 검색엔진에 알리는 이미지(구조화 데이터 image·og:image)의 내용 해시 목록을 만든다.
 *
 * 왜: 캐러셀·대표 이미지를 새로 만들 때 같은 파일 이름에 덮어써 왔다. 네이버는 이미지를 주소 단위로
 * 저장하므로 주소가 같으면 페이지를 다시 수집해도 예전 썸네일을 계속 보여 줬다(2026-11-14 캡처 확인).
 * 주소 뒤에 ?v=내용해시를 붙여, 이미지가 바뀌면 주소도 바뀌게 한다. 안 바뀐 이미지는 주소가 그대로다.
 *
 * 출력: src/generated/asset-versions.json  { "/images/generated/carousel/hooks/부산공탁.webp": "1a2b3c4d", ... }
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "src/generated/asset-versions.json");
// 검색결과 썸네일·캐러셀·OG로 쓰이는 폴더(빌드 변형 /_img 는 페이지 안 이미지 전용이라 제외)
const DIRS = ["images", "generated", "image", "resources/og", "qrCode"];
const EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

const versions = {};
function walk(dir, only = EXT) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, only);
    else if (only.test(entry.name)) {
      const rel = "/" + path.relative(PUBLIC, full).split(path.sep).join("/");
      const hash = crypto.createHash("sha1").update(fs.readFileSync(full)).digest("hex").slice(0, 8);
      versions[rel.normalize("NFC")] = hash;
    }
  }
}
for (const d of DIRS) walk(path.join(PUBLIC, d));
// 빌드 변형 중 OG 공유용(*.og.jpg)만 — og:image가 이 파일을 가리키는 경우가 있다
walk(path.join(PUBLIC, "_img"), /\.og\.(jpe?g|png|webp)$/i);

const sorted = Object.fromEntries(Object.entries(versions).sort(([a], [b]) => a.localeCompare(b)));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(sorted) + "\n", "utf8");
console.log(`[asset-versions] ${Object.keys(sorted).length} images → src/generated/asset-versions.json`);
