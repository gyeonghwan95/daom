/** XML 1.0 text node escape (loc은 UTF-8 URL 그대로, & < > " ' 만 이스케이프) */
export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const MAX_URLS_PER_SITEMAP = 50000;
const MAX_BYTES_PER_SITEMAP = 50 * 1024 * 1024;

export function buildUrlSetXml(entries) {
  if (entries.length > MAX_URLS_PER_SITEMAP) {
    throw new Error(`sitemap exceeds ${MAX_URLS_PER_SITEMAP} URLs (${entries.length})`);
  }

  const body = entries
    .map(({ loc, lastmod }) => {
      const lastmodLine = lastmod
        ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>`
        : "";
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodLine}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${SITEMAP_NS}">\n${body}\n</urlset>\n`;

  if (Buffer.byteLength(xml, "utf8") > MAX_BYTES_PER_SITEMAP) {
    throw new Error(`sitemap exceeds ${MAX_BYTES_PER_SITEMAP} bytes`);
  }

  return xml;
}

export function buildSitemapIndexXml(sitemaps) {
  const body = sitemaps
    .map(({ loc, lastmod }) => {
      const lastmodLine = lastmod
        ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>`
        : "";
      return `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>${lastmodLine}\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="${SITEMAP_NS}">\n${body}\n</sitemapindex>\n`;
}

export function parseLocTags(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

export function assertValidXmlPrologue(xml) {
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    throw new Error("XML must start with UTF-8 prologue");
  }
}
