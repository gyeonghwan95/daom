/**
 * 빌드 전 검사 — 의뢰 전 준비자료 원본과 정적 자산(PNG·PDF·OG)이 같은 버전인지 확인한다.
 *   npx tsx scripts/validate-resource-assets.ts
 * 실패하면 `npx tsx scripts/generate-resource-assets.ts`로 다시 만든다.
 */
import fs from "node:fs";
import path from "node:path";
import { RESOURCE_GUIDES, RESOURCE_VERSION } from "../src/data/resources/guides";
import { computeResourceContentHash, resourceAssetPaths } from "../src/lib/resources/asset-hash";

const ROOT = path.join(__dirname, "..");
const errors: string[] = [];
const manifestPath = path.join(ROOT, "src/data/resources/assets-manifest.json");

function pngSize(file: string): [number, number] {
  const b = fs.readFileSync(file);
  if (b.toString("ascii", 1, 4) !== "PNG") return [0, 0];
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

if (!fs.existsSync(manifestPath)) {
  errors.push("assets-manifest.json 없음");
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    version: string;
    contentHash: string;
    guides: Record<string, { pdfPages: number }>;
  };
  if (manifest.version !== RESOURCE_VERSION) errors.push(`매니페스트 버전 ${manifest.version} ≠ 원본 ${RESOURCE_VERSION}`);
  const hash = computeResourceContentHash(ROOT);
  if (manifest.contentHash !== hash) errors.push(`원본·조판이 바뀌었는데 자산을 다시 만들지 않음 (manifest ${manifest.contentHash} ≠ ${hash})`);

  const slugs = new Set<string>();
  for (const g of RESOURCE_GUIDES) {
    if (slugs.has(g.slug)) errors.push(`slug 중복 ${g.slug}`);
    slugs.add(g.slug);
    if (g.checks.length < 5 || g.checks.length > 6) errors.push(`${g.slug}: 확인사항은 5~6개`);
    if (!g.sources.length) errors.push(`${g.slug}: 공식 근거 없음`);
    if (!g.reviewConditions.length || !g.officeTasks.length || !g.inquiry.facts.length) errors.push(`${g.slug}: 검토 조건·맡는 일·문의 사실 누락`);
    if (!manifest.guides[g.slug]) errors.push(`${g.slug}: 매니페스트 항목 없음`);
    const p = resourceAssetPaths(g.slug);
    const png = path.join(ROOT, "public", p.png);
    const og = path.join(ROOT, "public", p.og);
    const pdf = path.join(ROOT, "public", p.pdf);
    for (const f of [png, og, pdf]) if (!fs.existsSync(f)) errors.push(`파일 없음 ${path.relative(ROOT, f)}`);
    if (fs.existsSync(png) && pngSize(png).join("x") !== "1080x1440") errors.push(`${g.slug} PNG 크기 ${pngSize(png).join("x")}`);
    if (fs.existsSync(og) && pngSize(og).join("x") !== "1200x630") errors.push(`${g.slug} OG 크기 ${pngSize(og).join("x")}`);
    if (fs.existsSync(pdf)) {
      const raw = fs.readFileSync(pdf).toString("latin1");
      if (!raw.startsWith("%PDF")) errors.push(`${g.slug} PDF 형식 오류`);
      if (!/\/FontFile2|\/FontFile3/.test(raw)) errors.push(`${g.slug} PDF 글꼴 임베딩 없음`);
      if (!/\/URI\s*\(/.test(raw)) errors.push(`${g.slug} PDF 링크 없음`);
    }
  }
}

if (errors.length) {
  console.error(`[validate-resource-assets] ${errors.length}건\n - ${errors.join("\n - ")}\n→ npx tsx scripts/generate-resource-assets.ts`);
  process.exit(1);
}
console.log(`[validate-resource-assets] OK — ${RESOURCE_GUIDES.length}종 v${RESOURCE_VERSION}`);
