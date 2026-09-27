#!/usr/bin/env node
/**
 * NAVER CRITICAL RECOVERY — DOM priority audit for target pages (built out/ HTML).
 *   node scripts/ncr-dom-audit.mjs [--phase=before|after]
 * Writes .cache/naver-critical-recovery/dom-<phase>.json
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const CACHE = path.join(ROOT, ".cache", "naver-critical-recovery");
const phase = (process.argv.find((a) => a.startsWith("--phase=")) || "--phase=before").split("=")[1];
const TARGETS = ["/부산상속전문법무사", "/부산상속포기", "/해운대법무사"];

const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
const strip = (h) =>
  decode(
    h
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const CONSULT_WORDS = ["상담가능", "상담 가능", "바로 상담", "전화", "카카오", "톡톡", "예약", "상담하기", "문의하기"];
const REPEAT = ["3개월", "후순위", "처분", "한정승인", "상담", "전국", "방문", "배우자", "자녀"];
const PHONE_RE = /0\d{1,2}[- .]?\d{3,4}[- .]?\d{4}/g;

const result = {};
for (const t of TARGETS) {
  const html = fs.readFileSync(path.join(OUT, `${t.slice(1)}.html`), "utf8");
  const body = html.slice(html.search(/<body[\s>]/i));
  const h1Idx = body.search(/<h1[\s>]/i);
  const mainIdx = body.search(/<main[\s>]/i);
  const beforeH1Html = body.slice(0, h1Idx);
  const headerEnd = beforeH1Html.search(/<\/header>/i);
  const afterHeaderBeforeH1 = headerEnd >= 0 ? beforeH1Html.slice(headerEnd) : beforeH1Html;
  const beforeH1Text = strip(afterHeaderBeforeH1);
  const main = body.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? body;
  const mainText = strip(main);
  const headings = [...main.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    tag: m[1].toLowerCase(),
    text: strip(m[2]),
    pos: strip(main.slice(0, m.index)).length,
  }));
  const h1Pos = headings.find((h) => h.tag === "h1")?.pos ?? 0;
  const afterH1 = mainText.slice(h1Pos);
  const nationwide = headings.filter((h) => /전국|방문\s*없이|비대면/.test(h.text));
  const counts = Object.fromEntries(REPEAT.map((w) => [w, (afterH1.match(new RegExp(w, "g")) || []).length]));
  const phones = [...new Set((html.match(PHONE_RE) || []).map((p) => p.replace(/[ .]/g, "-")))];
  const imgs = [...main.matchAll(/<img\b[^>]*>/gi)].slice(0, 6).map((m) => ({
    src: decode(m[0].match(/\ssrc="([^"]+)"/)?.[1] ?? "").slice(0, 120),
    alt: decode(m[0].match(/\salt="([^"]*)"/)?.[1] ?? ""),
    beforeH1: m.index < main.search(/<h1[\s>]/i),
  }));
  result[t] = {
    textBeforeH1_afterHeader_chars: beforeH1Text.length,
    textBeforeH1_afterHeader: beforeH1Text.slice(0, 600),
    consultWordsBeforeH1: CONSULT_WORDS.filter((w) => beforeH1Text.includes(w)),
    h1InsideMain: mainIdx >= 0 && mainIdx < h1Idx,
    articleWrapsH1: /<article[\s>]/i.test(body.slice(mainIdx, h1Idx)),
    headings,
    h2Count: headings.filter((h) => h.tag === "h2").length,
    nationwideHeadings: nationwide.map((h) => ({ text: h.text, charsAfterH1: h.pos - h1Pos, h2Index: headings.filter((x) => x.tag === "h2").findIndex((x) => x.text === h.text) })),
    mainChars: mainText.length,
    first700: afterH1.slice(0, 700),
    repeatCounts: counts,
    phones,
    ogImage: decode(html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i)?.[1] ?? ""),
    imagesInMain: imgs,
    loadingPlaceholder: /불러오는 중/.test(strip(body.slice(0, h1Idx))),
  };
  const r = result[t];
  console.log(`\n== ${t}`);
  console.log(` textBeforeH1(after header)=${r.textBeforeH1_afterHeader_chars} consult=${r.consultWordsBeforeH1.join(",") || "-"} h1InMain=${r.h1InsideMain} article=${r.articleWrapsH1} h2=${r.h2Count} main=${r.mainChars}`);
  console.log(` before-H1 text: ${r.textBeforeH1_afterHeader.slice(0, 300)}`);
  console.log(` nationwide: ${JSON.stringify(r.nationwideHeadings)}`);
  console.log(` repeats: ${JSON.stringify(r.repeatCounts)}`);
  console.log(` phones: ${r.phones.join(" ")}  og: ${r.ogImage.slice(-80)}`);
  console.log(` headings:\n   ${r.headings.map((h) => `${h.tag}@${h.pos - h1Pos}: ${h.text.slice(0, 60)}`).join("\n   ")}`);
}
fs.mkdirSync(CACHE, { recursive: true });
fs.writeFileSync(path.join(CACHE, `dom-${phase}.json`), `${JSON.stringify(result, null, 2)}\n`);
