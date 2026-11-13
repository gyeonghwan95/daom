#!/usr/bin/env node
/**
 * 핵심 검색어 1위 목표 점검 — 네이버 모바일 통합검색에서 지금 위치를 재고, 1위와의 차이를 보여 준다.
 *
 * 이 스크립트는 순위를 올리지도, 1위를 약속하지도 않는다(검색 순위는 네이버가 정한다).
 * 대신 매주 같은 방법으로 재서 아래를 한눈에 보이게 한다.
 *   - 우리 사이트 카드가 몇 번째인지(10위 밖이면 "-")
 *   - 네이버가 고른 우리 문서가 담당 페이지(seo/keyword-map.json owner)와 같은지 → 다르면 "의도 불일치"
 *   - 지금 1위가 누구인지(플레이스·블로그·카페·사이트)
 *
 *   node scripts/naver-rank/goal-check.mjs                      # scripts/naver-rank/goal-keywords.txt
 *   node scripts/naver-rank/goal-check.mjs "부산 상속 법무사"    # 지정한 키워드만
 *   GOAL_KW_FILE=목록.txt node scripts/naver-rank/goal-check.mjs   # 다른 키워드 파일
 *
 * 결과: reports/naver-rank/goal-YYYY-MM-DD.json
 * 네이버는 짧은 시간에 요청이 많으면(약 110회) 차단하므로 한 번에 80개 이하, 키워드당 2~4초 간격으로 보낸다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
const keywords = args.length
  ? args
  : fs
      .readFileSync(process.env.GOAL_KW_FILE || path.join(ROOT, "scripts/naver-rank/goal-keywords.txt"), "utf8")
      .split(/\r?\n/)
      .map((s) => s.replace(/#.*/, "").trim())
      .filter(Boolean);
if (keywords.length > 80) {
  console.error("한 번에 80개 이하로 나눠 실행하세요(네이버 차단 방지).");
  process.exit(1);
}
const owners = JSON.parse(fs.readFileSync(path.join(ROOT, "seo/keyword-map.json"), "utf8")).queries;

const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const SITE_HOST = /xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr/i;
const BLOG = /blog\.naver\.com\/law-yoon-91/i;
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
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
  try {
    h = new URL(decode(u)).hostname;
  } catch {
    return false;
  }
  if (/(^|\.)naver\.(com|net)$|pstatic\.net$/.test(h)) return /^(m\.)?(blog|cafe|post|kin|in|place)\.naver\.com$/.test(h);
  return !/ader\.naver|adcr\.naver|searchad/.test(h);
}

const kind = (key) =>
  /^place\.naver/.test(key) ? "플레이스" : /^blog\.naver|^in\.naver/.test(key) ? "블로그" : /^cafe\.naver/.test(key) ? "카페" : /^kin\.naver/.test(key) ? "지식iN" : "사이트";

async function checkOne(q) {
  const res = await fetch(`https://m.search.naver.com/search.naver?query=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9", Accept: "text/html" },
  });
  const html = await res.text();
  if (/이용이 제한/.test(html)) throw new Error("네이버가 요청을 잠시 제한했습니다. 1시간 뒤 다시 실행하세요.");
  const cards = [];
  const seen = new Set();
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]{0,600}?)<\/a>/g)) {
    const href = decode(m[1]);
    if (!wanted(href) || /\/ad\//.test(href)) continue;
    const key = normalize(href);
    if (seen.has(key)) continue;
    const group = /^(blog|cafe)\.naver\.com\//.test(key) ? key.split("/").slice(0, 2).join("/") : key.split("/")[0];
    const prev = cards.find((c) => c.group === group);
    if (prev) {
      seen.add(key);
      prev.subs.push(key);
      continue;
    }
    const title = strip(m[2]).slice(0, 80);
    if (title.length < 4) continue;
    seen.add(key);
    cards.push({ rank: cards.length + 1, key, title, group, subs: [] });
  }
  const mine = cards.find((c) => SITE_HOST.test(c.key));
  const blog = cards.find((c) => BLOG.test(`https://${c.key}`));
  const pages = mine
    ? [...new Set([mine.key, ...mine.subs].map((s) => s.replace(/^[^/]*/, "") || "/"))].map((p) => {
        try {
          return decodeURIComponent(p);
        } catch {
          return p;
        }
      })
    : [];
  // 카드의 첫 링크는 사이트 대표(/)다. 홈이 고른 문서이면 사이트링크(/about·/services 등)가 여럿 붙고,
  // 하위 문서가 고른 문서이면 / 다음에 그 문서 하나가 붙는다.
  const HOME_SITELINKS = new Set(["/about", "/services", "/resources", "/상속", "/부산부동산등기", "/부산법인등기"]);
  const subs = pages.filter((p) => p !== "/");
  const homeCard = subs.filter((p) => HOME_SITELINKS.has(p)).length >= 2;
  const chosen = !pages.length ? null : homeCard || !subs.length ? "/" : subs[0];
  const owner = owners[q]?.owner ?? null;
  const firstNonPlace = cards.find((c) => kind(c.key) !== "플레이스");
  return {
    keyword: q,
    siteRank: mine?.rank ?? null,
    chosen,
    owner,
    intentMatch: chosen && owner ? chosen === owner : null,
    blogRank: blog?.rank ?? null,
    top1: cards[0] ? `${kind(cards[0].key)} ${cards[0].key}` : null,
    topNonPlace: firstNonPlace ? `${kind(firstNonPlace.key)} ${firstNonPlace.key} | ${firstNonPlace.title.slice(0, 30)}` : null,
    top: cards.slice(0, 10).map((c) => `${c.rank}. [${kind(c.key)}] ${c.key} | ${c.title.slice(0, 40)}`),
  };
}

const results = [];
for (const q of keywords) {
  try {
    const r = await checkOne(q);
    results.push(r);
    const intent = r.intentMatch === false ? `의도 불일치(담당 ${r.owner})` : r.intentMatch ? "담당 일치" : "";
    console.log(
      `${q.padEnd(18)} ${r.siteRank ? `${String(r.siteRank).padStart(2)}위` : " 밖 "}  ${(r.chosen ?? "").padEnd(16)} ${intent}  | 1위 ${r.top1 ?? "-"}`,
    );
  } catch (e) {
    console.log(`${q}  오류: ${e.message}`);
    if (/제한/.test(e.message)) break;
  }
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
}

const dir = path.join(ROOT, "reports/naver-rank");
fs.mkdirSync(dir, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const file = path.join(dir, `goal-${today}${process.env.GOAL_TAG ? "-" + process.env.GOAL_TAG : ""}.json`);
fs.writeFileSync(file, JSON.stringify({ date: today, results }, null, 1));
const first = results.filter((r) => r.siteRank === 1).length;
const mismatch = results.filter((r) => r.intentMatch === false).length;
console.log(`\n1위 ${first}/${results.length} · 10위 밖 ${results.filter((r) => !r.siteRank).length} · 의도 불일치 ${mismatch}`);
console.log(`저장: ${path.relative(ROOT, file)}`);
