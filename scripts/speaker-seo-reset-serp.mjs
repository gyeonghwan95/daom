#!/usr/bin/env node
/**
 * SPEAKER SEO RESET — light live SERP pattern check (one request per P0 keyword, no bypass).
 * Records only result-type composition and whether this site appears; no competitor copy is stored.
 *   node scripts/speaker-seo-reset-serp.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TARGET_KEYWORDS, groupUrl } from "./speaker-seo-reset-keywords.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache", "speaker-seo-reset");
const OWN = /xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr/i;
const SKIP_HOST =
  /^(search|help|nid|policy|www|m|keep|mkt|adcr|searchad|ader|terms|nam|lcs|ssl|gw\.in|talk|smartplace|map|pay|shopping|news|n)\.naver\.com$|^naver\.com$|pstatic\.net$|naver\.me$/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function category(host) {
  if (/blog\.naver\.com/.test(host)) return "blog";
  if (/cafe\.naver\.com/.test(host)) return "cafe";
  if (/in\.naver\.com|post\.naver\.com/.test(host)) return "influencer/post";
  if (/kin\.naver\.com/.test(host)) return "kin";
  if (/youtube\.com|youtu\.be|tv\.naver\.com/.test(host)) return "video";
  if (/\.go\.kr$/.test(host)) return "public(.go.kr)";
  if (/\.ac\.kr$/.test(host)) return "university(.ac.kr)";
  if (/\.(or|re)\.kr$/.test(host)) return "org(.or.kr)";
  if (/\.(hs|ms|es|sc)\.kr$/.test(host)) return "school";
  if (OWN.test(host)) return "own";
  return "web";
}

const p0 = TARGET_KEYWORDS.filter(([, , pr]) => pr === "P0");
const rows = [];
for (const [keyword, group] of p0) {
  const url = `https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(keyword)}`;
  let status = 0;
  let html = "";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
    });
    status = res.status;
    html = await res.text();
  } catch (e) {
    status = -1;
  }
  const blocked = status !== 200 || html.length < 20000 || /비정상적인 접근|자동입력 방지/.test(html);
  const hosts = [];
  let ownRank = null;
  let ownUrl = "";
  if (!blocked) {
    const seen = new Set();
    for (const m of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)) {
      let u;
      try {
        u = new URL(m[1].replace(/&amp;/g, "&"));
      } catch {
        continue;
      }
      const host = u.hostname;
      if (SKIP_HOST.test(host)) continue;
      const key = `${host}${u.pathname}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hosts.push(host);
      if (ownRank == null && OWN.test(host)) {
        ownRank = hosts.length;
        try {
          ownUrl = decodeURIComponent(u.pathname);
        } catch {
          ownUrl = u.pathname;
        }
      }
      if (hosts.length >= 40) break;
    }
  }
  const mix = {};
  for (const h of hosts.slice(0, 20)) mix[category(h)] = (mix[category(h)] || 0) + 1;
  rows.push({
    keyword,
    group,
    targetUrl: groupUrl(group),
    status: blocked ? "BLOCKED_OR_EMPTY" : "OK",
    httpStatus: status,
    ownRankAmongTop40Links: ownRank,
    ownUrl,
    ownIsTarget: ownUrl ? ownUrl.replace(/\/$/, "") === groupUrl(group) : false,
    top20Mix: mix,
    checkedAt: new Date().toISOString(),
  });
  console.log(`${keyword}\t${blocked ? "BLOCKED" : "OK"}\town=${ownRank ?? "-"} ${ownUrl}\t${JSON.stringify(mix)}`);
  if (blocked) break;
  await sleep(2500);
}
fs.mkdirSync(CACHE, { recursive: true });
fs.writeFileSync(path.join(CACHE, "serp.json"), `${JSON.stringify(rows, null, 2)}\n`);
