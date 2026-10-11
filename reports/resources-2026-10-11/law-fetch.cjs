// 국가법령정보센터 조문 1개를 받아 sources/<name>.txt 로 저장(시행일·URL·조문 본문).
// node law-fetch.cjs <name> <법령명> <제N조>
const fs = require("fs");
const path = require("path");
const [, , name, law, jo] = process.argv;
(async () => {
  const u = `https://www.law.go.kr/LSW/lsLinkProc.do?lsNm=${encodeURIComponent(law)}&joLnkStr=${encodeURIComponent(jo)}&mode=11`;
  const r = await fetch(u, { headers: { "user-agent": "Mozilla/5.0 Chrome/130" } });
  const h = await r.text();
  const t = h
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
  const ef = (t.match(/시행 ?\d{4}\. ?\d{1,2}\. ?\d{1,2}\.?/) || [""])[0];
  const i = t.indexOf(jo + "(");
  let body = "(조문 미발견)";
  if (i >= 0) {
    const rest = t.slice(i + jo.length);
    const m = rest.match(/ 제\d+조(의\d+)?\(/);
    body = t.slice(i, m ? i + jo.length + m.index : i + 1500);
  }
  fs.writeFileSync(path.join(__dirname, "sources", `${name}.txt`), `${law} ${jo} | ${ef} | ${u}\n${body}\n`);
  console.log(name, ef, "|", body.slice(0, 650));
})();
