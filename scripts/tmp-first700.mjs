import fs from "node:fs";
function strip(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ")
    .replace(/<header[\s\S]*?<\/header>/gi," ").replace(/<footer[\s\S]*?<\/footer>/gi," ")
    .replace(/<nav[\s\S]*?<\/nav>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
}
for (const u of ["부산상속법무사","부산상속포기","부산상속전문법무사"]) {
  const b = strip(fs.readFileSync("out/"+u+".html","utf8"));
  console.log("\n===", u, "chars", b.length);
  console.log(b.slice(0,700));
}
