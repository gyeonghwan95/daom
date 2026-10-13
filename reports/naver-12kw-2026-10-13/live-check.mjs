#!/usr/bin/env node
/** 운영 응답 점검: 상태·최종 URL·X-Robots-Tag·캐시·title·canonical·robots·H1. 결과는 live-<name>.json */
import fs from "node:fs";
import path from "node:path";
import { parsePage } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";
const UA = process.env.UA || "Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)";
const name = process.argv[2] || "before";
const paths = JSON.parse(fs.readFileSync(path.join(DIR, "check-paths.json"), "utf8"));
const rows = [];
for (const p of paths) {
  const url = ORIGIN + encodeURI(p);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
    const html = res.headers.get("content-type")?.includes("html") ? await res.text() : "";
    const meta = html ? parsePage(html) : null;
    rows.push({
      path: p,
      status: res.status,
      finalUrl: decodeURI(res.url.replace(ORIGIN, "")),
      xRobots: res.headers.get("x-robots-tag"),
      cache: res.headers.get("cf-cache-status"),
      type: res.headers.get("content-type"),
      title: meta?.title,
      canonical: meta?.canonical ? decodeURI(meta.canonical.replace(ORIGIN, "")) : null,
      robots: meta?.robots,
      h1: meta?.h1s,
      mainLen: meta?.mainText.length,
    });
  } catch (e) {
    rows.push({ path: p, error: String(e.message) });
  }
}
fs.writeFileSync(path.join(DIR, `live-${name}.json`), JSON.stringify(rows, null, 1));
for (const r of rows) console.log(r.status ?? "ERR", r.path, r.finalUrl !== r.path ? `-> ${r.finalUrl}` : "", r.xRobots ?? "", r.robots ?? "", r.canonical === r.path ? "" : `canon=${r.canonical}`);
