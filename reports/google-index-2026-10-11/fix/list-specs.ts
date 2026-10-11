// seo-landing 스펙을 명시적 serviceId로 집계 → specs.json (경로 문자열로 업무를 추정하지 않는다)
import fs from "node:fs";
import { buildSeoLandingSpecs } from "../../../src/lib/seo-landing/combinations";
const fn = buildSeoLandingSpecs;
const specs = fn();
const by: Record<string, number> = {};
for (const s of specs) by[s.serviceId ?? "(none)"] = (by[s.serviceId ?? "(none)"] ?? 0) + 1;
console.log("specs", specs.length, by);
fs.writeFileSync(new URL("./specs.json", import.meta.url), JSON.stringify(specs.map((s: any) => ({ path: s.path, type: s.type, serviceId: s.serviceId ?? null, intentId: s.intentId ?? null, institutionId: s.institutionId ?? null, regionLabel: s.regionLabel ?? null }))));
