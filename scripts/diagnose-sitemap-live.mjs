/**
 * Live sitemap + page crawl diagnostic (read-only).
 * Usage: node scripts/diagnose-sitemap-live.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";
const SITE_IDN = "https://다옴법무사사무소.kr";
const ROOT = process.cwd();
const UA_BROWSER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const UA_GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const CONCURRENCY = 8;
const PAGE_TIMEOUT_MS = 20000;

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function countUrls(xml) {
  return (xml.match(/<url>/g) || []).length;
}

function hasSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

function hasUrlset(xml) {
  return /<urlset[\s>]/i.test(xml);
}

function getNamespace(xml) {
  const m = xml.match(/xmlns="([^"]+)"/);
  return m ? m[1] : "(none)";
}

function isWellFormedXml(xml) {
  if (!xml.trimStart().startsWith("<?xml")) return { ok: false, reason: "missing xml declaration" };
  if (!/<\/?[a-zA-Z]/.test(xml)) return { ok: false, reason: "no xml tags" };
  const openTags = [...xml.matchAll(/<([a-zA-Z][\w:-]*)(?:\s[^>]*)?>(?!\s*<\/\1>)/g)].map((m) => m[1]);
  const selfClosing = new Set(
    [...xml.matchAll(/<([a-zA-Z][\w:-]*)[^>]*\/>/g)].map((m) => m[1]),
  );
  // basic balance check for main roots
  for (const tag of ["sitemapindex", "urlset", "sitemap", "url", "loc"]) {
    const opens = (xml.match(new RegExp(`<${tag}[\\s>]`, "g")) || []).length;
    const closes = (xml.match(new RegExp(`</${tag}>`, "g")) || []).length;
    if (opens !== closes) return { ok: false, reason: `unbalanced <${tag}> (${opens} open, ${closes} close)` };
  }
  if (hasSitemapIndex(xml) && hasUrlset(xml))
    return { ok: false, reason: "contains both sitemapindex and urlset" };
  return { ok: true };
}

async function fetchHead(url, ua = UA_BROWSER) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), PAGE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      signal: ctrl.signal,
    });
    return {
      status: res.status,
      contentType: res.headers.get("content-type") || "",
      location: res.headers.get("location") || "",
      xRobots: res.headers.get("x-robots-tag") || "",
      cfRay: res.headers.get("cf-ray") || "",
    };
  } catch (e) {
    return { status: 0, contentType: "", location: "", xRobots: "", error: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

async function fetchGet(url, ua = UA_BROWSER, maxBytes = 500_000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), PAGE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      signal: ctrl.signal,
    });
    const ct = res.headers.get("content-type") || "";
    let body = "";
    if (res.status >= 200 && res.status < 400) {
      const buf = await res.arrayBuffer();
      body = new TextDecoder("utf-8", { fatal: false }).decode(buf.slice(0, maxBytes));
    }
    return {
      status: res.status,
      contentType: ct,
      location: res.headers.get("location") || "",
      xRobots: res.headers.get("x-robots-tag") || "",
      body,
    };
  } catch (e) {
    return { status: 0, contentType: "", location: "", xRobots: "", body: "", error: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

async function fetchSitemap(url) {
  const res = await fetchGet(url, UA_BROWSER, 5_000_000);
  return res;
}

function parseCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return null;
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

function parseRobotsMeta(html) {
  const tags = [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]*>/gi)].map((m) => m[0]);
  return tags
    .map((t) => {
      const c = t.match(/content=["']([^"']+)["']/i);
      return c ? c[1] : "";
    })
    .filter(Boolean);
}

function localFileForUrl(url) {
  try {
    const u = new URL(url);
    let p = decodeURIComponent(u.pathname);
    if (p.endsWith("/")) p += "index.html";
    else if (!p.includes(".")) p = join(p, "index.html");
    return join(ROOT, "out", p.replace(/^\//, ""));
  } catch {
    return null;
  }
}

async function mapPool(items, fn, limit = CONCURRENCY) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function section(title) {
  console.log(`\n${"=".repeat(72)}\n${title}\n${"=".repeat(72)}`);
}

async function main() {
  const report = {
    sitemaps: [],
    pages: [],
    uaDiffs: [],
    buildCompare: { localOutExists: existsSync(join(ROOT, "out")), mismatches: [] },
    summary: {},
  };

  section("0. Entry points (browser vs Googlebot)");
  for (const path of ["/sitemap.xml", "/robots.txt"]) {
    for (const [label, base] of [
      ["punycode", SITE],
      ["idn", SITE_IDN],
    ]) {
      const url = `${base}${path}`;
      const [br, gb] = await Promise.all([fetchHead(url, UA_BROWSER), fetchHead(url, UA_GOOGLEBOT)]);
      console.log(`\n${label} ${path}`);
      console.log(`  browser:   status=${br.status} ct=${br.contentType} loc=${br.location || "-"}`);
      console.log(`  googlebot: status=${gb.status} ct=${gb.contentType} loc=${gb.location || "-"}`);
      if (br.status !== gb.status || br.contentType !== gb.contentType || br.location !== gb.location) {
        report.uaDiffs.push({ url, type: "entry", browser: br, googlebot: gb });
      }
    }
  }

  section("1. Fetch sitemap index");
  const indexRes = await fetchSitemap(`${SITE}/sitemap.xml`);
  console.log(`status=${indexRes.status} content-type=${indexRes.contentType}`);
  if (indexRes.status !== 200) {
    console.error("FATAL: sitemap.xml not 200");
    process.exit(1);
  }
  const childUrls = extractLocs(indexRes.body);
  const xmlCheck = isWellFormedXml(indexRes.body);
  console.log(`namespace=${getNamespace(indexRes.body)}`);
  console.log(`type=sitemapindex child_sitemaps=${childUrls.length} xml=${xmlCheck.ok ? "OK" : xmlCheck.reason}`);

  section("2. Child sitemaps");
  const allPageUrls = [];
  for (const childUrl of childUrls) {
    const localName = childUrl.split("/").pop();
    const localPath = join(ROOT, "public", "sitemaps", localName);
    const localXml = existsSync(localPath) ? readFileSync(localPath, "utf8") : null;

    const live = await fetchSitemap(childUrl);
    const locs = extractLocs(live.body);
    const urlCount = countUrls(live.body);
    const ns = getNamespace(live.body);
    const xml = isWellFormedXml(live.body);
    const entry = {
      url: childUrl,
      status: live.status,
      contentType: live.contentType,
      urlCount,
      namespace: ns,
      xmlOk: xml.ok,
      xmlReason: xml.reason || "",
      locCount: locs.length,
      localUrlCount: localXml ? countUrls(localXml) : null,
      localMatch: localXml ? countUrls(localXml) === urlCount : null,
    };
    report.sitemaps.push(entry);
    console.log(`\n${localName}`);
    console.log(`  status=${entry.status} content-type=${entry.contentType}`);
    console.log(`  url_count=${entry.urlCount} loc_tags=${entry.locCount}`);
    console.log(`  namespace=${entry.namespace}`);
    console.log(`  xml=${entry.xmlOk ? "OK" : entry.xmlReason}`);
    console.log(`  local_public=${entry.localUrlCount ?? "N/A"} match=${entry.localMatch}`);

    if (live.status === 200) {
      for (const u of locs) allPageUrls.push(u);
    }
  }

  const uniqueUrls = [...new Set(allPageUrls)];
  console.log(`\nTotal unique page URLs in sitemaps: ${uniqueUrls.length}`);

  section("3. Page URL checks (all URLs)");
  let idx = 0;
  const pageResults = await mapPool(uniqueUrls, async (url) => {
    const [brHead, gbHead] = await Promise.all([
      fetchHead(url, UA_BROWSER),
      fetchHead(url, UA_GOOGLEBOT),
    ]);

    let canonical = null;
    let robotsMeta = [];
    let finalUrl = url;
    let redirectChain = [];

    // Follow redirects for analysis (GET sample)
    if (brHead.status >= 300 && brHead.status < 400 && brHead.location) {
      redirectChain.push({ from: url, status: brHead.status, to: brHead.location });
    }

    const needsBody =
      brHead.status === 200 ||
      (brHead.status >= 300 && brHead.status < 400) ||
      gbHead.status === 200;

    if (needsBody) {
      const get = await fetchGet(url, UA_GOOGLEBOT);
      if (get.status >= 300 && get.status < 400 && get.location) {
        redirectChain.push({ from: url, status: get.status, to: get.location });
        const get2 = await fetchGet(new URL(get.location, url).href, UA_GOOGLEBOT);
        canonical = parseCanonical(get2.body);
        robotsMeta = parseRobotsMeta(get2.body);
        finalUrl = new URL(get.location, url).href;
      } else if (get.status === 200) {
        canonical = parseCanonical(get.body);
        robotsMeta = parseRobotsMeta(get.body);
      }
    }

    const noindex =
      /noindex/i.test(brHead.xRobots) ||
      /noindex/i.test(gbHead.xRobots) ||
      robotsMeta.some((r) => /noindex/i.test(r));

    const row = {
      url,
      statusBrowser: brHead.status,
      statusGooglebot: gbHead.status,
      contentType: brHead.contentType || gbHead.contentType,
      redirect: redirectChain.length ? redirectChain : null,
      canonical,
      robotsMeta,
      xRobotsBrowser: brHead.xRobots,
      xRobotsGooglebot: gbHead.xRobots,
      noindex,
      uaMismatch:
        brHead.status !== gbHead.status ||
        brHead.contentType !== gbHead.contentType ||
        brHead.location !== gbHead.location,
    };

    if (row.uaMismatch) report.uaDiffs.push({ url, type: "page", browser: brHead, googlebot: gbHead });

    idx++;
    if (idx % 50 === 0) process.stderr.write(`  checked ${idx}/${uniqueUrls.length}\r`);

    return row;
  });

  report.pages = pageResults;

  section("4. Aggregated page issues");
  const byStatus = {};
  const not200 = [];
  const hasRedirect = [];
  const noindexList = [];
  const canonicalMismatch = [];
  const missingCanonical = [];
  const uaMismatchPages = [];

  for (const p of pageResults) {
    byStatus[p.statusGooglebot] = (byStatus[p.statusGooglebot] || 0) + 1;
    if (p.statusGooglebot !== 200) not200.push(p);
    if (p.redirect?.length) hasRedirect.push(p);
    if (p.noindex) noindexList.push(p);
    if (!p.canonical && p.statusGooglebot === 200) missingCanonical.push(p);
    if (p.canonical) {
      try {
        const c = new URL(p.canonical);
        const u = new URL(p.url);
        if (c.origin !== u.origin || c.pathname !== u.pathname) {
          canonicalMismatch.push(p);
        }
      } catch {
        canonicalMismatch.push(p);
      }
    }
    if (p.uaMismatch) uaMismatchPages.push(p);
  }

  console.log("Status distribution (Googlebot HEAD):");
  for (const [s, n] of Object.entries(byStatus).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  ${s}: ${n}`);
  }
  console.log(`\nnot_200: ${not200.length}`);
  console.log(`redirects: ${hasRedirect.length}`);
  console.log(`noindex: ${noindexList.length}`);
  console.log(`missing_canonical (200): ${missingCanonical.length}`);
  console.log(`canonical_host_or_path_mismatch: ${canonicalMismatch.length}`);
  console.log(`ua_mismatch_pages: ${uaMismatchPages.length}`);

  if (not200.length) {
    console.log("\nSample not-200 (up to 15):");
    for (const p of not200.slice(0, 15)) {
      console.log(`  ${p.statusGooglebot} ${p.url}`);
    }
  }
  if (canonicalMismatch.length) {
    console.log("\nSample canonical mismatch (up to 15):");
    for (const p of canonicalMismatch.slice(0, 15)) {
      console.log(`  page=${p.url}`);
      console.log(`    canonical=${p.canonical}`);
    }
  }
  if (noindexList.length) {
    console.log("\nnoindex URLs (up to 15):");
    for (const p of noindexList.slice(0, 15)) {
      console.log(`  ${p.url} meta=${p.robotsMeta.join("|")} x-robots=${p.xRobotsGooglebot}`);
    }
  }

  section("5. Build output vs live (sample + file presence)");
  if (!report.buildCompare.localOutExists) {
    console.log("out/ not found — run npm run build locally for full compare");
  } else {
    const sample = uniqueUrls.slice(0, 30).concat(uniqueUrls.slice(-10));
    for (const url of [...new Set(sample)]) {
      const lf = localFileForUrl(url);
      const exists = lf && existsSync(lf);
      const live = await fetchHead(url, UA_GOOGLEBOT);
      if (!exists || live.status !== 200) {
        report.buildCompare.mismatches.push({ url, localFile: lf, localExists: !!exists, liveStatus: live.status });
      }
    }
    console.log(`sample_checked=${[...new Set(sample)].length} mismatches=${report.buildCompare.mismatches.length}`);
    for (const m of report.buildCompare.mismatches.slice(0, 10)) {
      console.log(`  live=${m.liveStatus} local=${m.localExists ? "yes" : "no"} ${m.url}`);
    }

    // compare sitemap files bytes hash-ish
    for (const sm of report.sitemaps) {
      const name = sm.url.split("/").pop();
      const localPath = join(ROOT, "public", "sitemaps", name);
      if (!existsSync(localPath)) continue;
      const localCount = countUrls(readFileSync(localPath, "utf8"));
      if (localCount !== sm.urlCount) {
        console.log(`  COUNT_MISMATCH ${name}: live=${sm.urlCount} local=${localCount}`);
      }
    }
  }

  section("6. Root cause analysis");
  const idnIndex = await fetchHead(`${SITE_IDN}/sitemap.xml`, UA_GOOGLEBOT);
  const punyIndex = await fetchHead(`${SITE}/sitemap.xml`, UA_GOOGLEBOT);
  const gscPropertyIdn = idnIndex.status;
  const gscPropertyPuny = punyIndex.status;

  const hostsInSitemap = new Set(uniqueUrls.map((u) => new URL(u).host));
  const canonicalHosts = new Set(
    pageResults.filter((p) => p.canonical).map((p) => {
      try {
        return new URL(p.canonical).host;
      } catch {
        return "?";
      }
    }),
  );

  console.log("Hosts in sitemap <loc>:", [...hostsInSitemap].join(", "));
  console.log("Hosts in page canonical (sampled via GET):", [...canonicalHosts].join(", "));
  console.log(`IDN sitemap.xml status: ${gscPropertyIdn} (location: ${idnIndex.location || "-"})`);
  console.log(`Punycode sitemap.xml status: ${gscPropertyPuny}`);

  const causes = [];
  if (report.sitemaps.every((s) => s.status === 200 && s.urlCount > 0)) {
    causes.push("Child sitemaps are reachable and contain URLs — sitemap fetch itself is NOT empty.");
  }
  if (not200.length === uniqueUrls.length) {
    causes.push("CRITICAL: ALL sitemap URLs return non-200 to Googlebot.");
  } else if (not200.length > uniqueUrls.length * 0.5) {
    causes.push(`CRITICAL: ${not200.length}/${uniqueUrls.length} URLs non-200 for Googlebot.`);
  }
  if (canonicalMismatch.length > 0) {
    const idnCanon = canonicalMismatch.filter((p) => p.canonical?.includes("다옴") || p.canonical?.includes("xn--"));
    if (idnCanon.length)
      causes.push(`Canonical host mismatch on ${canonicalMismatch.length} pages (IDN vs punycode split).`);
  }
  if (idnIndex.status >= 300 && idnIndex.status < 400) {
    causes.push(`IDN sitemap redirects (${idnIndex.status} → ${idnIndex.location}) — GSC property must match submitted URL.`);
  }
  if (uaMismatchPages.length > 0) {
    causes.push(`Googlebot vs browser mismatch on ${uaMismatchPages.length} page(s).`);
  }
  if (noindexList.length === uniqueUrls.length) {
    causes.push("CRITICAL: All sitemap URLs are noindex.");
  }

  const totalUrls = uniqueUrls.length;
  const ok200 = byStatus[200] || 0;
  if (totalUrls > 0 && ok200 === totalUrls && canonicalMismatch.length === 0 && noindexList.length === 0) {
    causes.push(
      "Technical crawl looks healthy. GSC '0 discovered' likely timing/GSC property URL mismatch/recent sitemap resubmit — not sitemap emptiness.",
    );
  }

  console.log("\nMost likely causes (evidence-based):");
  causes.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));

  // Write JSON report
  const outPath = join(ROOT, "collector", "output", "sitemap-live-diagnosis.json");
  try {
    const { mkdirSync, writeFileSync } = await import("node:fs");
    mkdirSync(join(ROOT, "collector", "output"), { recursive: true });
    writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), report, causes }, null, 2));
    console.log(`\nFull JSON: ${outPath}`);
  } catch {
    // ignore
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
