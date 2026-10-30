import fs from "node:fs";
import { boots } from "./serp-boot.mjs";
const DIR = decodeURIComponent(new URL(".", import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1");
const queries = JSON.parse(fs.readFileSync(DIR + "queries.json", "utf8")).map((q) => q.query);
const clean = (s) => (s || "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/\s+/g, " ").trim();
const short = (u) => { if (!u) return ""; let x = u.replace(/\?art=.*$/, "").replace(/[?&](kinsrch_src|qb)=[^&#]*/g, ""); try { x = decodeURI(x); } catch {} return x.replace(/^https?:\/\//, "").replace(/xn--2j1br1na42lvxja38mk8r\.kr/, "[OURS]").slice(0, 110); };
const dateOf = (o) => { const m = JSON.stringify(o).match(/"(createdDate|dateText|date|time_str|dateInfo)":"([^"]+)"/); return m ? m[2] : ""; };
const authorOf = (o) => clean(o.sourceProfile?.title || o.profile?.title || o.author || o.sourceName || "");
const mode = process.argv[2] || "pc";
const only = process.argv[3] ? Number(process.argv[3]) : null;
const out = [];
queries.forEach((q, idx) => {
  const n = idx + 1;
  if (only && n !== only) return;
  const h = fs.readFileSync(`${DIR}serp/${mode}-${n}.html`, "utf8");
  const L = [];
  L.push(`\n######## ${mode}-${n} 「${q}」`);
  const placeIdx = h.indexOf("플레이스</h2>") >= 0 ? h.indexOf("플레이스</h2>") : h.search(/<h2 class="title">플레이스/);
  const powerlinkIdx = h.indexOf("파워링크");
  const bs = boots(h);
  let rank = 0, placed = false;
  for (const b of bs) {
    if (b.err) continue;
    const o = b.obj, area = o.meta?.area || "", ss = o.meta?.ssuid || "", bid = (o.refs?.blockId || "").split("/")[0];
    if (!placed && placeIdx > 0 && b.pos > placeIdx) { L.push(`  [PLACE 블록 위치: 여기 직전]`); placed = true; }
    if (bid === "ai-briefing") {
      const p = o.body?.props || {};
      const md = p.summary?.markdown || "";
      const first = clean(md.split("\n")[0].replace(/<template[^>]*><\/template>/g, ""));
      const heads = [...md.matchAll(/^### (.+)$/gm)].map((m) => m[1]).join(" / ");
      L.push(`  [AI브리핑] 첫문장: ${first.slice(0, 220)}`);
      L.push(`     소제목: ${heads}`);
      const copy = p.summary?.copy || "";
      const srcs = [...copy.matchAll(/^\[(\d+)\] (.*?), (https?:\/\/\S+)$/gm)].map((m) => `#${m[1]} ${m[2]} ${short(m[3])}`);

      (p.sources || []).forEach((s) => L.push(`       - src(${s.footnoteSourceIndex}) [${s.platform}] ${clean(s.title).slice(0,50)} | ${short(s.url).slice(0,70)} | ${s.dateText || ""}`));
      // which sentences cite ours
      if (/xn--2j1br1na42lvxja38mk8r|law-yoon-91/.test(JSON.stringify(p))) L.push(`     ★ 우리 사이트/블로그 인용 있음`);
      continue;
    }
    if (bid === "related-questions") {
      const qs = o.body?.props?.children?.find((c) => c.props?.questions)?.props?.questions || [];
      L.push(`  [관련질문]`);
      qs.forEach((x, i) => {
        const md = x.answer?.markdown || "";
        L.push(`     Q${i + 1} ${clean(x.title)} → ${clean(md.split("\n")[0].replace(/<template[^>]*><\/template>/g, "")).slice(0, 160)}`);
        (x.answer?.sources || []).forEach((s) => L.push(`        · ${clean(s.sourceName)} | ${clean(s.title).slice(0,50)} | ${short(s.url).slice(0,70)}`));
      });
      continue;
    }
    if (bid === "aipick") { L.push(`  [AI픽: ${clean(o.body?.props?.children?.[0]?.props?.title || "")} 메이트 프로필]`); continue; }
    if (bid === "clip") { L.push(`  [클립]`); continue; }
    if (bid === "image") { L.push(`  [이미지]`); continue; }
    if (bid === "qra") { L.push(`  [qra: ${o.body?.props?.header?.title || ""}]`); continue; }
    if (area === "ugB_pkR") { L.push(`  [브랜드콘텐츠(광고)]`); continue; }
    const items = o.data?.state?.items || [];
    for (const it of items) {
      rank++; if (rank > (Number(process.env.MAXR)||99) && !/xn--2j1br1na42lvxja38mk8r|law-yoon-91/.test(it.href||it.titleHref||"")) continue;
      const title = clean(it.title || it.questionTitle);
      const url = it.href || it.titleHref || it.questionHref || it.url || "";
      const body = clean(it.bodyText || it.content || it.answer || it.questionContent || "").slice(0, Number(process.env.BODY ?? 140));
      const tag = /xn--2j1br1na42lvxja38mk8r/.test(url) ? " ★OURS" : /law-yoon-91/.test(url) ? " ★BLOG" : "";
      L.push(`  ${area}#${rank} [${ss}] ${title.slice(0,70)} | ${short(url).slice(0,80)} | ${authorOf(it)} | ${dateOf(it)}${tag}` + (body ? `\n        ↳ ${body}` : ""));
    }
    if (ss === "video" && !items.length) L.push(`  [video]`);
  }
  L.push(`  (통합 결과 항목 총 ${rank}개)`);
  out.push(L.join("\n"));
});
const txt = out.join("\n");
fs.writeFileSync(`serp-${mode}${only ? "-" + only : ""}.txt`, txt);
console.log(txt.length);
