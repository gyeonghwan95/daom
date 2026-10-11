#!/usr/bin/env node
/**
 * 네이버 보호용 기준선 스냅샷 — out/(정적 export) 전체 HTML에서 보호 필드를 기계적으로 모은다.
 *   node reports/google-index-2026-10-11/protect/protect-snapshot.mjs save <name>
 *   node reports/google-index-2026-10-11/protect/protect-snapshot.mjs diff <a> <b> [allowed-paths.txt]
 *
 * 보호 필드: title, description, H1, canonical, meta robots, OG 제목·설명·이미지, naver 인증 메타,
 *   JSON-LD @id/url 목록, 페이지 전체 a[href]+앵커 텍스트, CTA 링크(tel·카카오·톡톡·/contact)
 * 본문: <main>의 텍스트(스크립트·RSC 제외)를 정규화한 해시와 문장 목록(diff 시 바뀐 문장 보고용).
 * 사이트 리소스: /sitemap.xml·/sitemaps/*.xml의 loc 집합(lastmod 제외), rss.xml, robots.txt, _headers, _redirects 해시.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../../..");
const OUT = path.join(ROOT, "out");
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const meta = (head, attr, key) => {
  const re = new RegExp(`<meta[^>]+${attr}="${key}"[^>]*>`, "i");
  const tag = (head.match(re) || [""])[0];
  return decode((tag.match(/content="([^"]*)"/) || [])[1] || "");
};

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith("_")) walk(f, acc);
    } else if (e.name.endsWith(".html")) acc.push(f);
  }
  return acc;
}

function routeOf(file) {
  let r = "/" + path.relative(OUT, file).split(path.sep).join("/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  r = r.replace(/(.)\/$/, "$1");
  return r === "" ? "/" : r;
}

function pageFields(html) {
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [""])[0];
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const main = (noScript.match(/<main[\s\S]*<\/main>/i) || [""])[0];
  const sentences = [
    ...new Set(
      main
        .replace(/<(br|\/p|\/li|\/h[1-6]|\/div|\/td|\/th|\/dt|\/dd|\/summary)[^>]*>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .split(/\n+/)
        .map((s) => decode(s).replace(/\s+/g, " ").trim())
        .filter((s) => s.length >= 2),
    ),
  ];
  const links = [...noScript.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((m) => {
      const href = decode((m[1].match(/href="([^"]*)"/) || [])[1] || "");
      return `${href}|${text(m[2]).slice(0, 80)}`;
    })
    .filter((l) => !l.startsWith("|"));
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) =>
    [...m[1].matchAll(/"(@id|url)":"([^"]+)"/g)].map((x) => `${x[1]}=${x[2]}`),
  );
  return {
    title: text((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ""),
    description: meta(head, "name", "description"),
    h1: [...noScript.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1])),
    canonical: decode((head.match(/<link[^>]+rel="canonical"[^>]*href="([^"]*)"/i) || [])[1] || ""),
    robots: meta(head, "name", "robots"),
    ogTitle: meta(head, "property", "og:title"),
    ogDescription: meta(head, "property", "og:description"),
    ogImage: meta(head, "property", "og:image"),
    naverVerification: meta(head, "name", "naver-site-verification"),
    jsonld: [...new Set(jsonld)].sort(),
    linksHash: sha(links.join("\n")),
    linkCount: links.length,
    ctaHash: sha(links.filter((l) => /^(tel:|https:\/\/(pf\.kakao|talk\.naver|naver\.me|m\.place|map\.naver))|^\/contact/.test(l)).sort().join("\n")),
    mainHash: sha(sentences.join("\n")),
    sentences,
  };
}

function siteResources() {
  const read = (p) => (fs.existsSync(path.join(OUT, p)) ? fs.readFileSync(path.join(OUT, p), "utf8") : "");
  const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
  const sitemaps = { "sitemap.xml": locs(read("sitemap.xml")) };
  const smDir = path.join(OUT, "sitemaps");
  if (fs.existsSync(smDir)) for (const f of fs.readdirSync(smDir).sort()) sitemaps[`sitemaps/${f}`] = locs(read(`sitemaps/${f}`));
  return {
    sitemaps,
    rss: sha(read("rss.xml").replace(/<lastBuildDate>[^<]*<\/lastBuildDate>/, "")),
    robots: sha(read("robots.txt")),
    headers: sha(read("_headers")),
    redirects: sha(read("_redirects")),
  };
}

const [cmd, a, b, allowFile] = process.argv.slice(2);
if (cmd === "save" && a) {
  const pages = {};
  for (const f of walk(OUT)) pages[routeOf(f)] = pageFields(fs.readFileSync(f, "utf8"));
  const snap = { savedAt: new Date().toISOString(), pages, site: siteResources() };
  fs.writeFileSync(path.join(DIR, `${a}.json`), JSON.stringify(snap));
  console.log(`saved ${a}: pages ${Object.keys(pages).length}, sitemap locs ${snap.site.sitemaps["sitemap.xml"].length}, sub-sitemaps ${Object.keys(snap.site.sitemaps).length - 1}`);
} else if (cmd === "diff" && a && b) {
  const A = JSON.parse(fs.readFileSync(path.join(DIR, `${a}.json`), "utf8"));
  const B = JSON.parse(fs.readFileSync(path.join(DIR, `${b}.json`), "utf8"));
  const allowed = new Set(allowFile && fs.existsSync(allowFile) ? fs.readFileSync(allowFile, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : []);
  const FIELDS = ["title", "description", "h1", "canonical", "robots", "ogTitle", "ogDescription", "ogImage", "naverVerification", "jsonld", "linksHash", "ctaHash"];
  const report = { removedRoutes: [], addedRoutes: [], protectedFieldChanges: [], mainChangedAllowed: [], mainChangedNotAllowed: [], site: {} };
  for (const r of Object.keys(A.pages)) if (!B.pages[r]) report.removedRoutes.push(r);
  for (const r of Object.keys(B.pages)) if (!A.pages[r]) report.addedRoutes.push(r);
  const rows = [];
  for (const [r, pa] of Object.entries(A.pages)) {
    const pb = B.pages[r];
    if (!pb) continue;
    for (const f of FIELDS) {
      if (JSON.stringify(pa[f]) !== JSON.stringify(pb[f])) report.protectedFieldChanges.push({ route: r, field: f, before: pa[f], after: pb[f] });
    }
    if (pa.mainHash !== pb.mainHash) {
      const sa = new Set(pa.sentences);
      const sb = new Set(pb.sentences);
      const removed = pa.sentences.filter((s) => !sb.has(s));
      const added = pb.sentences.filter((s) => !sa.has(s));
      (allowed.has(r) ? report.mainChangedAllowed : report.mainChangedNotAllowed).push(r);
      rows.push({ route: r, allowed: allowed.has(r), removed, added });
    }
  }
  for (const k of new Set([...Object.keys(A.site.sitemaps), ...Object.keys(B.site.sitemaps)])) {
    const x = A.site.sitemaps[k] || [];
    const y = B.site.sitemaps[k] || [];
    const sx = new Set(x);
    const sy = new Set(y);
    report.site[k] = { removed: x.filter((u) => !sy.has(u)).length, added: y.filter((u) => !sx.has(u)).length, before: x.length, after: y.length };
  }
  for (const k of ["rss", "robots", "headers", "redirects"]) report.site[k] = A.site[k] === B.site[k] ? "same" : "CHANGED";
  fs.writeFileSync(path.join(DIR, `diff-${a}-${b}.json`), JSON.stringify(report, null, 1));
  const csv = ["﻿route,allowed,removed_sentences,added_sentences"];
  for (const row of rows) csv.push([row.route, row.allowed, row.removed.join(" ⏎ "), row.added.join(" ⏎ ")].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  fs.writeFileSync(path.join(DIR, `diff-${a}-${b}-main.csv`), csv.join("\n") + "\n");
  console.log(
    JSON.stringify(
      {
        removedRoutes: report.removedRoutes.length,
        addedRoutes: report.addedRoutes.length,
        protectedFieldChanges: report.protectedFieldChanges.length,
        protectedFieldChangeKinds: [...new Set(report.protectedFieldChanges.map((c) => c.field))],
        mainChangedAllowed: report.mainChangedAllowed.length,
        mainChangedNotAllowed: report.mainChangedNotAllowed.length,
        site: report.site,
      },
      null,
      1,
    ),
  );
  if (report.mainChangedNotAllowed.length) console.log("not-allowed sample:", report.mainChangedNotAllowed.slice(0, 8).join(" "));
  if (report.protectedFieldChanges.length) console.log("protected sample:", JSON.stringify(report.protectedFieldChanges.slice(0, 3)).slice(0, 600));
} else {
  console.error("usage: save <name> | diff <a> <b> [allowed-paths.txt]");
  process.exit(1);
}
