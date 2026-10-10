import fs from "node:fs";
const cands = JSON.parse(fs.readFileSync("cands.json", "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};
for (const c of cands) {
  const q = `${c.replace(/^(인천|대전|광주)(?=.+구$)/, "$1 ")} 상속`;
  try {
    const j = await (await fetch(`https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(q)}&con=0&frm=nv&ans=2&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&run=2&rev=4&q_enc=UTF-8&st=100`, { headers: { "user-agent": "Mozilla/5.0 Chrome/130" } })).json();
    out[c] = (j.items?.[0] || []).map((x) => x[0]).filter((s) => /상속/.test(s));
  } catch (e) { out[c] = ["ERR " + e.message]; }
  await sleep(800);
}
fs.writeFileSync("ac-covered.json", JSON.stringify({ at: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }), out }, null, 1));
for (const [c, v] of Object.entries(out)) console.log(c.padEnd(6), v.length, v.filter((s) => /법무사|상속등기|상속포기|한정승인/.test(s)).join(" | "));
