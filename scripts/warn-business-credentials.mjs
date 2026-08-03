#!/usr/bin/env node
/**
 * 기업확인서 검증·만료 경고 (공개 UI 없음).
 * verificationRequired 이거나 만료 임박 시 stderr에 남긴다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/business-credentials.ts");

const source = fs.readFileSync(DATA, "utf8");
const asOf =
  process.env.CREDENTIALS_AS_OF?.trim() ||
  new Date().toISOString().slice(0, 10);

const blockRe =
  /\{\s*id:\s*"([^"]+)"[\s\S]*?officialName:\s*"([^"]+)"[\s\S]*?validUntil:\s*(null|"[^"]*")[\s\S]*?verified:\s*(true|false)[\s\S]*?enabled:\s*(true|false)[\s\S]*?verificationRequired:\s*(true|false)/g;

let match;
let warnings = 0;

while ((match = blockRe.exec(source)) !== null) {
  const [, id, name, validUntilRaw, verified, enabled, required] = match;
  if (required === "true" && (verified === "false" || enabled === "false")) {
    console.warn(
      `[business-credentials] 검증 보류 · 공개 미노출: ${name} (${id})`,
    );
    warnings += 1;
  }
  if (
    verified === "true" &&
    enabled === "true" &&
    validUntilRaw &&
    validUntilRaw !== "null"
  ) {
    const until = validUntilRaw.replace(/"/g, "");
    const days =
      (Date.parse(until) - Date.parse(asOf)) / (24 * 60 * 60 * 1000);
    if (Number.isFinite(days) && days < 0) {
      console.warn(
        `[business-credentials] 만료 · 공개 제외 대상: ${name} validUntil=${until}`,
      );
      warnings += 1;
    } else if (Number.isFinite(days) && days <= 30) {
      console.warn(
        `[business-credentials] 만료 임박(≤30일): ${name} validUntil=${until} (asOf=${asOf})`,
      );
      warnings += 1;
    }
  }
}

if (warnings === 0) {
  console.log("[business-credentials] OK — 경고 없음");
} else {
  console.log(
    `[business-credentials] 경고 ${warnings}건 (공개 노출은 enabled·verified·유효기간 게이트로 차단)`,
  );
}
