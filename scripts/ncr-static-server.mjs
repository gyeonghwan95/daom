#!/usr/bin/env node
/** Minimal static server for out/ (QA only). node scripts/ncr-static-server.mjs [port] */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const PORT = Number(process.argv[2] || 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

function resolveFile(urlPath) {
  let p = urlPath.split("?")[0];
  try {
    p = decodeURIComponent(p);
  } catch {
    /* raw */
  }
  const candidates = [p, `${p}.html`, path.join(p, "index.html")];
  for (const c of candidates) {
    const full = path.join(ROOT, c);
    if (full.startsWith(ROOT) && fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

http
  .createServer((req, res) => {
    const file = resolveFile(req.url === "/" ? "/index.html" : req.url);
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`static out/ on http://localhost:${PORT}`));
