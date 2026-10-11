/**
 * 준비자료 원본·조판이 바뀌었는지 판정하는 해시와 자산 경로 규칙.
 * 생성기(scripts/generate-resource-assets.ts)와 빌드 전 검사(scripts/validate-resource-assets.ts)가 함께 쓴다.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { RESOURCE_GUIDES, RESOURCE_VERIFIED_ON, RESOURCE_VERSION } from "@/data/resources/guides";
import { getContactInfo } from "@/lib/contact";

export { resourceAssetPaths } from "@/lib/resources/asset-paths";

export function computeResourceContentHash(root = process.cwd()): string {
  const template = ["src/lib/resources/print-html.ts", "src/lib/resources/urls.ts"]
    .map((f) => fs.readFileSync(path.join(root, f), "utf8").replace(/\r\n/g, "\n"))
    .join("\n");
  const payload = JSON.stringify({
    guides: RESOURCE_GUIDES,
    version: RESOURCE_VERSION,
    verifiedOn: RESOURCE_VERIFIED_ON,
    phone: getContactInfo().phone,
    template,
  });
  return crypto.createHash("sha1").update(payload).digest("hex").slice(0, 16);
}
