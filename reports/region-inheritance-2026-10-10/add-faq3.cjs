// 본문 유사도가 기준(0.80)을 조금 넘는 시·도 7곳에 지역 실무 FAQ를 하나씩 더한다.
// 근거: 지방세법 제20조 제1항(취득세 6개월·9개월), 농지법 제7조(상속 농지 1만㎡), 협의분할·매도 순서는 일반 등기 실무.
const fs = require("fs");
const f = "src/lib/nationwide-cases/metro-defs.ts";
const ADD = {
  인천상속등기법무사: { question: "인천에 사시던 부모님 상속포기는 어디에 하나요?", answer: "고인의 마지막 주소지를 관할하는 가정법원입니다. 주민등록초본으로 사망 당시 주소를 확인한 뒤 접수처를 정합니다." },
  세종상속등기법무사: { question: "세종 아파트 취득세는 언제까지 신고하나요?", answer: "부동산이 있는 세종특별자치시에 상속개시일이 속한 달의 말일부터 6개월(외국에 주소를 둔 상속인이 있으면 9개월) 안에 신고·납부합니다(지방세법 제20조 제1항)." },
  강원상속등기법무사: { question: "강원 토지를 상속받은 뒤 바로 팔 수 있나요?", answer: "상속등기를 먼저 마쳐야 매도 등기를 할 수 있습니다. 토지거래허가구역이라면 매매 계약 전에 허가가 필요한지 따로 확인합니다." },
  충북상속등기법무사: { question: "충북 임야 지분을 형제 중 한 명이 받으려면?", answer: "상속인 전원이 상속재산분할협의서에 서명하고 인감증명서를 붙이면 그 지분을 한 사람 명의로 상속등기할 수 있습니다." },
  전북상속등기법무사: { question: "전주 아파트와 김제 논을 형제가 나눠 받을 수 있나요?", answer: "협의분할로 부동산마다 받을 상속인을 정할 수 있습니다. 논을 받는 상속인이 농사를 짓지 않으면 상속 농지 1만㎡ 상한을 함께 봅니다(농지법 제7조)." },
  제주상속등기법무사: { question: "제주 부동산 취득세는 어디에 신고하나요?", answer: "부동산이 있는 제주특별자치도에 상속개시일이 속한 달의 말일부터 6개월(외국에 주소를 둔 상속인이 있으면 9개월) 안에 신고·납부합니다(지방세법 제20조 제1항)." },
  울산상속등기법무사: { question: "울산 아파트를 상속받아 바로 팔려면 일정을 어떻게 잡나요?", answer: "상속등기를 먼저 마쳐야 매도 등기를 할 수 있습니다. 잔금일이 정해져 있으면 그날에서 거꾸로 계산해 상속등기 접수일과 서류 준비 순서를 정합니다." },
};
let s = fs.readFileSync(f, "utf8");
let n = 0;
for (const [slug, faq] of Object.entries(ADD)) {
  const at = s.indexOf(`slug: "${slug}"`);
  if (at < 0) { console.log("miss slug", slug); continue; }
  const li = s.indexOf("localFaqs: [", at);
  const eol = s.indexOf("\n", li);
  const end = s.lastIndexOf("]", eol);
  if (li < 0 || end < li) { console.log("miss faqs", slug); continue; }
  if (s.slice(li, eol).includes(faq.question)) { console.log("exists", slug); continue; }
  s = s.slice(0, end) + "," + JSON.stringify(faq) + s.slice(end);
  n++;
}
fs.writeFileSync(f, s);
console.log("added", n);
