// 강원·충북이 '관할 특례로 접수처를 모을 수 있는지' 표현을 공유 → 내용은 같게, 표현만 지역 상황에 맞게 바꾼다.
const fs = require("fs");
const f = "src/lib/nationwide-cases/metro-defs.ts";
let s = fs.readFileSync(f, "utf8");
const R = [
  ["강릉·속초·양양 등 동해안과 춘천·원주 등 영서 지역 부동산은 관할 등기소가 달라, 두 곳에 걸쳐 있으면 상속등기 접수처를 한곳으로 모을 수 있는지 봅니다(부동산등기법 제7조의3).",
   "강릉·속초·양양 등 동해안과 춘천·원주 등 영서는 담당 등기소가 서로 다릅니다. 부동산이 양쪽에 있으면 어느 등기소에 한꺼번에 낼지 먼저 정합니다(부동산등기법 제7조의3)."],
  ["상속등기 관할 특례로 접수처를 모을 수 있는지 보고, 임야는 공유지분 비율을 확인한 뒤 목록에 넣습니다.",
   "청주 아파트와 충주 임야는 등기소가 달라도 한 등기소에 함께 신청할 수 있는지부터 검토합니다. 임야는 다른 공유자와 지분 비율을 먼저 확인합니다."],
];
let n = 0;
for (const [a, b] of R) {
  const c = s.split(a).length - 1;
  if (c !== 1) { console.log("count", c, a.slice(0, 30)); continue; }
  s = s.replace(a, b);
  n++;
}
fs.writeFileSync(f, s);
console.log("reworded", n);
