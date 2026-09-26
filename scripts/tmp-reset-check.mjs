import fs from "node:fs";

function check(slug) {
  const h = fs.readFileSync(`out/${slug}.html`, "utf8");
  const title = (h.match(/<title[^>]*>([^<]*)/i) || [])[1];
  const robots =
    (h.match(/name=["']robots["'][^>]*content=["']([^"']*)/i) || [])[1];
  const can =
    (h.match(/rel=["']canonical["'][^>]*href=["']([^"']*)/i) || [])[1];
  const h1 = ((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const h2 = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
  const nationwide = /방문하지 않아도 업무를 끝까지/.test(h);
  console.log("===", slug);
  console.log({ title, robots, can, h1, h2: h2.length, nationwide });
  console.log("h2:", h2.slice(0, 10).join(" | "));
}

for (const s of ["부산상속법무사", "부산상속포기", "부산상속전문법무사"]) {
  check(s);
}
