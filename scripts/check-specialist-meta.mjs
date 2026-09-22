#!/usr/bin/env node
import fs from "node:fs";

function meta(u) {
  const p = `out/${u.slice(1)}.html`;
  if (!fs.existsSync(p)) {
    console.log(u, "MISSING");
    return;
  }
  const h = fs.readFileSync(p, "utf8");
  const t = (h.match(/<title[^>]*>([^<]*)/i) || [])[1];
  const c =
    (h.match(/rel=["']canonical["'][^>]*href=["']([^"']*)/i) || [])[1] || "";
  const r =
    (h.match(/name=["']robots["'][^>]*content=["']([^"']*)/i) || [])[1] || "";
  console.log(u);
  console.log(" title:", t);
  console.log(" can:", c);
  console.log(" robots:", r);
}

["/부산등기전문법무사", "/부산법인전문법무사", "/부산상속전문법무사"].forEach(meta);
