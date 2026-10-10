// 세종·강원 localPoints에 지역 고유 항목 1개씩 추가(세종: 구·군 없는 단층 행정구역, 강원: 영동·영서 관할 등기소 차이).
const fs = require("fs");
const f = "src/lib/nationwide-cases/metro-defs.ts";
const ADD = {
  세종상속등기법무사: "세종은 시 아래 구·군 없이 읍·면·동으로만 나뉘어, 부동산 주소를 '세종특별자치시 ○○동(읍·면)' 단위로 적어 목록을 만듭니다.",
  강원상속등기법무사: "강릉·속초·양양 등 동해안과 춘천·원주 등 영서 지역 부동산은 관할 등기소가 달라, 두 곳에 걸쳐 있으면 상속등기 접수처를 한곳으로 모을 수 있는지 봅니다(부동산등기법 제7조의3).",
};
let s = fs.readFileSync(f, "utf8");
let n = 0;
for (const [slug, item] of Object.entries(ADD)) {
  const at = s.indexOf(`slug: "${slug}"`);
  const li = s.indexOf("localPoints: {", at);
  const eol = s.indexOf("\n", li);
  const end = s.lastIndexOf("]", eol);
  if (at < 0 || li < 0 || end < li || s.slice(li, eol).includes(item)) { console.log("skip", slug); continue; }
  s = s.slice(0, end) + "," + JSON.stringify(item) + s.slice(end);
  n++;
}
fs.writeFileSync(f, s);
console.log("added", n);
