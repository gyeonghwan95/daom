#!/usr/bin/env node
/** 기준표(baseline/after) + 운영 응답 + 네이버 관측을 묶어 seo-facts.json 생성. 관측하지 않은 값은 null/unknowns로 남긴다. */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const snap = process.argv[2] || "baseline";
const S = JSON.parse(fs.readFileSync(path.join(DIR, `${snap}.json`), "utf8"));
const live = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(DIR, "live-before.json"), "utf8")).map((r) => [r.path, r]));
const obs = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(DIR, "naver-observe-before.json"), "utf8")).map((r) => [r.query, r]));
const owners = JSON.parse(fs.readFileSync(path.join(DIR, "owners.json"), "utf8"));

const inbound = {};
for (const [r, row] of Object.entries(S)) {
  if (/noindex/.test(row.robots || "")) continue;
  for (const h of row.linkHrefs) (inbound[h] ??= new Set()).add(r);
}
const facts = owners.map((o) => {
  const row = S[o.owner];
  const inb = inbound[o.owner] || new Set();
  const n = obs[o.query];
  return {
    query: o.query,
    set: o.set,
    route: o.owner,
    source: o.source,
    title: row?.title ?? null,
    h1: row?.h1 ?? null,
    canonical: row?.canonical ?? null,
    robots: row?.robots ?? null,
    inSitemap: row?.inSitemap ?? null,
    response: live[o.owner] ? { status: live[o.owner].status, xRobots: live[o.owner].xRobots, cache: live[o.owner].cache } : null,
    inboundIndexable: inb.size,
    linkedFrom: ["/", "/services", "/부산법무사", "/부산상속법무사", "/상속"].filter((p) => inb.has(p)),
    naverObserved: n ? { atKST: n.observedAtKST, ourDomainOrder: n.ourDomainOrder, ourUrl: n.ourUrl } : null,
    evidence: o.evidence,
    unknowns: [
      "네이버 서치어드바이저 색인·유입 자료 미제공",
      ...(n?.ourDomainOrder ? [] : ["비로그인 PC 1회 관측에서 본 도메인 미검출(순위 아님)"]),
      ...(o.unknowns || []),
    ],
  };
});
fs.writeFileSync(path.join(DIR, "seo-facts.json"), JSON.stringify(facts, null, 1));
for (const f of facts) console.log(f.set, f.query, "→", f.route, f.response?.status ?? "-", f.robots, "inb", f.inboundIndexable, "from", f.linkedFrom.join(",") || "-", "| naver", f.naverObserved?.ourUrl ?? "-");
