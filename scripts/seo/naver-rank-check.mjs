#!/usr/bin/env node
/**
 * 네이버 모바일 통합검색에서 키워드별 사이트·블로그 순위를 조회한다(PC 검색은 스크립트 접근을 막는다).
 * 순위를 올려 주는 도구가 아니라 "지금 어디에 있는지"를 재는 측정 도구다. 배포 2~3주 뒤 같은 명령으로 다시 재서 비교한다.
 *
 *   node scripts/seo/naver-rank-check.mjs                 # scripts/seo/keywords.json 전체
 *   node scripts/seo/naver-rank-check.mjs "부산 법무사"   # 지정한 키워드만
 *
 * 결과: reports/naver-rank/latest.json, reports/naver-rank/YYYY-MM-DD.json (날짜별 기록)
 * 같은 사이트의 링크는 한 카드로 묶고, 카드의 대표 주소와 하위 링크를 구분해 기록한다.
 * 요청은 키워드당 1.5~3초 간격으로 천천히 보낸다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.join(HERE, "..", "..", "reports", "naver-rank");
const argv = process.argv.slice(2);
const keywords = argv.length ? argv : JSON.parse(fs.readFileSync(path.join(HERE, "keywords.json"), "utf8")).flatMap((g) => g.keywords);

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const SITE_HOST = /xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr/i;
const BLOG = /blog\.naver\.com\/law-yoon-91/i;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const strip = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function normalize(u) {
  try {
    const x = new URL(decode(u));
    if (/(^|\.)blog\.naver\.com$/.test(x.hostname)) {
      const parts = x.pathname.split("/").filter(Boolean);
      const id = x.searchParams.get("blogId") || parts[0];
      const no = x.searchParams.get("logNo") || parts[1];
      return `blog.naver.com/${id}${no ? "/" + no : ""}`;
    }
    if (/(^|\.)cafe\.naver\.com$/.test(x.hostname)) return `cafe.naver.com${x.pathname}`;
    return `${x.hostname.replace(/^(m|www)\./, "")}${decodeURIComponent(x.pathname).replace(/\/$/, "")}`;
  } catch {
    return u;
  }
}

function wanted(u) {
  if (!/^https?:\/\//.test(u)) return false;
  let h = "";
  try { h = new URL(decode(u)).hostname; } catch { return false; }
  if (/(^|\.)naver\.(com|net)$|pstatic\.net$/.test(h)) return /^(m\.)?(blog|cafe|post|kin|in|place)\.naver\.com$/.test(h);
  return !/ader\.naver|adcr\.naver|searchad/.test(h);
}

async function checkOne(q) {
  const res = await fetch(`https://m.search.naver.com/search.naver?query=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9", Accept: "text/html" },
  });
  const html = await res.text();
  const cards = [];
  const seen = new Set();
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]{0,600}?)<\/a>/g)) {
    const href = decode(m[1]);
    if (!wanted(href) || /\/ad\//.test(href)) continue;
    const key = normalize(href);
    if (seen.has(key)) continue;
    const group = /^(blog|cafe)\.naver\.com\//.test(key) ? key.split("/").slice(0, 2).join("/") : key.split("/")[0];
    const prev = cards.find((c) => c.group === group);
    if (prev) { seen.add(key); prev.subs.push(key); continue; }
    const title = strip(m[2]).slice(0, 80);
    if (title.length < 4) continue;
    seen.add(key);
    cards.push({ rank: cards.length + 1, key, title, group, subs: [] });
  }
  const mine = cards.find((c) => SITE_HOST.test(c.key));
  const blog = cards.find((c) => BLOG.test(`https://${c.key}`));
  const pages = mine ? [...new Set(mine.subs.map((s) => s.replace(/^[^/]*/, "") || "/"))] : [];
  return {
    keyword: q,
    status: res.status,
    cards: cards.length,
    siteRank: mine?.rank ?? null,
    sitePages: pages.map((p) => { try { return decodeURIComponent(p); } catch { return p; } }),
    blogRank: blog?.rank ?? null,
    top3: cards.slice(0, 3).map((c) => `${c.rank}. ${c.key}`),
  };
}

const results = [];
for (const q of keywords) {
  try {
    const r = await checkOne(q);
    results.push(r);
    console.log(`${q.padEnd(24)} 사이트 ${String(r.siteRank ?? "-").padStart(2)}위 ${r.sitePages.slice(0, 2).join(",")}  블로그 ${r.blogRank ?? "-"}위  (1위: ${r.top3[0] ?? "-"})`);
  } catch (e) {
    console.log(`${q}  오류: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));
}

fs.mkdirSync(REPORT_DIR, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const payload = JSON.stringify({ date: today, results }, null, 1);
fs.writeFileSync(path.join(REPORT_DIR, "latest.json"), payload);
fs.writeFileSync(path.join(REPORT_DIR, `${today}.json`), payload);
console.log(`\n저장: reports/naver-rank/latest.json, ${today}.json`);
