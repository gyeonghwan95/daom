// 대상 57개 스펙의 PageData를 바로 생성해 결함 패턴이 남았는지 확인(빌드 없이)
import { buildSeoLandingSpecs } from "../../../src/lib/seo-landing/combinations";
import { buildPageDataFromSeoLanding } from "../../../src/lib/seo-landing/page-data";
const TARGET = new Set(["inheritance-renunciation", "qualified-acceptance", "personal-rehabilitation", "bankruptcy"]);
const BAD = /본등기|등기필|전자등기|잔금|결의일|법인 결의|법인 변경일|부동산·법인 소재지 기준|부동산 소재지·본점|부동산 소재지·법인 본점|법인 본점 주소만|등기원인 문구|계약서·협의서|매매계약서|대출·매매|막히는 권리|법인등기부|등기소·법원 창구|관할\(법원·등기소\)|근저당 유무|상속포기은|개인파산는|한정승인는|개인회생는/;
const specs = buildSeoLandingSpecs().filter((s) => TARGET.has(s.serviceId ?? ""));
const left = new Map<string, Set<string>>();
for (const s of specs) {
  const p = buildPageDataFromSeoLanding(s);
  const texts = [...p.introParagraphs, ...p.procedures, ...p.documents, ...p.consultationPoints, ...p.faqs.map((f) => f.answer), p.consultationExample?.body ?? "", ...p.sections.flatMap((x) => [x.body, ...(x.items ?? [])])];
  for (const t of texts) for (const sent of t.split(/(?<=[.다요])\s+/)) if (BAD.test(sent)) { const k = sent.replace(s.regionLabel ?? "@@", "{지역}"); if (!left.has(k)) left.set(k, new Set()); left.get(k)!.add(s.path); }
}
console.log("specs", specs.length, "remaining distinct", left.size);
for (const [k, v] of left) console.log(v.size, [...v].slice(0, 2).join(" "), "|", k.slice(0, 170));
