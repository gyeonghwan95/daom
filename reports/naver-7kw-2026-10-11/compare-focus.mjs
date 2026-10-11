// good0927 vs after19(HEAD 빌드) — 대상 페이지 메타·본문·링크와 사이트 전체 inbound 비교
import fs from "node:fs";
const R = "reports/busan-lawyer-rank-2026-10-10/";
const [a, b] = [process.argv[2] || "good0927", process.argv[3] || "after19"].map((n) => JSON.parse(fs.readFileSync(R + n + ".json", "utf8")));
const FOCUS = ["/", "/부산법무사", "/공탁채권회수", "/부산공탁", "/부산형사공탁", "/공탁자가진단", "/부산상속포기", "/부산상속전문법무사", "/부산상속법무사", "/상속", "/부산상속등기", "/부산한정승인", "/공공기관등기업무", "/partners", "/부산법무사상담", "/contact", "/부산법무사추천"];
const rows = (x) => x.rows || x;
const A = rows(a), B = rows(b);
const inbound = (S) => { const m = {}; for (const [r, v] of Object.entries(S)) for (const h of new Set(v.linkHrefs || [])) if (h !== r) m[h] = (m[h] || 0) + 1; return m; };
const ia = inbound(A), ib = inbound(B);
const out = [];
for (const r of FOCUS) {
  const x = A[r], y = B[r];
  if (!x || !y) { out.push({ r, missing: !x ? "good" : "head" }); continue; }
  const d = { r };
  for (const k of ["title", "description", "canonical", "robots", "inSitemap"]) if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) d[k] = [x[k], y[k]];
  if (JSON.stringify(x.h1) !== JSON.stringify(y.h1)) d.h1 = [x.h1, y.h1];
  d.mainLen = [x.mainLen, y.mainLen];
  d.links = [x.links, y.links];
  const lx = new Set(x.linkHrefs), ly = new Set(y.linkHrefs);
  d.linksLost = [...lx].filter((h) => !ly.has(h));
  d.linksAdded = [...ly].filter((h) => !lx.has(h)).length;
  d.inbound = [ia[r] || 0, ib[r] || 0];
  out.push(d);
}
fs.writeFileSync("reports/naver-7kw-2026-10-11/compare-focus.json", JSON.stringify(out, null, 1));
for (const d of out) console.log(d.r, "| main", d.mainLen?.join("→"), "| links", d.links?.join("→"), "lost", d.linksLost?.length, "| inbound", d.inbound?.join("→"), Object.keys(d).filter((k) => ["title", "description", "canonical", "robots", "inSitemap", "h1", "missing"].includes(k)).join(","));
